/* eslint-disable no-this-alias -- `var self = this` is used deliberately
   throughout this file to capture the query/mutation builder instance for
   use inside nested Promise callbacks (ES5 `function` style, no arrows). */
// ═══════════════════════════════════════════════════════════════
// Realmood — Supabase → Firebase compatibility adapter
//
// This is NOT a general-purpose Supabase clone. It implements only the
// exact subset of the supabase-js v2 API that this app actually calls
// (grep for `sb\.` across public/*.html to see the full surface),
// backed by the Firebase compat SDK (Auth + Firestore + Storage).
//
// Load order required in every HTML page that used `sb`:
//   1. firebase-app-compat.js, firebase-auth-compat.js,
//      firebase-firestore-compat.js, firebase-storage-compat.js
//   2. firebase-config.js   (defines firebaseConfig + calls firebase.initializeApp)
//   3. firebase-adapter.js  (this file — defines window.sb)
// ═══════════════════════════════════════════════════════════════
(function () {
  if (typeof firebase === 'undefined' || !firebase.apps.length) {
    console.error('[firebase-adapter] Firebase SDK not initialized. Load firebase-config.js before this file.');
    return;
  }

  var auth = firebase.auth();
  var db = firebase.firestore();
  var fbStorage = firebase.storage();

  function mapAuthUser(fbUser) {
    if (!fbUser) return null;
    return { id: fbUser.uid, email: fbUser.email };
  }

  var AUTH_ERROR_MAP = {
    'auth/invalid-credential': 'Invalid login credentials',
    'auth/invalid-login-credentials': 'Invalid login credentials',
    'auth/wrong-password': 'Invalid login credentials',
    'auth/user-not-found': 'Invalid login credentials',
    'auth/email-already-in-use': 'User already registered',
    'auth/weak-password': 'Password should be at least 6 characters',
  };
  function mapAuthError(err) {
    if (!err) return null;
    return { message: AUTH_ERROR_MAP[err.code] || err.message, code: err.code };
  }

  // ── Auth ─────────────────────────────────────────────────────
  var authApi = {
    getSession: function () {
      return new Promise(function (resolve) {
        var unsub = auth.onAuthStateChanged(function (user) {
          unsub();
          resolve({ data: { session: user ? { user: mapAuthUser(user) } : null } });
        });
      });
    },
    onAuthStateChange: function (cb) {
      var unsub = auth.onAuthStateChanged(function (user) {
        cb(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user: mapAuthUser(user) } : null);
      });
      return { data: { subscription: { unsubscribe: unsub } } };
    },
    signInWithPassword: function (opts) {
      return auth.signInWithEmailAndPassword(opts.email, opts.password)
        .then(function (cred) {
          var u = mapAuthUser(cred.user);
          return { data: { user: u, session: { user: u } }, error: null };
        })
        .catch(function (err) { return { data: null, error: mapAuthError(err) }; });
    },
    signUp: function (opts) {
      return auth.createUserWithEmailAndPassword(opts.email, opts.password)
        .then(function (cred) {
          var u = mapAuthUser(cred.user);
          return { data: { user: u, session: { user: u } }, error: null };
        })
        .catch(function (err) { return { data: null, error: mapAuthError(err) }; });
    },
    signInWithOAuth: function (opts) {
      if (opts.provider !== 'google') {
        return Promise.resolve({ error: { message: 'Unsupported provider: ' + opts.provider } });
      }
      var provider = new firebase.auth.GoogleAuthProvider();
      return auth.signInWithPopup(provider)
        .then(function () { return { error: null }; })
        .catch(function (err) { return { error: mapAuthError(err) }; });
    },
    signOut: function () {
      return auth.signOut().then(function () { return { error: null }; });
    },
  };

  // ── Firestore: read query builder (select/eq/is/gte/order/or/maybeSingle) ──
  function FsQuery(col) {
    this._col = col;
    this._filters = [];   // [op, field, value]
    this._orderField = null;
    this._orderAsc = true;
    this._single = false;
    this._orClauses = null;
  }
  FsQuery.prototype.select = function () { return this; };
  FsQuery.prototype.eq = function (field, value) { this._filters.push(['eq', field, value]); return this; };
  FsQuery.prototype.is = function (field, value) { this._filters.push(['eq', field, value]); return this; };
  FsQuery.prototype.gte = function (field, value) { this._filters.push(['gte', field, value]); return this; };
  FsQuery.prototype.order = function (field, opts) {
    this._orderField = field;
    this._orderAsc = !opts || opts.ascending !== false;
    return this;
  };
  FsQuery.prototype.maybeSingle = function () { this._single = true; return this; };
  // Only supports the exact shape used in this app: "id.eq.X,user_id.eq.Y"
  FsQuery.prototype.or = function (expr) {
    this._orClauses = expr.split(',').map(function (part) {
      var m = part.match(/^([a-zA-Z_]+)\.eq\.(.+)$/);
      return m ? [m[1], m[2]] : null;
    }).filter(Boolean);
    return this;
  };
  FsQuery.prototype._fetchDocs = function () {
    var self = this;
    if (this._orClauses) {
      var seen = {};
      var out = [];
      var chain = Promise.resolve();
      this._orClauses.forEach(function (clause) {
        var field = clause[0], value = clause[1];
        chain = chain.then(function () {
          if (field === 'id') {
            return db.collection(self._col).doc(value).get().then(function (d) {
              return d.exists ? [d] : [];
            });
          }
          return db.collection(self._col).where(field, '==', value).get().then(function (s) { return s.docs; });
        }).then(function (docs) {
          docs.forEach(function (d) { if (!seen[d.id]) { seen[d.id] = true; out.push(d); } });
        });
      });
      return chain.then(function () { return out; });
    }
    var idFilter = null;
    this._filters.forEach(function (f) { if (f[0] === 'eq' && f[1] === 'id') idFilter = f; });
    if (idFilter) {
      return db.collection(this._col).doc(idFilter[2]).get().then(function (d) { return d.exists ? [d] : []; });
    }
    var ref = db.collection(this._col);
    this._filters.forEach(function (f) {
      if (f[0] === 'eq') ref = ref.where(f[1], '==', f[2]);
      if (f[0] === 'gte') ref = ref.where(f[1], '>=', f[2]);
    });
    return ref.get().then(function (snap) { return snap.docs; });
  };
  FsQuery.prototype.then = function (resolve) {
    var self = this;
    this._fetchDocs()
      .then(function (docs) {
        var rows = docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
        if (self._orderField) {
          rows.sort(function (a, b) {
            var av = a[self._orderField], bv = b[self._orderField];
            if (av === bv) return 0;
            var cmp = av > bv ? 1 : -1;
            return self._orderAsc ? cmp : -cmp;
          });
        }
        resolve({ data: self._single ? (rows[0] || null) : rows, error: null });
      })
      .catch(function (err) { resolve({ data: null, error: { message: err.message } }); });
  };

  // ── Firestore: write operations (insert/update/delete/upsert) ──
  function FsMutation(col, kind, payload, opts) {
    this._col = col;
    this._kind = kind;
    this._payload = payload;
    this._opts = opts || {};
    this._filters = [];
  }
  FsMutation.prototype.eq = function (field, value) { this._filters.push([field, value]); return this; };
  FsMutation.prototype._withCreatedAt = function (obj) {
    if (obj.created_at) return obj;
    var out = Object.assign({}, obj);
    out.created_at = new Date().toISOString();
    return out;
  };
  FsMutation.prototype._idFilterValue = function () {
    var f = null;
    this._filters.forEach(function (x) { if (x[0] === 'id') f = x[1]; });
    return f;
  };
  FsMutation.prototype._run = function () {
    var self = this;
    if (this._kind === 'insert') {
      var payload = this._withCreatedAt(this._payload);
      // If the caller supplied an explicit id (mirrors Postgres client-specified PK),
      // use it as the Firestore doc id instead of auto-generating one.
      if (payload.id != null) {
        var explicitId = String(payload.id);
        return db.collection(this._col).doc(explicitId).set(payload)
          .then(function () { return { data: [Object.assign({}, payload, { id: explicitId })], error: null }; });
      }
      return db.collection(this._col).add(payload)
        .then(function (ref) { return { data: [Object.assign({}, payload, { id: ref.id })], error: null }; });
    }
    if (this._kind === 'upsert') {
      var key = this._opts.onConflict || 'id';
      var id = String(this._payload[key]);
      return db.collection(this._col).doc(id).set(this._payload)
        .then(function () { return { data: [this._payload], error: null }; }.bind(this));
    }
    if (this._kind === 'update') {
      var updId = this._idFilterValue();
      if (updId == null) return Promise.reject(new Error('update() requires .eq("id", value)'));
      return db.collection(this._col).doc(String(updId)).update(this._payload)
        .then(function () { return { data: null, error: null }; });
    }
    if (this._kind === 'delete') {
      var delId = this._idFilterValue();
      if (delId == null) return Promise.reject(new Error('delete() requires .eq("id", value)'));
      return db.collection(this._col).doc(String(delId)).delete()
        .then(function () { return { data: null, error: null }; });
    }
    return Promise.reject(new Error('Unknown mutation kind: ' + this._kind));
  };
  FsMutation.prototype.then = function (resolve) {
    this._run()
      .then(function (res) { resolve(res); })
      .catch(function (err) { resolve({ data: null, error: { message: err.message } }); });
  };

  function from(collectionName) {
    return {
      select: function () { return new FsQuery(collectionName); },
      insert: function (payload) { return new FsMutation(collectionName, 'insert', payload); },
      update: function (payload) { return new FsMutation(collectionName, 'update', payload); },
      delete: function () { return new FsMutation(collectionName, 'delete', {}); },
      upsert: function (payload, opts) { return new FsMutation(collectionName, 'upsert', payload, opts); },
    };
  }

  // ── Storage ──────────────────────────────────────────────────
  // NOTE: unlike Supabase, Firebase Storage download URLs are fetched
  // asynchronously (a network call), so getPublicUrl() here returns a
  // Promise. The one call site that used it (app.html → _uploadPhotoToStorage)
  // has been updated to `await` it as part of this migration.
  var storageApi = {
    from: function (bucket) {
      return {
        upload: function (path, blob, opts) {
          var ref = fbStorage.ref().child(bucket + '/' + path);
          return ref.put(blob, { contentType: opts && opts.contentType })
            .then(function () { return { data: { path: path }, error: null }; })
            .catch(function (err) { return { data: null, error: { message: err.message } }; });
        },
        getPublicUrl: function (path) {
          var ref = fbStorage.ref().child(bucket + '/' + path);
          return ref.getDownloadURL()
            .then(function (url) { return { data: { publicUrl: url } }; })
            .catch(function (err) { return { data: { publicUrl: null }, error: { message: err.message } }; });
        },
      };
    },
  };

  window.sb = { auth: authApi, from: from, storage: storageApi };
})();

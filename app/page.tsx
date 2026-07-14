'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const HIRE_WORDS = [
  'revestimientos',
  'terrazo y pisos',
  'piedra natural',
  'diseño de interiores',
  'arquitectura',
]

const OFFER_WORDS = [
  'Mostrá tu trabajo',
  'Publicá tu portfolio',
  'Hacé crecer tu negocio',
  'Llegá a más clientes',
]

const HIRE_BULLETS = [
  'Publicá tu necesidad y recibí propuestas — gratis',
  'Explorá portfolios y trabajos reales de profesionales',
  'Conectá con proveedores certificados de materiales',
]

const OFFER_BULLETS = [
  'Unite a una comunidad de profesionales del sector',
  'Recibí consultas calificadas sin comisiones ocultas',
  'Mostrá tu portfolio a miles de potenciales clientes',
]

type PinCard = {
  id: string
  img: string
  title: string
  tag: string
  aspectRatio: string
}

const HIRE_CARDS: PinCard[] = [
  { id: 'h1', img: '/proj-2.jpg',            title: 'Obra en Córdoba',         tag: 'Proyecto',     aspectRatio: '3/4' },
  { id: 'h2', img: '/cocina-ambiente.jpg',   title: 'Cocina en terracota',     tag: 'Ambiente',     aspectRatio: '4/5' },
  { id: 'h3', img: '/prod-eco.jpg',          title: 'Instalación ECO-005',     tag: 'Inspiración',  aspectRatio: '2/3' },
  { id: 'h4', img: '/mesa-ambiente.jpg',     title: 'Mesa de comedor',         tag: 'Ambiente',     aspectRatio: '4/3' },
  { id: 'h5', img: '/life-1.jpg',            title: 'Rincón de trabajo',       tag: 'Ambiente',     aspectRatio: '3/4' },
  { id: 'h6', img: '/proj-3.jpg',            title: 'Detalle de obra',         tag: 'Proyecto',     aspectRatio: '1/1' },
  { id: 'h7', img: '/prod-brass.jpg',        title: 'Mesa de vidrio y latón',  tag: 'Detalle',      aspectRatio: '4/5' },
  { id: 'h8', img: '/proj-4.jpg',            title: 'Proyecto terminado',      tag: 'Proyecto',     aspectRatio: '3/4' },
]

const OFFER_CARDS: PinCard[] = [
  { id: 'o1', img: '/pasted-1781733750827-0.png', title: 'Combinación de materiales', tag: 'Inspiración', aspectRatio: '4/5' },
  { id: 'o2', img: '/prod-brass.jpg',             title: 'Mesa de vidrio y latón',    tag: 'Detalle',     aspectRatio: '3/4' },
  { id: 'o3', img: '/pasted-1781733758235-0.png', title: 'Paleta natural',            tag: 'Inspiración', aspectRatio: '2/3' },
  { id: 'o4', img: '/prod-bangkok.jpg',           title: 'Sillas Bangkok',            tag: 'Mobiliario',  aspectRatio: '4/3' },
  { id: 'o5', img: '/pasted-1781734716790-0.png', title: 'Moodboard cálido',          tag: 'Inspiración', aspectRatio: '3/4' },
  { id: 'o6', img: '/mesa-ambienteop2.jpg',       title: 'Detalle de mesa',           tag: 'Detalle',     aspectRatio: '4/5' },
  { id: 'o7', img: '/cocina-ambiente.jpg',        title: 'Cocina en terracota',        tag: 'Ambiente',    aspectRatio: '1/1' },
  { id: 'o8', img: '/life-1.jpg',                 title: 'Rincón de trabajo',         tag: 'Ambiente',    aspectRatio: '3/4' },
]

// ── Password gate ──────────────────────────────────────────────────

const GATE_PASSWORD = '987'
const GATE_SESSION_KEY = 'rm-auth'

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value === GATE_PASSWORD) {
      sessionStorage.setItem(GATE_SESSION_KEY, '1')
      onUnlock()
    } else {
      setError(true)
      setShaking(true)
      setValue('')
      inputRef.current?.focus()
      setTimeout(() => setShaking(false), 400)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#F4F1EB',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&display=swap');
        @keyframes rmShake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        .rm-gate-shake { animation: rmShake 0.35s ease; }
        .rm-gate-panel { width: 42%; max-width: 608px; }
        @media (max-width: 768px) { .rm-gate-panel { display: none !important; } }
      `}</style>

      {/* Left column */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: 'clamp(32px,7vh,100px) clamp(24px,8vw,120px) clamp(24px,5vh,50px)',
          overflowY: 'auto',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexShrink: 0 }}>
          <svg width="52" height="48" viewBox="0 0 130 120">
            <rect x="38" y="32" width="62" height="62" rx="13" fill="#16140F" stroke="#F4F1EB" strokeWidth="3" transform="rotate(16 69 63)"/>
            <rect x="34" y="30" width="62" height="62" rx="13" fill="#16140F" stroke="#F4F1EB" strokeWidth="3"/>
            <g transform="rotate(-16 61 59)">
              <clipPath id="logoLux"><rect x="30" y="28" width="62" height="62" rx="13"/></clipPath>
              <rect x="30" y="28" width="62" height="62" rx="13" fill="#4A4A52" stroke="#F4F1EB" strokeWidth="3"/>
              <g clipPath="url(#logoLux)">
                <text x="57" y="63" fontFamily="'Space Grotesk',sans-serif" fontSize="104" fontWeight="600" fill="#F4F1EB" textAnchor="middle" dominantBaseline="central">R</text>
              </g>
            </g>
          </svg>
          <div style={{ fontSize: '20px', fontWeight: 500, letterSpacing: '-0.01em', color: '#16140F' }}>
            realmoodboard
          </div>
        </div>

        {/* Tagline */}
        <div style={{ padding: 'clamp(36px,8vh,100px) 0 clamp(28px,4vh,52px)', flexShrink: 0 }}>
          <div style={{ fontSize: '11px', letterSpacing: '.3em', textTransform: 'uppercase', color: '#A8895A', marginBottom: 'clamp(14px,3vh,34px)' }}>
            Acceso privado
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 300,
              fontSize: 'clamp(26px,5vw,54px)',
              lineHeight: 1.08,
              letterSpacing: '-0.012em',
              color: '#16140F',
              maxWidth: '560px',
            }}
          >
            El momento en que una idea toca la{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>materia</span>.
          </div>
        </div>

        {/* Password form */}
        <form
          onSubmit={handleSubmit}
          className={shaking ? 'rm-gate-shake' : ''}
          style={{ display: 'flex', flexDirection: 'column', gap: '22px', margin: 0, flexShrink: 0, maxWidth: '430px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#9a948a' }}>
              Contraseña
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1.5px solid #16140F', paddingBottom: '14px' }}>
              <input
                ref={inputRef}
                type="password"
                placeholder="••••••••••"
                autoComplete="current-password"
                value={value}
                onChange={e => setValue(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '19px',
                  letterSpacing: '.12em',
                  color: '#16140F',
                }}
              />
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '12px',
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  color: '#A8895A',
                  padding: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                Entrar <span style={{ fontSize: '16px' }}>→</span>
              </button>
            </div>
            <p
              style={{
                color: '#C04030',
                fontSize: '12px',
                fontWeight: 500,
                margin: 0,
                letterSpacing: '.04em',
                opacity: error ? 1 : 0,
                transition: 'opacity 0.2s',
              }}
            >
              Contraseña incorrecta
            </p>
          </div>
        </form>

        <div style={{ flex: 1, minHeight: '24px' }} />

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            borderTop: '1px solid rgba(22,20,15,.12)',
            paddingTop: '18px',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#b3ada2' }}>
            Realmood Estudio
          </div>
          <div style={{ fontSize: '11px', letterSpacing: '.04em', color: '#b3ada2' }}>
            © 2026 Mildesign SAS · Todos los derechos reservados
          </div>
        </div>
      </div>

      {/* Right panel – desktop only */}
      <div
        className="rm-gate-panel"
        style={{ background: '#16140F', flexShrink: 0, position: 'relative', overflow: 'hidden' }}
      >
        <svg width="300" height="277" viewBox="0 0 130 120" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) rotate(-6deg)' }}>
          <rect x="38" y="32" width="62" height="62" rx="13" fill="#2A2A2E" stroke="#16140F" strokeWidth="3" transform="rotate(16 69 63)"/>
          <rect x="34" y="30" width="62" height="62" rx="13" fill="#2A2A2E" stroke="#16140F" strokeWidth="3"/>
          <g transform="rotate(-16 61 59)">
            <clipPath id="heroClip"><rect x="30" y="28" width="62" height="62" rx="13"/></clipPath>
            <rect x="30" y="28" width="62" height="62" rx="13" fill="#4A4A52" stroke="#16140F" strokeWidth="3"/>
            <g clipPath="url(#heroClip)">
              <text x="57" y="63" fontFamily="'Space Grotesk',sans-serif" fontSize="104" fontWeight="600" fill="#16140F" textAnchor="middle" dominantBaseline="central">R</text>
            </g>
          </g>
        </svg>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '1px', height: '100%', background: 'rgba(186,150,92,.30)' }} />
      </div>
    </div>
  )
}

// ── Lightbox ───────────────────────────────────────────────────────

function LightboxModal({ img, title, onClose }: { img: string; title: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: 'rgba(0,0,0,0.82)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: 'min(90vw, 900px)',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar imagen"
          style={{
            position: 'absolute',
            top: '-14px',
            right: '-14px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
            zIndex: 1,
            color: '#1A1A18',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <img
          src={img}
          alt={title}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: 'calc(88vh - 48px)',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}
        />
        {title && (
          <div style={{
            marginTop: '12px',
            color: 'rgba(255,255,255,0.85)',
            fontSize: '14px',
            fontWeight: 600,
            textAlign: 'center',
          }}>
            {title}
          </div>
        )}
      </div>
    </div>
  )
}

// ── PinCard ────────────────────────────────────────────────────────

function PinCard({ card, visible, delay, onExpand }: { card: PinCard; visible: boolean; delay: number; onExpand: (img: string, title: string) => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        breakInside: 'avoid',
        marginBottom: '12px',
        display: 'inline-block',
        width: '100%',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.3s ease ${delay}ms, transform 0.3s ease ${delay}ms`,
      }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: '14px',
          overflow: 'hidden',
          background: '#f0ebe3',
          boxShadow: hovered
            ? '0 12px 32px rgba(0,0,0,0.18)'
            : '0 1px 4px rgba(0,0,0,0.08)',
          transform: hovered ? 'translateY(-3px)' : 'none',
          transition: 'box-shadow 0.22s ease, transform 0.22s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ aspectRatio: card.aspectRatio, overflow: 'hidden' }}>
          <img
            src={card.img}
            alt={card.title}
            loading="lazy"
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '28px 12px 12px',
            background: 'linear-gradient(0deg, rgba(26,26,24,.75) 0%, transparent 100%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.18s ease',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', lineHeight: 1.3, textShadow: '0 1px 4px rgba(0,0,0,.4)' }}>
            {card.title}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.75)', marginTop: '2px' }}>
            {card.tag}
          </div>
        </div>
        <button
          aria-label="Ampliar imagen"
          onClick={(e) => { e.stopPropagation(); onExpand(card.img, card.title) }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.22)',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1)' : 'scale(0.8)',
            transition: 'opacity 0.18s ease, transform 0.18s ease',
            color: '#1A1A18',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M8.5 1H13v4.5M13 1L8 6M5.5 13H1V8.5M1 13l5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div style={{ padding: '7px 4px 2px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A18', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {card.title}
        </div>
        <div style={{ fontSize: '11px', color: '#9b958a', marginTop: '1px' }}>{card.tag}</div>
      </div>
    </div>
  )
}

function PinterestGrid({ cards, visible, onExpand }: { cards: PinCard[]; visible: boolean; onExpand: (img: string, title: string) => void }) {
  return (
    <div
      style={{
        columns: '160px',
        columnGap: '12px',
        padding: '20px 16px',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {cards.map((card, i) => (
        <PinCard key={card.id} card={card} visible={visible} delay={i * 50} onExpand={onExpand} />
      ))}
    </div>
  )
}

// ── Hero page ──────────────────────────────────────────────────────

export default function Home() {
  const [gated, setGated] = useState(true)
  const [mode, setMode] = useState<'hire' | 'offer'>('hire')
  const [wordIdx, setWordIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const [gridVisible, setGridVisible] = useState(true)
  const [displayedCards, setDisplayedCards] = useState<PinCard[]>(HIRE_CARDS)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [lightbox, setLightbox] = useState<{ img: string; title: string } | null>(null)
  const openLightbox = useCallback((img: string, title: string) => setLightbox({ img, title }), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  // Check sessionStorage on mount — bypass gate if already authenticated
  useEffect(() => {
    if (sessionStorage.getItem(GATE_SESSION_KEY) === '1') {
      setGated(false)
    }
  }, [])

  useEffect(() => {
    setWordIdx(0)
    setFading(false)
    setGridVisible(false)
    const t = setTimeout(() => {
      setDisplayedCards(mode === 'hire' ? HIRE_CARDS : OFFER_CARDS)
      setGridVisible(true)
    }, 260)
    return () => clearTimeout(t)
  }, [mode])

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setFading(true)
      setTimeout(() => {
        const words = mode === 'hire' ? HIRE_WORDS : OFFER_WORDS
        setWordIdx(i => (i + 1) % words.length)
        setFading(false)
      }, 280)
    }, 2600)
    return () => clearTimeout(timerRef.current)
  }, [wordIdx, mode])

  const words = mode === 'hire' ? HIRE_WORDS : OFFER_WORDS
  const currentWord = words[wordIdx]
  const bullets = mode === 'hire' ? HIRE_BULLETS : OFFER_BULLETS

  const accentStyle: React.CSSProperties = {
    color: '#b45309',
    display: 'inline-block',
    opacity: fading ? 0 : 1,
    transform: fading ? 'translateY(-8px)' : 'translateY(0)',
    transition: 'opacity 0.28s ease, transform 0.28s ease',
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {gated && <PasswordGate onUnlock={() => setGated(false)} />}
      {lightbox && <LightboxModal img={lightbox.img} title={lightbox.title} onClose={closeLightbox} />}
      <header className="flex items-center justify-between px-8 py-5 border-b border-zinc-100 flex-shrink-0">
        <img src="/Realmood-Hibrida-Grafito.png" alt="Realmoodboard" className="h-8 w-auto" />
        <nav className="flex items-center gap-6 text-sm text-zinc-500">
          <a href="#about" className="hover:text-zinc-900 transition-colors">Nosotros</a>
          <a href="#contact" className="hover:text-zinc-900 transition-colors">Contacto</a>
        </nav>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: text content */}
        <div className="flex flex-col justify-center px-8 sm:px-14 lg:pl-20 lg:pr-10 py-12 lg:py-16 lg:w-[500px] xl:w-[560px] flex-shrink-0">

          {/* Toggle / switch */}
          <div className="flex rounded-full border border-zinc-200 p-1 w-fit mb-10 text-sm font-semibold">
            <button
              onClick={() => setMode('hire')}
              className={`px-5 py-2 rounded-full transition-all duration-200 ${
                mode === 'hire'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Contratá profesionales
            </button>
            <button
              onClick={() => setMode('offer')}
              className={`px-5 py-2 rounded-full transition-all duration-200 ${
                mode === 'offer'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Ofrecé tus servicios
            </button>
          </div>

          {/* Hero title */}
          {mode === 'hire' ? (
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight text-zinc-900 mb-8">
              Encontrá los mejores en{' '}
              <span style={accentStyle}>{currentWord}</span>
            </h1>
          ) : (
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight text-zinc-900 mb-8">
              <span style={accentStyle}>{currentWord}</span>
              <br />
              y conseguí clientes
            </h1>
          )}

          {/* Bullets */}
          <ul className="mb-10 space-y-3">
            {bullets.map(b => (
              <li key={b} className="flex items-start gap-3 text-zinc-600 text-base sm:text-lg">
                <span className="mt-1 flex-shrink-0 text-amber-700">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8.5l3.5 3.5 6.5-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {b}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div>
            <a
              href="/app.html#inicio"
              className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-zinc-700 transition-colors"
            >
              Ingresar
            </a>
          </div>
        </div>

        {/* Right: Pinterest-style project grid */}
        <div className="flex-1 relative overflow-hidden bg-[#f7f4f0]" style={{ minHeight: '300px' }}>
          <div
            className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, #f7f4f0 0%, transparent 100%)' }}
          />
          <PinterestGrid cards={displayedCards} visible={gridVisible} onExpand={openLightbox} />
        </div>
      </main>

      <footer className="px-8 py-5 border-t border-zinc-100 text-center text-sm text-zinc-400 flex-shrink-0">
        © {new Date().getFullYear()} Instone. Todos los derechos reservados.
      </footer>
    </div>
  )
}

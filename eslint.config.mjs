import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Legacy/vendor files
    "support.js",
    "public/support.js",
    // Supabase-compat shim: intentional ES5 `var self = this` closures
    "public/firebase-adapter.js",
  ]),
]);

export default eslintConfig;

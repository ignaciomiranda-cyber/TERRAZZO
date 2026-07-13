'use client'

import { useState, useEffect, useRef } from 'react'

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

export default function Home() {
  const [mode, setMode] = useState<'hire' | 'offer'>('hire')
  const [wordIdx, setWordIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    setWordIdx(0)
    setFading(false)
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
      <header className="flex items-center justify-between px-8 py-5 border-b border-zinc-100">
        <img src="/Realmood-Hibrida-Grafito.png" alt="Realmoodboard" className="h-8 w-auto" />
        <nav className="flex items-center gap-6 text-sm text-zinc-500">
          <a href="#about" className="hover:text-zinc-900 transition-colors">Nosotros</a>
          <a href="#contact" className="hover:text-zinc-900 transition-colors">Contacto</a>
        </nav>
      </header>

      <main className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-16 max-w-4xl">

        {/* Toggle */}
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
                  <path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {b}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        {mode === 'hire' ? (
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/app.html#explorar"
              className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-zinc-700 transition-colors"
            >
              Buscar profesionales
            </a>
            <a
              href="/app.html#inicio"
              className="inline-flex items-center gap-2 border border-zinc-300 text-zinc-800 px-6 py-3 rounded-full text-sm font-semibold hover:border-zinc-500 transition-colors"
            >
              Ver proveedores
            </a>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/app.html#mis-proyectos"
              className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-zinc-700 transition-colors"
            >
              Publicar mi perfil
            </a>
            <a
              href="/app.html#explorar"
              className="inline-flex items-center gap-2 border border-zinc-300 text-zinc-800 px-6 py-3 rounded-full text-sm font-semibold hover:border-zinc-500 transition-colors"
            >
              Ver proyectos disponibles
            </a>
          </div>
        )}
      </main>

      <footer className="px-8 py-5 border-t border-zinc-100 text-center text-sm text-zinc-400">
        © {new Date().getFullYear()} Instone. Todos los derechos reservados.
      </footer>
    </div>
  )
}

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

type MapPin = {
  id: string
  x: number
  y: number
  type: 'project' | 'material'
  label: string
}

const HIRE_PINS: MapPin[] = [
  { id: 'h1', x: 18, y: 26, type: 'project', label: 'Mármol · Palermo' },
  { id: 'h2', x: 56, y: 52, type: 'project', label: 'Terrazo · Belgrano' },
  { id: 'h3', x: 72, y: 16, type: 'project', label: 'Piedra · San Isidro' },
  { id: 'h4', x: 36, y: 70, type: 'project', label: 'Interiores · Almagro' },
  { id: 'h5', x: 80, y: 62, type: 'project', label: 'Terrazo · Tigre' },
]

const OFFER_PINS: MapPin[] = [
  { id: 'o1', x: 26, y: 32, type: 'material', label: 'Piedra blanca rodada' },
  { id: 'o2', x: 62, y: 47, type: 'material', label: 'Terrazo gris perla' },
  { id: 'o3', x: 18, y: 64, type: 'material', label: 'Cuarcita azul' },
  { id: 'o4', x: 74, y: 24, type: 'project', label: 'Proyecto · Recoleta' },
  { id: 'o5', x: 50, y: 74, type: 'project', label: 'Cocina · Núñez' },
]

function MapBackground() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 480 440"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="480" height="440" fill="#f0e8dc" />
      {/* Major horizontal streets */}
      <rect x="0" y="110" width="480" height="14" fill="#e3d8cc" />
      <rect x="0" y="248" width="480" height="14" fill="#e3d8cc" />
      <rect x="0" y="372" width="480" height="10" fill="#e3d8cc" />
      {/* Major vertical streets */}
      <rect x="106" y="0" width="14" height="440" fill="#e3d8cc" />
      <rect x="256" y="0" width="14" height="440" fill="#e3d8cc" />
      <rect x="394" y="0" width="10" height="440" fill="#e3d8cc" />
      {/* Minor horizontal streets */}
      <rect x="0" y="56" width="480" height="5" fill="#ebe3d8" />
      <rect x="0" y="182" width="480" height="4" fill="#ebe3d8" />
      <rect x="0" y="310" width="480" height="4" fill="#ebe3d8" />
      <rect x="0" y="415" width="480" height="4" fill="#ebe3d8" />
      {/* Minor vertical streets */}
      <rect x="52" y="0" width="4" height="440" fill="#ebe3d8" />
      <rect x="182" y="0" width="4" height="440" fill="#ebe3d8" />
      <rect x="330" y="0" width="4" height="440" fill="#ebe3d8" />
      <rect x="458" y="0" width="4" height="440" fill="#ebe3d8" />
      {/* Parks */}
      <rect x="120" y="124" width="58" height="54" fill="#c5d4a0" rx="4" />
      <rect x="270" y="262" width="56" height="44" fill="#c5d4a0" rx="4" />
      <rect x="56" y="60" width="42" height="42" fill="#c5d4a0" rx="4" />
      <rect x="404" y="124" width="44" height="36" fill="#c5d4a0" rx="4" />
      {/* Water feature right edge */}
      <path
        d="M414 0 Q448 110 428 220 Q408 330 438 440 L480 440 L480 0 Z"
        fill="#d8e8f0"
        opacity="0.55"
      />
    </svg>
  )
}

function PinMarker({
  pin,
  visible,
  delay,
}: {
  pin: MapPin
  visible: boolean
  delay: number
}) {
  const isProject = pin.type === 'project'
  return (
    <div
      style={{
        position: 'absolute',
        left: `${pin.x}%`,
        top: `${pin.y}%`,
        transform: 'translate(-50%, -50%)',
        opacity: visible ? 1 : 0,
        transition: `opacity 0.25s ease ${delay}ms`,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          padding: '5px 11px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          background: isProject ? '#18181b' : '#b45309',
          color: 'white',
          userSelect: 'none',
        }}
      >
        {pin.label}
      </div>
    </div>
  )
}

export default function Home() {
  const [mode, setMode] = useState<'hire' | 'offer'>('hire')
  const [wordIdx, setWordIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const [pinsVisible, setPinsVisible] = useState(true)
  const [displayedPins, setDisplayedPins] = useState<MapPin[]>(HIRE_PINS)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    setWordIdx(0)
    setFading(false)
    setPinsVisible(false)
    const t = setTimeout(() => {
      setDisplayedPins(mode === 'hire' ? HIRE_PINS : OFFER_PINS)
      setPinsVisible(true)
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

          {/* CTAs */}
          {mode === 'hire' ? (
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/app.html#inicio"
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
                href="/app.html#inicio"
                className="inline-flex items-center gap-2 border border-zinc-300 text-zinc-800 px-6 py-3 rounded-full text-sm font-semibold hover:border-zinc-500 transition-colors"
              >
                Ver proyectos disponibles
              </a>
            </div>
          )}
        </div>

        {/* Right: map preview with pins */}
        <div className="flex-1 relative overflow-hidden" style={{ minHeight: '300px' }}>
          <MapBackground />
          {displayedPins.map((pin, i) => (
            <PinMarker key={pin.id} pin={pin} visible={pinsVisible} delay={i * 55} />
          ))}
        </div>
      </main>

      <footer className="px-8 py-5 border-t border-zinc-100 text-center text-sm text-zinc-400 flex-shrink-0">
        © {new Date().getFullYear()} Instone. Todos los derechos reservados.
      </footer>
    </div>
  )
}

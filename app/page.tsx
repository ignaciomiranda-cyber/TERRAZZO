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

function PinCard({ card, visible, delay }: { card: PinCard; visible: boolean; delay: number }) {
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
        {/* Image */}
        <div style={{ aspectRatio: card.aspectRatio, overflow: 'hidden' }}>
          <img
            src={card.img}
            alt={card.title}
            loading="lazy"
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        {/* Hover overlay with title */}
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
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', lineHeight: 1.3, textShadow: '0 1px 4px rgba(0,0,0,.4)' }}>
            {card.title}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.75)', marginTop: '2px' }}>
            {card.tag}
          </div>
        </div>
      </div>
      {/* Caption below */}
      <div style={{ padding: '7px 4px 2px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A18', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {card.title}
        </div>
        <div style={{ fontSize: '11px', color: '#9b958a', marginTop: '1px' }}>{card.tag}</div>
      </div>
    </div>
  )
}

function PinterestGrid({ cards, visible }: { cards: PinCard[]; visible: boolean }) {
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
        <PinCard key={card.id} card={card} visible={visible} delay={i * 50} />
      ))}
    </div>
  )
}

export default function Home() {
  const [mode, setMode] = useState<'hire' | 'offer'>('hire')
  const [wordIdx, setWordIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const [gridVisible, setGridVisible] = useState(true)
  const [displayedCards, setDisplayedCards] = useState<PinCard[]>(HIRE_CARDS)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

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
          {/* Gradient fade on left edge to blend with white content */}
          <div
            className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, #f7f4f0 0%, transparent 100%)' }}
          />
          <PinterestGrid cards={displayedCards} visible={gridVisible} />
        </div>
      </main>

      <footer className="px-8 py-5 border-t border-zinc-100 text-center text-sm text-zinc-400 flex-shrink-0">
        © {new Date().getFullYear()} Instone. Todos los derechos reservados.
      </footer>
    </div>
  )
}

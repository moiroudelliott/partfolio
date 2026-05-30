import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const Ctx = createContext(null)

export function LightboxProvider({ children }) {
  const [state, setState] = useState(null)

  const open = useCallback((images, startIndex = 0) => {
    const imgs = Array.isArray(images) ? images : [images]
    setState({ images: imgs.filter(Boolean) })
  }, [])

  const close = useCallback(() => setState(null), [])

  useEffect(() => {
    if (!state) return
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, close])

  useEffect(() => {
    document.body.style.overflow = state ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [state])

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {state && <LightboxOverlay state={state} close={close} />}
    </Ctx.Provider>
  )
}

export const useLightbox = () => useContext(Ctx)

function LightboxImg({ src, imgStyle }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 80, minHeight: 80 }}>
      {!loaded && (
        <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spin" style={{ width: 22, height: 22, border: '1.5px solid oklch(0.55 0.02 80)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
      )}
      <img
        src={src} alt=""
        onLoad={() => setLoaded(true)}
        style={{ ...imgStyle, opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
      />
    </div>
  )
}

function LightboxOverlay({ state, close }) {
  const { images } = state
  const hasMany = images.length > 1

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0,
        // Au-dessus de tout, SAUF le curseur custom (voir style.css)
        zIndex: 9000,
        background: 'oklch(0.15 0.01 60 / 0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(6px)',
        // Curseur natif visible dans le lightbox
        cursor: 'default',
        overflowX: hasMany ? 'auto' : 'hidden',
        overflowY: 'hidden',
        padding: '48px 64px',
        gap: 32,
      }}
    >
      {/* Tape déco (image unique uniquement) */}
      {!hasMany && (
        <div
          onClick={e => e.stopPropagation()}
          style={{ position: 'relative', display: 'inline-block' }}
        >
          <div style={{
            position: 'absolute', top: -12, left: '50%',
            transform: 'translateX(-50%) rotate(-2deg)',
            width: 80, height: 20, zIndex: 2, pointerEvents: 'none',
            background: 'oklch(0.92 0.05 90 / 0.55)',
            borderLeft: '1px dashed oklch(0.8 0.05 85 / 0.4)',
            borderRight: '1px dashed oklch(0.8 0.05 85 / 0.4)',
          }} />
          <LightboxImg src={images[0]} imgStyle={{
            display: 'block',
            maxWidth: '86vw', maxHeight: '84vh',
            width: 'auto', height: 'auto',
            objectFit: 'contain',
            boxShadow: '0 30px 80px oklch(0.08 0.01 60 / 0.7)',
          }} />
        </div>
      )}

      {/* Plusieurs images côte à côte */}
      {hasMany && images.map((src, i) => (
        <div
          key={i}
          onClick={e => e.stopPropagation()}
          style={{ position: 'relative', flexShrink: 0 }}
        >
          {/* Tape sur chaque image */}
          <div style={{
            position: 'absolute', top: -12,
            left: i % 2 === 0 ? '30%' : '60%',
            transform: `translateX(-50%) rotate(${i % 2 === 0 ? -3 : 2}deg)`,
            width: 70, height: 18, zIndex: 2, pointerEvents: 'none',
            background: 'oklch(0.92 0.05 90 / 0.55)',
            borderLeft: '1px dashed oklch(0.8 0.05 85 / 0.4)',
            borderRight: '1px dashed oklch(0.8 0.05 85 / 0.4)',
          }} />
          <LightboxImg src={src} imgStyle={{
            display: 'block',
            // Chaque image prend sa taille naturelle dans la limite de l'écran
            maxHeight: '78vh',
            maxWidth: `min(${Math.floor(86 / images.length)}vw, 600px)`,
            width: 'auto', height: 'auto',
            objectFit: 'contain',
            boxShadow: '0 24px 60px oklch(0.08 0.01 60 / 0.65)',
          }} />
          {/* Numéro de l'image */}
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
            color: 'oklch(0.6 0.02 80)', textTransform: 'uppercase',
            marginTop: 10, textAlign: 'center',
          }}>
            {String(i + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>
        </div>
      ))}

      {/* Bouton fermer */}
      <button
        onClick={close}
        style={{
          position: 'fixed', top: 20, right: 24,
          background: 'none', border: '1px solid oklch(0.55 0.01 80 / 0.4)',
          color: 'oklch(0.8 0.01 80)', width: 38, height: 38,
          borderRadius: '50%', fontSize: 16,
          cursor: 'default',
          display: 'grid', placeItems: 'center',
          transition: 'background 0.2s',
          zIndex: 1,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'oklch(0.92 0.01 80 / 0.15)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
      >✕</button>
    </div>
  )
}

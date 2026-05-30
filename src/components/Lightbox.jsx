import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const Ctx = createContext(null)

export function LightboxProvider({ children }) {
  const [state, setState] = useState(null)

  const open = useCallback((images, piece = null) => {
    const imgs = Array.isArray(images) ? images : [images]
    setState({
      images: imgs.filter(Boolean),
      piece: (piece && typeof piece === 'object') ? piece : null,
    })
  }, [])

  const close = useCallback(() => setState(null), [])

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

// ── Image avec spinner ────────────────────────────────────────────────────────
function LightboxImg({ src, style: imgStyle }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 80, minHeight: 80 }}>
      {!loaded && (
        <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spin" style={{ width: 22, height: 22, border: '1.5px solid oklch(0.55 0.02 80)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
      )}
      <img src={src} alt="" onLoad={() => setLoaded(true)}
        style={{ ...imgStyle, opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }} />
    </div>
  )
}

// ── Bouton flèche ─────────────────────────────────────────────────────────────
function NavBtn({ dir, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
      border: '1px solid oklch(0.55 0.01 80 / 0.45)',
      background: 'none', color: 'oklch(0.8 0.01 80)',
      fontSize: 20, cursor: 'default',
      display: 'grid', placeItems: 'center',
      opacity: disabled ? 0.2 : 1,
      transition: 'background 0.18s, opacity 0.18s',
    }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'oklch(0.92 0.01 80 / 0.12)' }}
    onMouseLeave={e => { e.currentTarget.style.background = 'none' }}>
      {dir === 'prev' ? '←' : '→'}
    </button>
  )
}

// ── Overlay principal ─────────────────────────────────────────────────────────
function LightboxOverlay({ state, close }) {
  const { images, piece } = state
  const [pageIdx, setPageIdx] = useState(0)

  const hasCarousel = images.length > 2
  const totalPages  = Math.ceil(images.length / 2)
  const curImgs     = images.slice(pageIdx * 2, pageIdx * 2 + 2)

  const note  = piece?.comment
  const title = piece?.title
  const hasNote = !!(note || title)

  // Portrait → note à droite / paysage ou multi → note en dessous
  const isPortrait = images.length === 1 && piece?.dim && piece.dim.h > piece.dim.w
  const layout = isPortrait ? 'row' : 'col'

  // Hauteur max selon contexte
  const maxH = hasNote
    ? (layout === 'row' ? '75vh' : '58vh')
    : (images.length > 1 ? '78vh' : '84vh')

  // Largeur max par image
  const perImgW = images.length === 1
    ? '86vw'
    : `min(${Math.floor(80 / curImgs.length)}vw, 560px)`

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') { close(); return }
      if (!hasCarousel) return
      if (e.key === 'ArrowRight') setPageIdx(p => Math.min(totalPages - 1, p + 1))
      if (e.key === 'ArrowLeft')  setPageIdx(p => Math.max(0, p - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close, hasCarousel, totalPages])

  const imgStyle = {
    display: 'block', objectFit: 'contain',
    maxHeight: maxH, maxWidth: perImgW,
    width: 'auto', height: 'auto',
    boxShadow: '0 24px 60px oklch(0.08 0.01 60 / 0.65)',
  }

  const noteBlock = hasNote && (
    <div style={{
      textAlign: layout === 'row' ? 'left' : 'center',
      maxWidth: layout === 'row' ? 300 : 680,
    }}>
      {title && (
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 20,
          color: 'oklch(0.8 0.02 80)', letterSpacing: '0.01em',
          marginBottom: note ? 10 : 0 }}>
          {title}
        </div>
      )}
      {note && (
        <div className="hand" style={{ fontSize: 28, color: 'oklch(0.84 0.03 82)', lineHeight: 1.4 }}>
          ↳ {note}
        </div>
      )}
    </div>
  )

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'oklch(0.15 0.01 60 / 0.92)',
      backdropFilter: 'blur(6px)',
      cursor: 'default',
      overflowY: 'auto',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '56px 72px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        display: 'flex',
        flexDirection: layout === 'row' ? 'row' : 'column',
        alignItems: layout === 'row' ? 'flex-start' : 'center',
        gap: layout === 'row' ? 44 : 28,
      }}>

        {/* ── Images + flèches ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {hasCarousel && (
            <NavBtn dir="prev" onClick={() => setPageIdx(p => Math.max(0, p - 1))} disabled={pageIdx === 0} />
          )}

          <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
            {curImgs.map((src, i) => (
              <div key={pageIdx * 2 + i} style={{ position: 'relative', flexShrink: 0 }}>
                {/* Scotch */}
                <div style={{
                  position: 'absolute', top: -12,
                  left: i % 2 === 0 ? '35%' : '62%',
                  transform: `translateX(-50%) rotate(${i % 2 === 0 ? -3 : 2}deg)`,
                  width: 70, height: 18, zIndex: 2, pointerEvents: 'none',
                  background: 'oklch(0.92 0.05 90 / 0.55)',
                  borderLeft: '1px dashed oklch(0.8 0.05 85 / 0.4)',
                  borderRight: '1px dashed oklch(0.8 0.05 85 / 0.4)',
                }} />
                <LightboxImg src={src} style={imgStyle} />
              </div>
            ))}
          </div>

          {hasCarousel && (
            <NavBtn dir="next" onClick={() => setPageIdx(p => Math.min(totalPages - 1, p + 1))} disabled={pageIdx === totalPages - 1} />
          )}
        </div>

        {/* ── Note (portrait : à droite) ── */}
        {layout === 'row' && (
          <div style={{ paddingTop: 28 }}>{noteBlock}</div>
        )}

        {/* ── Note + indicateur (en dessous) ── */}
        {layout === 'col' && (hasCarousel || hasNote) && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            {hasCarousel && (
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em',
                color: 'oklch(0.55 0.02 80)', textTransform: 'uppercase' }}>
                {pageIdx * 2 + 1}–{Math.min((pageIdx + 1) * 2, images.length)} / {images.length}
              </div>
            )}
            {noteBlock}
          </div>
        )}
      </div>

      {/* ── Bouton fermer ── */}
      <button onClick={close} style={{
        position: 'fixed', top: 20, right: 24,
        background: 'none', border: '1px solid oklch(0.55 0.01 80 / 0.4)',
        color: 'oklch(0.8 0.01 80)', width: 38, height: 38,
        borderRadius: '50%', fontSize: 16, cursor: 'default',
        display: 'grid', placeItems: 'center', transition: 'background 0.2s', zIndex: 1,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'oklch(0.92 0.01 80 / 0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none' }}>✕</button>
    </div>
  )
}

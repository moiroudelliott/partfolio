import { useState, useMemo, useEffect } from 'react'
import Reveal from '../components/Reveal.jsx'
import Placeholder from '../components/Placeholder.jsx'
import FloatingMotifs from '../components/FloatingMotifs.jsx'
import JustifiedGallery from '../components/JustifiedGallery.jsx'
import { useLightbox } from '../components/Lightbox.jsx'

const TONES = ['warm','ink','paper','rust','cool','moss']
const RATIOS = ['3/4','4/5','1/1','5/4','4/3','3/4','5/6']
const ROTS   = [-2.5, 1.8, -1.2, 2.2, -1.8, 1.5, -2, 1.2]

export default function CategoryPage({ ui, data, go, route }) {
  const cat = data.categories.find(c => c.id === route.id) ?? data.categories[0]
  const [activeSub, setActiveSub] = useState('all')

  useEffect(() => {
    setActiveSub('all')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route.id])

  const pieces = useMemo(() => {
    const out = []
    cat.sub.forEach((s, si) => {
      s.pieces.forEach((p, i) => {
        out.push({
          ...p,
          subId: s.id, subLabel: s.label, subNote: s.note,
          tone: TONES[(si + i) % TONES.length],
          ratio: RATIOS[(si * 2 + i) % RATIOS.length],
          rot: ROTS[(si + i) % ROTS.length],
          code: `${cat.number}·${s.id.slice(0,3).toUpperCase()}·${String(i+1).padStart(2,'0')}`,
        })
      })
    })
    return out
  }, [cat])

  const filtered = activeSub === 'all' ? pieces : pieces.filter(p => p.subId === activeSub)
  const idx = data.categories.indexOf(cat)
  const prev = data.categories[(idx - 1 + data.categories.length) % data.categories.length]
  const next = data.categories[(idx + 1) % data.categories.length]

  return (
    <div className="paper" style={{ position: 'relative', overflow: 'hidden' }}>
      <FloatingMotifs density={0.4} motifs={data.motifs} />

      {/* Fil d'Ariane */}
      <section className="sec-crumb" style={{ padding: '12px 56px 0', animation: 'hero-bar 0.45s ease both' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => go({ kind: 'home' })} data-cursor="hover" className="btn-ink" style={{ fontSize: 15 }}>
            <span className="ring" style={{ width: 44, height: 44 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 7 H 1 M 7 1 L 1 7 L 7 13" stroke="var(--ink)" strokeWidth="1.2" fill="none"/>
              </svg>
            </span>
            <span>{ui.backHome}</span>
          </button>
          <div className="kicker">{ui.categories} → <span style={{ color: 'var(--moss-deep)' }}>{cat.label}</span></div>
        </div>
      </section>

      {/* HERO */}
      <section className="sec-cat" style={{ padding: '50px 56px 50px', position: 'relative' }}>
        <div className="wrap r-cat" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, alignItems: 'start' }}>
          <div>
            <div className="kicker" style={{ marginBottom: 14, animation: 'hero-up 0.6s cubic-bezier(.22,1,.36,1) 0.1s both' }}>
              § {cat.number} · {ui.series}
            </div>
            <h1 className="serif-display" style={{ fontSize: 'clamp(52px, 7vw, 120px)', margin: 0, lineHeight: 0.9 }}>
              {cat.label.split(' ').map((w, i) => (
                <div key={i} style={{ overflow: 'hidden', paddingBottom: '0.28em', marginBottom: '-0.28em' }}>
                  <span style={{ display: 'block', fontStyle: i % 2 === 1 ? 'italic' : 'normal', animation: `hero-line 0.75s cubic-bezier(.22,1,.36,1) ${0.18 + i * 0.18}s both` }}>
                    {w}
                  </span>
                </div>
              ))}
            </h1>
            <p style={{ marginTop: 30, fontSize: 22, fontStyle: 'italic', color: 'var(--ink-soft)', maxWidth: 540, animation: 'hero-up 0.65s cubic-bezier(.22,1,.36,1) 0.42s both' }}>
              {cat.tagline}
            </p>
            <p style={{ marginTop: 28, fontSize: 18, lineHeight: 1.7, maxWidth: 580, animation: 'hero-up 0.65s cubic-bezier(.22,1,.36,1) 0.55s both' }}>
              {cat.blurb}
            </p>
            <div style={{ marginTop: 28, animation: 'hero-up 0.6s cubic-bezier(.22,1,.36,1) 0.68s both' }}>
              <span className="stamp">{cat.number} · {ui.stamp}</span>
            </div>
          </div>
          <div className="r-cat-cover" style={{ paddingTop: 30, animation: 'hero-cover 1.0s cubic-bezier(.22,1,.36,1) 0.15s both' }}>
            <CoverImage cat={cat} idx={idx} />
          </div>
        </div>
      </section>

      {/* Filtres sous-séries */}
      <section className="sec-filter" style={{ padding: '40px 56px 30px' }}>
        <div className="wrap">
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 20, borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--ink)', padding: '18px 0' }}>
              <div className="kicker">{ui.subcategories}</div>
              <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <SubChip label={ui.allWorks} count={pieces.length} active={activeSub === 'all'} onClick={() => setActiveSub('all')} />
                {cat.sub.map(s => (
                  <SubChip key={s.id} label={s.label} count={s.pieces.length} active={activeSub === s.id} onClick={() => setActiveSub(s.id)} />
                ))}
              </div>
            </div>
            {activeSub !== 'all' && (
              <div className="hand" style={{ fontSize: 22, color: 'var(--moss-deep)', marginBottom: 12 }}>
                ↳ {cat.sub.find(s => s.id === activeSub)?.note}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Galerie — layout justified (aucun recadrage) */}
      <section className="sec-gallery" style={{ padding: '20px 56px 60px' }}>
        <div className="wrap">
          <JustifiedGallery pieces={filtered} />
        </div>
      </section>

      {/* Prev / Next */}
      <section className="sec-pager" style={{ padding: '40px 56px 80px' }}>
        <div className="wrap">
          <hr className="dotted-rule" style={{ marginBottom: 30 }} />
          <div className="r-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
            <CatPager dir="prev" cat={prev} ui={ui} go={go} />
            <CatPager dir="next" cat={next} ui={ui} go={go} />
          </div>
        </div>
      </section>
    </div>
  )
}

// ── CoverImage ───────────────────────────────────────────────────────────────

function CoverImage({ cat, idx }) {
  const { open } = useLightbox()
  const image = cat.cover?.image
  return (
    <Placeholder
      label={cat.label.toLowerCase()} code={`${cat.number} · cover`}
      image={image} tone={TONES[idx % 6]} ratio="4 / 5"
      rotate={-2.5} tapeSeed={idx} hoverRot={1.5}
      style={{ width: '88%', marginLeft: 'auto' }}
      onClick={image ? () => open([image]) : null}
    />
  )
}

// ── PieceCard (plus utilisé dans la galerie, conservé pour référence) ────────

function PieceCard({ piece: p, index }) {
  const { open } = useLightbox()

  // normalise : image peut être string | string[] | null
  const images = p.image
    ? (Array.isArray(p.image) ? p.image : [p.image]).filter(Boolean)
    : []

  const isGrouped = images.length > 1
  const hasImage  = images.length > 0

  const handleClick = hasImage ? () => open(images, 0) : null

  return (
    <div>
      {isGrouped
        ? <StackedImages images={images} piece={p} index={index} onClick={handleClick} />
        : <Placeholder
            label={p.title} code={p.code} image={images[0] ?? null}
            tone={p.tone} ratio={p.ratio} rotate={p.rot}
            hoverRot={p.rot > 0 ? -1.5 : 1.5}
            tapeSeed={index} onClick={handleClick}
          />
      }

      {/* Légende */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, gap: 10, alignItems: 'baseline' }}>
        <span className="serif-display" style={{ fontSize: 20, fontStyle: 'italic' }}>{p.title}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--moss-deep)', whiteSpace: 'nowrap' }}>{p.year}</span>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-soft)', textTransform: 'uppercase', marginTop: 2 }}>{p.subLabel}</div>

      {/* Commentaire manuscrit — inline, jamais caché */}
      {p.comment && (
        <div className="hand" style={{
          fontSize: 16, marginTop: 6,
          color: 'var(--ink-soft)',
          transform: `rotate(${[-1.5, 1, -2, 1.5][index % 4]}deg)`,
          display: 'inline-block',
        }}>
          ↳ {p.comment}
        </div>
      )}
    </div>
  )
}

// ── StackedImages ─────────────────────────────────────────────────────────────
// Affiche le premier plan au-dessus, les suivants qui "dépassent" en-dessous.

function StackedImages({ images, piece: p, index, onClick }) {
  // Angles pour les images de fond (légèrement décalées)
  const backAngles = [3.5, -2.8, 4.2]

  return (
    <div
      data-cursor="hover"
      onClick={onClick}
      style={{
        position: 'relative',
        // espace en bas et à droite pour que les images de fond soient visibles
        paddingBottom: (images.length - 1) * 14,
        paddingRight: (images.length - 1) * 10,
        cursor: 'none',
      }}
    >
      {/* Images de fond (du plus bas au plus proche) */}
      {images.slice(1).reverse().map((img, bi) => {
        const depth = images.length - 1 - bi
        return (
          <div key={bi} style={{
            position: 'absolute',
            inset: 0,
            transform: `rotate(${backAngles[bi % backAngles.length]}deg) translate(${depth * 9}px, ${depth * 12}px)`,
            zIndex: bi,
            overflow: 'hidden',
          }}>
            <div className="ph" style={{
              aspectRatio: p.ratio,
              background: img
                ? 'var(--paper-warm)'
                : 'oklch(0.88 0.03 75)',
              boxShadow: '0 0 0 1px oklch(0.7 0.04 65 / 0.4) inset, 0 14px 30px -16px oklch(0.25 0.04 60 / 0.25)',
            }}>
              {img && (
                <img src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
          </div>
        )
      })}

      {/* Image de premier plan */}
      <div style={{ position: 'relative', zIndex: images.length }}>
        <Placeholder
          label={p.title} code={p.code} image={images[0]}
          tone={p.tone} ratio={p.ratio} rotate={p.rot}
          hoverRot={p.rot > 0 ? -1.5 : 1.5}
          tapeSeed={index} onClick={null}
        />
      </div>

      {/* Badge "+N" */}
      <div style={{
        position: 'absolute',
        bottom: 18, right: 4,
        zIndex: images.length + 1,
        background: 'var(--ink)',
        color: 'var(--paper-cream)',
        fontFamily: 'var(--mono)',
        fontSize: 9,
        letterSpacing: '0.12em',
        padding: '3px 8px',
        transform: 'rotate(2deg)',
        pointerEvents: 'none',
      }}>
        +{images.length - 1}
      </div>
    </div>
  )
}

// ── SubChip ───────────────────────────────────────────────────────────────────

function SubChip({ label, count, active, onClick }) {
  return (
    <button onClick={onClick} data-cursor="hover" style={{
      display: 'inline-flex', alignItems: 'baseline', gap: 10,
      padding: '8px 16px',
      background: active ? 'var(--ink)' : 'transparent',
      color: active ? 'var(--paper-cream)' : 'var(--ink)',
      border: '1px solid var(--ink)', borderRadius: 999,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17,
      transition: 'background 0.25s, color 0.25s, transform 0.25s',
      transform: active ? 'translateY(-1px)' : 'none',
    }}>
      <span>{label}</span>
      <span style={{ fontFamily: 'var(--mono)', fontStyle: 'normal', fontSize: 10, letterSpacing: '0.12em', color: active ? 'var(--paper-warm)' : 'var(--ink-soft)' }}>
        · {String(count).padStart(2, '0')}
      </span>
    </button>
  )
}

// ── CatPager ──────────────────────────────────────────────────────────────────

function CatPager({ dir, cat, ui, go }) {
  const isNext = dir === 'next'
  return (
    <div onClick={() => go({ kind: 'category', id: cat.id })} data-cursor="hover" className="hoverable"
         style={{ display: 'grid', gridTemplateColumns: isNext ? '1fr 80px' : '80px 1fr', gap: 24, alignItems: 'center', padding: 24, border: '1px dashed var(--rule)', background: 'oklch(0.92 0.025 80 / 0.4)', textAlign: isNext ? 'right' : 'left', '--hover-rot': '0deg' }}>
      {!isNext && <ArrowCircle dir="left" />}
      <div>
        <div className="kicker" style={{ marginBottom: 8 }}>{isNext ? ui.nextSeries : ui.prevSeries}</div>
        <div className="serif-display" style={{ fontSize: 'clamp(20px, 2.5vw, 36px)', fontStyle: 'italic' }}>{cat.label}</div>
        <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 4 }}>{cat.tagline}</div>
      </div>
      {isNext && <ArrowCircle dir="right" />}
    </div>
  )
}

function ArrowCircle({ dir }) {
  return (
    <div style={{ width: 72, height: 72, borderRadius: '50%', border: '1px solid var(--ink)', display: 'grid', placeItems: 'center', justifySelf: dir === 'left' ? 'start' : 'end' }}>
      <svg width="22" height="14" viewBox="0 0 22 14" fill="none" style={{ transform: dir === 'left' ? 'scaleX(-1)' : 'none' }}>
        <path d="M1 7 H 20 M 14 1 L 20 7 L 14 13" stroke="var(--ink)" strokeWidth="1.2" fill="none"/>
      </svg>
    </div>
  )
}

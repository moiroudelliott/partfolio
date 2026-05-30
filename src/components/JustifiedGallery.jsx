/**
 * EditorialGallery
 * ─────────────────
 * Regroupe les images en blocs de 1, 2 ou 3, assigne un template de composition
 * à chaque bloc selon les ratios réels, puis applique rotation + décalage
 * pour l'effet journal.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useLightbox } from './Lightbox.jsx'

// ── Constantes ────────────────────────────────────────────────────────────────
const GAP      = 40    // espace entre images dans un bloc
const BLOCK_MB = 80    // marge entre blocs
const IMG_PAD  = 16    // padding autour de chaque image (réduit la taille + zone tampon anti-chevauchement)

// ── Hash déterministe ─────────────────────────────────────────────────────────
function h(str) {
  let v = 2166136261
  for (let i = 0; i < str.length; i++) v = Math.imul(v ^ str.charCodeAt(i), 16777619) >>> 0
  return v
}

// ── Paramètres de chaos (déterministes par pièce) ────────────────────────────
function getChaos(id) {
  const hr = h(id + 'r')
  return {
    rot: (hr % 2 === 0 ? 1 : -1) * (0.2 + (hr % 18) / 10),  // ±0.2–2°
  }
}

// ── Classement du ratio ───────────────────────────────────────────────────────
function cat(w, h_) {
  const r = w / h_
  if (r < 0.75) return 'tall'
  if (r < 1.1)  return 'portrait'
  if (r < 1.5)  return 'square'
  if (r < 2.2)  return 'landscape'
  return 'wide'
}

// ── Chargement des dimensions réelles ────────────────────────────────────────
function src0(image) {
  if (!image) return null
  return Array.isArray(image) ? image[0] : image
}

function loadDims(pieces) {
  return Promise.all(pieces.map(p => {
    const s = src0(p.image)
    if (!s) return Promise.resolve({ w: 3, h: 4 })
    return new Promise(resolve => {
      const img = new Image()
      img.onload  = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
      img.onerror = () => resolve({ w: 3, h: 4 })
      img.src = s
    })
  }))
}

// ── Cache sessionStorage des dimensions ──────────────────────────────────────
function dimsCacheKey(pieces) {
  return 'dims:' + pieces.map(p => src0(p.image) || '').join('|')
}
function getCachedDims(pieces) {
  try {
    const v = sessionStorage.getItem(dimsCacheKey(pieces))
    if (v) { const d = JSON.parse(v); if (d.length === pieces.length) return d }
  } catch {}
  return null
}
function setCachedDims(pieces, dims) {
  try { sessionStorage.setItem(dimsCacheKey(pieces), JSON.stringify(dims)) } catch {}
}

// ── Sélection de la taille de bloc ───────────────────────────────────────────
function pickSize(remaining, blockNum) {
  if (remaining <= 1) return 1
  if (remaining === 2) return 2
  // séquence variée : favorise 2 et 3, intercale des solos
  const seq = [3, 2, 3, 1, 2, 3, 2, 3, 1, 3, 2, 3]
  return seq[blockNum % seq.length]
}

// ── Sélection du template ─────────────────────────────────────────────────────
function pickTemplate(size, dims, start) {
  if (size === 1) {
    const r = dims[start].w / dims[start].h
    return r > 1.4 ? 'solo-landscape' : 'solo-portrait'
  }

  if (size === 2) {
    const r0 = dims[start].w   / dims[start].h
    const r1 = dims[start+1].w / dims[start+1].h
    if (r0 > 1.3 && r1 > 1.3) return 'duo-stacked'    // 2 paysages : on empile
    if (r0 < 0.85)             return 'duo-tall-left'  // portrait dominant à gauche
    if (r1 < 0.85)             return 'duo-tall-right' // portrait dominant à droite
    if (r0 > r1 * 1.4)        return 'duo-big-left'   // première image nettement plus large
    if (r1 > r0 * 1.4)        return 'duo-big-right'  // deuxième nettement plus large
    return 'duo-equal'
  }

  if (size === 3) {
    const r0 = dims[start].w   / dims[start].h
    const r1 = dims[start+1].w / dims[start+1].h
    const r2 = dims[start+2].w / dims[start+2].h
    // Image portrait en premier → héros gauche
    if (cat(dims[start].w, dims[start].h) === 'tall' || cat(dims[start].w, dims[start].h) === 'portrait')
      return 'trio-hero-left'
    // Image portrait en dernier → héros droite
    if (cat(dims[start+2].w, dims[start+2].h) === 'tall' || cat(dims[start+2].w, dims[start+2].h) === 'portrait')
      return 'trio-hero-right'
    // Paysage en premier → image large en haut
    if (r0 > 1.5) return 'trio-wide-top'
    // Paysage en dernier → image large en bas
    if (r2 > 1.5) return 'trio-wide-bottom'
    // Par défaut on alterne
    return h('tpl' + start) % 2 === 0 ? 'trio-hero-left' : 'trio-hero-right'
  }
}

// ── Calcul des blocs ──────────────────────────────────────────────────────────
function computeBlocks(pieces, dims) {
  const blocks = []
  let i = 0, bn = 0
  while (i < pieces.length) {
    const size = pickSize(pieces.length - i, bn)
    const actual = Math.min(size, pieces.length - i)
    const tpl = pickTemplate(actual, dims, i)
    blocks.push({
      pieces:   pieces.slice(i, i + actual),
      dims:     dims.slice(i, i + actual),
      template: tpl,
      bn,
    })
    i += actual
    bn++
  }
  return blocks
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function JustifiedGallery({ pieces }) {
  const containerRef = useRef(null)
  const [dims,   setDims]   = useState(null)
  const [blocks, setBlocks] = useState(null)

  useEffect(() => {
    setDims(null); setBlocks(null)

    // Chemin rapide : toutes les pièces ont déjà leurs dimensions dans le JSON
    if (pieces.every(p => p.dim)) {
      const stored = pieces.map(p => p.dim)
      setDims(stored)
      setBlocks(computeBlocks(pieces, stored))
      return
    }

    // Fallback : cache session, sinon chargement réseau
    const cached = getCachedDims(pieces)
    if (cached) {
      setDims(cached)
      setBlocks(computeBlocks(pieces, cached))
      return
    }
    loadDims(pieces).then(d => {
      setCachedDims(pieces, d)
      setDims(d)
    })
  }, [pieces])

  const recompute = useCallback((allDims) => {
    // Guard : dims doit correspondre exactement aux pieces actuelles.
    // Sans ça, un changement de filtre peut déclencher recompute avec
    // des anciennes dims (mauvaise longueur) → crash dans pickTemplate.
    if (!allDims || allDims.length !== pieces.length) return
    setBlocks(computeBlocks(pieces, allDims))
  }, [pieces])

  useEffect(() => { if (dims) recompute(dims) }, [dims, recompute])

  return (
    <div ref={containerRef}>
      {!blocks && (
        <div className="kicker" style={{ padding: '60px 0', color: 'var(--ink-pale)', textAlign: 'center' }}>
          · mise en page ·
        </div>
      )}
      {blocks && blocks.map((block, bi) => (
        <Block key={bi} block={block} />
      ))}
    </div>
  )
}

// ── Bloc éditorial ────────────────────────────────────────────────────────────
function Block({ block }) {
  const { pieces, dims, template, bn } = block

  // alignItems: 'start' critique — évite que le grid étire les items
  // au-delà de leur hauteur naturelle (ce qui causerait du recadrage)
  const gridStyle = {
    display: 'grid',
    gap: GAP,
    marginBottom: BLOCK_MB,
    alignItems: 'start',
  }

  // ─ Solo ─────────────────────────────────────────────────────────────────────
  if (template === 'solo-landscape') {
    return (
      <div style={{ ...gridStyle, gridTemplateColumns: '1fr' }}>
        <Img piece={pieces[0]} dim={dims[0]} gIdx={bn * 8} />
      </div>
    )
  }

  if (template === 'solo-portrait') {
    // Portrait centré à ~45% de la largeur max pour éviter les géants
    return (
      <div style={{ ...gridStyle, gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div />
        <Img piece={pieces[0]} dim={dims[0]} gIdx={bn * 8} />
        <div />
      </div>
    )
  }

  // ─ Duo ──────────────────────────────────────────────────────────────────────
  if (template === 'duo-equal') {
    return (
      <div style={{ ...gridStyle, gridTemplateColumns: '1fr 1fr' }}>
        <Img piece={pieces[0]} dim={dims[0]} gIdx={bn * 8} />
        <Img piece={pieces[1]} dim={dims[1]} gIdx={bn * 8 + 1} />
      </div>
    )
  }

  if (template === 'duo-big-left') {
    return (
      <div style={{ ...gridStyle, gridTemplateColumns: '1.7fr 1fr' }}>
        <Img piece={pieces[0]} dim={dims[0]} gIdx={bn * 8} />
        <Img piece={pieces[1]} dim={dims[1]} gIdx={bn * 8 + 1} />
      </div>
    )
  }

  if (template === 'duo-big-right') {
    return (
      <div style={{ ...gridStyle, gridTemplateColumns: '1fr 1.7fr' }}>
        <Img piece={pieces[0]} dim={dims[0]} gIdx={bn * 8} />
        <Img piece={pieces[1]} dim={dims[1]} gIdx={bn * 8 + 1} />
      </div>
    )
  }

  if (template === 'duo-tall-left') {
    return (
      <div style={{ ...gridStyle, gridTemplateColumns: '0.85fr 1.4fr' }}>
        <Img piece={pieces[0]} dim={dims[0]} gIdx={bn * 8} />
        <Img piece={pieces[1]} dim={dims[1]} gIdx={bn * 8 + 1} />
      </div>
    )
  }

  if (template === 'duo-tall-right') {
    return (
      <div style={{ ...gridStyle, gridTemplateColumns: '1.4fr 0.85fr' }}>
        <Img piece={pieces[0]} dim={dims[0]} gIdx={bn * 8} />
        <Img piece={pieces[1]} dim={dims[1]} gIdx={bn * 8 + 1} />
      </div>
    )
  }

  if (template === 'duo-stacked') {
    // 2 paysages empilés, limités à 60% de la largeur et centrés
    return (
      <div style={{ ...gridStyle, gridTemplateColumns: '1fr 5fr 1fr' }}>
        <div />
        <div style={{ display: 'grid', gap: GAP }}>
          <Img piece={pieces[0]} dim={dims[0]} gIdx={bn * 8} />
          <Img piece={pieces[1]} dim={dims[1]} gIdx={bn * 8 + 1} />
        </div>
        <div />
      </div>
    )
  }

  // ─ Trio ─────────────────────────────────────────────────────────────────────
  if (template === 'trio-hero-left') {
    // Grande image à gauche + 2 empilées à droite.
    // Flexbox aligné en haut → chaque image garde son ratio naturel, 0 recadrage.
    return (
      <div style={{ display: 'flex', gap: GAP, marginBottom: BLOCK_MB, alignItems: 'flex-start' }}>
        <div style={{ flex: '1.5', minWidth: 0 }}>
          <Img piece={pieces[0]} dim={dims[0]} gIdx={bn * 8} />
        </div>
        <div style={{ flex: '1', minWidth: 0, display: 'flex', flexDirection: 'column', gap: GAP }}>
          <Img piece={pieces[1]} dim={dims[1]} gIdx={bn * 8 + 1} />
          <Img piece={pieces[2]} dim={dims[2]} gIdx={bn * 8 + 2} />
        </div>
      </div>
    )
  }

  if (template === 'trio-hero-right') {
    return (
      <div style={{ display: 'flex', gap: GAP, marginBottom: BLOCK_MB, alignItems: 'flex-start' }}>
        <div style={{ flex: '1', minWidth: 0, display: 'flex', flexDirection: 'column', gap: GAP }}>
          <Img piece={pieces[0]} dim={dims[0]} gIdx={bn * 8} />
          <Img piece={pieces[1]} dim={dims[1]} gIdx={bn * 8 + 1} />
        </div>
        <div style={{ flex: '1.5', minWidth: 0 }}>
          <Img piece={pieces[2]} dim={dims[2]} gIdx={bn * 8 + 2} />
        </div>
      </div>
    )
  }

  if (template === 'trio-wide-top') {
    // Paysage pleine largeur en haut, 2 images en dessous
    return (
      <div style={{ ...gridStyle }}>
        <Img piece={pieces[0]} dim={dims[0]} gIdx={bn * 8} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: GAP }}>
          <Img piece={pieces[1]} dim={dims[1]} gIdx={bn * 8 + 1} />
          <Img piece={pieces[2]} dim={dims[2]} gIdx={bn * 8 + 2} />
        </div>
      </div>
    )
  }

  if (template === 'trio-wide-bottom') {
    // 2 images en haut, paysage pleine largeur en bas
    return (
      <div style={{ ...gridStyle }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: GAP }}>
          <Img piece={pieces[0]} dim={dims[0]} gIdx={bn * 8} />
          <Img piece={pieces[1]} dim={dims[1]} gIdx={bn * 8 + 1} />
        </div>
        <Img piece={pieces[2]} dim={dims[2]} gIdx={bn * 8 + 2} />
      </div>
    )
  }

  // Fallback : tout côte à côte
  return (
    <div style={{ ...gridStyle, gridTemplateColumns: pieces.map(() => '1fr').join(' ') }}>
      {pieces.map((p, i) => <Img key={p.id} piece={p} dim={dims[i]} gIdx={bn * 8 + i} />)}
    </div>
  )
}

// ── Composant image avec chaos ────────────────────────────────────────────────
const TAPE_ANGLES = [-9, 7, -6, 11, -8, 6, -12, 5, -7, 9, -4, 8]
const TAPE_LEFTS  = ['28%', '52%', '38%', '64%', '33%', '58%', '44%']

function Img({ piece, dim, gIdx }) {
  const { open } = useLightbox()

  const images = piece.image
    ? (Array.isArray(piece.image) ? piece.image : [piece.image]).filter(Boolean)
    : []
  const isGrouped = images.length > 1
  const hasImage  = images.length > 0

  const { rot } = getChaos(piece.id)
  const tapeAngle = TAPE_ANGLES[gIdx % TAPE_ANGLES.length]
  const tapeLeft  = TAPE_LEFTS[gIdx  % TAPE_LEFTS.length]

  return (
    // Padding extérieur : réduit la taille visuelle + zone tampon
    // qui absorbe le débordement de la rotation → jamais de chevauchement
    <div style={{ padding: IMG_PAD }}>
    <div style={{
      transform: `rotate(${rot}deg)`,
      transformOrigin: 'center top',
      position: 'relative',
    }}>
      {/* Zone cliquable */}
      <div
        className="hoverable"
        data-cursor="hover"
        onClick={hasImage ? () => open(images, piece) : undefined}
        style={{
          position: 'relative',
          cursor: hasImage ? 'none' : 'default',
          '--hover-rot': '0deg', // la rotation est déjà sur le parent
          filter: 'drop-shadow(0 5px 16px oklch(0.22 0.04 60 / 0.2))',
        }}
      >
        {/* Scotch */}
        <div style={{
          position: 'absolute',
          left: tapeLeft, top: -11,
          transform: `translateX(-50%) rotate(${tapeAngle}deg)`,
          width: 74, height: 18,
          background: 'oklch(0.93 0.05 90 / 0.62)',
          borderLeft:  '1px dashed oklch(0.8 0.05 85 / 0.45)',
          borderRight: '1px dashed oklch(0.8 0.05 85 / 0.45)',
          zIndex: 4, pointerEvents: 'none',
        }} />

        {isGrouped
          ? <StackedFrame images={images} dim={dim} />
          : hasImage
            ? <SingleFrame  src={images[0]} dim={dim} />
            : <EmptyFrame   dim={dim} label={piece.title} />
        }
      </div>

      {/* Légende — tourne avec l'image */}
      <div style={{ marginTop: 9, paddingLeft: 3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, alignItems: 'baseline' }}>
          <span className="serif-display" style={{ fontSize: 17, fontStyle: 'italic' }}>{piece.title}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--moss-deep)', whiteSpace: 'nowrap' }}>{piece.year}</span>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--ink-soft)', textTransform: 'uppercase', marginTop: 2 }}>
          {piece.subLabel}
        </div>
        {piece.comment && (
          <div className="hand" style={{ fontSize: 18, marginTop: 5, color: 'var(--ink-soft)', display: 'inline-block' }}>
            ↳ {piece.comment}
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

// ── Frames ────────────────────────────────────────────────────────────────────

// Pour les images très grandes (portrait en solo sur écran large),
// on limite la largeur d'affichage côté layout (templates solo) plutôt
// qu'en coupant l'image. Plus de maxHeight ici → zéro recadrage.
function SingleFrame({ src, dim }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="gframe" style={{
      aspectRatio: `${dim.w} / ${dim.h}`,
      boxShadow: '0 0 0 1px oklch(0.7 0.04 65 / 0.3)',
    }}>
      {!loaded && <div className="img-shimmer" />}
      <img
        src={src} alt=""
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: loaded ? 1 : 0, transition: 'opacity 0.45s ease' }}
      />
    </div>
  )
}

const BACK_ROTS = [3.8, -2.5, 4.5]

// Épaisseur de chaque bande visible à gauche de l'image principale
const PEEK_W = 20

function StackedFrame({ images, dim }) {
  const [mainLoaded, setMainLoaded] = useState(false)
  const nBack = images.length - 1

  return (
    // flex row : bandes des images secondaires à gauche, image principale à droite
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 3 }}>

      {/* Bandes — fines tranches des images secondaires */}
      {images.slice(1).map((img, bi) => (
        <div key={bi} style={{
          width: PEEK_W,
          flexShrink: 0,
          overflow: 'hidden',
          boxShadow: '0 0 0 1px oklch(0.7 0.04 65 / 0.35)',
        }}>
          <img src={img} alt="" loading="lazy" style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }} />
        </div>
      ))}

      {/* Image principale */}
      <div className="gframe" style={{
        flex: 1, minWidth: 0,
        aspectRatio: `${dim.w} / ${dim.h}`,
        boxShadow: '0 0 0 1px oklch(0.7 0.04 65 / 0.45), 0 6px 20px oklch(0.25 0.04 60 / 0.22)',
      }}>
        {!mainLoaded && <div className="img-shimmer" />}
        <img
          src={images[0]} alt=""
          loading="lazy"
          onLoad={() => setMainLoaded(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: mainLoaded ? 1 : 0, transition: 'opacity 0.45s ease' }}
        />
        {/* Badge discret en bas à gauche */}
        <div style={{
          position: 'absolute', bottom: 7, left: 7,
          background: 'oklch(0.22 0.01 60 / 0.75)',
          color: 'var(--paper-cream)',
          fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em',
          padding: '2px 7px',
          backdropFilter: 'blur(4px)',
          zIndex: 2,
        }}>+{nBack}</div>
      </div>

    </div>
  )
}

function EmptyFrame({ dim, label }) {
  const style = { width: '100%', aspectRatio: `${dim.w} / ${dim.h}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }
  return (
    <div style={{
      ...style,
      background: 'repeating-linear-gradient(135deg, oklch(0.86 0.04 75) 0 9px, oklch(0.78 0.05 70) 9px 10px)',
      boxShadow: '0 0 0 1px oklch(0.7 0.04 65 / 0.4)',
      fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.16em',
      textTransform: 'uppercase', color: 'oklch(0.55 0.02 65)',
    }}>
      <span style={{ border: '1px dashed oklch(0.55 0.02 65)', padding: '5px 10px' }}>{label}</span>
    </div>
  )
}

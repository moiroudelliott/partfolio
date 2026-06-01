import { memo, useMemo } from 'react'
import { Leaf, LeafB, LeafC, Butterfly, ButterflyB, ButterflyC } from './icons.jsx'

// Sélection déterministe par index (stable entre renders)
function seededPick(seed, arr) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return arr[Math.floor(Math.abs(x - Math.floor(x)) * arr.length)]
}

// Positions aléatoires générées une fois par session (différentes à chaque rechargement)
function rnd(min, max) { return Math.round(min + Math.random() * (max - min)) }

const MAX_LEAF  = 12
const MAX_BUTT  = 10
const MAX_FLYER = 6

const PRE_LEAF  = Array.from({ length: MAX_LEAF  }, () => ({ x: rnd(3, 88) + '%', y: rnd(5, 85) + '%', rot: rnd(-25, 25) }))
const PRE_BUTT  = Array.from({ length: MAX_BUTT  }, () => ({ x: rnd(3, 88) + '%', y: rnd(5, 85) + '%', rot: rnd(-25, 25) }))
const PRE_FLY_Y = Array.from({ length: MAX_FLYER }, () => rnd(5, 80) + '%')

const LEAF_SIZES = [40, 46, 54, 58, 66, 70, 82, 50, 62, 44, 74, 52]
const LEAF_HUES  = [130, 132, 135, 138, 140, 142, 136, 133, 139, 131, 137, 134]
const LEAF_ANIM  = [
  { dx: '14px',  dy: '-22px', dur: 16 }, { dx: '-10px', dy: '-14px', dur: 14 },
  { dx: '10px',  dy: '-16px', dur: 19 }, { dx: '-12px', dy:  '12px', dur: 15 },
  { dx: '6px',   dy:  '-8px', dur: 21 }, { dx: '-8px',  dy: '-14px', dur: 17 },
  { dx: '12px',  dy: '-18px', dur: 13 }, { dx: '-6px',  dy:  '10px', dur: 20 },
  { dx: '8px',   dy: '-12px', dur: 16 }, { dx: '-14px', dy:  '-6px', dur: 18 },
  { dx: '4px',   dy: '-20px', dur: 22 }, { dx: '-16px', dy:  '-4px', dur: 14 },
]
const BUTT_SIZES = [28, 32, 38, 42, 46, 34, 36, 30, 40, 44]
const BUTT_ANIM  = [
  { dx: '10px',  dy: '-12px', dur:  9 }, { dx: '8px',   dy:  '-8px', dur: 11 },
  { dx: '-6px',  dy: '-10px', dur: 13 }, { dx: '12px',  dy: '-14px', dur: 10 },
  { dx: '-8px',  dy:   '8px', dur: 12 }, { dx: '6px',   dy: '-16px', dur:  8 },
  { dx: '-10px', dy:  '-6px', dur: 14 }, { dx: '4px',   dy: '-10px', dur: 11 },
  { dx: '-4px',  dy: '-12px', dur: 10 }, { dx: '10px',  dy:   '6px', dur: 13 },
]
const FLYER_SIZES = [30, 20, 34, 26, 38, 22]
const FLYER_DURS  = [22, 31, 25, 28, 19, 35]
const FLYER_DELAYS = [-5, -14, -21, -8, -18, -3]

export default memo(function FloatingMotifs({ density = 1, motifs = {} }) {
  const leafCount  = Math.min(Math.round((motifs?.leafCount      ?? 5)  * density), MAX_LEAF)
  const buttCount  = Math.min(Math.round((motifs?.butterflyCount ?? 3)  * density), MAX_BUTT)
  const flyerCount = Math.min(motifs?.flyerCount ?? 3, MAX_FLYER)

  // Rétrocompat : leafImage/butterflyImage (anciens champs string)
  const leafImgs = [
    ...(motifs?.leafImages || []),
    ...(motifs?.leafImage && !(motifs?.leafImages || []).includes(motifs.leafImage) ? [motifs.leafImage] : []),
  ].filter(Boolean)
  const buttImgs = [
    ...(motifs?.butterflyImages || []),
    ...(motifs?.butterflyImage && !(motifs?.butterflyImages || []).includes(motifs.butterflyImage) ? [motifs.butterflyImage] : []),
  ].filter(Boolean)

  const leafVariants = [
    ...(motifs?.leafA !== false      ? [{ C: Leaf,        ratio: 1.35 }] : []),
    ...(motifs?.leafB !== false      ? [{ C: LeafB,       ratio: 1.10 }] : []),
    ...(motifs?.leafC !== false      ? [{ C: LeafC,       ratio: 1.20 }] : []),
    ...leafImgs.map(src             =>  ({ img: src,      ratio: 1.35 })),
  ]
  const buttVariants = [
    ...(motifs?.butterflyA !== false ? [{ C: Butterfly,   ratio: 0.90 }] : []),
    ...(motifs?.butterflyB !== false ? [{ C: ButterflyB,  ratio: 0.75 }] : []),
    ...(motifs?.butterflyC !== false ? [{ C: ButterflyC,  ratio: 0.90 }] : []),
    ...buttImgs.map(src             =>  ({ img: src,      ratio: 0.90 })),
  ]
  const safeLeaf = leafVariants.length > 0 ? leafVariants : [{ C: Leaf,      ratio: 1.35 }]
  const safeButt = buttVariants.length > 0 ? buttVariants : [{ C: Butterfly, ratio: 0.90 }]

  // Génère l'ambient en utilisant les positions pré-aléatoires (random par session)
  const ambient = useMemo(() => {
    const items = []
    for (let i = 0; i < leafCount; i++) {
      items.push({ kind: 'leaf', size: LEAF_SIZES[i % LEAF_SIZES.length], hue: LEAF_HUES[i % LEAF_HUES.length], ...LEAF_ANIM[i % LEAF_ANIM.length], ...PRE_LEAF[i] })
    }
    for (let i = 0; i < buttCount; i++) {
      items.push({ kind: 'butterfly', size: BUTT_SIZES[i % BUTT_SIZES.length], ...BUTT_ANIM[i % BUTT_ANIM.length], ...PRE_BUTT[i] })
    }
    return items
  }, [leafCount, buttCount])

  function renderVariant(v, size, hue, isLeaf) {
    if (v.img) return (
      <img src={v.img} alt="" style={{ width: size, height: size * v.ratio, objectFit: 'contain', opacity: 0.65, display: 'block' }} />
    )
    const C = v.C
    return isLeaf ? <C size={size} hue={hue} /> : <C size={size} />
  }

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {ambient.map((m, i) => {
        const isLeaf = m.kind === 'leaf'
        const v = seededPick(i, isLeaf ? safeLeaf : safeButt)
        return (
          <div key={i} className={isLeaf ? 'float-leaf' : 'float-butterfly'}
               style={{ left: m.x, top: m.y, '--dx': m.dx, '--dy': m.dy, '--dur': `${m.dur}s`, '--rot': `${m.rot}deg` }}>
            {renderVariant(v, m.size, m.hue, isLeaf)}
          </div>
        )
      })}
      {Array.from({ length: flyerCount }, (_, i) => {
        const v = seededPick(i + 100, safeButt)
        return (
          <div key={'fly-' + i} className="float-fly"
               style={{ top: PRE_FLY_Y[i], '--dur': `${FLYER_DURS[i % FLYER_DURS.length]}s`, '--fly-delay': `${FLYER_DELAYS[i % FLYER_DELAYS.length]}s` }}>
            {renderVariant(v, FLYER_SIZES[i % FLYER_SIZES.length], null, false)}
          </div>
        )
      })}
    </div>
  )
})

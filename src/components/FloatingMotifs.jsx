import { memo } from 'react'
import { Leaf, Butterfly } from './icons.jsx'

function rand(min, max) { return Math.round(min + Math.random() * (max - min)) }

const AMBIENT = [
  { kind: 'leaf',      size: 82,  hue: 135, dx: '14px',  dy: '-22px', dur: 16 },
  { kind: 'leaf',      size: 54,  hue: 130, dx: '-10px', dy: '-14px', dur: 14 },
  { kind: 'butterfly', size: 42,            dx: '10px',  dy: '-12px', dur:  9 },
  { kind: 'leaf',      size: 66,  hue: 142, dx: '10px',  dy: '-16px', dur: 19 },
  { kind: 'leaf',      size: 46,  hue: 138, dx: '-12px', dy: '12px',  dur: 15 },
  { kind: 'butterfly', size: 32,            dx: '8px',   dy: '-8px',  dur: 11 },
  { kind: 'leaf',      size: 40,  hue: 140, dx: '6px',   dy: '-8px',  dur: 21 },
  { kind: 'leaf',      size: 58,  hue: 136, dx: '-8px',  dy: '-14px', dur: 17 },
].map(m => ({
  ...m,
  x: rand(3, 88) + '%',
  y: rand(5, 85) + '%',
  rot: rand(-25, 25),
}))

const FLYERS = [
  { size: 30, dur: 22, delay: -5  },
  { size: 20, dur: 31, delay: -14 },
  { size: 34, dur: 25, delay: -21 },
].map(f => ({ ...f, y: rand(10, 80) + '%' }))

export default memo(function FloatingMotifs({ density = 1 }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {AMBIENT.slice(0, Math.ceil(AMBIENT.length * density)).map((m, i) => (
        <div key={i}
             className={m.kind === 'butterfly' ? 'float-butterfly' : 'float-leaf'}
             style={{ left: m.x, top: m.y, '--dx': m.dx, '--dy': m.dy, '--dur': `${m.dur}s`, '--rot': `${m.rot}deg` }}>
          {m.kind === 'leaf'      && <Leaf size={m.size} hue={m.hue} />}
          {m.kind === 'butterfly' && <Butterfly size={m.size} />}
        </div>
      ))}
      {FLYERS.map((f, i) => (
        <div key={'fly-' + i} className="float-fly"
             style={{ top: f.y, '--dur': `${f.dur}s`, '--fly-delay': `${f.delay}s` }}>
          <Butterfly size={f.size} />
        </div>
      ))}
    </div>
  )
})

import Reveal from '../components/Reveal.jsx'
import Placeholder from '../components/Placeholder.jsx'
import FloatingMotifs from '../components/FloatingMotifs.jsx'
import { Ornament, PlantSprig } from '../components/icons.jsx'
import { scrollToId } from '../components/TopNav.jsx'

export default function HomeCabinet({ ui, data, go }) {
  const hero = data.hero
  const ab = data.about
  const cats = data.categories
  const t = hero.title
  const splitIdx = t.toLowerCase().indexOf('margot')
  const titleParts = splitIdx > 0 ? [t.slice(0, splitIdx).trim(), t.slice(splitIdx).trim()] : [t, '']

  return (
    <div className="paper" style={{ position: 'relative', overflow: 'hidden' }}>
      <FloatingMotifs density={0.8} />

      {/* HERO */}
      <section style={{ padding: '50px 56px 90px', position: 'relative' }}>
        <div className="wrap">
          <div style={{ position: 'relative', border: '1px solid var(--ink)', padding: 14, margin: '0 auto', maxWidth: 1180 }}>
            <div style={{ border: '1px solid var(--ink-pale)', padding: '70px 80px 56px', position: 'relative', background: 'oklch(0.95 0.02 80 / 0.45)' }}>
              {[{top:-7,left:-7,rot:0},{top:-7,right:-7,rot:90},{bottom:-7,right:-7,rot:180},{bottom:-7,left:-7,rot:270}].map((p, i) => (
                <div key={i} style={{ position: 'absolute', width: 14, height: 14, ...p, transform: `rotate(${p.rot}deg)`, background: 'var(--ink)', clipPath: 'polygon(0 0, 100% 0, 100% 30%, 30% 30%, 30% 100%, 0 100%)' }} />
              ))}
              <div className="kicker" style={{ textAlign: 'center', marginBottom: 18 }}>❦ &nbsp; {hero.kicker} &nbsp; ❦</div>
              <h1 className="serif-display" style={{ fontSize: 'clamp(56px, 7.4vw, 108px)', margin: 0, textAlign: 'center', lineHeight: 1 }}>
                <div>{titleParts[0]}</div>
                {titleParts[1] && <div style={{ fontStyle: 'italic', color: 'var(--moss-deep)' }}>{titleParts[1]}</div>}
              </h1>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 6px' }}><Ornament size={240} /></div>
              <p style={{ textAlign: 'center', fontSize: 18, fontStyle: 'italic', maxWidth: 620, margin: '0 auto', color: 'var(--ink-soft)' }}>{hero.subtitle}</p>
              <div style={{ position: 'absolute', left: -60, top: 80, opacity: 0.85 }}><PlantSprig size={130} hue={135} /></div>
              <div style={{ position: 'absolute', right: -60, top: 80, opacity: 0.85 }}><PlantSprig size={130} hue={135} flip /></div>
            </div>
          </div>
          <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}>
            <button className="btn-ink" data-cursor="hover" onClick={() => scrollToId('cabinet')}>
              <span className="ring"><svg width="14" height="20" viewBox="0 0 14 20" fill="none"><path d="M7 1 V 18 M 1 12 L 7 18 L 13 12" stroke="var(--ink)" strokeWidth="1.2" fill="none"/></svg></span>
              <span>{ui.enter} · {ui.sectionWorks.toLowerCase()}</span>
            </button>
          </div>
        </div>
      </section>

      {/* CABINET */}
      <section id="cabinet" style={{ padding: '60px 56px 90px', position: 'relative' }}>
        <div className="wrap">
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 30 }}>
              <div className="kicker">§ I · {ui.categories}</div>
              <div className="kicker">{cats.length} / {cats.length}</div>
            </div>
            <h2 className="serif-display" style={{ fontSize: 84, margin: 0, marginBottom: 36 }}>
              {ui.sectionWorks}<span style={{ fontStyle: 'italic', color: 'var(--moss-deep)' }}>.</span>
            </h2>
            <hr className="dotted-rule" style={{ marginBottom: 50 }} />
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 60 }}>
            {cats.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.05}><FramedCard cat={c} go={go} index={i} /></Reveal>
            ))}
          </div>
          <hr className="dotted-rule" style={{ margin: '90px 0 30px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-soft)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            <span>Salle I — œuvres récentes</span>
            <span>{cats.reduce((a,c) => a + c.sub.reduce((s,x) => s + x.pieces.length, 0), 0)} {ui.pieces}</span>
            <span>2021 — 2026</span>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '90px 56px', position: 'relative' }}>
        <div className="wrap" style={{ maxWidth: 980 }}>
          <Reveal>
            <div style={{ textAlign: 'center' }}>
              <div className="kicker" style={{ marginBottom: 14 }}>· {ab.kicker} ·</div>
              <h2 className="serif-display" style={{ fontSize: 96, margin: 0, marginBottom: 36 }}>{ab.title}</h2>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 260px', gap: 40, alignItems: 'start' }}>
            <Reveal>
              <Placeholder label={ab.portrait.label} code={ab.portrait.code} image={ab.portrait.image} tone="warm" ratio="3 / 4" rotate={-3} tape={{ rotate: -10 }} hoverRot={2} />
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ fontSize: 19, lineHeight: 1.75, marginTop: 0 }}><span className="drop">{ab.paragraphs[0][0]}</span>{ab.paragraphs[0].slice(1)}</p>
              <p style={{ fontSize: 19, lineHeight: 1.75 }}>{ab.paragraphs[1]}</p>
              <div className="hand" style={{ fontSize: 24, color: 'var(--moss-deep)', marginTop: 14, textAlign: 'right' }}>{ab.signature}</div>
            </Reveal>
            <Reveal delay={0.15}>
              <Placeholder label={ab.inlineImages[0].label} code={ab.inlineImages[0].code} image={ab.inlineImages[0].image} tone="paper" ratio="3 / 4" rotate={3} tape={{ rotate: 8 }} hoverRot={-2} />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}

const TONES = ['warm','ink','paper','rust','cool','moss']
const RATIOS = ['4 / 5','3 / 4','5 / 6','4 / 5','3 / 4','5 / 6']

function FramedCard({ cat, go, index }) {
  return (
    <div onClick={() => go({ kind: 'category', id: cat.id })} data-cursor="hover" style={{ cursor: 'none' }}>
      <div className="hoverable" style={{ background: 'var(--paper-warm)', padding: 18, border: '1px solid var(--ink-pale)', boxShadow: '0 0 0 1px var(--paper-deep) inset, 0 30px 50px -20px oklch(0.25 0.04 60 / 0.4), 0 2px 6px -2px oklch(0.25 0.04 60 / 0.25)', '--hover-rot': '0deg' }}>
        <div style={{ padding: 22, background: 'oklch(0.93 0.025 80)', border: '1px solid var(--rule)' }}>
          <Placeholder label={cat.label.toLowerCase()} code={`№ ${cat.number}`} image={cat.cover?.image} tone={TONES[index % TONES.length]} ratio={RATIOS[index % RATIOS.length]} rotate={0} hoverRot={0} />
        </div>
        <div style={{ marginTop: 16, padding: '10px 14px', background: 'oklch(0.78 0.05 80)', border: '1px solid oklch(0.55 0.06 70)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'oklch(0.32 0.04 60)', textTransform: 'uppercase' }}>№ {cat.number}</div>
          <div className="serif-display" style={{ fontSize: 28, fontStyle: 'italic', marginTop: 2 }}>{cat.label}</div>
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-soft)', padding: '0 4px' }}>{cat.tagline}</div>
    </div>
  )
}

import Reveal from '../components/Reveal.jsx'
import Placeholder from '../components/Placeholder.jsx'
import FloatingMotifs from '../components/FloatingMotifs.jsx'
import { InkEye, Ornament, PlantSprig } from '../components/icons.jsx'
import { scrollToId } from '../components/TopNav.jsx'

export default function HomeCollage({ ui, data, go }) {
  const hero = data.hero
  const ab = data.about
  const poem = hero.poem

  return (
    <div className="paper" style={{ position: 'relative', overflow: 'hidden' }}>
      <FloatingMotifs density={1} />

      {/* HERO */}
      <section style={{ padding: '24px 56px 80px', position: 'relative' }}>
        <div className="wrap" style={{ position: 'relative' }}>
          <div className="kicker" style={{ marginTop: 30, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ display: 'inline-block', padding: 4, background: 'var(--paper-warm)', border: '1px solid var(--ink-pale)', boxShadow: '0 2px 6px oklch(0.25 0.04 60 / 0.18)', transform: 'rotate(-3deg)' }}>
              <InkEye size={36} />
            </span>
            ↳ {hero.kicker}
          </div>
          <h1 className="serif-display" style={{ fontSize: 'clamp(80px, 11vw, 168px)', margin: 0, marginRight: '12vw', position: 'relative', zIndex: 2 }}>
            <span>{poem[0]}</span>{' '}
            <span style={{ fontStyle: 'italic' }}>{poem[1]}</span>
            <br />
            <span style={{ display: 'inline-block', transform: 'translateX(8vw)' }}>{poem[2]} {poem[3]}</span>
            <br />
            <span style={{ fontStyle: 'italic' }}>{poem[4]}</span>
            <br />
            <span style={{ display: 'inline-block', marginLeft: '20vw' }}>{poem[5]}</span>
          </h1>
          <div style={{ position: 'absolute', top: 40, right: 0, width: 280 }}>
            <Placeholder label="atelier #02" code="MM·022" tone="moss" ratio="3 / 4" rotate={3.5} tape={{ rotate: 4 }} style={{ width: 180, marginLeft: 'auto' }} />
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}><PlantSprig size={140} hue={135} flip /></div>
          </div>
          <div style={{ marginTop: 56, display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
            <button className="btn-ink" data-cursor="hover" onClick={() => scrollToId('series')}>
              <span className="ring">
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none"><path d="M1 7 H 18 M 12 1 L 18 7 L 12 13" stroke="var(--ink)" strokeWidth="1.2" fill="none"/></svg>
              </span>
              <span>{ui.enter}</span>
            </button>
            <div style={{ maxWidth: 360, color: 'var(--ink-soft)', fontStyle: 'italic', fontSize: 18 }}>{hero.sub}</div>
          </div>
          <div style={{ marginTop: 80, display: 'flex', justifyContent: 'center' }}><Ornament size={180} /></div>
        </div>
      </section>

      {/* OEUVRES */}
      <CollageMosaic ui={ui} data={data} go={go} />

      {/* ABOUT */}
      <section id="about" style={{ padding: '40px 56px 60px', position: 'relative' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 80, alignItems: 'start' }}>
          <Reveal>
            <div className="kicker" style={{ marginBottom: 12 }}>· {ab.kicker} ·</div>
            <h2 className="serif-display" style={{ fontSize: 96, margin: 0, marginBottom: 20 }}>
              {ab.title.split(' ')[0]}<br />
              <span style={{ fontStyle: 'italic' }}>{ab.title.split(' ').slice(1).join(' ') || 'moi'}</span>
            </h2>
            <div style={{ position: 'relative', maxWidth: 380 }}>
              <Placeholder label={ab.portrait.label} code={ab.portrait.code} image={ab.portrait.image} tone="warm" ratio="3 / 4" rotate={-2} tape={{ rotate: -10, left: '30%' }} hoverRot={1} />
              <div className="hand" style={{ fontSize: 22, marginTop: 14, transform: 'rotate(-1.5deg)' }}>{ab.portrait.caption}</div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ paddingTop: 80, fontSize: 18, lineHeight: 1.7, maxWidth: 560 }}>
              <p style={{ marginTop: 0 }}><span className="drop">{ab.paragraphs[0][0]}</span>{ab.paragraphs[0].slice(1)}</p>
              <p>{ab.paragraphs[1]}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 40 }}>
                {ab.inlineImages.map((im, i) => (
                  <Placeholder key={i} label={im.label} code={im.code} image={im.image}
                    tone={['warm','cool','ink'][i % 3]} ratio="1/1"
                    rotate={[-2,1.5,-1][i % 3]} hoverRot={[2,-2,1.5][i % 3]} />
                ))}
              </div>
              <div className="hand" style={{ fontSize: 18, marginTop: 18, color: 'var(--ink-soft)' }}>↳ {data.hero.annotations.threeMediums}</div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  )
}

function CollageMosaic({ ui, data, go }) {
  const cats = data.categories
  const slots = [
    { x: '6%',  y: '4%',   w: 360, ratio: '4/5', rot: -3,   tone: 'warm',  hover: 1.5,  tape: { rotate: -8 }, big: true },
    { x: '54%', y: '0%',   w: 280, ratio: '3/4', rot: 2.5,  tone: 'ink',   hover: -2 },
    { x: '82%', y: '14%',  w: 220, ratio: '4/5', rot: -4,   tone: 'paper', hover: 2 },
    { x: '40%', y: '36%',  w: 320, ratio: '5/4', rot: -1.5, tone: 'rust',  hover: 2,    tape: { rotate: 5, left: '40%' } },
    { x: '4%',  y: '46%',  w: 300, ratio: '4/5', rot: 4,    tone: 'cool',  hover: -2,   tape: { rotate: -6 } },
    { x: '74%', y: '52%',  w: 280, ratio: '4/3', rot: -2,   tone: 'warm',  hover: 1.5 },
    { x: '30%', y: '64%',  w: 300, ratio: '4/5', rot: 2,    tone: 'moss',  hover: -1.5, tape: { rotate: -5 } },
    { x: '66%', y: '74%',  w: 260, ratio: '3/4', rot: -3,   tone: 'ink',   hover: 2 },
  ]
  const stageHeight = Math.max(1300, 700 + cats.length * 110)

  return (
    <section id="series" style={{ padding: '120px 56px', position: 'relative' }}>
      <div className="wrap">
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 40 }}>
            <div>
              <div className="kicker" style={{ marginBottom: 8 }}>§ {String(cats.length).padStart(2,'0')} · {ui.categories}</div>
              <h2 className="serif-display" style={{ fontSize: 96, margin: 0 }}>
                {ui.sectionWorks}<span style={{ fontStyle: 'italic', color: 'var(--moss-deep)' }}>.</span>
              </h2>
            </div>
            <div className="hand" style={{ fontSize: 24, color: 'var(--ink-soft)', maxWidth: 280, textAlign: 'right' }}>{data.hero.annotations.clickToEnter}</div>
          </div>
          <hr className="dotted-rule" style={{ marginBottom: 60 }} />
        </Reveal>

        <Reveal>
          <div style={{ position: 'relative', minHeight: stageHeight, marginTop: 24 }}>
            {cats.map((c, i) => {
              const s = slots[i % slots.length]
              const total = c.sub.reduce((a, x) => a + x.pieces.length, 0)
              return (
                <div key={c.id} onClick={() => go({ kind: 'category', id: c.id })} data-cursor="hover"
                     style={{ position: 'absolute', left: s.x, top: s.y, width: s.w, cursor: 'none', zIndex: s.big ? 4 : 2 }}>
                  <Placeholder label={c.label.toLowerCase()} code={`${c.number} · ${c.label}`}
                    image={c.cover?.image} tone={s.tone} ratio={s.ratio}
                    rotate={s.rot} hoverRot={s.hover * 1.5} tape={s.tape} />
                  <div style={{ marginTop: 14, padding: '0 6px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--moss-deep)' }}>№ {c.number}</span>
                      <span style={{ height: 1, flex: 1, background: 'var(--ink-pale)' }} />
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-soft)' }}>{total} {ui.pieces}</span>
                    </div>
                    <div className="serif-display" style={{ fontSize: 34, marginTop: 6, fontStyle: 'italic' }}>{c.label}</div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--ink-soft)', marginTop: 4, maxWidth: s.w - 12 }}>{c.tagline}</div>
                  </div>
                </div>
              )
            })}
            <div style={{ position: 'absolute', left: '32%', top: stageHeight - 580, opacity: 0.7, pointerEvents: 'none' }}>
              <PlantSprig size={180} hue={135} />
            </div>
            <div className="hand" style={{ position: 'absolute', left: '22%', top: stageHeight - 320, fontSize: 26, color: 'var(--moss-deep)', transform: 'rotate(-3deg)' }}>
              ↳ {data.hero.annotations.ongoing}
            </div>
            <div style={{ position: 'absolute', right: '36%', top: stageHeight - 200 }}>
              <span className="stamp">archive · 2026</span>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ marginTop: 100 }}>
            <hr className="dotted-rule" style={{ marginBottom: 24 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
              <div className="kicker">· {ui.allWorks} ·</div>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {cats.map(c => (
                  <a key={c.id} data-cursor="hover" className="inline"
                     onClick={() => go({ kind: 'category', id: c.id })}
                     style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18 }}>{c.label}</a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

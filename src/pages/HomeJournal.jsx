import { useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import Placeholder from '../components/Placeholder.jsx'
import FloatingMotifs from '../components/FloatingMotifs.jsx'
import { SunDial, PlantSprig } from '../components/icons.jsx'
import { scrollToId } from '../components/TopNav.jsx'
import { useLightbox } from '../components/Lightbox.jsx'

export default function HomeJournal({ ui, data, go }) {
  const hero = data.hero
  const ab = data.about
  const { open } = useLightbox()
  const artist = data.artist

  return (
    <div className="paper" style={{ position: 'relative', overflow: 'hidden' }}>
      <FloatingMotifs density={0.5} />

      {/* HERO */}
      <section style={{ padding: '40px 56px 60px', position: 'relative' }}>
        <div className="wrap">

          {/* Barre folio */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--ink-soft)', textTransform: 'uppercase', paddingBottom: 14, borderBottom: '1px solid var(--rule)', marginBottom: 56, animation: 'hero-bar 0.55s ease both' }}>
            <span>{hero.kicker}</span>
            <span>{artist.location}</span>
            <span>MMXXVI</span>
          </div>

          {/* Corps : texte gauche, cover droite */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>

            {/* ── Gauche ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 24, alignItems: 'start' }}>
              {/* Kicker vertical */}
              <div className="kicker" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: 'var(--ink-pale)', letterSpacing: '0.24em', paddingTop: 6, animation: 'hero-up 0.7s cubic-bezier(.22,1,.36,1) 0.1s both' }}>
                {artist.location} · {hero.kicker.split('·')[1]?.trim() ?? 'atelier'}
              </div>

              <div>
                {/* Nom — line reveal */}
                <h1 className="serif-display" style={{ fontSize: 'clamp(72px, 9vw, 136px)', margin: 0, lineHeight: 0.88 }}>
                  <div style={{ overflow: 'hidden', paddingBottom: '0.28em', marginBottom: '-0.28em' }}>
                    <span style={{ display: 'block', animation: 'hero-line 0.75s cubic-bezier(.22,1,.36,1) 0.15s both' }}>
                      {artist.name.split(' ')[0]}
                    </span>
                  </div>
                  <div style={{ overflow: 'hidden', paddingBottom: '0.28em', marginBottom: '-0.28em' }}>
                    <span style={{ display: 'block', fontStyle: 'italic', color: 'var(--moss-deep)', animation: 'hero-line 0.75s cubic-bezier(.22,1,.36,1) 0.32s both' }}>
                      {artist.name.split(' ').slice(1).join(' ')}
                    </span>
                  </div>
                </h1>

                {/* Filet + médiums */}
                <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--rule)', animation: 'hero-up 0.65s cubic-bezier(.22,1,.36,1) 0.5s both' }}>
                  <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-soft)', fontStyle: 'italic', letterSpacing: '0.04em' }}>
                    {hero.subtitle}
                  </p>
                </div>

                {/* Stats */}
                <div style={{ marginTop: 20, display: 'flex', gap: 24, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-pale)', animation: 'hero-up 0.65s cubic-bezier(.22,1,.36,1) 0.65s both' }}>
                  <span>{data.categories.length} séries</span>
                  <span>·</span>
                  <span>{data.categories.reduce((t, c) => t + c.sub.reduce((s, sub) => s + sub.pieces.length, 0), 0)} œuvres</span>
                </div>

                {/* Bouton */}
                <div style={{ marginTop: 44, animation: 'hero-up 0.65s cubic-bezier(.22,1,.36,1) 0.8s both' }}>
                  <button className="btn-ink" data-cursor="hover" onClick={() => scrollToId('series')}>
                    <span className="ring">
                      <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                        <path d="M1 7 H 18 M 12 1 L 18 7 L 12 13" stroke="var(--ink)" strokeWidth="1.2" fill="none"/>
                      </svg>
                    </span>
                    <span>{ui.enter}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Droite : cover ── */}
            <div style={{ animation: 'hero-cover 1.0s cubic-bezier(.22,1,.36,1) 0.1s both' }}>
              <div
                data-cursor="hover"
                onClick={hero.cover?.image ? () => open([hero.cover.image]) : undefined}
                style={{ transform: 'rotate(2deg)', transformOrigin: 'center center', cursor: hero.cover?.image ? 'none' : 'default' }}
              >
                <div className="hoverable" style={{ padding: '18px 18px 28px', background: 'var(--paper-warm)', border: '1px solid oklch(0.78 0.03 70)', boxShadow: '0 2px 0 oklch(0.7 0.03 70), 0 20px 50px -12px oklch(0.22 0.04 60 / 0.35), 0 4px 12px -4px oklch(0.22 0.04 60 / 0.2)', '--hover-rot': '-1.5deg' }}>
                  <div style={{ overflow: 'hidden', background: 'var(--paper-deep)' }}>
                    {hero.cover?.image
                      ? <img src={hero.cover.image} alt="couverture" style={{ width: '100%', display: 'block', aspectRatio: '4/5', objectFit: 'cover' }} />
                      : <div style={{ aspectRatio: '4/5', background: 'repeating-linear-gradient(135deg, oklch(0.88 0.03 75) 0 9px, oklch(0.8 0.04 70) 9px 10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'oklch(0.55 0.02 65)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>couverture</span>
                        </div>
                    }
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-pale)' }}>
                    <span>{hero.cover?.label ?? 'couverture'}</span>
                    <span>MM · 000</span>
                  </div>
                </div>
                <div className="hand" style={{ marginTop: 10, textAlign: 'right', fontSize: 17, color: 'var(--ink-soft)', transform: 'rotate(-1deg)', paddingRight: 4 }}>
                  {ab.signature}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* OEUVRES — avant À propos pour correspondre à l'ordre du nav */}
      <SeriesIndex ui={ui} data={data} go={go} />

      {/* ABOUT */}
      <section id="about" style={{ padding: '90px 56px', position: 'relative' }}>
        <div className="wrap" style={{ maxWidth: 1100 }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 30 }}>
              <div className="kicker">§ II · {ab.kicker}</div>
              <div className="kicker">page 02</div>
            </div>
            <h2 className="serif-display" style={{ fontSize: 84, margin: 0, marginBottom: 40 }}>
              {ab.title}<span style={{ color: 'var(--moss-deep)' }}>.</span>
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 56 }}>
            <Reveal from="left">
              <p style={{ fontSize: 18, lineHeight: 1.75, marginTop: 0 }}><span className="drop">{ab.paragraphs[0][0]}</span>{ab.paragraphs[0].slice(1)}</p>
              <div style={{ marginTop: 30 }}>
                <Placeholder label={ab.portrait.label} code={ab.portrait.code} image={ab.portrait.image} tone="warm" ratio="5 / 4" rotate={-1.5} tape={{ rotate: -8, left: '20%' }} hoverRot={1.5} />
                <div className="hand" style={{ fontSize: 18, marginTop: 10, color: 'var(--ink-soft)' }}>{ab.portrait.caption}</div>
              </div>
            </Reveal>
            <div className="col-rule" />
            <Reveal from="right" delay={0.08}>
              <p style={{ fontSize: 18, lineHeight: 1.75, marginTop: 0 }}>{ab.paragraphs[1]}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 30 }}>
                {ab.inlineImages.map((im, i) => (
                  <Placeholder key={i} label={im.label} code={im.code} image={im.image} tone={['cool','ink'][i % 2]} ratio="3/4" rotate={[2,-2][i % 2]} hoverRot={[-2,2][i % 2]} />
                ))}
              </div>
              <p className="hand" style={{ fontSize: 22, marginTop: 18, color: 'var(--moss-deep)' }}>{ab.signature}</p>
            </Reveal>
          </div>
        </div>
      </section>

    </div>
  )
}

function SeriesIndex({ ui, data, go }) {
  const [hover, setHover] = useState(null)
  const { open } = useLightbox()
  const cats = data.categories
  const tones = ['warm','ink','paper','rust','cool','moss']

  return (
    <section id="series" style={{ padding: '90px 56px 120px', position: 'relative' }}>
      <div className="wrap" style={{ maxWidth: 1100 }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
            <div className="kicker">§ I · {ui.categories}</div>
            <div className="kicker">sommaire</div>
          </div>
          <h2 className="serif-display" style={{ fontSize: 84, margin: 0, marginBottom: 36 }}>{ui.sectionWorks}</h2>
          <hr className="dotted-rule" style={{ marginBottom: 40 }} />
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 60, alignItems: 'start' }}>
          <Reveal from="left">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {cats.map((c) => {
                const total = c.sub.reduce((a, s) => a + s.pieces.length, 0)
                return (
                  <li key={c.id}
                      onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)}
                      onClick={() => go({ kind: 'category', id: c.id })} data-cursor="hover"
                      style={{ display: 'grid', gridTemplateColumns: '54px 1fr auto 90px', gap: 20, alignItems: 'baseline', padding: '22px 0', borderBottom: '1px dashed var(--rule)', transition: 'color 0.3s, padding-left 0.3s, background 0.3s', color: hover === c.id ? 'var(--moss-deep)' : 'var(--ink)', paddingLeft: hover === c.id ? 18 : 0, background: hover === c.id ? 'oklch(0.92 0.04 130 / 0.18)' : 'transparent' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '0.12em', color: 'var(--ink-soft)' }}>№ {c.number}</span>
                    <span className="serif-display" style={{ fontSize: 44, fontStyle: hover === c.id ? 'italic' : 'normal', transition: 'font-style 0.2s' }}>{c.label}</span>
                    <span style={{ flex: 1, height: 1, borderTop: '1px dotted var(--ink-pale)', margin: '0 12px', alignSelf: 'center', minWidth: 80 }} />
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-soft)', textAlign: 'right' }}>{total} {ui.pieces}</span>
                  </li>
                )
              })}
            </ul>
          </Reveal>
          <Reveal from="right" delay={0.08}>
            <div style={{ position: 'sticky', top: 90 }}>
              <div style={{ padding: 10, background: 'var(--paper-warm)', border: '1px solid var(--rule)' }}>
                <div style={{ padding: 16, background: 'oklch(0.92 0.025 80 / 0.6)', border: '1px solid var(--rule)' }}>
                  <div className="kicker" style={{ marginBottom: 14 }}>· planche ·</div>

                  {hover === null ? (
                    <>
                      <div style={{ aspectRatio: '3 / 4', background: 'var(--paper-deep)', border: '1px dashed oklch(0.72 0.03 68)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        <span className="hand" style={{ fontSize: 160, color: 'var(--ink-pale)', lineHeight: 1, transform: 'rotate(-12deg)', display: 'block', userSelect: 'none' }}>?</span>
                      </div>
                      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ height: 26, borderRadius: 2, background: 'var(--rule)', opacity: 0.5, width: '72%' }} />
                        <div style={{ height: 13, borderRadius: 2, background: 'var(--rule)', opacity: 0.35, width: '90%' }} />
                      </div>
                    </>
                  ) : (() => {
                    const c = cats.find(x => x.id === hover)
                    const idx = cats.indexOf(c)
                    return (
                      <>
                        <Placeholder label={c.label.toLowerCase()} code={`PL · ${c.number}`} image={c.cover?.image} tone={tones[idx % tones.length]} ratio="3 / 4" rotate={0} hoverRot={0} tape={false} onClick={c.cover?.image ? () => open([c.cover.image], 0) : null} />
                        <div className="serif-display" style={{ fontSize: 28, marginTop: 16, fontStyle: 'italic' }}>{c.label}</div>
                        <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 4 }}>{c.tagline}</div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

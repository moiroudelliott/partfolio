import Reveal from './Reveal.jsx'
import Placeholder from './Placeholder.jsx'

export default function Footer({ ui, data }) {
  const c = data.contact
  const ar = data.artist
  return (
    <footer id="contact" className="sec-footer" style={{ padding: '120px 56px 60px', position: 'relative' }}>
      <div className="wrap r-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
        <Reveal>
          <div className="kicker" style={{ marginBottom: 14 }}>· {ui.followMe} ·</div>
          <h3 className="serif-display" style={{ fontSize: 64, fontStyle: 'italic', margin: 0, marginBottom: 24 }}>{c.title}</h3>
          <div style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 460 }}>{c.blurb}</div>
          <div style={{ marginTop: 36, display: 'grid', gap: 14, fontFamily: 'var(--mono)', fontSize: 13 }}>
            <a className="inline" href={`mailto:${ar.email}`}>{ar.email}</a>
            <a className="inline" href={ar.instagram} target="_blank" rel="noreferrer">Instagram &nbsp;·&nbsp; {ar.handle}</a>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ paddingTop: 28 }}>
            <div style={{ position: 'relative', transform: 'rotate(2deg)', width: 280, margin: '0 auto' }}>
              <Placeholder label={c.studioImage.label} image={c.studioImage.image} tone="moss" ratio="4 / 5" rotate={0} tape={{ rotate: -8 }} />
              <div className="hand" style={{ fontSize: 22, marginTop: 16, textAlign: 'right', transform: 'rotate(-1deg)' }}>{data.about.signature}</div>
            </div>
          </div>
        </Reveal>
      </div>
      <hr className="dotted-rule" style={{ margin: '80px 0 24px' }} />
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
        <span>© {new Date().getFullYear()} · {ar.name}</span>
        <span>{ui.colophon}</span>
        <span>v.MMXXVI · {ar.location}</span>
      </div>
    </footer>
  )
}

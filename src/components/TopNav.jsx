export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' })
}

export default function TopNav({ ui, go, route }) {
  return (
    <nav className="nav" style={{ animation: 'hero-bar 0.5s ease both' }}>
      <div className="mark" data-cursor="hover" onClick={() => go({ kind: 'home' })}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" stroke="var(--ink)" strokeWidth="1"/>
          <path d="M8 24 C 12 14, 18 14, 18 24 C 18 14, 24 14, 28 24" stroke="var(--ink)" strokeWidth="1.2" fill="none" />
          <circle cx="18" cy="12" r="1.6" fill="var(--moss-deep)" />
        </svg>
        <span>Margot Moiroud</span>
      </div>
      <div className="nav-links">
        <a data-cursor="hover" className={route.kind === 'home' ? 'active' : ''} onClick={() => go({ kind: 'home' })}>Accueil</a>
        <a data-cursor="hover" className={route.kind === 'category' ? 'active' : ''}
           onClick={() => route.kind === 'home' ? scrollToId('series') : go({ kind: 'home' })}>
          {ui.works}
        </a>
        <a data-cursor="hover" onClick={() => scrollToId('about')}>{ui.about}</a>
        <a data-cursor="hover" onClick={() => scrollToId('contact')}>{ui.contact}</a>
      </div>
      <div style={{ width: 110 }} />
    </nav>
  )
}

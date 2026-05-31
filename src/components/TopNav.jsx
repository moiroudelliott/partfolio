export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' })
}

export default function TopNav({ ui, go, route, scrollSection }) {
  const isHome = route.kind === 'home'

  // Section active : basée sur le scroll (home) ou la route (catégorie)
  const active = section => {
    if (section === 'series' && route.kind === 'category') return true
    if (!isHome) return false
    if (section === 'home') return scrollSection === 'home' || !scrollSection
    return scrollSection === section
  }

  // Clic nav : scroll si déjà sur home, navigate+scroll sinon
  const nav = scrollId => {
    if (isHome) {
      if (scrollId) scrollToId(scrollId)
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      go({ kind: 'home', scrollTo: scrollId || undefined })
    }
  }

  return (
    <nav className="nav" style={{ animation: 'hero-bar 0.5s ease both' }}>
      <div className="mark" data-cursor="hover" onClick={() => nav(null)}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" stroke="var(--ink)" strokeWidth="1"/>
          <path d="M8 24 C 12 14, 18 14, 18 24 C 18 14, 24 14, 28 24" stroke="var(--ink)" strokeWidth="1.2" fill="none" />
          <circle cx="18" cy="12" r="1.6" fill="var(--moss-deep)" />
        </svg>
        <span>Margot Moiroud</span>
      </div>
      <div className="nav-links">
        <a data-cursor="hover" className={active('home')    ? 'active' : ''} onClick={() => nav(null)}     >{ui.home}</a>
        <a data-cursor="hover" className={active('series')  ? 'active' : ''} onClick={() => nav('series')} >{ui.works}</a>
        <a data-cursor="hover" className={active('about')   ? 'active' : ''} onClick={() => nav('about')}  >{ui.about}</a>
        <a data-cursor="hover" className={active('contact') ? 'active' : ''} onClick={() => nav('contact')}>{ui.contact}</a>
      </div>
      <div style={{ width: 110 }} />
    </nav>
  )
}

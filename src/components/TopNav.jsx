import { useState } from 'react'

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' })
}

export default function TopNav({ ui, go, route, scrollSection }) {
  const isHome = route.kind === 'home'
  const [menuOpen, setMenuOpen] = useState(false)

  const active = section => {
    if (section === 'series' && route.kind === 'category') return true
    if (!isHome) return false
    if (section === 'home') return scrollSection === 'home' || !scrollSection
    return scrollSection === section
  }

  const nav = scrollId => {
    setMenuOpen(false)
    if (isHome) {
      if (scrollId) scrollToId(scrollId)
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      go({ kind: 'home', scrollTo: scrollId || undefined })
    }
  }

  const links = [
    { label: ui.home,    scrollId: null,      section: 'home' },
    { label: ui.works,   scrollId: 'series',  section: 'series' },
    { label: ui.about,   scrollId: 'about',   section: 'about' },
    { label: ui.contact, scrollId: 'contact', section: 'contact' },
  ]

  return (
    <>
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
          {links.map(l => (
            <a key={l.section} data-cursor="hover"
               className={active(l.section) ? 'active' : ''}
               onClick={() => nav(l.scrollId)}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="nav-spacer" />

        <button
          className="nav-burger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div className="nav-drawer">
          {links.map(l => (
            <a key={l.section}
               className={active(l.section) ? 'active' : ''}
               onClick={() => nav(l.scrollId)}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  )
}

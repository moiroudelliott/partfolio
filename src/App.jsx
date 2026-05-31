import { useState, useEffect, useRef } from 'react'
import { LightboxProvider } from './components/Lightbox.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import TopNav, { scrollToId } from './components/TopNav.jsx'
import Footer from './components/Footer.jsx'
import HomeJournal from './pages/HomeJournal.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import EditorPage from './pages/EditorPage.jsx'

// Accent vert fixe
const ACCENT = '#5E7A4A'

function shade(hex, amount) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0,2), 16), g = parseInt(h.slice(2,4), 16), b = parseInt(h.slice(4,6), 16)
  const adj = (v) => Math.max(0, Math.min(255, Math.round(v + amount * 255)))
  const toHex = (v) => v.toString(16).padStart(2, '0')
  return '#' + toHex(adj(r)) + toHex(adj(g)) + toHex(adj(b))
}

function Portfolio() {
  const [content, setContent]             = useState(null)
  const [error, setError]                 = useState(null)
  const [route, setRoute]                 = useState({ kind: 'home' })
  const [scrollSection, setScrollSection] = useState('home')
  const pendingScroll                     = useRef(null)

  useEffect(() => {
    fetch('/content.json')
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
      .then(setContent)
      .catch(err => setError(String(err)))
  }, [])

  // Applique les variables CSS de couleur une seule fois
  useEffect(() => {
    document.documentElement.style.setProperty('--moss',      ACCENT)
    document.documentElement.style.setProperty('--moss-deep', shade(ACCENT, -0.18))
    document.documentElement.style.setProperty('--moss-pale', shade(ACCENT, 0.28))
  }, [])

  // Suivi de la section visible au scroll sur la page d'accueil
  useEffect(() => {
    if (route.kind !== 'home') { setScrollSection(null); return }
    const check = () => {
      for (const id of ['contact', 'about', 'series']) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 100) { setScrollSection(id); return }
      }
      setScrollSection('home')
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [route])

  // Scroll vers la cible après navigation vers home
  useEffect(() => {
    if (route.kind === 'home' && pendingScroll.current) {
      const target = pendingScroll.current
      pendingScroll.current = null
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(target)))
    }
  }, [route])

  const go = (r) => {
    setRoute(r)
    if (r.kind === 'home') {
      window.scrollTo({ top: 0, behavior: 'auto' })
      if (r.scrollTo) pendingScroll.current = r.scrollTo
    }
  }

  if (error) return (
    <div className="paper" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div className="serif-display" style={{ fontSize: 48, marginBottom: 12 }}>Erreur</div>
        <p style={{ color: 'var(--ink-soft)' }}>Impossible de charger content.json — {error}</p>
      </div>
    </div>
  )

  if (!content) return (
    <div className="paper" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div className="kicker">· chargement de l'atelier ·</div>
    </div>
  )

  return (
    <LightboxProvider>
      <CustomCursor />
      <TopNav ui={content.ui} go={go} route={route} scrollSection={scrollSection} />
      <main>
        <div key={`${route.kind}-${route.id ?? ''}`} className="page-enter">
          {route.kind === 'home'     && <HomeJournal ui={content.ui} data={content} go={go} />}
          {route.kind === 'category' && <CategoryPage ui={content.ui} data={content} go={go} route={route} />}
        </div>
      </main>
      <Footer ui={content.ui} data={content} />
    </LightboxProvider>
  )
}

export default function App() {
  if (window.location.pathname.startsWith('/editor')) return <EditorPage />
  return <Portfolio />
}

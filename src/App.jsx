import { useState, useEffect } from 'react'
import { LightboxProvider } from './components/Lightbox.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import TopNav from './components/TopNav.jsx'
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
  const [content, setContent] = useState(null)
  const [error, setError]     = useState(null)
  const [route, setRoute]     = useState({ kind: 'home' })

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

  const go = (r) => {
    setRoute(r)
    if (r.kind === 'home') window.scrollTo({ top: 0, behavior: 'auto' })
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
      <TopNav ui={content.ui} go={go} route={route} />
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

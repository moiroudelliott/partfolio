import { useState, useEffect, useRef } from 'react'

const PWD = 'hubble01'

// ── Helpers ───────────────────────────────────────────────────────────────────
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload  = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

async function uploadImage(file, folder = 'Oeuvres/Uploads') {
  const data = await toBase64(file)
  const res  = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: file.name, folder, data }),
  })
  const json = await res.json()
  if (!json.ok) throw new Error(json.error || 'Erreur upload')
  return json // { path, dim }
}

// ── Style tokens ──────────────────────────────────────────────────────────────
const S = {
  input: {
    width: '100%', padding: '8px 11px',
    border: '1px solid var(--rule)',
    background: 'white',
    fontFamily: 'var(--serif)', fontSize: 15,
    outline: 'none', boxSizing: 'border-box',
    cursor: 'text',
  },
  label: {
    display: 'block',
    fontFamily: 'var(--mono)', fontSize: 10,
    letterSpacing: '0.13em', textTransform: 'uppercase',
    color: 'var(--ink-soft)', marginBottom: 5,
  },
  btn: {
    padding: '6px 13px', border: '1px solid var(--rule)',
    background: 'var(--paper-warm)', fontFamily: 'var(--mono)',
    fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
    cursor: 'pointer', color: 'var(--ink)',
  },
  btnPrimary: {
    padding: '8px 22px', border: 'none',
    background: 'var(--moss-deep)', color: 'var(--paper-cream)',
    fontFamily: 'var(--serif)', fontSize: 15,
    cursor: 'pointer', letterSpacing: '0.04em',
  },
}

// ── Reusable Field ────────────────────────────────────────────────────────────
function Field({ label, value, onChange, multiline, rows = 4, placeholder }) {
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <span style={S.label}>{label}</span>
      {multiline
        ? <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows={rows}
            placeholder={placeholder} style={{ ...S.input, resize: 'vertical', cursor: 'text' }} />
        : <input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} style={S.input} />
      }
    </label>
  )
}

function Divider({ title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '32px 0 22px' }}>
      <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 20, whiteSpace: 'nowrap' }}>{title}</span>
      <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--rule)', margin: 0 }} />
    </div>
  )
}

// ── Password gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onAuth }) {
  const [val, setVal] = useState('')
  const [err, setErr] = useState(false)

  const submit = e => {
    e.preventDefault()
    if (val === PWD) { sessionStorage.setItem('ed-auth', '1'); onAuth() }
    else { setErr(true); setVal('') }
  }

  return (
    <div className="paper" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', cursor: 'auto' }}>
      <div style={{ textAlign: 'center', width: 320 }}>
        <div className="serif-display" style={{ fontSize: 42, marginBottom: 6 }}>Éditeur</div>
        <p className="kicker" style={{ color: 'var(--ink-pale)', marginBottom: 36, letterSpacing: '0.2em' }}>portfolio · margot moiroud</p>
        <form onSubmit={submit}>
          <input
            type="password" value={val} autoFocus
            onChange={e => { setVal(e.target.value); setErr(false) }}
            placeholder="Mot de passe"
            style={{ ...S.input, marginBottom: 10, fontSize: 17, textAlign: 'center',
              borderColor: err ? 'var(--rust)' : undefined }}
          />
          {err && <p style={{ color: 'var(--rust)', fontFamily: 'var(--mono)', fontSize: 10,
            letterSpacing: '0.12em', marginBottom: 10 }}>Mot de passe incorrect</p>}
          <button type="submit" style={{ ...S.btnPrimary, width: '100%', padding: '12px', fontSize: 16 }}>
            Entrer
          </button>
        </form>
        <p style={{ marginTop: 28 }}>
          <a href="/" style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
            color: 'var(--ink-pale)', textDecoration: 'none', cursor: 'pointer' }}>
            ← Retour au portfolio
          </a>
        </p>
      </div>
    </div>
  )
}

// ── Artiste tab ───────────────────────────────────────────────────────────────
function ArtistTab({ content, onChange }) {
  const a   = content.artist
  const set = (k, v) => onChange({ ...content, artist: { ...a, [k]: v } })
  return (
    <div style={{ maxWidth: 520 }}>
      <Field label="Nom complet" value={a.name} onChange={v => set('name', v)} />
      <Field label="Identifiant Instagram (avec @)" value={a.handle} onChange={v => set('handle', v)} />
      <Field label="Adresse e-mail" value={a.email} onChange={v => set('email', v)} />
      <Field label="Lien Instagram (URL complète)" value={a.instagram} onChange={v => set('instagram', v)} />
      <Field label="Ville" value={a.location} onChange={v => set('location', v)} />
    </div>
  )
}

// ── Image picker ─────────────────────────────────────────────────────────────
function ImagePicker({ label, value, onChange, folder = 'Oeuvres/Uploads', ratio = '1/1' }) {
  const [uploading, setUploading] = useState(false)

  const handle = async file => {
    setUploading(true)
    try { const j = await uploadImage(file, folder); onChange(j.path) }
    catch (e) { alert('Erreur : ' + e.message) }
    setUploading(false)
  }

  return (
    <div style={{ marginBottom: 18 }}>
      <span style={S.label}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 2 }}>
        <div style={{ width: 88, aspectRatio: ratio, flexShrink: 0, border: '1px solid var(--rule)',
          overflow: 'hidden', position: 'relative', background: 'var(--paper-deep)' }}>
          {value
            ? <img src={value} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: 9,
                color: 'var(--ink-pale)', letterSpacing: '0.1em' }}>aucune</div>
          }
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label style={{ ...S.btn, cursor: 'pointer', display: 'inline-block' }}>
            {uploading ? 'Upload…' : value ? 'Changer l\'image' : 'Choisir une image'}
            <input type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => e.target.files[0] && handle(e.target.files[0])} />
          </label>
          {value && <button onClick={() => onChange(null)}
            style={{ ...S.btn, color: 'var(--rust)', fontSize: 9 }}>Retirer</button>}
        </div>
      </div>
    </div>
  )
}

// ── Textes tab ────────────────────────────────────────────────────────────────
function TextesTab({ content, onChange }) {
  const hero    = content.hero
  const about   = content.about
  const contact = content.contact
  const setHero    = (k, v) => onChange({ ...content, hero:    { ...hero,    [k]: v } })
  const setAbout   = (k, v) => onChange({ ...content, about:   { ...about,   [k]: v } })
  const setContact = (k, v) => onChange({ ...content, contact: { ...contact, [k]: v } })
  const setAboutP  = (i, v) => { const p = [...(about.paragraphs || [])]; p[i] = v; setAbout('paragraphs', p) }

  const setInlineImg = (i, v) => {
    const imgs = [...(about.inlineImages || [])]
    imgs[i] = { ...imgs[i], image: v }
    setAbout('inlineImages', imgs)
  }

  return (
    <div style={{ maxWidth: 680 }}>

      {/* ── Accueil ── */}
      <Divider title="Page d'accueil" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <Field label="Accroche (ex : Mes Carnets · 2023—2026)" value={hero.kicker}   onChange={v => setHero('kicker', v)} />
          <Field label="Sous-titre (médiums)"                     value={hero.subtitle} onChange={v => setHero('subtitle', v)} />
        </div>
        <ImagePicker label="Image de couverture" ratio="4/5"
          value={hero.cover?.image}
          onChange={v => setHero('cover', { ...(hero.cover || {}), image: v })} />
      </div>

      {/* ── À propos ── */}
      <Divider title="À propos" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
        <div>
          <Field label="Premier paragraphe"  value={about.paragraphs?.[0]} onChange={v => setAboutP(0, v)} multiline rows={5} />
          <Field label="Deuxième paragraphe" value={about.paragraphs?.[1]} onChange={v => setAboutP(1, v)} multiline rows={5} />
          <Field label="Signature" value={about.signature} onChange={v => setAbout('signature', v)} placeholder="— Prénom Nom" />
        </div>
        <div>
          <ImagePicker label="Photo portrait" ratio="3/4"
            value={about.portrait?.image}
            onChange={v => setAbout('portrait', { ...(about.portrait || {}), image: v })} />
        </div>
      </div>

      {/* Images inline de la section À propos */}
      {(about.inlineImages || []).length > 0 && (
        <div>
          <span style={S.label}>Images décoratives (à propos)</span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 6, marginBottom: 16 }}>
            {(about.inlineImages || []).map((item, i) => (
              <ImagePicker key={i} label={item.label || `Image ${i + 1}`}
                value={item.image} onChange={v => setInlineImg(i, v)} />
            ))}
          </div>
        </div>
      )}

      {/* ── Contact ── */}
      <Divider title="Contact" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <Field label="Titre"             value={contact.title} onChange={v => setContact('title', v)} />
          <Field label="Texte introductif" value={contact.blurb} onChange={v => setContact('blurb', v)} multiline rows={3} />
        </div>
        <ImagePicker label="Photo / image contact"
          value={contact.studioImage?.image}
          onChange={v => setContact('studioImage', { ...(contact.studioImage || {}), image: v })} />
      </div>

    </div>
  )
}

// ── Piece card ────────────────────────────────────────────────────────────────
function PieceCard({ piece, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState(null)
  const [uploading, setUploading] = useState(false)

  const mainImg  = Array.isArray(piece.image) ? piece.image[0] : piece.image
  const allImgs  = d => d.image ? (Array.isArray(d.image) ? d.image : [d.image]).filter(Boolean) : []
  const packImgs = imgs => imgs.length === 0 ? null : imgs.length === 1 ? imgs[0] : imgs

  const handleUpload = async (file, replaceIdx = null) => {
    setUploading(true)
    try {
      const json = await uploadImage(file)
      setDraft(d => {
        const imgs = [...allImgs(d)]
        if (replaceIdx !== null) imgs[replaceIdx] = json.path
        else imgs.push(json.path)
        return { ...d, image: packImgs(imgs), dim: replaceIdx === 0 || replaceIdx === null && imgs.length === 1 ? json.dim : d.dim }
      })
    } catch (e) { alert('Erreur : ' + e.message) }
    setUploading(false)
  }

  // ── View mode ──────────────────────────────────────────────────────────────
  if (!editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 14px',
        borderBottom: '1px solid oklch(0.9 0.02 75)' }}>
        {mainImg
          ? <img src={mainImg} style={{ width: 52, height: 52, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--rule)' }} />
          : <div style={{ width: 52, height: 52, background: 'var(--paper-deep)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-pale)' }}>img</div>
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>
            {piece.title || <em style={{ color: 'var(--ink-pale)' }}>sans titre</em>}
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-pale)', letterSpacing: '0.09em' }}>
            {piece.year}
            {Array.isArray(piece.image) && piece.image.length > 1 && ` · ${piece.image.length} images`}
          </div>
          {piece.comment && <div style={{ fontFamily: 'var(--hand)', fontSize: 13, color: 'var(--ink-soft)', marginTop: 1 }}>{piece.comment}</div>}
        </div>
        <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
          <button onClick={onMoveUp}   disabled={isFirst} title="Monter"    style={{ ...S.btn, padding: '4px 9px', opacity: isFirst ? 0.25 : 1 }}>↑</button>
          <button onClick={onMoveDown} disabled={isLast}  title="Descendre" style={{ ...S.btn, padding: '4px 9px', opacity: isLast  ? 0.25 : 1 }}>↓</button>
          <button onClick={() => { setDraft(JSON.parse(JSON.stringify(piece))); setEditing(true) }} style={S.btn}>✏</button>
          <button onClick={onDelete} style={{ ...S.btn, color: 'var(--rust)', borderColor: 'oklch(0.78 0.08 38 / 0.4)' }}>✕</button>
        </div>
      </div>
    )
  }

  // ── Edit mode ──────────────────────────────────────────────────────────────
  const imgs = allImgs(draft)

  return (
    <div style={{ padding: '16px 14px', background: 'oklch(0.972 0.01 80)', borderBottom: '1px solid var(--rule)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 14 }}>
        <div>
          <Field label="Titre" value={draft.title} onChange={v => setDraft(d => ({ ...d, title: v }))} />
          <Field label="Année" value={draft.year}  onChange={v => setDraft(d => ({ ...d, year: v }))} />
          <Field label="Commentaire (optionnel)" value={draft.comment} onChange={v => setDraft(d => ({ ...d, comment: v }))} />
        </div>
        <div>
          <span style={S.label}>Images</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {imgs.map((img, i) => (
              <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
                <img src={img} style={{ width: 68, height: 68, objectFit: 'cover',
                  border: '1px solid var(--rule)', display: 'block' }} />
                {i === 0 && <span style={{ position: 'absolute', bottom: 2, left: 2,
                  background: 'oklch(0.2 0.01 60/0.8)', color: 'white',
                  fontFamily: 'var(--mono)', fontSize: 7, padding: '1px 4px', letterSpacing: '0.1em' }}>MAIN</span>}
                <button onClick={() => {
                  const next = imgs.filter((_, j) => j !== i)
                  setDraft(d => ({ ...d, image: packImgs(next), dim: i === 0 ? null : d.dim }))
                }} style={{ position: 'absolute', top: 1, right: 1, width: 16, height: 16,
                  border: 'none', background: 'oklch(0.2 0.01 60/0.8)', color: 'white',
                  fontSize: 9, cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 0 }}>✕</button>
              </div>
            ))}
            <label style={{ width: 68, height: 68, border: '1px dashed var(--rule)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', background: 'var(--paper-warm)', fontSize: 22, color: 'var(--ink-pale)' }}>
              {uploading ? '…' : '+'}
              <input type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => e.target.files[0] && handleUpload(e.target.files[0])} />
            </label>
          </div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-pale)', marginTop: 7,
            letterSpacing: '0.1em' }}>La 1ʳᵉ image est celle affichée dans la galerie.</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={() => setEditing(false)} style={S.btn}>Annuler</button>
        <button onClick={() => { onUpdate(draft); setEditing(false) }} style={S.btnPrimary}>Enregistrer</button>
      </div>
    </div>
  )
}

// ── New piece form ────────────────────────────────────────────────────────────
function NewPieceForm({ onAdd }) {
  const init = { title: '', year: String(new Date().getFullYear()), comment: '', image: null, dim: null }
  const [open,      setOpen]     = useState(false)
  const [draft,     setDraft]    = useState(init)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async file => {
    setUploading(true)
    try {
      const json = await uploadImage(file)
      setDraft(d => ({ ...d, image: json.path, dim: json.dim }))
    } catch (e) { alert('Erreur : ' + e.message) }
    setUploading(false)
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ ...S.btn, display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 7, padding: '10px 14px',
      border: '1px dashed var(--rule)', width: 'calc(100% - 28px)', margin: '10px 14px' }}>
      + Ajouter une pièce
    </button>
  )

  return (
    <div style={{ padding: '16px 14px', background: 'oklch(0.972 0.01 80)', borderTop: '1px solid var(--rule)' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'var(--moss-deep)', marginBottom: 14 }}>Nouvelle pièce</div>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 16, marginBottom: 14 }}>
        <div>
          <span style={S.label}>Image</span>
          <label style={{ width: 80, height: 80, border: '1px dashed var(--rule)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', background: 'var(--paper-warm)', overflow: 'hidden', position: 'relative' }}>
            {draft.image
              ? <img src={draft.image} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: uploading ? 13 : 26, color: 'var(--ink-pale)' }}>{uploading ? '…' : '+'}</span>
            }
            <input type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => e.target.files[0] && handleUpload(e.target.files[0])} />
          </label>
        </div>
        <div>
          <Field label="Titre *" value={draft.title} onChange={v => setDraft(d => ({ ...d, title: v }))} placeholder="ex : Mai 2026" />
          <Field label="Année"   value={draft.year}  onChange={v => setDraft(d => ({ ...d, year:  v }))} />
        </div>
        <div>
          <Field label="Commentaire" value={draft.comment} onChange={v => setDraft(d => ({ ...d, comment: v }))}
            multiline rows={3} placeholder="Optionnel" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={() => { setOpen(false); setDraft(init) }} style={S.btn}>Annuler</button>
        <button onClick={() => {
          if (!draft.title.trim()) return alert('Le titre est requis.')
          onAdd({ ...draft, id: `new-${Date.now()}` })
          setOpen(false); setDraft(init)
        }} style={S.btnPrimary}>Ajouter</button>
      </div>
    </div>
  )
}

// ── Subcategory editor ────────────────────────────────────────────────────────
function SubEditor({ sub, onChange }) {
  const [open, setOpen] = useState(false)

  const update = (pi, updated) => {
    const pieces = [...sub.pieces]; pieces[pi] = updated
    onChange({ ...sub, pieces })
  }
  const remove = pi => {
    if (!confirm(`Supprimer "${sub.pieces[pi].title}" ?`)) return
    onChange({ ...sub, pieces: sub.pieces.filter((_, i) => i !== pi) })
  }
  const move = (pi, dir) => {
    const to = pi + dir
    if (to < 0 || to >= sub.pieces.length) return
    const pieces = [...sub.pieces];
    [pieces[pi], pieces[to]] = [pieces[to], pieces[pi]]
    onChange({ ...sub, pieces })
  }

  return (
    <div style={{ marginBottom: 10, border: '1px solid var(--rule)' }}>
      <div onClick={() => setOpen(o => !o)} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', cursor: 'pointer', background: 'var(--paper-warm)',
        borderBottom: open ? '1px solid var(--rule)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 17 }}>{sub.label}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-pale)', letterSpacing: '0.09em' }}>
            {sub.pieces.length} pièce{sub.pieces.length !== 1 ? 's' : ''}
          </span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-pale)' }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div>
          {sub.pieces.map((piece, pi) => (
            <PieceCard
              key={piece.id}
              piece={piece}
              isFirst={pi === 0}
              isLast={pi === sub.pieces.length - 1}
              onUpdate={u => update(pi, u)}
              onDelete={() => remove(pi)}
              onMoveUp={() => move(pi, -1)}
              onMoveDown={() => move(pi, 1)}
            />
          ))}
          <NewPieceForm onAdd={p => onChange({ ...sub, pieces: [...sub.pieces, p] })} />
        </div>
      )}
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function slugify(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ── Add-category form ─────────────────────────────────────────────────────────
function NewCategoryForm({ nextNumber, onAdd, onCancel }) {
  const [label, setLabel] = useState('')
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0 10px' }}>
      <input
        value={label} autoFocus
        onChange={e => setLabel(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }}
        placeholder="Nom de la catégorie"
        style={{ ...S.input, width: 200, padding: '6px 10px', fontSize: 14 }}
      />
      <button onClick={() => {
        const l = label.trim()
        if (!l) return
        onAdd({ id: slugify(l), number: nextNumber, label: l, tagline: '', blurb: '', hue: 60, cover: {}, sub: [] })
        setLabel('')
      }} style={{ ...S.btnPrimary, padding: '6px 14px', fontSize: 13 }}>Créer</button>
      <button onClick={onCancel} style={{ ...S.btn, padding: '6px 10px' }}>✕</button>
    </div>
  )
}

// ── Add-subcategory form ──────────────────────────────────────────────────────
function NewSubForm({ onAdd, onCancel }) {
  const [label, setLabel] = useState('')
  const [note,  setNote]  = useState('')
  return (
    <div style={{ padding: '14px 16px', background: 'oklch(0.972 0.01 80)', border: '1px dashed var(--rule)', marginTop: 8 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--moss-deep)', marginBottom: 12 }}>
        Nouvelle sous-série
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
        <Field label="Nom *" value={label} onChange={setLabel} placeholder="ex : Pastel" />
        <Field label="Description courte (optionnelle)" value={note} onChange={setNote} placeholder="ex : Études sur papier coloré" />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={S.btn}>Annuler</button>
        <button onClick={() => {
          const l = label.trim()
          if (!l) return alert('Le nom est requis.')
          onAdd({ id: slugify(l), label: l, note: note.trim(), pieces: [] })
        }} style={S.btnPrimary}>Créer la sous-série</button>
      </div>
    </div>
  )
}

// ── Œuvres tab ────────────────────────────────────────────────────────────────
function OeuvresTab({ content, onChange }) {
  const [catIdx,     setCatIdx]     = useState(0)
  const [addingCat,  setAddingCat]  = useState(false)
  const [addingSub,  setAddingSub]  = useState(false)
  const cats = content.categories

  const setCategories = cats => onChange({ ...content, categories: cats })
  const setCategory   = (i, updated) => { const c = [...cats]; c[i] = updated; setCategories(c) }
  const cat = cats[catIdx]

  const addCategory = newCat => {
    const next = [...cats, newCat]
    setCategories(next)
    setCatIdx(next.length - 1)
    setAddingCat(false)
  }

  const addSub = newSub => {
    setCategory(catIdx, { ...cat, sub: [...cat.sub, newSub] })
    setAddingSub(false)
  }

  return (
    <div>
      {/* ── Category tabs + add button ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 28, borderBottom: '2px solid var(--rule)', gap: 0 }}>
        {cats.map((c, i) => (
          <button key={c.id} onClick={() => { setCatIdx(i); setAddingSub(false) }} style={{
            padding: '10px 26px', border: 'none',
            borderBottom: catIdx === i ? '2px solid var(--ink)' : '2px solid transparent',
            background: 'transparent', fontFamily: 'var(--serif)', fontSize: 17,
            cursor: 'pointer', color: catIdx === i ? 'var(--ink)' : 'var(--ink-soft)',
            marginBottom: -2,
          }}>{c.label}</button>
        ))}

        {/* Add category area */}
        <div style={{ marginLeft: 8, marginBottom: 4, display: 'flex', alignItems: 'center' }}>
          {addingCat
            ? <NewCategoryForm
                nextNumber={String(cats.length + 1).padStart(2, '0')}
                onAdd={addCategory}
                onCancel={() => setAddingCat(false)}
              />
            : <button onClick={() => setAddingCat(true)} style={{ ...S.btn, padding: '5px 11px', fontSize: 13, border: '1px dashed var(--rule)' }}
                title="Nouvelle catégorie">+ Catégorie</button>
          }
        </div>
      </div>

      {/* ── Category tagline + cover ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
        <Field label="Accroche de la catégorie" value={cat.tagline}
          onChange={v => setCategory(catIdx, { ...cat, tagline: v })} />
        <ImagePicker label="Image de couverture" ratio="3/4"
          value={cat.cover?.image}
          onChange={v => setCategory(catIdx, { ...cat, cover: { ...(cat.cover || {}), image: v } })} />
      </div>

      {/* ── Subcategories ── */}
      {cat.sub.map((sub, si) => (
        <SubEditor key={sub.id} sub={sub}
          onChange={updated => {
            const subs = [...cat.sub]; subs[si] = updated
            setCategory(catIdx, { ...cat, sub: subs })
          }}
        />
      ))}

      {/* ── Add subcategory ── */}
      {addingSub
        ? <NewSubForm onAdd={addSub} onCancel={() => setAddingSub(false)} />
        : <button onClick={() => setAddingSub(true)} style={{
            ...S.btn, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 7, padding: '10px 14px', border: '1px dashed var(--rule)',
            width: '100%', marginTop: 4,
          }}>+ Ajouter une sous-série</button>
      }
    </div>
  )
}

// ── Main editor ───────────────────────────────────────────────────────────────
function Editor() {
  const [content,    setContent]    = useState(null)
  const [tab,        setTab]        = useState('oeuvres')
  const [saving,     setSaving]     = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [apiError,   setApiError]   = useState(false)

  useEffect(() => {
    document.documentElement.style.cursor = 'auto'
    document.body.style.cursor = 'auto'
    return () => {
      document.documentElement.style.cursor = ''
      document.body.style.cursor = ''
    }
  }, [])

  useEffect(() => {
    fetch('/api/content')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setContent)
      .catch(() => setApiError(true))
  }, [])

  const save = async () => {
    setSaving(true); setSaveStatus(null)
    try {
      const res  = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      const json = await res.json()
      setSaveStatus(json.ok ? 'ok' : 'error')
    } catch { setSaveStatus('error') }
    setSaving(false)
    setTimeout(() => setSaveStatus(null), 4000)
  }

  if (apiError) return (
    <div className="paper" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', cursor: 'auto' }}>
      <div style={{ textAlign: 'center', maxWidth: 440 }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠</div>
        <p style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>L'éditeur n'est pas disponible.</p>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-pale)', letterSpacing: '0.1em', lineHeight: 1.8 }}>
          Lancez le serveur avec <strong>npm start</strong><br/>
          (après <strong>npm run build</strong> si ce n'est pas fait).
        </p>
        <a href="/" style={{ display: 'inline-block', marginTop: 24, fontFamily: 'var(--mono)',
          fontSize: 10, color: 'var(--ink-pale)', textDecoration: 'none', letterSpacing: '0.14em', cursor: 'pointer' }}>
          ← Retour au portfolio
        </a>
      </div>
    </div>
  )

  if (!content) return (
    <div className="paper" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', cursor: 'auto' }}>
      <div className="kicker">· chargement ·</div>
    </div>
  )

  return (
    <div className="paper" style={{ minHeight: '100vh', cursor: 'auto' }}>

      {/* ── Sticky header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'oklch(0.945 0.018 85 / 0.96)', backdropFilter: 'blur(6px)',
        borderBottom: '1px solid var(--rule)', padding: '12px 36px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a href="/" style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
            color: 'var(--ink-pale)', textDecoration: 'none', cursor: 'pointer' }}>← Portfolio</a>
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22 }}>Éditeur</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {saveStatus === 'ok'    && <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--moss)' }}>✓ Sauvegardé</span>}
          {saveStatus === 'error' && <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--rust)' }}>Erreur — réessayez</span>}
          <button onClick={save} disabled={saving}
            style={{ ...S.btnPrimary, opacity: saving ? 0.6 : 1, cursor: saving ? 'default' : 'pointer' }}>
            {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={{ borderBottom: '1px solid var(--rule)', padding: '0 36px', background: 'var(--paper-warm)' }}>
        {[['artiste', 'Artiste'], ['textes', 'Textes'], ['oeuvres', 'Œuvres']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '11px 22px', border: 'none',
            borderBottom: tab === id ? '2px solid var(--ink)' : '2px solid transparent',
            background: 'transparent', fontFamily: 'var(--serif)', fontSize: 17,
            cursor: 'pointer', color: tab === id ? 'var(--ink)' : 'var(--ink-soft)',
            marginBottom: -1,
          }}>{label}</button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '36px 40px', maxWidth: 960, margin: '0 auto' }}>
        {tab === 'artiste' && <ArtistTab  content={content} onChange={setContent} />}
        {tab === 'textes'  && <TextesTab  content={content} onChange={setContent} />}
        {tab === 'oeuvres' && <OeuvresTab content={content} onChange={setContent} />}
      </div>
    </div>
  )
}

// ── Entry point ───────────────────────────────────────────────────────────────
export default function EditorPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('ed-auth') === '1')

  if (!authed) {
    return <PasswordGate onAuth={() => {
      sessionStorage.setItem('ed-auth', '1')
      setAuthed(true)
    }} />
  }

  return <Editor />
}

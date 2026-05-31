/**
 * Serveur de production — sert le portfolio ET l'éditeur.
 * Usage : node server.mjs  (ou npm start après npm run build)
 */

import express  from 'express'
import fs       from 'fs'
import path     from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC    = path.join(__dirname, 'public')
const DIST      = path.join(__dirname, 'dist')
const CONTENT   = path.join(PUBLIC, 'content.json')
const PORT      = process.env.PORT || 4173

const app = express()
app.use(express.json({ limit: '50mb' }))

// ── Dim readers (même logique que vite.config.js) ─────────────────────────────
function readJpegDims(buf) {
  let i = 2
  while (i < buf.length - 8) {
    if (buf[i] !== 0xFF) break
    const marker = buf[i + 1]
    const len    = buf.readUInt16BE(i + 2)
    if (marker === 0xC0 || marker === 0xC1 || marker === 0xC2)
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }
    i += 2 + len
  }
  return null
}
function readPngDims(buf) {
  return buf.length < 24 ? null : { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
}
function addMissingDims(content) {
  for (const cat of content.categories ?? []) {
    for (const sub of cat.sub ?? []) {
      for (const piece of sub.pieces ?? []) {
        if (piece.dim) continue
        const url = Array.isArray(piece.image) ? piece.image[0] : piece.image
        if (!url) continue
        const fp = path.join(PUBLIC, url.startsWith('/') ? url.slice(1) : url)
        if (!fs.existsSync(fp)) continue
        try {
          const fd  = fs.openSync(fp, 'r')
          const buf = Buffer.alloc(256 * 1024)
          const n   = fs.readSync(fd, buf, 0, buf.length, 0)
          fs.closeSync(fd)
          const sl = buf.slice(0, n)
          const d  = sl[0] === 0xFF && sl[1] === 0xD8 ? readJpegDims(sl)
                   : sl[0] === 0x89 && sl[1] === 0x50 ? readPngDims(sl) : null
          if (d) piece.dim = d
        } catch {}
      }
    }
  }
}

// ── API : content.json ────────────────────────────────────────────────────────
app.get('/api/content', (req, res) => {
  res.sendFile(CONTENT)
})

app.post('/api/content', (req, res) => {
  try {
    const content = req.body
    addMissingDims(content)
    fs.writeFileSync(CONTENT, JSON.stringify(content, null, 2))
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── API : upload image ────────────────────────────────────────────────────────
app.post('/api/upload', async (req, res) => {
  try {
    const { name, folder, data } = req.body
    const base64  = data.includes(',') ? data.split(',')[1] : data
    const buf     = Buffer.from(base64, 'base64')

    const { default: sharp } = await import('sharp')
    const compressed = await sharp(buf)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer()

    const destDir = path.join(PUBLIC, folder)
    fs.mkdirSync(destDir, { recursive: true })

    const ext  = '.jpg'
    const base = path.basename(name, path.extname(name))
    let fname  = base + ext
    let n = 1
    while (fs.existsSync(path.join(destDir, fname)))
      fname = `${base}(${n++})${ext}`

    const destPath = path.join(destDir, fname)
    const tmp      = destPath + '.tmp'
    fs.writeFileSync(tmp, compressed)
    fs.renameSync(tmp, destPath)

    const meta    = await sharp(compressed).metadata()
    const imgPath = '/' + path.relative(PUBLIC, destPath).replace(/\\/g, '/')
    res.json({ ok: true, path: imgPath, dim: { w: meta.width, h: meta.height } })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Fichiers statiques ────────────────────────────────────────────────────────
// public/ en premier : content.json live + images uploadées visibles immédiatement
app.use(express.static(PUBLIC))
// dist/ : JS, CSS, et assets compilés
app.use(express.static(DIST))

// SPA fallback — toutes les routes renvoient index.html
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`\n✓ Portfolio → http://localhost:${PORT}`)
  console.log(`  Éditeur  → http://localhost:${PORT}/editor\n`)
})

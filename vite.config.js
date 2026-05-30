import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs   from 'fs'
import path from 'path'

// ── Dim readers (same logic as scripts/add-dims.mjs) ─────────────────────────
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
function dimsFromFile(filePath) {
  try {
    const fd  = fs.openSync(filePath, 'r')
    const buf = Buffer.alloc(256 * 1024)
    const n   = fs.readSync(fd, buf, 0, buf.length, 0)
    fs.closeSync(fd)
    const sl  = buf.slice(0, n)
    if (sl[0] === 0xFF && sl[1] === 0xD8) return readJpegDims(sl)
    if (sl[0] === 0x89 && sl[1] === 0x50) return readPngDims(sl)
  } catch {}
  return null
}

function addMissingDims(content, publicDir) {
  for (const cat of content.categories ?? []) {
    for (const sub of cat.sub ?? []) {
      for (const piece of sub.pieces ?? []) {
        if (piece.dim) continue
        const url = Array.isArray(piece.image) ? piece.image[0] : piece.image
        if (!url) continue
        const rel = url.startsWith('/') ? url.slice(1) : url
        const fp  = path.join(publicDir, rel)
        if (!fs.existsSync(fp)) continue
        const d = dimsFromFile(fp)
        if (d) piece.dim = d
      }
    }
  }
}

// ── Body reader ───────────────────────────────────────────────────────────────
function readBody(req, limit = 50 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0
    req.on('data', c => { size += c.length; if (size > limit) reject(new Error('too large')); else chunks.push(c) })
    req.on('end',  () => resolve(Buffer.concat(chunks).toString()))
    req.on('error', reject)
  })
}

// ── Vite plugin ───────────────────────────────────────────────────────────────
function editorApiPlugin() {
  // Même middleware pour dev (configureServer) et preview (configurePreviewServer)
  function setup(server) {
      const publicDir   = path.resolve('public')
      const contentPath = path.join(publicDir, 'content.json')

      // GET / POST /api/content
      server.middlewares.use('/api/content', async (req, res, next) => {
        res.setHeader('Content-Type', 'application/json')
        if (req.method === 'GET') {
          return res.end(fs.readFileSync(contentPath, 'utf8'))
        }
        if (req.method === 'POST') {
          try {
            const body    = await readBody(req)
            const content = JSON.parse(body)
            addMissingDims(content, publicDir)
            fs.writeFileSync(contentPath, JSON.stringify(content, null, 2))
            return res.end(JSON.stringify({ ok: true }))
          } catch (e) {
            res.statusCode = 500
            return res.end(JSON.stringify({ error: e.message }))
          }
        }
        next()
      })

      // POST /api/upload  body: { name, folder, data (dataURL) }
      server.middlewares.use('/api/upload', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        res.setHeader('Content-Type', 'application/json')
        try {
          const { name, folder, data } = JSON.parse(await readBody(req))
          const base64  = data.includes(',') ? data.split(',')[1] : data
          const buf     = Buffer.from(base64, 'base64')

          const { default: sharp } = await import('sharp')
          const compressed = await sharp(buf)
            .rotate()
            .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 82, mozjpeg: true })
            .toBuffer()

          const destDir = path.join(publicDir, folder)
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

          const meta   = await sharp(compressed).metadata()
          const imgPath = '/' + path.relative(publicDir, destPath).replace(/\\/g, '/')
          res.end(JSON.stringify({ ok: true, path: imgPath, dim: { w: meta.width, h: meta.height } }))
        } catch (e) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: e.message }))
        }
      })
  }

  return {
    name: 'editor-api',
    configureServer(server)        { setup(server) },
    configurePreviewServer(server) { setup(server) },
  }
}

export default defineConfig({
  plugins: [react(), editorApiPlugin()],
})

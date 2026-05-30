/**
 * Lit les dimensions (w, h) de chaque image listée dans content.json
 * en parcourant uniquement l'en-tête du fichier (pas les pixels),
 * puis écrit le résultat dans le champ `dim` de chaque pièce.
 *
 * Usage : node scripts/add-dims.mjs
 */

import fs from 'fs'
import path from 'path'

const PUBLIC  = path.join(process.cwd(), 'public')
const CONTENT = path.join(PUBLIC, 'content.json')

// ── Lecture des dimensions depuis l'en-tête ───────────────────────────────────

function readJpegDims(buf) {
  let i = 2 // skip SOI (FF D8)
  while (i < buf.length - 8) {
    if (buf[i] !== 0xFF) break
    const marker = buf[i + 1]
    const len    = buf.readUInt16BE(i + 2)
    // SOF0, SOF1, SOF2 — contiennent hauteur et largeur
    if (marker === 0xC0 || marker === 0xC1 || marker === 0xC2) {
      const h = buf.readUInt16BE(i + 5)
      const w = buf.readUInt16BE(i + 7)
      return { w, h }
    }
    i += 2 + len
  }
  return null
}

function readPngDims(buf) {
  // Signature PNG : 8 octets, puis chunk IHDR, puis 4 width + 4 height
  if (buf.length < 24) return null
  const w = buf.readUInt32BE(16)
  const h = buf.readUInt32BE(20)
  return { w, h }
}

function getImageDims(filePath) {
  let fd
  try {
    fd = fs.openSync(filePath, 'r')
    // 256 KB — suffisant pour passer les blocs EXIF/APP des photos de téléphone
    const buf = Buffer.alloc(256 * 1024)
    const bytesRead = fs.readSync(fd, buf, 0, buf.length, 0)
    const slice = buf.slice(0, bytesRead)

    const b0 = slice[0], b1 = slice[1]
    if (b0 === 0xFF && b1 === 0xD8) return readJpegDims(slice)      // JPEG
    if (b0 === 0x89 && b1 === 0x50) return readPngDims(slice)        // PNG
    if (b0 === 0x47 && b1 === 0x49) return null                      // GIF — skip
  } catch (e) {
    console.warn('  ⚠ cannot read', filePath, e.message)
    return null
  } finally {
    if (fd !== undefined) try { fs.closeSync(fd) } catch {}
  }
}

function urlToPath(imgUrl) {
  // "/Oeuvres/Peinture/..." → "public/Oeuvres/Peinture/..."
  const rel = imgUrl.startsWith('/') ? imgUrl.slice(1) : imgUrl
  return path.join(PUBLIC, rel)
}

// ── Parcours de content.json ──────────────────────────────────────────────────

const content = JSON.parse(fs.readFileSync(CONTENT, 'utf8'))

let updated = 0
let missing = 0

function processPiece(piece) {
  const images = Array.isArray(piece.image) ? piece.image : (piece.image ? [piece.image] : [])
  if (!images.length) return

  const firstSrc = images[0]
  const filePath = urlToPath(firstSrc)

  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ fichier introuvable : ${firstSrc}`)
    missing++
    return
  }

  const dims = getImageDims(filePath)
  if (dims) {
    piece.dim = dims
    updated++
  }
}

for (const cat of content.categories ?? []) {
  for (const sub of cat.sub ?? []) {
    for (const piece of sub.pieces ?? []) {
      processPiece(piece)
    }
  }
}

fs.writeFileSync(CONTENT, JSON.stringify(content, null, 2))

console.log(`\n✓ ${updated} pièces mises à jour`)
if (missing > 0) console.log(`⚠ ${missing} images introuvables`)

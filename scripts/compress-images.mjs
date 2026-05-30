/**
 * Compresse toutes les images du dossier public/Oeuvres en place.
 * - JPEG/JPEG : qualité 82, max 2000 px de large ou de haut
 * - PNG       : qualité 85, même limite dimensionnelle
 * Les originaux sont conservés dans public/Oeuvres-originals/ (première exécution).
 *
 * Usage : node scripts/compress-images.mjs
 */

import fs   from 'fs'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const sharp   = require('sharp')

const PUBLIC    = path.join(process.cwd(), 'public')
const SRC_DIR   = path.join(PUBLIC, 'Oeuvres')
const BACKUP    = path.join(PUBLIC, 'Oeuvres-originals')
const MAX_PX    = 2000   // px — couvre un écran 4K en vue lightbox
const JPEG_Q    = 82
const PNG_Q     = 85

const EXTS = new Set(['.jpg', '.jpeg', '.png'])

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) walk(full, out)
    else if (EXTS.has(path.extname(name).toLowerCase())) out.push(full)
  }
  return out
}

function fmt(bytes) {
  return bytes > 1_000_000
    ? (bytes / 1_000_000).toFixed(1) + ' MB'
    : Math.round(bytes / 1024) + ' KB'
}

// ── Sauvegarde des originaux (une seule fois) ─────────────────────────────────
if (!fs.existsSync(BACKUP)) {
  console.log('📦 Sauvegarde des originaux → public/Oeuvres-originals/')
  fs.cpSync(SRC_DIR, BACKUP, { recursive: true })
}

// ── Compression ───────────────────────────────────────────────────────────────
const files = walk(SRC_DIR)
console.log(`\n🔄 ${files.length} images à compresser…\n`)

let totalBefore = 0
let totalAfter  = 0
let skipped     = 0

for (const filePath of files) {
  const ext    = path.extname(filePath).toLowerCase()
  const before = fs.statSync(filePath).size
  totalBefore += before

  let pipeline = sharp(filePath)
    .rotate()                              // respecte l'orientation EXIF
    .resize({ width: MAX_PX, height: MAX_PX, fit: 'inside', withoutEnlargement: true })

  if (ext === '.png') {
    pipeline = pipeline.png({ quality: PNG_Q, compressionLevel: 8 })
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_Q, mozjpeg: true })
  }

  const buf   = await pipeline.toBuffer()
  const after = buf.length

  if (after >= before) {
    // L'image est déjà bien compressée — on ne remplace pas
    totalAfter += before
    skipped++
    continue
  }

  // Écrire dans un tmp puis renommer pour éviter le verrou Windows
  const tmp = filePath + '.tmp'
  fs.writeFileSync(tmp, buf)
  fs.renameSync(tmp, filePath)
  totalAfter += after

  const rel = path.relative(SRC_DIR, filePath)
  const pct = Math.round((1 - after / before) * 100)
  console.log(`  ${pct.toString().padStart(3)}% │ ${fmt(before).padStart(8)} → ${fmt(after).padStart(8)}  ${rel}`)
}

const saved = totalBefore - totalAfter
const pct   = Math.round((1 - totalAfter / totalBefore) * 100)
console.log(`\n✓ Total : ${fmt(totalBefore)} → ${fmt(totalAfter)}  (−${pct}%, économisé ${fmt(saved)})`)
if (skipped > 0) console.log(`  ${skipped} images déjà compressées, non modifiées`)
console.log('\nOriginaux conservés dans public/Oeuvres-originals/')

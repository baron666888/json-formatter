import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svgPath = join(__dirname, '..', 'public', 'og-image.svg')
const pngPath = join(__dirname, '..', 'public', 'og-image.png')

const svg = readFileSync(svgPath)

sharp(svg)
  .resize(1200, 630)
  .png()
  .toFile(pngPath)
  .then(() => console.log('OG image generated: public/og-image.png'))
  .catch(err => console.error('Error:', err))

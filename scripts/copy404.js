// Creates a 404.html for SPA fallback on GitHub Pages after Vite build.
import { copyFileSync, existsSync } from 'node:fs'

const src = 'dist/index.html'
const dest = 'dist/404.html'
if (existsSync(src)) {
  copyFileSync(src, dest)
  console.log('Created SPA 404.html for GitHub Pages.')
} else {
  console.warn('index.html not found; did the build succeed?')
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
//
// NOTE: do not set `base`. The site is served from the root of the custom
// domain (public/CNAME), and absolute /assets/... URLs are what let the nested
// /resume/ page resolve its chunks correctly.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@content': path.resolve(__dirname, './content'),
    },
  },
  build: {
    rollupOptions: {
      // Only these entries are crawled. Anything not reachable from them —
      // notably admin/ — never enters the module graph or dist/.
      input: {
        main: path.resolve(__dirname, 'index.html'),
        resume: path.resolve(__dirname, 'resume/index.html'),
      },
    },
  },
})

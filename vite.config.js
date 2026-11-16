import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { adminPlugin, adminIsolationGuard } from './tools/vite-plugin-admin.js'

// https://vite.dev/config/
//
// NOTE: do not set `base`. The site is served from the root of the custom
// domain (public/CNAME), and absolute /assets/... URLs are what let the nested
// /resume/ page resolve its chunks correctly.
export default defineConfig({
  // adminPlugin is apply:'serve' and adminIsolationGuard is apply:'build',
  // so exactly one of them is ever active.
  plugins: [react(), tailwindcss(), adminPlugin(), adminIsolationGuard()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@content': path.resolve(__dirname, './content'),
    },
  },
  build: {
    rollupOptions: {
      // The deployed /admin/ is a GitHub-token-gated editor that commits content
      // straight to the repo (admin/github-api.js), so it ships as its own
      // entry. It is marked noindex and linked from nowhere — reachable only by
      // typing /admin/. In the production bundle the local loopback-API branch
      // (admin/api.js) tree-shakes out, since import.meta.env.PROD is constant.
      input: {
        main: path.resolve(__dirname, 'index.html'),
        resume: path.resolve(__dirname, 'resume/index.html'),
        admin: path.resolve(__dirname, 'admin/index.html'),
      },
    },
  },
})

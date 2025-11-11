
## Portfolio Site (React + Tailwind + Vite)

This repository hosts my portfolio at https://tylorduong.github.io, now powered by React and Tailwind, built with Vite and deployed via GitHub Actions.

### Structure (key files)

- `index.html` – Vite entry HTML
- `src/` – React app (pages and components)
	- `src/components/NavBar.jsx` – top navigation
	- `src/pages/{Home,About,Projects,Contact}.jsx` – routed pages
- `tailwind.config.js`, `postcss.config.js`, `src/index.css` – Tailwind setup
- `vite.config.js` – Vite config
- `.github/workflows/deploy.yml` – builds and deploys to GitHub Pages
- `public/.nojekyll` – disables Jekyll processing on Pages

Legacy Jekyll files (`_config.yml`, markdown pages) can be removed later; the GitHub Action publishes the built `dist` only.

### Run locally (Windows PowerShell)
1) Install Node.js LTS (https://nodejs.org/) if needed
2) Install deps and start dev server
```powershell
npm install
npm run dev
```
Then open the URL shown (typically http://localhost:5173).

### Build
```powershell
npm run build
```
Output goes to `dist/`. A `404.html` is generated for SPA routing on GitHub Pages.

### Deploy (GitHub Pages via Actions)
Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys automatically. In GitHub Settings → Pages, set the Source to “GitHub Actions”.

### Customize
- Update contact links in `src/pages/Contact.jsx`
- Add real projects in `src/pages/Projects.jsx`
- Adjust colors/spacing via Tailwind classes in components


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // absolut ('/'): rute bertingkat seperti /produk/1 dan halaman 404 tetap memuat aset dari /app-assets
  base: '/',
  // Renamed from the default "assets" because the repo root already has a
  // real assets/ folder (the legacy static adilabs-hero.html page) — when
  // this repo is deployed by cloning straight into public_html, a root-level
  // `assets` symlink to this folder would land inside that existing
  // directory instead of replacing it.
  build: {
    assetsDir: 'app-assets',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

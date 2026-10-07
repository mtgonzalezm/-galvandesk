import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Versión publicada (Vercel da el commit); sirve para saber qué versión tenía quien informa de un fallo
const version = (process.env.VERCEL_GIT_COMMIT_SHA || 'local').slice(0, 7)

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
  },
  build: {
    rollupOptions: {},
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})

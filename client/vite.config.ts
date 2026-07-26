import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Local dev: proxy /api/* to the local backend so the frontend uses the same
  // same-origin /api paths it uses in production (Vercel handles this via
  // vercel.json). The /api prefix is stripped to match the backend's routes.
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})

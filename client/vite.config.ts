import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Local dev: proxy /api/* to the local backend, which serves its routes
  // under /api/* (so the prefix is preserved, not stripped). Production does
  // the same via vercel.json.
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})

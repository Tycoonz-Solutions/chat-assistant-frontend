import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Load `../.env` / `../.env.local` (package root) as well as `demo/.env*`.
  envDir: "..",
  plugins: [react()],
  server: { port: 5173 },
  resolve: {
    preserveSymlinks: true, // make Vite respect linked packages
  },
  optimizeDeps: {
    include: ['@asadullah009/chat-widget'], // pre-bundle your widget
  },
})

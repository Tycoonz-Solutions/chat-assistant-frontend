import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  resolve: {
    preserveSymlinks: true, // make Vite respect linked packages
  },
  optimizeDeps: {
    include: ['@asadullah009/chat-widget'], // pre-bundle your widget
  },
})

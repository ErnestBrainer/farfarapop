import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // ✅ this exposes the app to your network
    port: 5173,   // optional, keeps the default port
    proxy: {
      '/api': 'http://10.23.15.151:5000', // ✅ use your PC IP
    },
  },
})
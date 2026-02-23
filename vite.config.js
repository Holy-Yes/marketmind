import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Forward all /auth, /campaigns, /instagram, etc. to FastAPI
      '/auth': { target: 'http://localhost:8000', changeOrigin: true },
      '/campaigns': { target: 'http://localhost:8000', changeOrigin: true },
      '/instagram': { target: 'http://localhost:8000', changeOrigin: true },
      '/images': { target: 'http://localhost:8000', changeOrigin: true },
      '/pitch': { target: 'http://localhost:8000', changeOrigin: true },
      '/competitor': { target: 'http://localhost:8000', changeOrigin: true },
      '/leads': { target: 'http://localhost:8000', changeOrigin: true },
      '/simulator': { target: 'http://localhost:8000', changeOrigin: true },
      '/intelligence': { target: 'http://localhost:8000', changeOrigin: true },
      '/memory': { target: 'http://localhost:8000', changeOrigin: true },
      '/health': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})

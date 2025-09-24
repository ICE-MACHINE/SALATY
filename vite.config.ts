import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  // base: isGitHubPages ? '/SALATY/' : './',
  base: '/SALATY/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material']
        }
      }
    }
  },
  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    }
  }
})

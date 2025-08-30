import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// دالة صغيرة تحدد إن كان النشر على GitHub Pages
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'

// لما يكون GitHub Pages (repo SALATY) نخلي base=/SALATY/
// أما Vercel / Netlify / أي دومين عادي نخلي base=./
export default defineConfig({
  base: isGitHubPages ? '/SALATY/' : './',
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

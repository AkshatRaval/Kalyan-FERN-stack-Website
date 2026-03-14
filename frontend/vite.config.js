import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          'react-vendor': ['react', 'react-dom'],
          
          // Split router if you're using it
          'router': ['react-router-dom'],
          
          // Split axios or other HTTP libraries
          // 'utils': ['axios'],
        },
      },
    },
    
    // Minify more aggressively
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
  
  // Dev server proxy configuration
  server: {
    proxy: {
      '/quiz': 'http://localhost:5000',
      '/api': 'http://localhost:5000',
      '/admin': 'http://localhost:5000',
      '/pay': 'http://localhost:5000',
    }
  }
})
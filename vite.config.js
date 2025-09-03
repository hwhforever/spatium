import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          react: ['react', 'react-dom'],
          // Separate component chunks
          components: [
            './src/components/Dashboard.jsx',
            './src/components/ProjectView.jsx',
            './src/components/ProjectTile.jsx'
          ],
          // Utilities chunk
          utils: [
            './src/utils/localStorage.js',
            './src/utils/aiService.js',
            './src/utils/templateLibrary.js'
          ]
        }
      }
    },
    // Source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development',
    // Asset optimization
    assetsDir: 'assets',
    // Bundle size warnings
    chunkSizeWarningLimit: 1000
  },
  // Development server configuration
  server: {
    port: 5173,
    host: true,
    // Proxy API calls during development
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // Preview server configuration
  preview: {
    port: 4173,
    host: true
  },
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
})

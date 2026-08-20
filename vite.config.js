import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      // SpringBoot 8080，继续用 /api，axios request正常工作
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      },
      // Python FastAPI 8000 使用 /pyapi 作为访问入口
      '/pyapi': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/pyapi/, '')
      }
    }
  }
})
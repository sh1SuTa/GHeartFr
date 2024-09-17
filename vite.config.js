import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
      proxy: {
        '/api': {//获取路径中包含了/api的请求

          //后台服务所在的源
          target: 'http://localhost:8080',
          // target: 'http://123.57.186.79/8080',

          //修改源
          changeOrigin: true,

          // '/api'替换为空字符串
          rewrite: (path)=> path.replace(/^\/api/,'')

        }
      }
  }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fileCachePlugin from '../index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    fileCachePlugin({
      cacheFiles: ['/src/styles/index.less']
    })],
})

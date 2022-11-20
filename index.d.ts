declare module 'vite-cache-file-plugin' {
  import { Plugin } from 'vite'
  function fileCachePlugin(cacheFiles: string[]): Plugin
  export default fileCachePlugin
}

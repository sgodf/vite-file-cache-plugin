declare module 'vite-cache-file-plugin' {
  import { Plugin } from 'vite'
  function fileCachePlugin(options: { cacheFiles: string[], matchUrlFn?: (url?: string) => boolean }): Plugin
  export default fileCachePlugin
}

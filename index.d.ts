declare module 'vite-cache-file-plugin' {
  import { Plugin } from 'vite'
  function fileCachePlugin(options: { matchFn?: (id?: string) => boolean }): Plugin
  export default fileCachePlugin
}

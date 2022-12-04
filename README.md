# Vite File Cache Plugin
Applicable to single files with long compilation time and low change frequency

# Install
```shell
npm install vite-file-cache-plugin --save-dev
```

# Usage
### vite.config.ts
```js
import fileCahcePlugin from 'vite-file-cache-plugin'
export default defineConfig({
  plugins: [vue(), fileCahcePlugin({
    cacheFiles: ['file relative path']
  })]
})
```

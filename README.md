# Vite file cache plugin
- Applicable to single files with long compilation time and low change frequenc.
- Such as global sass and less file, or component.
- Support hmr do not restart.

# Install
```shell
npm install @godf/vite-file-cache-plugin --save-dev
```

# Usage
### vite.config.ts
```js
import fileCahcePlugin from 'vite-file-cache-plugin'
export default defineConfig({
  plugins: [
    vue(),
    fileCahcePlugin({
      matchFn: (id) => id.includes('/src/styles/index.less')
    })
  ]
})
```
# Options
|function| description | callback parameter |
|----|----|----|
|matchFn| assess whether to cache file  | (id?: string) id: vite module id

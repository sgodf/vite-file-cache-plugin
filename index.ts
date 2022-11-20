import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';

const cacheDirJson = 'cacheFile.json';
const cachePathPrefix = '/node_modules/.vite/cacheDir';

// TODO 客户端缓存控制、文件名后缀处理
export default function fileCachePlugin(cacheFiles: string[]): Plugin {
  return {
    name: 'fileCachePlugin',
    apply: 'serve',
    enforce: 'pre',
    configureServer(serve) {
      const { middlewares, transformRequest } = serve;
      middlewares.use(async (req, res, next) => {
        if (
          cacheFiles.find(file => req?.url?.includes(file)) &&
          req.url &&
          req.originalUrl
        ) {
          try {
            const formatUrl = req.originalUrl.split('?')[0];
            // 读取文件信息
            const { mtime } = fs.statSync(path.join(__dirname, formatUrl));
            const cacheFileInfoJsonPath = path.join(
              __dirname,
              cachePathPrefix,
              cacheDirJson
            );
            const cacheDir = path.join(__dirname, cachePathPrefix);
            const fileName = formatUrl.replace(/\//g, '-');
            const exist = fs.existsSync(cacheFileInfoJsonPath);
            if (exist) {
              const fileContent = await fs.readFileSync(cacheFileInfoJsonPath, {
                encoding: 'utf8',
              });
              const serializeContent = JSON.parse(fileContent);

              if (serializeContent[formatUrl] == mtime.getTime()) {
                const readFileContent = await fs.readFileSync(
                  path.join(cacheDir, fileName)
                );

                res.setHeader(
                  'Content-Type',
                  'application/javascript; charset=utf-8'
                );
                res.end(readFileContent);
                return;
              } else {
                const fileInfo = JSON.stringify({
                  ...serializeContent,
                  [formatUrl]: mtime.getTime(),
                });
                const result = await transformRequest(formatUrl);
                fs.writeFileSync(cacheFileInfoJsonPath, fileInfo);
                fs.writeFileSync(
                  path.join(cacheDir, fileName),
                  result?.code ?? ''
                );
              }
            } else {
              // 首次加载
              const fileInfo = JSON.stringify({
                [formatUrl]: mtime.getTime(),
              });
              const result = await transformRequest(req.url);
              await fs.mkdirSync(path.join(__dirname, cachePathPrefix));
              fs.writeFileSync(cacheFileInfoJsonPath, fileInfo);
              fs.writeFileSync(
                path.join(cacheDir, fileName),
                result?.code ?? ''
              );
            }
          } catch (err) {
            console.error(err);
          }
        }
        next();
      });
    },
    async load(id) {
      let formatUrl = cacheFiles.find(file => id?.includes(file));
      if (formatUrl) {
        try {
          formatUrl = formatUrl?.startsWith('/') ? `${formatUrl}` : formatUrl;

          // 读取文件信息
          const { mtime } = fs.statSync(path.join(__dirname, formatUrl));
          const cacheFileInfoJsonPath = path.join(
            __dirname,
            cachePathPrefix,
            cacheDirJson
          );

          const exist = fs.existsSync(cacheFileInfoJsonPath);

          if (exist) {
            const fileContent = await fs.readFileSync(cacheFileInfoJsonPath, {
              encoding: 'utf8',
            });
            const serializeContent = JSON.parse(fileContent);
            // cache hit
            if (serializeContent[formatUrl] == mtime.getTime()) {
              return {
                code: '',
              };
            }
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        return null;
      }
    },
  };
}

import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';

const cacheDirJson = 'cacheFile.json';
const cachePathPrefix = '/node_modules/.vite/cacheDir';

// TODO 客户端缓存控制、文件名后缀处理
export default function fileCachePlugin(options: {
    cacheFiles: string[],
    matchUrlFn?: (url?: string) => boolean
    matchIdFn?: (id: string, cacheFiles: string[]) => string
  }
): Plugin {
  const { cacheFiles, matchUrlFn, matchIdFn } = options
  const cacheFileInfoJsonPath = path.join(
    process.cwd(),
    cachePathPrefix,
    cacheDirJson
  );
  return {
    name: 'fileCachePlugin',
    apply: 'serve',
    enforce: 'pre',
    configureServer(serve) {
      const { middlewares, transformRequest, moduleGraph } = serve;
      middlewares.use(async (req, res, next) => {
        const matchEx = matchUrlFn ? matchUrlFn?.(req?.url) : cacheFiles.find(file => req?.url?.includes(file))
        if (
          matchEx &&
          req.url &&
          req.originalUrl
        ) {
          try {
            console.log(moduleGraph.idToModuleMap);
            const formatUrl = req.originalUrl.split('?')[0];
            console.log(req.url, 'req.url');
            const cacheDir = path.join(process.cwd(), cachePathPrefix);
            const fileName = formatUrl.replace(/\//g, '-');

            const cacheInfo = await getCacheInfo(formatUrl, cacheFileInfoJsonPath)
            if (cacheInfo) {
              const { exist, cacheHit, serializeContent, mtime } = cacheInfo
              if (exist) {
                if (cacheHit) {
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
                await fs.mkdirSync(path.join(process.cwd(), cachePathPrefix));
                fs.writeFileSync(cacheFileInfoJsonPath, fileInfo);
                fs.writeFileSync(
                  path.join(cacheDir, fileName),
                  result?.code ?? ''
                );
              }
            }
          } catch (err) {
            console.error(err);
          }
        }
        next();
      });
    },
    async load(id) {
      const matchId = matchIdFn ? matchIdFn?.(id, cacheFiles) : cacheFiles.find(file => id?.includes(file));
      if (matchId) {
        try {
          const formatUrl = matchId?.startsWith('/') ? matchId : `/${matchId}`;
          const cacheInfo = await getCacheInfo(formatUrl, cacheFileInfoJsonPath)
          if (cacheInfo) {
            const { exist,  cacheHit } = cacheInfo
            if (exist && cacheHit) {
              return {
                code: '',
              }
            }
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        return null;
      }
    },
  }
}

const getCacheInfo = async (fileUrl: string, cacheFileInfoJsonPath: string) => {
  try {
    // 读取文件信息
    const { mtime } = fs.statSync(path.join(process.cwd(), fileUrl));
    const exist = fs.existsSync(cacheFileInfoJsonPath);
    if (exist) {
      const fileContent = await fs.readFileSync(cacheFileInfoJsonPath, {
        encoding: 'utf8',
      });
      const serializeContent = JSON.parse(fileContent);
      // cache hit
      if (serializeContent[fileUrl] == mtime.getTime()) {
        return {
          exist,
          cacheHit: true,
          serializeContent,
          mtime
        };
      }
    } else {
      return {
        exist,
        cacheHit: false,
        mtime
      }
    }
  } catch(err) {
    console.error(err);
  }
}

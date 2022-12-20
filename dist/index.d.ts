import type { Plugin } from 'vite';
export default function fileCachePlugin(options: {
    matchFn: (id?: string) => boolean;
}): Plugin;

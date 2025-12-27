import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react(), nodePolyfills()],
    server: {
        port: 3006,
    },
    build: {
        sourcemap: true,
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                iframe: resolve(__dirname, 'iframe.html'),
            },

            output: {
                entryFileNames: (chunkInfo) => {
                    return `${chunkInfo.name}.js`;
                },
                chunkFileNames: (chunkInfo) => {
                    return `${chunkInfo.name}.js`;
                },
            },
        },
    },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react(), nodePolyfills()],
    server: {
        port: 3006,
    },
    resolve: {
        preserveSymlinks: true,
    },
    build: {
        sourcemap: false,
        manifest: false,
        outDir: 'dist',
        rollupOptions: {
            preserveEntrySignatures: false,
            treeshake: true,
            input: {
                main: resolve(__dirname, 'index.html'),
                // iframe: resolve(__dirname, 'iframe.html'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
                sourcemapPathTransform: () => '',
            },
        },
    },
});

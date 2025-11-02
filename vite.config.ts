import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), nodePolyfills()],
    server: {
        port: 3006,
    },
    build: {
        sourcemap: true,
        manifest: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                iframe: resolve(__dirname, 'iframe.html'),
            },
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
        outDir: 'dist',
    },
    define: {
        'process.env.BUILD_DATE': JSON.stringify('2024-09-29'),
    },
});

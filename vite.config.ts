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
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'), // основное SPA
            },
        },
        outDir: 'dist',
    },
});

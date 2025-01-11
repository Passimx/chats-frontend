import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { ManifestOptions, VitePWA } from 'vite-plugin-pwa';

const manifest: Partial<ManifestOptions> | false = {
    theme_color: '#000000',
    background_color: '#a1cff7',
    icons: [
        { purpose: 'maskable', sizes: '512x512', src: '/assets/images/icon512_maskable.png', type: 'image/png' },
        { purpose: 'any', sizes: '512x512', src: '/assets/images/icon512_rounded.png', type: 'image/png' },
    ],
    screenshots: [
        { src: '/assets/images/desktop.png', type: 'image/png', sizes: '3024x1642', form_factor: 'wide' },
        { src: '/assets/images/mobile.png', type: 'image/png', sizes: '852x1474', form_factor: 'narrow' },
    ],
    orientation: 'any',
    display: 'standalone',
    lang: 'ru-RU',
    name: 'Passim Team',
    short_name: 'Passim',
    description: 'open platform for messaging',
    start_url: '/',
    edge_side_panel: {
        preferred_width: 480,
    },
};

const vitePWA = VitePWA({
    registerType: 'autoUpdate',
    workbox: {
        globPatterns: ['**/*.{html,css,js,ico,png,svg,}'],
    },
    manifest,
});

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), nodePolyfills(), vitePWA],
    server: {
        port: 3006,
    },
});

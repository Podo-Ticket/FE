import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    strategies: 'injectManifest',
    srcDir: 'src',
    filename: 'sw.ts',
    registerType: 'prompt',
    injectRegister: 'auto',

    manifest: {
      name: 'Podo-Ticket',
      short_name: 'Podo-Ticket',
      description: 'Podo ticket service',
      theme_color: '#ffffff',

      icons: [{
        src: 'favicon.ico',
        sizes: '64x64',
        type: 'image/png',
      }, {
        src: 'favicon.ico',
        sizes: '192x192',
        type: 'image/png',
      }, {
        src: 'favicon.ico',
        sizes: '512x512',
        type: 'image/png',
      }, {
        src: 'favicon.ico',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      }],
    },

    injectManifest: {
      globPatterns: ['**/*.{js,mjs,css,scss,html,svg,png,ico,json,webmanifest}'],
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})
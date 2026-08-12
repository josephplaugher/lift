/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // 1. You MUST set the API to modern for silenceDeprecations to work
        api: 'modern-compiler', 
        
        // 2. Now these flags will be respected
        silenceDeprecations: ['color-functions', 'global-builtin', 'import'],
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      // 'prompt' (not autoUpdate): autoUpdate would reload the page when a new SW
      // takes control. Requirement is an explicit confirm before reload.
      registerType: 'prompt',
      // Installability only — default asset precache is enough for Chrome's SW requirement.
      // No runtime caching / offline data strategies.
      includeAssets: ['apple-touch-icon.png', 'favicon-32.png', 'barbell-192x192.png', 'barbell-512x512.png', 'barbell-512x512-maskable.png'],
      workbox: {
        navigateFallbackDenylist: [/^\/api\//],
      },
      manifest: {
        name: 'Lift!',
        short_name: 'Lift',
        description: 'Progressive overload weight lifting tracker',
        theme_color: '#060b47',
        background_color: '#060b47',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'barbell-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'barbell-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'barbell-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom', // required for DOM testing
    setupFiles: './setupTests.tsx',
  },
})

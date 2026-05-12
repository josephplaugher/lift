/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // required for DOM testing
    setupFiles: './setupTests.tsx',
  },
})

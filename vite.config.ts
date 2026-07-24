import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

import { PWA_OPTIONS } from './src/app/pwa.ts'

export default defineConfig({
  plugins: [
    react(),
    VitePWA(PWA_OPTIONS),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})

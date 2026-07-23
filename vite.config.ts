import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mahjong Helper',
        short_name: 'Mahjong Helper',
        description: '첫 손패에서 목표로 삼을 역을 추천하는 리치마작 입문 도우미',
        theme_color: '#185c45',
        background_color: '#f5f6f2',
        display: 'standalone',
        start_url: '/',
        lang: 'ko',
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})

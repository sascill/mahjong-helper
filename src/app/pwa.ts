import type { VitePWAOptions } from 'vite-plugin-pwa'

export const PWA_OPTIONS: Partial<VitePWAOptions> = {
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
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
}

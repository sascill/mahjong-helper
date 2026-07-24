import type { VitePWAOptions } from 'vite-plugin-pwa'

export const PWA_OPTIONS: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  manifest: {
    name: '마작 노트',
    short_name: '마작 노트',
    description: '역과 패, 용어를 빠르게 확인하는 리치마작 노트',
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

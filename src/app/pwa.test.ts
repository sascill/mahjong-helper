import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { PWA_OPTIONS } from './pwa'

describe('PWA 설정', () => {
  it('설치와 마스커블 표시에 필요한 아이콘을 제공한다', () => {
    expect(PWA_OPTIONS.manifest).toMatchObject({
      name: 'Mahjong Helper',
      short_name: 'Mahjong Helper',
      description: '역과 기본 조건을 빠르게 확인하는 리치마작 입문 도우미',
      display: 'standalone',
      start_url: '/',
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
    })

    expect(PWA_OPTIONS.registerType).toBe('autoUpdate')
    expect(existsSync(resolve('public/pwa-192x192.png'))).toBe(true)
    expect(existsSync(resolve('public/pwa-512x512.png'))).toBe(true)
    expect(existsSync(resolve('public/pwa-maskable-512x512.png'))).toBe(true)
  })
})

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const readJson = (path: string): Record<string, unknown> =>
  JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>

describe('Cloudflare 수동 배포 설정', () => {
  it('정적 SPA를 mahjong-helper Worker로 배포한다', () => {
    const config = readJson(resolve('wrangler.jsonc'))

    expect(config).toMatchObject({
      name: 'mahjong-helper',
      assets: {
        directory: './dist',
        not_found_handling: 'single-page-application',
      },
    })
  })

  it('빌드와 dry-run을 포함한 수동 배포 명령을 제공한다', () => {
    const packageConfig = readJson(resolve('package.json'))

    expect(packageConfig).toMatchObject({
      scripts: {
        deploy: 'npm run build && wrangler deploy',
        'deploy:dry-run': 'npm run build && wrangler deploy --dry-run',
      },
      devDependencies: {
        wrangler: expect.any(String),
      },
    })
  })
})

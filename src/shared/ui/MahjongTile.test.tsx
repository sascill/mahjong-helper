import {
  existsSync,
  readFileSync,
} from 'node:fs'
import { resolve } from 'node:path'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TILES } from '../../domain/mahjong/hand'
import { MahjongTile } from './MahjongTile'

const readPngSize = (path: string) => {
  const png = readFileSync(path)

  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
  }
}

describe('MahjongTile', () => {
  it('TileId에 대응하는 패 이미지와 접근성 이름을 표시한다', () => {
    render(<MahjongTile tileId="1m" />)

    const tile = screen.getByRole('img', { name: '1만' })
    const image = tile.querySelector('img')

    expect(image).toHaveAttribute('src', '/tiles/1m.png')
    expect(image).toHaveAttribute('alt', '')
  })

  it('모든 기본 패의 이미지 에셋을 제공한다', () => {
    for (const tile of TILES) {
      const tilePath = resolve(`public/tiles/${tile.id}.png`)

      expect(existsSync(tilePath)).toBe(true)
      expect(readPngSize(tilePath)).toEqual({ width: 41, height: 72 })
    }
  })
})

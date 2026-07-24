import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TILES } from '../../domain/mahjong/hand'
import { TileReference } from './index'

const TILE_LABELS = [
  '1만',
  '2만',
  '3만',
  '4만',
  '5만',
  '6만',
  '7만',
  '8만',
  '9만',
  '1통',
  '2통',
  '3통',
  '4통',
  '5통',
  '6통',
  '7통',
  '8통',
  '9통',
  '1삭',
  '2삭',
  '3삭',
  '4삭',
  '5삭',
  '6삭',
  '7삭',
  '8삭',
  '9삭',
  '동',
  '남',
  '서',
  '북',
  '백',
  '발',
  '중',
]

describe('패 읽는 법 기능', () => {
  it('34종 패를 그룹별 이미지와 캡션으로 표시한다', () => {
    render(<TileReference />)

    expect(
      screen.getByRole('heading', { name: '패 읽는 법', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.queryByText('패 읽기')).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        '패 모양은 그대로 보고, 아래 이름으로 읽는 법만 확인하세요.',
      ),
    ).not.toBeInTheDocument()

    for (const groupName of ['만수', '통수', '삭수', '자패']) {
      expect(
        screen.getByRole('region', { name: `${groupName} 읽는 법` }),
      ).toBeInTheDocument()
    }

    expect(
      screen.queryByText('한자 숫자와 만 자가 있는 패입니다.'),
    ).not.toBeInTheDocument()

    const reference = screen.getByRole('main')

    expect(within(reference).getAllByRole('img')).toHaveLength(TILES.length)

    for (const tileLabel of TILE_LABELS) {
      expect(within(reference).getByText(tileLabel)).toBeInTheDocument()
    }
  })
})

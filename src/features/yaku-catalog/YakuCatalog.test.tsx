import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { getYaku, YAKUS } from '../../domain/mahjong/yaku'
import { YakuCatalog } from './index'

describe('역 도감 기능', () => {
  it('지원하는 모든 역을 정의된 순서로 표시한다', () => {
    render(
      <MemoryRouter>
        <YakuCatalog />
      </MemoryRouter>,
    )

    const catalog = screen.getByRole('region', {
      name: '지원하는 역',
    })

    expect(
      within(catalog)
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual(YAKUS.map(({ name }) => name))

    for (const yaku of YAKUS) {
      expect(
        within(catalog).getByRole('link', {
          name: `${yaku.name} 상세 보기`,
        }),
      ).toHaveAttribute('href', `/yaku/${yaku.id}`)
    }
  })

  it('멘젠 전용 역의 상세 조건과 완성 예시를 표시한다', () => {
    render(
      <MemoryRouter>
        <YakuCatalog selectedYaku={getYaku('chiitoitsu')} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: '치또이츠', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByText('멘젠 2판')).toBeInTheDocument()
    expect(screen.getByText('울기 불가')).toBeInTheDocument()
    expect(screen.getByText('멘젠 필수')).toBeInTheDocument()
    expect(screen.getByText('치·퐁·깡 불가')).toBeInTheDocument()
    expect(
      screen.getByText('서로 다른 패의 또이쯔가 일곱 개 필요합니다.'),
    ).toBeInTheDocument()

    const example = screen.getByRole('region', {
      name: '치또이츠 완성 예시',
    })

    expect(within(example).getAllByRole('listitem')).toHaveLength(7)
    expect(within(example).getAllByRole('img')).toHaveLength(14)
  })

  it('울 수 있는 역의 멘젠과 울기 판수를 표시한다', () => {
    render(
      <MemoryRouter>
        <YakuCatalog selectedYaku={getYaku('honitsu')} />
      </MemoryRouter>,
    )

    expect(screen.getByText('멘젠 3판')).toBeInTheDocument()
    expect(screen.getByText('울기 2판')).toBeInTheDocument()
    expect(screen.getByText('멘젠 필수 아님')).toBeInTheDocument()
    expect(screen.getByText('치·퐁·깡 가능')).toBeInTheDocument()
  })
})

import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { getYaku, YAKUS } from '../../domain/mahjong/yaku'
import { YakuCatalog } from './index'
import styles from './YakuCatalog.module.css'

describe('역 정보 기능', () => {
  it('지원하는 모든 역을 판수와 역만으로 구분해 표시한다', () => {
    render(
      <MemoryRouter>
        <YakuCatalog />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: '역 정보', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.queryByText('역 도감')).not.toBeInTheDocument()

    const groupNavigation = screen.getByRole('navigation', {
      name: '판수별 역 바로가기',
    })
    const groupAnchors = [
      ['1판', '#yaku-1'],
      ['2판', '#yaku-2'],
      ['3판', '#yaku-3'],
      ['6판', '#yaku-6'],
      ['역만', '#yaku-yakuman'],
    ] as const

    for (const [label, href] of groupAnchors) {
      expect(
        within(groupNavigation).getByRole('link', { name: label }),
      ).toHaveAttribute('href', href)
    }

    const catalog = screen.getByRole('region', {
      name: '지원하는 역',
    })

    expect(screen.queryByText('리치마작 역 정보')).not.toBeInTheDocument()
    expect(
      screen.queryByText('현재 지원하는 역의 조건과 완성 형태를 살펴보세요.'),
    ).not.toBeInTheDocument()

    expect(
      within(catalog)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(YAKUS.map(({ name }) => name))

    for (const groupName of ['1판', '2판', '3판', '6판', '역만']) {
      const group = within(catalog).getByRole('region', {
        name: `${groupName} 역`,
      })

      expect(group).toBeInTheDocument()
      expect(
        within(group).getByRole('heading', { name: groupName, level: 2 }),
      ).toHaveClass(styles.listGroupHeading)
    }

    for (const [label, href] of groupAnchors) {
      expect(
        within(catalog).getByRole('region', {
          name: `${label} 역`,
        }),
      ).toHaveAttribute('id', href.slice(1))
    }

    for (const yaku of YAKUS) {
      expect(
        within(catalog).getByRole('link', {
          name: `${yaku.name} 상세 보기`,
        }),
      ).toHaveAttribute('href', `/yaku/${yaku.id}`)
    }

    expect(
      within(catalog).getByText('리치 선언 후 화료'),
    ).toBeInTheDocument()
    expect(
      within(catalog).queryByText(
        '멘젠 텐파이 상태에서 리치를 선언하고 화료하는 역입니다.',
      ),
    ).not.toBeInTheDocument()
    expect(within(catalog).queryByText('멘젠 1판')).not.toBeInTheDocument()
    expect(within(catalog).queryByText('멘젠 2판')).not.toBeInTheDocument()
    expect(within(catalog).getAllByText('울기 1판').length).toBeGreaterThan(0)
    expect(within(catalog).getAllByText('멘젠 전용').length).toBeGreaterThan(0)

    const compactSummaries = Array.from(
      catalog.querySelectorAll('article p'),
    ).map((paragraph) => paragraph.textContent ?? '')

    expect(compactSummaries).toHaveLength(YAKUS.length)
    for (const compactSummary of compactSummaries) {
      expect(compactSummary.length).toBeLessThanOrEqual(18)
      expect(compactSummary).not.toMatch(/입니다\.?$/)
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

  it('역만의 가치와 멘젠 조건을 표시한다', () => {
    render(
      <MemoryRouter>
        <YakuCatalog selectedYaku={getYaku('kokushi-musou')} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', {
        name: '국사무쌍',
        level: 1,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('역만')).toBeInTheDocument()
    expect(screen.getByText('멘젠 필수')).toBeInTheDocument()
    expect(screen.getByText('치·퐁·깡 불가')).toBeInTheDocument()

    const example = screen.getByRole('region', {
      name: '국사무쌍 완성 예시',
    })

    expect(within(example).getAllByRole('img')).toHaveLength(14)
  })
})

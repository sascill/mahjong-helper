import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TermReference } from './index'

describe('용어 기능', () => {
  it('초보자가 자주 보는 마작 용어를 인덱스로 표시한다', () => {
    render(<TermReference />)

    expect(
      screen.getByRole('heading', { name: '용어', level: 1 }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: '룰 정보', level: 1 }),
    ).not.toBeInTheDocument()

    for (const groupName of ['기본 진행', '패와 형태', '역과 점수']) {
      expect(
        screen.getByRole('region', { name: `${groupName} 용어` }),
      ).toBeInTheDocument()
    }

    const reference = screen.getByRole('main')

    for (const termName of [
      '멘젠',
      '울기',
      '텐파이',
      '슌쯔',
      '커쯔',
      '역',
      '도라',
    ]) {
      expect(
        within(reference).getByRole('heading', { name: termName, level: 3 }),
      ).toBeInTheDocument()
    }

    expect(
      within(reference).getByText(
        '치·퐁·깡으로 울지 않고 손패를 닫은 상태입니다.',
      ),
    ).toBeInTheDocument()
    expect(
      within(reference).getByText(
        '필요한 패 한 장만 오면 화료할 수 있는 상태입니다.',
      ),
    ).toBeInTheDocument()
    expect(
      within(reference).queryByText('기본 룰'),
    ).not.toBeInTheDocument()
  })
})

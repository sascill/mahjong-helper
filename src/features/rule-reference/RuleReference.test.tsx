import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RuleReference } from './index'

describe('룰 정보 기능', () => {
  it('초보자가 자주 확인하는 기본 룰을 표시한다', () => {
    render(<RuleReference />)

    expect(
      screen.getByRole('heading', { name: '룰 정보', level: 1 }),
    ).toBeInTheDocument()

    for (const ruleTitle of [
      '역이 있어야 화료할 수 있습니다',
      '도라는 역이 아닙니다',
      '리치는 멘젠에서만 가능합니다',
      '울면 조건이 바뀔 수 있습니다',
    ]) {
      expect(screen.getByText(ruleTitle)).toBeInTheDocument()
    }
  })
})

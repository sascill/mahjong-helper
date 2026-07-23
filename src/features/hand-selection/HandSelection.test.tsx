import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import HandSelection from './HandSelection'

const INITIAL_HAND_LABELS = [
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
]

const addTiles = async (labels: string[]) => {
  const user = userEvent.setup()

  for (const label of labels) {
    await user.click(screen.getByRole('button', { name: `${label} 추가` }))
  }

  return user
}

describe('손패 선택', () => {
  it('초기 상태에 34종 패와 빈 손패를 표시한다', () => {
    render(<HandSelection onAnalyze={vi.fn()} />)

    expect(screen.getAllByRole('button', { name: /추가$/ })).toHaveLength(34)
    expect(screen.getByText('0 / 13')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '분석하기' }),
    ).toBeDisabled()
  })

  it('패를 추가하고 선택한 패 한 장을 제거한다', async () => {
    const user = userEvent.setup()

    render(<HandSelection onAnalyze={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: '1만 추가' }))

    expect(screen.getByText('1 / 13')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: '선택한 1만 제거' }),
    )

    expect(screen.getByText('0 / 13')).toBeInTheDocument()
  })

  it('같은 패는 최대 4장까지만 선택한다', async () => {
    const user = userEvent.setup()

    render(<HandSelection onAnalyze={vi.fn()} />)

    const tileButton = screen.getByRole('button', { name: '1만 추가' })

    await user.click(tileButton)
    await user.click(tileButton)
    await user.click(tileButton)
    await user.click(tileButton)

    expect(tileButton).toBeDisabled()
    expect(screen.getByText('4 / 13')).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: '선택한 1만 제거' }),
    ).toHaveLength(4)
  })

  it('전체 손패는 최대 13장까지만 선택한다', async () => {
    render(<HandSelection onAnalyze={vi.fn()} />)

    await addTiles(INITIAL_HAND_LABELS)

    expect(screen.getByText('13 / 13')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5통 추가' })).toBeDisabled()
  })

  it('선택한 손패를 도메인 순서로 정렬해서 표시한다', async () => {
    render(<HandSelection onAnalyze={vi.fn()} />)

    await addTiles(['중', '2삭', '1만', '동', '9통', '1만'])

    const selectedHand = screen.getByRole('region', {
      name: '선택한 손패',
    })

    expect(
      within(selectedHand)
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label')),
    ).toEqual([
      '선택한 1만 제거',
      '선택한 1만 제거',
      '선택한 9통 제거',
      '선택한 2삭 제거',
      '선택한 동 제거',
      '선택한 중 제거',
    ])
  })

  it('장풍과 자풍을 독립적으로 선택하고 전체 입력을 초기화한다', async () => {
    const user = userEvent.setup()

    render(<HandSelection onAnalyze={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: '1만 추가' }))
    await user.selectOptions(screen.getByRole('combobox', { name: '장풍' }), [
      'east',
    ])
    await user.selectOptions(screen.getByRole('combobox', { name: '자풍' }), [
      'east',
    ])

    expect(screen.getByRole('combobox', { name: '장풍' })).toHaveValue('east')
    expect(screen.getByRole('combobox', { name: '자풍' })).toHaveValue('east')

    await user.click(screen.getByRole('button', { name: '초기화' }))

    expect(screen.getByText('0 / 13')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: '장풍' })).toHaveValue('')
    expect(screen.getByRole('combobox', { name: '자풍' })).toHaveValue('')
  })

  it('완성된 입력을 분석 콜백에 전달한다', async () => {
    const onAnalyze = vi.fn()

    render(<HandSelection onAnalyze={onAnalyze} />)

    const user = await addTiles(INITIAL_HAND_LABELS)
    const analyzeButton = screen.getByRole('button', { name: '분석하기' })

    expect(analyzeButton).toBeDisabled()

    await user.selectOptions(screen.getByRole('combobox', { name: '장풍' }), [
      'east',
    ])
    await user.selectOptions(screen.getByRole('combobox', { name: '자풍' }), [
      'south',
    ])

    expect(analyzeButton).toBeEnabled()

    await user.click(analyzeButton)

    expect(onAnalyze).toHaveBeenCalledWith({
      tiles: [
        '1m',
        '2m',
        '3m',
        '4m',
        '5m',
        '6m',
        '7m',
        '8m',
        '9m',
        '1p',
        '2p',
        '3p',
        '4p',
      ],
      roundWind: 'east',
      seatWind: 'south',
    })
  })
})

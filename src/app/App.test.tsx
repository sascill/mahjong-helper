import {
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import App from './App'

const TANYAO_HAND = [
  '2만',
  '3만',
  '4만',
  '3만',
  '4만',
  '5만',
  '4통',
  '5통',
  '6통',
  '6삭',
  '7삭',
  '5통',
  '5통',
]

const NO_RECOMMENDATION_HAND = [
  '1만',
  '9만',
  '1통',
  '9통',
  '1삭',
  '9삭',
  '동',
  '남',
  '서',
  '북',
  '백',
  '발',
  '중',
]

const completeHandInput = (tileLabels: string[]) => {
  for (const tileLabel of tileLabels) {
    fireEvent.click(
      screen.getByRole('button', { name: `${tileLabel} 추가` }),
    )
  }

  fireEvent.change(screen.getByRole('combobox', { name: '장풍' }), {
    target: { value: 'east' },
  })
  fireEvent.change(screen.getByRole('combobox', { name: '자풍' }), {
    target: { value: 'south' },
  })
}

describe('애플리케이션 진입점', () => {
  it('홈 화면을 표시한다', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Mahjong Helper' }),
    ).toBeInTheDocument()
  })

  it('공통 헤더와 주요 메뉴를 표시한다', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('banner')).toBeInTheDocument()

    const navigation = screen.getByRole('navigation', {
      name: '주요 메뉴',
    })

    expect(
      within(navigation).getByRole('link', { name: '홈' }),
    ).toHaveAttribute('href', '/')
    expect(
      within(navigation).getByRole('link', { name: '손패' }),
    ).toHaveAttribute('href', '/hand')
  })

  it('홈 화면에서 손패 선택 화면으로 이동한다', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    await user.click(
      screen.getByRole('link', { name: '첫 손패 분석하기' }),
    )

    expect(
      screen.getByRole('heading', { name: '첫 손패를 선택하세요' }),
    ).toBeInTheDocument()
  })

  it('손패를 분석하고 가까운 역을 표시한다', () => {
    render(
      <MemoryRouter initialEntries={['/hand']}>
        <App />
      </MemoryRouter>,
    )

    completeHandInput(TANYAO_HAND)
    fireEvent.click(screen.getByRole('button', { name: '분석하기' }))

    expect(
      screen.getByRole('heading', { name: '노려볼 만한 역' }),
    ).toBeInTheDocument()

    const analyzedHand = screen.getByRole('region', {
      name: '분석한 손패',
    })
    const tanyao = screen.getByRole('article', {
      name: '탕야오 추천',
    })

    expect(within(analyzedHand).getAllByRole('img')).toHaveLength(13)
    expect(within(analyzedHand).getByText('장풍 동')).toBeInTheDocument()
    expect(within(analyzedHand).getByText('자풍 남')).toBeInTheDocument()
    expect(within(tanyao).getByText('멘젠 1판')).toBeInTheDocument()
    expect(within(tanyao).getByText('완성까지 1장')).toBeInTheDocument()
    expect(
      within(tanyao).getByText(/숫자패 2~8/),
    ).toBeInTheDocument()
  })

  it('추천할 역이 없으면 빈 결과를 안내한다', () => {
    render(
      <MemoryRouter initialEntries={['/hand']}>
        <App />
      </MemoryRouter>,
    )

    completeHandInput(NO_RECOMMENDATION_HAND)
    fireEvent.click(screen.getByRole('button', { name: '분석하기' }))

    expect(
      screen.getByText('현재 기준으로 추천할 역이 없습니다.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: '손패 다시 선택하기' }),
    ).toHaveAttribute('href', '/hand')
  })

  it('분석 결과 없이 추천 경로에 접근하면 손패 선택으로 이동한다', () => {
    render(
      <MemoryRouter initialEntries={['/recommendations']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: '첫 손패를 선택하세요' }),
    ).toBeInTheDocument()
  })
})

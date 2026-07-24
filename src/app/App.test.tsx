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
  '2만',
  '5만',
  '8만',
  '2통',
  '5통',
  '8통',
  '2삭',
  '5삭',
  '8삭',
  '동',
  '남',
  '백',
  '중',
]

const completeHandInput = (tileLabels: string[]) => {
  const tileButtons = new Map(
    screen
      .getAllByRole('button', { name: /추가$/ })
      .map((button) => [button.getAttribute('aria-label'), button]),
  )

  for (const tileLabel of tileLabels) {
    const tileButton = tileButtons.get(`${tileLabel} 추가`)

    if (!tileButton) {
      throw new Error(`${tileLabel} 패 버튼을 찾을 수 없습니다.`)
    }

    fireEvent.click(tileButton)
  }

  fireEvent.click(screen.getByRole('button', { name: '자풍 다음' }))
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
    expect(
      screen.getByRole('link', { name: '역 찾아보기' }),
    ).toHaveAttribute('href', '/yaku')
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
    expect(
      within(navigation).getByRole('link', { name: '역 도감' }),
    ).toHaveAttribute('href', '/yaku')
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

    fireEvent.click(
      within(tanyao).getByRole('link', {
        name: '탕야오 상세 보기',
      }),
    )

    expect(
      screen.getByRole('heading', { name: '탕야오', level: 1 }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        '1·9·자패 없이 숫자패 2~8만으로 완성하는 역입니다.',
      ),
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

  it('분석 없이 역 목록과 상세를 탐색한다', () => {
    render(
      <MemoryRouter initialEntries={['/yaku']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: '역 도감', level: 1 }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('link', { name: '치또이츠 상세 보기' }),
    )

    expect(
      screen.getByRole('heading', { name: '치또이츠', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByText('멘젠 필수')).toBeInTheDocument()
  })

  it('역 상세의 공통 헤더에서 역 목록으로 이동할 수 있다', () => {
    render(
      <MemoryRouter initialEntries={['/yaku/chiitoitsu']}>
        <App />
      </MemoryRouter>,
    )

    const header = screen.getByRole('banner', {
      name: '애플리케이션 헤더',
    })
    const detail = screen.getByRole('main')

    expect(
      within(header).getByRole('link', { name: '역 목록으로' }),
    ).toHaveAttribute('href', '/yaku')
    expect(
      within(detail).queryByRole('link', { name: /역 목록으로/ }),
    ).not.toBeInTheDocument()
  })

  it('존재하지 않는 역 ID는 역 목록으로 이동한다', () => {
    render(
      <MemoryRouter initialEntries={['/yaku/not-found']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: '역 도감', level: 1 }),
    ).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import App from './App'

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
})

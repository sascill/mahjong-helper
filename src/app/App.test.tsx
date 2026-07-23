import { render, screen } from '@testing-library/react'
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
})

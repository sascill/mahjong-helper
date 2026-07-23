import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type {
  HandInput,
  TileId,
} from '../../domain/mahjong/hand'
import {
  HandAnalysisProvider,
  type HandAnalysisResult,
  useHandAnalysis,
} from './index'

const TANYAO_TENPAI: TileId[] = [
  '2m',
  '3m',
  '4m',
  '3m',
  '4m',
  '5m',
  '4p',
  '5p',
  '6p',
  '6s',
  '7s',
  '5p',
  '5p',
]

const INPUT: HandInput = {
  tiles: TANYAO_TENPAI,
  roundWind: 'east',
  seatWind: 'south',
}

function AnalysisConsumer({
  returnedResults,
}: {
  returnedResults: HandAnalysisResult[]
}) {
  const { analyze, result } = useHandAnalysis()

  return (
    <>
      <button
        type="button"
        onClick={() => returnedResults.push(analyze(INPUT))}
      >
        분석
      </button>
      <output>{result?.recommendations[0]?.yakuId ?? '결과 없음'}</output>
    </>
  )
}

function ConsumerWithoutProvider() {
  useHandAnalysis()

  return null
}

describe('손패 분석 기능', () => {
  it('입력과 추천 결과를 저장하고 저장한 결과를 반환한다', () => {
    const returnedResults: HandAnalysisResult[] = []

    render(
      <HandAnalysisProvider>
        <AnalysisConsumer returnedResults={returnedResults} />
      </HandAnalysisProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: '분석' }))

    expect(screen.getByText('tanyao')).toBeInTheDocument()
    expect(returnedResults).toHaveLength(1)
    expect(returnedResults[0].input).toEqual(INPUT)
    expect(returnedResults[0].input.tiles).not.toBe(INPUT.tiles)
    expect(returnedResults[0].recommendations[0]).toMatchObject({
      yakuId: 'tanyao',
      requiredTileCount: 1,
    })
  })

  it('공급자 밖에서 분석 상태를 사용할 수 없다', () => {
    expect(() => render(<ConsumerWithoutProvider />)).toThrow(
      '손패 분석 공급자 안에서 사용해야 합니다.',
    )
  })
})

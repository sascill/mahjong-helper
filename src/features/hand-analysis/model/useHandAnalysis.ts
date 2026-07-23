import { useContext } from 'react'

import { HandAnalysisContext } from './HandAnalysisContext'

export function useHandAnalysis() {
  const context = useContext(HandAnalysisContext)

  if (!context) {
    throw new Error('손패 분석 공급자 안에서 사용해야 합니다.')
  }

  return context
}

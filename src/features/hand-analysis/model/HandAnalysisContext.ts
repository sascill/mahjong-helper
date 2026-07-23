import { createContext } from 'react'

import type { HandInput } from '../../../domain/mahjong/hand'
import type { Recommendation } from '../../../domain/mahjong/recommendation'

export type HandAnalysisResult = {
  input: HandInput
  recommendations: Recommendation[]
}

export type HandAnalysisContextValue = {
  result: HandAnalysisResult | null
  analyze: (input: HandInput) => HandAnalysisResult
}

export const HandAnalysisContext =
  createContext<HandAnalysisContextValue | null>(null)

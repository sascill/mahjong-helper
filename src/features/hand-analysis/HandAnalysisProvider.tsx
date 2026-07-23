import {
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react'

import type { HandInput } from '../../domain/mahjong/hand'
import { recommendYaku } from '../../domain/mahjong/recommendation'
import {
  HandAnalysisContext,
  type HandAnalysisResult,
} from './model/HandAnalysisContext'

function HandAnalysisProvider({ children }: PropsWithChildren) {
  const [result, setResult] = useState<HandAnalysisResult | null>(null)

  const analyze = useCallback((input: HandInput): HandAnalysisResult => {
    const copiedInput = {
      ...input,
      tiles: [...input.tiles],
    }
    const nextResult = {
      input: copiedInput,
      recommendations: recommendYaku(copiedInput),
    }

    setResult(nextResult)

    return nextResult
  }, [])

  const contextValue = useMemo(
    () => ({
      result,
      analyze,
    }),
    [analyze, result],
  )

  return (
    <HandAnalysisContext.Provider value={contextValue}>
      {children}
    </HandAnalysisContext.Provider>
  )
}

export default HandAnalysisProvider

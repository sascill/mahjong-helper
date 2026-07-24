import { describe, expect, it } from 'vitest'

import {
  GLOSSARY_TERM_BY_ID,
  GLOSSARY_TERMS,
  getGlossaryTerm,
} from './index'

const INITIAL_TERM_LABELS = [
  '역',
  '판',
  '역만',
  '멘젠',
  '울기',
  '치',
  '퐁',
  '깡',
  '슌쯔',
  '커쯔',
  '또이쯔',
  '머리',
  '대기',
  '텐파이',
  '화료',
  '도라',
]

describe('마작 용어', () => {
  it('인라인 도움말에서 사용할 초기 용어를 제공한다', () => {
    expect(GLOSSARY_TERMS.map((term) => term.label)).toEqual(
      INITIAL_TERM_LABELS,
    )

    expect(getGlossaryTerm('menzen')).toEqual({
      id: 'menzen',
      label: '멘젠',
      aliases: ['문전'],
      description: '치·퐁·깡으로 울지 않고 손패를 닫은 상태입니다.',
    })
    expect(getGlossaryTerm('shuntsu').description).toContain(
      '같은 종류의 숫자패가 3장 연속',
    )
    expect(getGlossaryTerm('dora').description).toContain('역은 아닙니다')
  })

  it('용어 ID를 중복 없이 조회할 수 있다', () => {
    const ids = GLOSSARY_TERMS.map((term) => term.id)

    expect(new Set(ids).size).toBe(ids.length)

    for (const term of GLOSSARY_TERMS) {
      expect(GLOSSARY_TERM_BY_ID[term.id]).toBe(term)
      expect(getGlossaryTerm(term.id)).toBe(term)
    }
  })
})

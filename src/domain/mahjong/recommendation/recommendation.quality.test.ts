import { describe, expect, it } from 'vitest'

import type { HandInput, TileId } from '../hand'
import type { YakuId } from '../yaku'
import { recommendYaku } from './recommendation'

const createHandInput = (tiles: TileId[]): HandInput => ({
  tiles,
  roundWind: 'east',
  seatWind: 'south',
})

const QUALITY_CASES: readonly {
  name: string
  targetYakuId: YakuId
  tiles: TileId[]
}[] = [
  {
    name: '2~8 숫자패와 슌쯔가 중심인 손패',
    targetYakuId: 'tanyao',
    tiles: [
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
    ],
  },
  {
    name: '슌쯔 후보와 비역패 머리가 분명한 손패',
    targetYakuId: 'pinfu',
    tiles: [
      '2m',
      '3m',
      '4m',
      '5m',
      '6m',
      '3p',
      '4p',
      '5p',
      '6s',
      '7s',
      '8s',
      '4s',
      '4s',
    ],
  },
  {
    name: '가치패 또이쯔를 가진 손패',
    targetYakuId: 'yakuhai',
    tiles: [
      '1m',
      '2m',
      '3m',
      '4p',
      '5p',
      '6p',
      '7s',
      '8s',
      '9s',
      '2m',
      '3m',
      'white',
      'white',
    ],
  },
  {
    name: '서로 다른 또이쯔가 다섯 개인 손패',
    targetYakuId: 'chiitoitsu',
    tiles: [
      '1m',
      '1m',
      '2m',
      '2m',
      '4p',
      '4p',
      '5p',
      '5p',
      '6s',
      '6s',
      '7s',
      '8s',
      'east',
    ],
  },
  {
    name: '커쯔와 또이쯔 후보가 네 개인 손패',
    targetYakuId: 'toitoi',
    tiles: [
      '1m',
      '1m',
      '1m',
      '2p',
      '2p',
      '2p',
      '3s',
      '3s',
      'east',
      'east',
      'south',
      'south',
      'white',
    ],
  },
  {
    name: '한 무늬와 자패가 대부분인 손패',
    targetYakuId: 'honitsu',
    tiles: [
      '1m',
      '2m',
      '3m',
      '4m',
      '5m',
      '7m',
      '8m',
      'east',
      'east',
      'white',
      'white',
      'red',
      'green',
    ],
  },
  {
    name: '한 무늬의 123·456·789 후보가 모두 있는 손패',
    targetYakuId: 'ittsuu',
    tiles: [
      '1m',
      '2m',
      '4m',
      '5m',
      '7m',
      '8m',
      '3p',
      '4p',
      '5p',
      '6s',
      '7s',
      'east',
      'east',
    ],
  },
  {
    name: '같은 숫자 슌쯔 후보가 세 무늬에 있는 손패',
    targetYakuId: 'sanshoku-doujun',
    tiles: [
      '2m',
      '3m',
      '2p',
      '3p',
      '2s',
      '3s',
      '5m',
      '6m',
      '7m',
      '7p',
      '8p',
      'east',
      'east',
    ],
  },
  {
    name: '1·9·자패와 바깥 슌쯔 후보가 많은 손패',
    targetYakuId: 'chanta',
    tiles: [
      '1m',
      '2m',
      '7p',
      '8p',
      '1s',
      '1s',
      '1s',
      '9s',
      '9s',
      'east',
      'east',
      'white',
      'red',
    ],
  },
  {
    name: '서로 다른 1·9·자패가 열 종류인 손패',
    targetYakuId: 'kokushi-musou',
    tiles: [
      '1m',
      '1m',
      '1m',
      '1m',
      '9m',
      '1p',
      '9p',
      '1s',
      '9s',
      'east',
      'south',
      'white',
      'red',
    ],
  },
]

describe('역 추천 품질', () => {
  it.each(QUALITY_CASES)(
    '$name에서 $targetYakuId을 목표 역으로 제시한다',
    ({ targetYakuId, tiles }) => {
      const recommendations = recommendYaku(createHandInput(tiles))

      expect(recommendations.length).toBeLessThanOrEqual(3)
      expect(
        recommendations.map(({ yakuId }) => yakuId),
      ).toContain(targetYakuId)
    },
  )
})

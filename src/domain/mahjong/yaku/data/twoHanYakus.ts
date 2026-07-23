import type { Yaku } from '../types';
import {
  STANDARD_CLOSED_EXAMPLE,
  TRIPLET_EXAMPLE,
} from './examples';

export const TWO_HAN_YAKUS = [
  {
    id: 'double-riichi',
    name: '더블리치',
    value: {
      type: 'han',
      closed: 2,
      open: null,
    },
    summary: '자신의 첫 버림에 리치를 선언하는 멘젠 역입니다.',
    requirements: [
      '멘젠 상태여야 합니다.',
      '자신의 첫 버림패로 리치를 선언해야 합니다.',
      '선언 전에 치·퐁·깡이 발생하면 성립하지 않습니다.',
      '일반 리치와 중복되지 않습니다.',
    ],
    example: STANDARD_CLOSED_EXAMPLE,
  },
  {
    id: 'chiitoitsu',
    name: '치또이츠',
    value: {
      type: 'han',
      closed: 2,
      open: null,
    },
    summary: '서로 다른 패의 또이쯔 일곱 개로 완성하는 역입니다.',
    requirements: [
      '서로 다른 패의 또이쯔가 일곱 개 필요합니다.',
      '멘젠 상태에서만 성립합니다.',
      '같은 패 네 장을 두 개의 또이쯔로 사용할 수 없습니다.',
    ],
    example: [
      ['2m', '2m'],
      ['5m', '5m'],
      ['3p', '3p'],
      ['7p', '7p'],
      ['4s', '4s'],
      ['8s', '8s'],
      ['east', 'east'],
    ],
  },
  {
    id: 'ittsuu',
    name: '일기통관',
    value: {
      type: 'han',
      closed: 2,
      open: 1,
    },
    summary: '한 무늬에서 123·456·789 슌쯔를 모두 만드는 역입니다.',
    requirements: [
      '같은 무늬의 123·456·789 슌쯔가 모두 필요합니다.',
      '울면 1판으로 내려갑니다.',
    ],
    example: [
      ['1m', '2m', '3m'],
      ['4m', '5m', '6m'],
      ['7m', '8m', '9m'],
      ['2p', '3p', '4p'],
      ['5s', '5s'],
    ],
  },
  {
    id: 'sanshoku-doujun',
    name: '삼색동순',
    value: {
      type: 'han',
      closed: 2,
      open: 1,
    },
    summary: '만수·통수·삭수에 같은 숫자 슌쯔를 하나씩 만드는 역입니다.',
    requirements: [
      '세 무늬에 숫자가 같은 슌쯔가 각각 하나씩 필요합니다.',
      '울면 1판으로 내려갑니다.',
    ],
    example: [
      ['4m', '5m', '6m'],
      ['4p', '5p', '6p'],
      ['4s', '5s', '6s'],
      ['7m', '8m', '9m'],
      ['2p', '2p'],
    ],
  },
  {
    id: 'sanshoku-doukou',
    name: '삼색동각',
    value: {
      type: 'han',
      closed: 2,
      open: 2,
    },
    summary: '만수·통수·삭수에 같은 숫자 커쯔를 하나씩 만드는 역입니다.',
    requirements: [
      '세 무늬에 숫자가 같은 커쯔나 깡쯔가 각각 하나씩 필요합니다.',
      '치·퐁·깡을 해도 판수가 내려가지 않습니다.',
    ],
    example: [
      ['5m', '5m', '5m'],
      ['5p', '5p', '5p'],
      ['5s', '5s', '5s'],
      ['7m', '8m', '9m'],
      ['2p', '2p'],
    ],
  },
  {
    id: 'toitoi',
    name: '또이또이',
    value: {
      type: 'han',
      closed: 2,
      open: 2,
    },
    summary: '네 몸통을 모두 커쯔나 깡쯔로 만드는 역입니다.',
    requirements: [
      '네 몸통이 모두 커쯔 또는 깡쯔여야 합니다.',
      '슌쯔를 사용할 수 없습니다.',
      '치·퐁·깡을 해도 성립합니다.',
    ],
    example: TRIPLET_EXAMPLE,
  },
  {
    id: 'sanankou',
    name: '산안커',
    value: {
      type: 'han',
      closed: 2,
      open: 2,
    },
    summary: '직접 모은 안커나 안깡을 세 개 만드는 역입니다.',
    requirements: [
      '안커 또는 안깡이 세 개 필요합니다.',
      '나머지 몸통은 울어도 성립할 수 있습니다.',
      '론으로 완성한 커쯔는 안커로 계산하지 않습니다.',
    ],
    example: TRIPLET_EXAMPLE,
  },
  {
    id: 'sankantsu',
    name: '산깡쯔',
    value: {
      type: 'han',
      closed: 2,
      open: 2,
    },
    summary: '한 손패에서 깡쯔를 세 개 만드는 역입니다.',
    requirements: [
      '안깡·대명깡·가깡을 합쳐 깡쯔가 세 개 필요합니다.',
      '네 번째 몸통은 슌쯔나 커쯔여도 됩니다.',
    ],
    example: [
      ['2m', '2m', '2m', '2m'],
      ['5p', '5p', '5p', '5p'],
      ['7s', '7s', '7s', '7s'],
      ['1p', '2p', '3p'],
      ['white', 'white'],
    ],
  },
  {
    id: 'chanta',
    name: '찬타',
    value: {
      type: 'han',
      closed: 2,
      open: 1,
    },
    summary: '모든 몸통과 머리에 1·9·자패가 포함되는 역입니다.',
    requirements: [
      '모든 몸통과 머리에 1·9·자패 중 하나가 포함되어야 합니다.',
      '슌쯔와 자패를 각각 하나 이상 사용해야 합니다.',
      '울면 1판으로 내려갑니다.',
    ],
    example: [
      ['1m', '2m', '3m'],
      ['7p', '8p', '9p'],
      ['1s', '1s', '1s'],
      ['east', 'east', 'east'],
      ['white', 'white'],
    ],
  },
  {
    id: 'honroutou',
    name: '혼노두',
    value: {
      type: 'han',
      closed: 2,
      open: 2,
    },
    summary: '1·9 숫자패와 자패만으로 완성하는 역입니다.',
    requirements: [
      '모든 패가 1·9 또는 자패여야 합니다.',
      '숫자패와 자패를 각각 하나 이상 사용해야 합니다.',
      '또이또이 또는 치또이츠와 함께 성립합니다.',
    ],
    example: [
      ['1m', '1m', '1m'],
      ['9p', '9p', '9p'],
      ['east', 'east', 'east'],
      ['white', 'white', 'white'],
      ['green', 'green'],
    ],
  },
  {
    id: 'shousangen',
    name: '소삼원',
    value: {
      type: 'han',
      closed: 2,
      open: 2,
    },
    summary: '삼원패 두 종류를 몸통으로 만들고 나머지를 머리로 쓰는 역입니다.',
    requirements: [
      '백·발·중 중 두 종류를 커쯔나 깡쯔로 만들어야 합니다.',
      '남은 삼원패 한 종류를 머리로 사용해야 합니다.',
      '삼원패 몸통의 역패 판수는 별도로 더합니다.',
    ],
    example: [
      ['white', 'white', 'white'],
      ['green', 'green', 'green'],
      ['1m', '2m', '3m'],
      ['7p', '8p', '9p'],
      ['red', 'red'],
    ],
  },
] as const satisfies readonly Yaku[];

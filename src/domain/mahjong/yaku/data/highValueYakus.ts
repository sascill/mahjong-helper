import type { Yaku } from '../types';

export const HIGH_VALUE_YAKUS = [
  {
    id: 'ryanpeikou',
    name: '량페코',
    value: {
      type: 'han',
      closed: 3,
      open: null,
    },
    summary: '이페코 형태를 두 쌍 만드는 멘젠 역입니다.',
    requirements: [
      '멘젠 상태여야 합니다.',
      '완전히 같은 슌쯔 두 개의 조합이 두 쌍 필요합니다.',
      '이페코와 치또이츠는 함께 계산하지 않습니다.',
    ],
    example: [
      ['1m', '2m', '3m'],
      ['1m', '2m', '3m'],
      ['7p', '8p', '9p'],
      ['7p', '8p', '9p'],
      ['5s', '5s'],
    ],
  },
  {
    id: 'honitsu',
    name: '혼일색',
    value: {
      type: 'han',
      closed: 3,
      open: 2,
    },
    summary: '한 종류의 숫자패와 자패만으로 완성하는 역입니다.',
    requirements: [
      '만수·통수·삭수 중 한 종류만 사용해야 합니다.',
      '선택한 숫자패 종류와 자패를 함께 사용해야 합니다.',
      '울면 2판으로 내려갑니다.',
    ],
    example: [
      ['1m', '2m', '3m'],
      ['4m', '5m', '6m'],
      ['7m', '8m', '9m'],
      ['east', 'east', 'east'],
      ['white', 'white'],
    ],
  },
  {
    id: 'junchan',
    name: '준찬타',
    value: {
      type: 'han',
      closed: 3,
      open: 2,
    },
    summary: '모든 몸통과 머리에 1·9를 포함하고 자패를 쓰지 않는 역입니다.',
    requirements: [
      '모든 몸통과 머리에 1 또는 9가 포함되어야 합니다.',
      '자패를 사용할 수 없습니다.',
      '슌쯔를 하나 이상 사용해야 합니다.',
      '울면 2판으로 내려갑니다.',
    ],
    example: [
      ['1m', '2m', '3m'],
      ['7m', '8m', '9m'],
      ['1p', '2p', '3p'],
      ['9s', '9s', '9s'],
      ['1p', '1p'],
    ],
  },
  {
    id: 'chinitsu',
    name: '청일색',
    value: {
      type: 'han',
      closed: 6,
      open: 5,
    },
    summary: '자패 없이 한 종류의 숫자패만으로 완성하는 역입니다.',
    requirements: [
      '만수·통수·삭수 중 한 종류만 사용해야 합니다.',
      '자패를 사용할 수 없습니다.',
      '울면 5판으로 내려갑니다.',
    ],
    example: [
      ['1m', '2m', '3m'],
      ['3m', '4m', '5m'],
      ['5m', '6m', '7m'],
      ['7m', '8m', '9m'],
      ['5m', '5m'],
    ],
  },
] as const satisfies readonly Yaku[];

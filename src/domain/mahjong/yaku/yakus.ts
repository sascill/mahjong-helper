import type { Yaku } from './types';

export const YAKUS = [
  {
    id: 'tanyao',
    name: '탕야오',
    han: {
      closed: 1,
      open: 1,
    },
    summary: '1·9·자패 없이 숫자패 2~8만으로 완성하는 역입니다.',
    requirements: [
      '모든 패가 숫자패 2~8이어야 합니다.',
      '1·9·자패를 사용할 수 없습니다.',
    ],
    example: [
      ['2m', '3m', '4m'],
      ['4p', '5p', '6p'],
      ['3s', '4s', '5s'],
      ['6s', '7s', '8s'],
      ['5m', '5m'],
    ],
  },
  {
    id: 'chiitoitsu',
    name: '치또이츠',
    han: {
      closed: 2,
      open: null,
    },
    summary: '서로 다른 패의 또이쯔 일곱 개로 완성하는 역입니다.',
    requirements: [
      '서로 다른 패의 또이쯔가 일곱 개 필요합니다.',
      '멘젠 상태에서만 성립합니다.',
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
    id: 'honitsu',
    name: '혼일색',
    han: {
      closed: 3,
      open: 2,
    },
    summary: '한 종류의 숫자패와 자패만으로 완성하는 역입니다.',
    requirements: [
      '만수·통수·삭수 중 한 종류만 사용해야 합니다.',
      '선택한 숫자패 종류와 자패를 함께 사용할 수 있습니다.',
    ],
    example: [
      ['1m', '2m', '3m'],
      ['4m', '5m', '6m'],
      ['7m', '8m', '9m'],
      ['east', 'east', 'east'],
      ['white', 'white'],
    ],
  },
] as const satisfies readonly Yaku[];

import type { Yaku } from '../types';
import { STANDARD_CLOSED_EXAMPLE } from './examples';

export const ONE_HAN_YAKUS = [
  {
    id: 'riichi',
    name: '리치',
    value: {
      type: 'han',
      closed: 1,
      open: null,
    },
    summary: '멘젠 텐파이 상태에서 리치를 선언하고 화료하는 역입니다.',
    requirements: [
      '멘젠 상태여야 합니다.',
      '텐파이 상태에서 1,000점 봉을 내고 리치를 선언해야 합니다.',
      '리치 선언 뒤 손패 구성을 바꾸지 않고 화료해야 합니다.',
    ],
    example: STANDARD_CLOSED_EXAMPLE,
  },
  {
    id: 'ippatsu',
    name: '일발',
    value: {
      type: 'han',
      closed: 1,
      open: null,
    },
    summary: '리치 선언 후 한 바퀴 안에 방해 없이 화료하는 역입니다.',
    requirements: [
      '리치가 성립한 상태여야 합니다.',
      '리치 선언 후 자신의 다음 버림 전까지 화료해야 합니다.',
      '그사이에 치·퐁·깡이 발생하면 성립하지 않습니다.',
    ],
    example: STANDARD_CLOSED_EXAMPLE,
  },
  {
    id: 'menzen-tsumo',
    name: '멘젠쯔모',
    value: {
      type: 'han',
      closed: 1,
      open: null,
    },
    summary: '멘젠 상태의 손패를 직접 뽑은 패로 완성하는 역입니다.',
    requirements: [
      '멘젠 상태여야 합니다.',
      '론이 아니라 쯔모로 화료해야 합니다.',
    ],
    example: STANDARD_CLOSED_EXAMPLE,
  },
  {
    id: 'pinfu',
    name: '핑후',
    value: {
      type: 'han',
      closed: 1,
      open: null,
    },
    summary: '모든 몸통이 슌쯔이고 양면대기로 완성하는 멘젠 역입니다.',
    requirements: [
      '멘젠 상태여야 합니다.',
      '네 몸통이 모두 슌쯔여야 합니다.',
      '머리가 삼원패·자풍·장풍이면 안 됩니다.',
      '양면대기로 슌쯔를 완성해야 합니다.',
    ],
    example: [
      ['1m', '2m', '3m'],
      ['4m', '5m', '6m'],
      ['2p', '3p', '4p'],
      ['6s', '7s', '8s'],
      ['5p', '5p'],
    ],
  },
  {
    id: 'iipeikou',
    name: '이페코',
    value: {
      type: 'han',
      closed: 1,
      open: null,
    },
    summary: '같은 무늬의 같은 숫자 슌쯔를 두 개 만드는 멘젠 역입니다.',
    requirements: [
      '멘젠 상태여야 합니다.',
      '완전히 같은 슌쯔가 두 개 있어야 합니다.',
    ],
    example: [
      ['1m', '2m', '3m'],
      ['1m', '2m', '3m'],
      ['4p', '5p', '6p'],
      ['7s', '8s', '9s'],
      ['5p', '5p'],
    ],
  },
  {
    id: 'tanyao',
    name: '탕야오',
    value: {
      type: 'han',
      closed: 1,
      open: 1,
    },
    summary: '1·9·자패 없이 숫자패 2~8만으로 완성하는 역입니다.',
    requirements: [
      '모든 패가 숫자패 2~8이어야 합니다.',
      '1·9·자패를 사용할 수 없습니다.',
      '치·퐁·깡을 해도 성립합니다.',
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
    id: 'yakuhai',
    name: '역패',
    value: {
      type: 'han',
      closed: 1,
      open: 1,
    },
    summary: '삼원패·자풍·장풍 중 하나를 커쯔나 깡쯔로 만드는 역입니다.',
    requirements: [
      '백·발·중, 자신의 자풍 또는 현재 장풍을 세 장 이상 모아야 합니다.',
      '해당 패의 커쯔나 깡쯔 하나마다 1판입니다.',
      '자풍과 장풍이 같으면 해당 풍패는 2판입니다.',
    ],
    example: [
      ['1m', '2m', '3m'],
      ['4p', '5p', '6p'],
      ['7s', '8s', '9s'],
      ['white', 'white', 'white'],
      ['5m', '5m'],
    ],
  },
  {
    id: 'chankan',
    name: '창깡',
    value: {
      type: 'han',
      closed: 1,
      open: 1,
    },
    summary: '다른 사람이 가깡하려는 패로 론하는 상황역입니다.',
    requirements: [
      '다른 플레이어가 퐁한 몸통에 패를 더해 가깡해야 합니다.',
      '가깡에 사용한 패가 자신의 화료패여야 합니다.',
      '안깡한 패로는 창깡할 수 없습니다.',
    ],
    example: STANDARD_CLOSED_EXAMPLE,
  },
  {
    id: 'rinshan-kaihou',
    name: '영상개화',
    value: {
      type: 'han',
      closed: 1,
      open: 1,
    },
    summary: '깡 직후 영상패를 뽑아 화료하는 상황역입니다.',
    requirements: [
      '깡을 선언한 뒤 영상패를 뽑아야 합니다.',
      '그 영상패로 쯔모 화료해야 합니다.',
    ],
    example: STANDARD_CLOSED_EXAMPLE,
  },
  {
    id: 'haitei',
    name: '해저로월',
    value: {
      type: 'han',
      closed: 1,
      open: 1,
    },
    summary: '패산의 마지막 쯔모패로 화료하는 상황역입니다.',
    requirements: [
      '패산에서 가져오는 마지막 패여야 합니다.',
      '마지막 패를 직접 뽑아 쯔모 화료해야 합니다.',
    ],
    example: STANDARD_CLOSED_EXAMPLE,
  },
  {
    id: 'houtei',
    name: '하저로어',
    value: {
      type: 'han',
      closed: 1,
      open: 1,
    },
    summary: '마지막 쯔모 뒤에 나온 마지막 버림패로 론하는 상황역입니다.',
    requirements: [
      '패산의 마지막 패를 뽑은 플레이어가 버린 패여야 합니다.',
      '그 마지막 버림패로 론 화료해야 합니다.',
    ],
    example: STANDARD_CLOSED_EXAMPLE,
  },
] as const satisfies readonly Yaku[];

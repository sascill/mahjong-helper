export const GLOSSARY_TERMS = [
  {
    id: 'yaku',
    label: '역',
    aliases: [],
    description: '화료하기 위해 필요한 인정 조건입니다. 패 모양이 완성되어도 역이 하나 이상 있어야 화료할 수 있습니다.',
  },
  {
    id: 'han',
    label: '판',
    aliases: ['한'],
    description: '역과 도라로 올라가는 점수 단위입니다. 판이 높을수록 기본 점수가 커집니다.',
  },
  {
    id: 'yakuman',
    label: '역만',
    aliases: [],
    description: '가장 높은 등급의 특수한 역입니다. 일반 판수 계산 대신 큰 고정 점수로 취급합니다.',
  },
  {
    id: 'menzen',
    label: '멘젠',
    aliases: ['문전'],
    description: '치·퐁·깡으로 울지 않고 손패를 닫은 상태입니다.',
  },
  {
    id: 'open',
    label: '울기',
    aliases: ['후로'],
    description: '다른 사람이 버린 패를 치·퐁·깡으로 가져와 내 손패에 쓰는 행동입니다.',
  },
  {
    id: 'chi',
    label: '치',
    aliases: [],
    description: '왼쪽 사람이 버린 패를 가져와 같은 종류의 연속된 숫자패 3장을 만드는 울기입니다.',
  },
  {
    id: 'pon',
    label: '퐁',
    aliases: [],
    description: '다른 사람이 버린 패를 가져와 같은 패 3장을 만드는 울기입니다.',
  },
  {
    id: 'kan',
    label: '깡',
    aliases: [],
    description: '같은 패 4장을 하나의 묶음으로 공개하거나 선언하는 행동입니다.',
  },
  {
    id: 'shuntsu',
    label: '슌쯔',
    aliases: ['순자'],
    description: '같은 종류의 숫자패가 3장 연속으로 모인 몸통입니다. 예: 3만·4만·5만',
  },
  {
    id: 'koutsu',
    label: '커쯔',
    aliases: ['각자'],
    description: '같은 패 3장이 모인 몸통입니다. 예: 동·동·동',
  },
  {
    id: 'toitsu',
    label: '또이쯔',
    aliases: ['대자'],
    description: '같은 패 2장이 모인 묶음입니다. 완성 손패에서는 보통 머리로 사용합니다.',
  },
  {
    id: 'jantou',
    label: '머리',
    aliases: ['작두'],
    description: '완성 손패에 필요한 같은 패 2장 묶음입니다.',
  },
  {
    id: 'machi',
    label: '대기',
    aliases: [],
    description: '텐파이 상태에서 어떤 패가 오면 화료할 수 있는지를 나타내는 기다림 형태입니다.',
  },
  {
    id: 'tenpai',
    label: '텐파이',
    aliases: [],
    description: '필요한 패 한 장만 오면 화료할 수 있는 상태입니다.',
  },
  {
    id: 'agari',
    label: '화료',
    aliases: ['오름'],
    description: '손패를 완성해 점수를 받는 것입니다. 쯔모나 론으로 화료할 수 있습니다.',
  },
  {
    id: 'tsumo',
    label: '쯔모',
    aliases: [],
    description: '자신이 직접 뽑은 패로 화료하는 것입니다.',
  },
  {
    id: 'ron',
    label: '론',
    aliases: [],
    description: '다른 사람이 버린 패로 화료하는 것입니다.',
  },
  {
    id: 'dora',
    label: '도라',
    aliases: [],
    description: '점수를 올려 주는 보너스 패입니다. 도라만으로는 화료 조건이 되지 않으며 역은 아닙니다.',
  },
] as const

export type GlossaryTerm = (typeof GLOSSARY_TERMS)[number]
export type GlossaryTermId = GlossaryTerm['id']

export const GLOSSARY_TERM_BY_ID = Object.freeze(
  Object.fromEntries(GLOSSARY_TERMS.map((term) => [term.id, term])),
) as Readonly<Record<GlossaryTermId, GlossaryTerm>>

export const getGlossaryTerm = (id: GlossaryTermId): GlossaryTerm =>
  GLOSSARY_TERM_BY_ID[id]

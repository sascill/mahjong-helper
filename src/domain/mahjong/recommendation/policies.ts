import type { YakuId } from '../yaku';
import type { HandFeatures } from './handFeatures';

export type RecommendationRole = 'primary' | 'upgrade' | 'catalog-only';

export type RecommendationTargetYakuId =
  | 'tanyao'
  | 'pinfu'
  | 'yakuhai'
  | 'chiitoitsu'
  | 'toitoi'
  | 'honitsu'
  | 'ittsuu'
  | 'sanshoku-doujun'
  | 'chanta'
  | 'kokushi-musou';

export type RecommendationPolicy = {
  yakuId: RecommendationTargetYakuId;
  isEligible: (features: HandFeatures) => boolean;
  createReason: (features: HandFeatures) => string;
};

export const YAKU_RECOMMENDATION_ROLES = {
  riichi: 'catalog-only',
  ippatsu: 'catalog-only',
  'menzen-tsumo': 'catalog-only',
  pinfu: 'primary',
  iipeikou: 'upgrade',
  tanyao: 'primary',
  yakuhai: 'primary',
  chankan: 'catalog-only',
  'rinshan-kaihou': 'catalog-only',
  haitei: 'catalog-only',
  houtei: 'catalog-only',
  'double-riichi': 'catalog-only',
  chiitoitsu: 'primary',
  ittsuu: 'primary',
  'sanshoku-doujun': 'primary',
  'sanshoku-doukou': 'upgrade',
  toitoi: 'primary',
  sanankou: 'upgrade',
  sankantsu: 'catalog-only',
  chanta: 'primary',
  honroutou: 'upgrade',
  shousangen: 'upgrade',
  ryanpeikou: 'upgrade',
  honitsu: 'primary',
  junchan: 'upgrade',
  chinitsu: 'upgrade',
  tenhou: 'catalog-only',
  chiihou: 'catalog-only',
  'kokushi-musou': 'primary',
  'chuuren-poutou': 'upgrade',
  ryuuiisou: 'upgrade',
  suuankou: 'upgrade',
  suukantsu: 'catalog-only',
  chinroutou: 'upgrade',
  tsuuiisou: 'upgrade',
  daisangen: 'upgrade',
  shousuushii: 'upgrade',
  daisuushii: 'upgrade',
} as const satisfies Record<YakuId, RecommendationRole>;

const SUIT_NAMES = {
  man: '만수',
  pin: '통수',
  sou: '삭수',
} as const;

export const RECOMMENDATION_POLICIES = [
  {
    yakuId: 'tanyao',
    isEligible: ({ terminalOrHonorCount }) => terminalOrHonorCount <= 3,
    createReason: ({ terminalOrHonorCount }) =>
      `1·9·자패가 ${terminalOrHonorCount}장뿐이라 숫자패 2~8 중심으로 만들기 좋습니다.`,
  },
  {
    yakuId: 'pinfu',
    isEligible: ({ sequenceCandidateCount, pairCandidateCount }) =>
      sequenceCandidateCount >= 3 && pairCandidateCount >= 1,
    createReason: ({ sequenceCandidateCount, pairCandidateCount }) =>
      `슌쯔 후보가 ${sequenceCandidateCount}개이고 또이쯔·커쯔 후보가 ${pairCandidateCount}개 있습니다.`,
  },
  {
    yakuId: 'yakuhai',
    isEligible: ({ valuePairCount }) => valuePairCount >= 1,
    createReason: ({ valuePairCount }) =>
      `두 장 이상 모인 가치패가 ${valuePairCount}종 있습니다.`,
  },
  {
    yakuId: 'chiitoitsu',
    isEligible: ({ exactPairCount }) => exactPairCount >= 4,
    createReason: ({ exactPairCount }) =>
      `정확히 두 장인 또이쯔가 ${exactPairCount}개 있습니다.`,
  },
  {
    yakuId: 'toitoi',
    isEligible: ({ pairCandidateCount }) => pairCandidateCount >= 3,
    createReason: ({ pairCandidateCount, tripletCount }) =>
      `또이쯔·커쯔 후보가 ${pairCandidateCount}개이고 그중 커쯔가 ${tripletCount}개 있습니다.`,
  },
  {
    yakuId: 'honitsu',
    isEligible: ({
      dominantSuitCount,
      dominantSuitAndHonorCount,
      honorCount,
    }) =>
      dominantSuitCount >= 5 &&
      dominantSuitAndHonorCount >= 9 &&
      honorCount >= 1,
    createReason: ({
      dominantSuit,
      dominantSuitAndHonorCount,
      honorCount,
    }) =>
      `${SUIT_NAMES[dominantSuit]}와 자패가 ${dominantSuitAndHonorCount}장이고 자패가 ${honorCount}장 있습니다.`,
  },
  {
    yakuId: 'ittsuu',
    isEligible: ({ ittsuuSegmentCandidateCount }) =>
      ittsuuSegmentCandidateCount >= 2,
    createReason: ({ ittsuuSegmentCandidateCount }) =>
      `한 무늬의 123·456·789 구간 중 ${ittsuuSegmentCandidateCount}개가 슌쯔 후보입니다.`,
  },
  {
    yakuId: 'sanshoku-doujun',
    isEligible: ({ sanshokuSuitCandidateCount }) =>
      sanshokuSuitCandidateCount >= 2,
    createReason: ({ sanshokuSuitCandidateCount }) =>
      `같은 숫자 구간이 ${sanshokuSuitCandidateCount}가지 무늬에서 슌쯔 후보입니다.`,
  },
  {
    yakuId: 'chanta',
    isEligible: ({
      terminalOrHonorCount,
      outsideSequenceCandidateCount,
    }) =>
      terminalOrHonorCount >= 5 && outsideSequenceCandidateCount >= 1,
    createReason: ({
      terminalOrHonorCount,
      outsideSequenceCandidateCount,
    }) =>
      `1·9·자패가 ${terminalOrHonorCount}장이고 123·789 슌쯔 후보가 ${outsideSequenceCandidateCount}개 있습니다.`,
  },
  {
    yakuId: 'kokushi-musou',
    isEligible: ({ orphanUniqueCount }) => orphanUniqueCount >= 9,
    createReason: ({ orphanUniqueCount }) =>
      `서로 다른 1·9·자패가 ${orphanUniqueCount}종 있습니다.`,
  },
] as const satisfies readonly RecommendationPolicy[];

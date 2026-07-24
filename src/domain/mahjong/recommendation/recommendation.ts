import {
  validateHandInput,
  type HandInput,
} from '../hand';
import type { YakuId } from '../yaku';
import {
  evaluateChanta,
  evaluateChiitoitsu,
  evaluateChinitsu,
  evaluateChinroutou,
  evaluateChuurenPoutou,
  evaluateDaisangen,
  evaluateDaisuushii,
  evaluateHonitsu,
  evaluateHonroutou,
  evaluateIipeikou,
  evaluateIttsuu,
  evaluateJunchan,
  evaluateKokushiMusou,
  evaluatePinfu,
  evaluateRyanpeikou,
  evaluateRyuuiisou,
  evaluateSanankou,
  evaluateSanshokuDoujun,
  evaluateSanshokuDoukou,
  evaluateShousangen,
  evaluateShousuushii,
  evaluateSuuankou,
  evaluateTanyao,
  evaluateToitoi,
  evaluateTsuuiisou,
  evaluateYakuhai,
} from './evaluators';
import type {
  Recommendation,
  RecommendationDistance,
  YakuEvaluation,
} from './types';

type YakuEvaluator = (input: HandInput) => YakuEvaluation;

const MAX_RECOMMENDATION_COUNT = 3;

const RECOMMENDATION_PRIORITY = [
  'tanyao',
  'chiitoitsu',
  'honitsu',
  'pinfu',
  'iipeikou',
  'yakuhai',
  'ittsuu',
  'sanshoku-doujun',
  'sanshoku-doukou',
  'toitoi',
  'sanankou',
  'chanta',
  'honroutou',
  'shousangen',
  'ryanpeikou',
  'junchan',
  'chinitsu',
  'kokushi-musou',
  'chuuren-poutou',
  'ryuuiisou',
  'suuankou',
  'chinroutou',
  'tsuuiisou',
  'daisangen',
  'shousuushii',
  'daisuushii',
] as const satisfies readonly YakuId[];

const EVALUATORS = {
  riichi: null,
  ippatsu: null,
  'menzen-tsumo': null,
  pinfu: evaluatePinfu,
  iipeikou: evaluateIipeikou,
  tanyao: evaluateTanyao,
  yakuhai: evaluateYakuhai,
  chankan: null,
  'rinshan-kaihou': null,
  haitei: null,
  houtei: null,
  'double-riichi': null,
  chiitoitsu: evaluateChiitoitsu,
  ittsuu: evaluateIttsuu,
  'sanshoku-doujun': evaluateSanshokuDoujun,
  'sanshoku-doukou': evaluateSanshokuDoukou,
  toitoi: evaluateToitoi,
  sanankou: evaluateSanankou,
  sankantsu: null,
  chanta: evaluateChanta,
  honroutou: evaluateHonroutou,
  shousangen: evaluateShousangen,
  ryanpeikou: evaluateRyanpeikou,
  honitsu: evaluateHonitsu,
  junchan: evaluateJunchan,
  chinitsu: evaluateChinitsu,
  tenhou: null,
  chiihou: null,
  'kokushi-musou': evaluateKokushiMusou,
  'chuuren-poutou': evaluateChuurenPoutou,
  ryuuiisou: evaluateRyuuiisou,
  suuankou: evaluateSuuankou,
  suukantsu: null,
  chinroutou: evaluateChinroutou,
  tsuuiisou: evaluateTsuuiisou,
  daisangen: evaluateDaisangen,
  shousuushii: evaluateShousuushii,
  daisuushii: evaluateDaisuushii,
} satisfies Record<YakuId, YakuEvaluator | null>;

const RECOMMENDABLE_EVALUATORS = (
  Object.entries(EVALUATORS) as [YakuId, YakuEvaluator | null][]
).filter(
  (entry): entry is [YakuId, YakuEvaluator] => entry[1] !== null,
);

const isRecommendationDistance = (
  distance: number,
): distance is RecommendationDistance =>
  distance >= 1 && distance <= 5;

const getPriority = (yakuId: YakuId): number => {
  const priority = RECOMMENDATION_PRIORITY.indexOf(
    yakuId as (typeof RECOMMENDATION_PRIORITY)[number],
  );

  if (priority === -1) {
    throw new Error(`추천 우선순위가 정의되지 않은 역입니다: ${yakuId}`);
  }

  return priority;
};

const toRecommendation = (
  evaluation: YakuEvaluation,
): Recommendation | null => {
  if (!isRecommendationDistance(evaluation.requiredTileCount)) {
    return null;
  }

  return {
    yakuId: evaluation.yakuId,
    requiredTileCount: evaluation.requiredTileCount,
    reason: evaluation.reason,
  };
};

const assertValidHandInput = (input: HandInput): void => {
  if (!validateHandInput(input).valid) {
    throw new Error('유효하지 않은 손패입니다.');
  }
};

export function evaluateYaku(
  input: HandInput,
  yakuId: YakuId,
): YakuEvaluation | null {
  assertValidHandInput(input);

  const evaluator = EVALUATORS[yakuId];

  return evaluator ? evaluator(input) : null;
}

export function recommendYaku(input: HandInput): Recommendation[] {
  assertValidHandInput(input);

  return RECOMMENDABLE_EVALUATORS.map(([, evaluator]) =>
    evaluator(input),
  )
    .map(toRecommendation)
    .filter((result): result is Recommendation => result !== null)
    .sort(
      (left, right) =>
        left.requiredTileCount - right.requiredTileCount ||
        getPriority(left.yakuId) - getPriority(right.yakuId),
    )
    .slice(0, MAX_RECOMMENDATION_COUNT);
}

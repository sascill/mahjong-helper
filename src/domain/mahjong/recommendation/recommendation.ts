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
import { extractHandFeatures } from './handFeatures';
import { RECOMMENDATION_POLICIES } from './policies';

type YakuEvaluator = (input: HandInput) => YakuEvaluation;

const MAX_RECOMMENDATION_COUNT = 3;
const OUTSIDE_RECOMMENDATION_DISTANCE = 4;

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

const isRecommendationDistance = (
  distance: number,
): distance is RecommendationDistance =>
  distance >= 1 && distance <= 3;

const toRecommendation = (
  evaluation: YakuEvaluation,
  reason: string,
): Recommendation | null => {
  if (!isRecommendationDistance(evaluation.requiredTileCount)) {
    return null;
  }

  return {
    yakuId: evaluation.yakuId,
    requiredTileCount: evaluation.requiredTileCount,
    reason,
  };
};

const normalizeEvaluation = (
  evaluation: YakuEvaluation,
): YakuEvaluation => ({
  ...evaluation,
  requiredTileCount: Math.min(
    evaluation.requiredTileCount,
    OUTSIDE_RECOMMENDATION_DISTANCE,
  ),
});

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

  return evaluator ? normalizeEvaluation(evaluator(input)) : null;
}

export function recommendYaku(input: HandInput): Recommendation[] {
  assertValidHandInput(input);

  const features = extractHandFeatures(input);

  return RECOMMENDATION_POLICIES.filter(({ isEligible }) =>
    isEligible(features),
  )
    .map(({ yakuId, createReason }, priority) => {
      const evaluator = EVALUATORS[yakuId];

      if (!evaluator) {
        throw new Error(`목표 역 평가기가 정의되지 않았습니다: ${yakuId}`);
      }

      return {
        evaluation: normalizeEvaluation(evaluator(input)),
        priority,
        reason: createReason(features),
      };
    })
    .map(({ evaluation, priority, reason }) => ({
      recommendation: toRecommendation(evaluation, reason),
      priority,
    }))
    .filter(
      (
        result,
      ): result is {
        recommendation: Recommendation;
        priority: number;
      } => result.recommendation !== null,
    )
    .sort(
      (left, right) =>
        left.recommendation.requiredTileCount -
          right.recommendation.requiredTileCount ||
        left.priority - right.priority,
    )
    .slice(0, MAX_RECOMMENDATION_COUNT)
    .map(({ recommendation }) => recommendation);
}

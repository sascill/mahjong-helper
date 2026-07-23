import {
  validateHandInput,
  type HandInput,
} from '../hand';
import type { YakuId } from '../yaku';
import {
  evaluateChiitoitsu,
  evaluateHonitsu,
  evaluateTanyao,
} from './evaluators';
import type {
  Recommendation,
  RecommendationDistance,
  YakuEvaluation,
} from './types';

const MAX_RECOMMENDATION_COUNT = 3;

const RECOMMENDATION_PRIORITY: readonly YakuId[] = [
  'tanyao',
  'chiitoitsu',
  'honitsu',
];

const EVALUATORS = [
  evaluateTanyao,
  evaluateChiitoitsu,
  evaluateHonitsu,
];

const isRecommendationDistance = (
  distance: number,
): distance is RecommendationDistance =>
  distance >= 1 && distance <= 5;

const getPriority = (yakuId: YakuId): number => {
  const priority = RECOMMENDATION_PRIORITY.indexOf(yakuId);

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

export function recommendYaku(input: HandInput): Recommendation[] {
  if (!validateHandInput(input).valid) {
    throw new Error('유효하지 않은 손패입니다.');
  }

  return EVALUATORS.map((evaluate) => evaluate(input))
    .map(toRecommendation)
    .filter((result): result is Recommendation => result !== null)
    .sort(
      (left, right) =>
        left.requiredTileCount - right.requiredTileCount ||
        getPriority(left.yakuId) - getPriority(right.yakuId),
    )
    .slice(0, MAX_RECOMMENDATION_COUNT);
}

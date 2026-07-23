import type { YakuId } from '../yaku';

export type RecommendationDistance = 1 | 2 | 3 | 4 | 5;

export type Recommendation = {
  yakuId: YakuId;
  requiredTileCount: RecommendationDistance;
  reason: string;
};

export type YakuEvaluation = {
  yakuId: YakuId;
  requiredTileCount: number;
  reason: string;
};

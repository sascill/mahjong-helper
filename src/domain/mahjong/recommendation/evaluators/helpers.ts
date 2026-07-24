import {
  TILES,
  type TileId,
} from '../../hand';
import type { YakuId } from '../../yaku';
import {
  ALL_MELDS,
  ALL_TILE_IDS,
  calculateStandardShapeDistance,
  type MeldCandidate,
} from '../lib/distance';
import type { YakuEvaluation } from '../types';

export const TERMINAL_TILE_IDS: readonly TileId[] = TILES.filter(
  ({ suit, value }) =>
    suit !== 'honor' && (value === 1 || value === 9),
).map(({ id }) => id);

export const TERMINAL_OR_HONOR_TILE_IDS: readonly TileId[] =
  TILES.filter(
    ({ suit, value }) =>
      suit === 'honor' || value === 1 || value === 9,
  ).map(({ id }) => id);

export const countTiles = (
  tiles: readonly TileId[],
  targetTileIds: readonly TileId[],
): number => {
  const targetTiles = new Set(targetTileIds);

  return tiles.filter((tileId) => targetTiles.has(tileId)).length;
};

export const createEvaluation = (
  yakuId: YakuId,
  requiredTileCount: number,
  reason: string,
): YakuEvaluation => ({
  yakuId,
  requiredTileCount,
  reason,
});

export const createShapeEvaluation = (
  yakuId: YakuId,
  requiredTileCount: number,
  description: string,
): YakuEvaluation => {
  const retainedTileCount = 14 - requiredTileCount;
  const reason =
    requiredTileCount <= 5
      ? `${description} 완성형에 현재 패를 최대 ${retainedTileCount}장 유지할 수 있습니다.`
      : `${description} 완성형과 현재 손패의 거리가 추천 범위를 벗어납니다.`;

  return createEvaluation(yakuId, requiredTileCount, reason);
};

export const calculateRequiredPatternDistance = (
  tiles: readonly TileId[],
  patterns: readonly (readonly MeldCandidate[])[],
): number => {
  let bestDistance = 6;

  for (const requiredMelds of patterns) {
    bestDistance = Math.min(
      bestDistance,
      calculateStandardShapeDistance(tiles, {
        meldCandidates: ALL_MELDS,
        pairTileIds: ALL_TILE_IDS,
        requiredMelds,
      }),
    );

    if (bestDistance === 1) {
      break;
    }
  }

  return bestDistance;
};

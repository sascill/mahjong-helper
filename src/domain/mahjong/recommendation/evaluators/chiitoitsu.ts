import {
  TILES,
  type HandInput,
  type TileId,
} from '../../hand';
import { calculateSevenPairsDistance } from '../lib/distance';
import type { YakuEvaluation } from '../types';

const ALL_TILE_IDS = TILES.map(({ id }) => id);

const countPairs = (tiles: readonly TileId[]): number => {
  const counts = new Map<TileId, number>();

  for (const tileId of tiles) {
    counts.set(tileId, (counts.get(tileId) ?? 0) + 1);
  }

  return [...counts.values()].filter((count) => count >= 2).length;
};

export function evaluateChiitoitsu(
  input: HandInput,
): YakuEvaluation {
  const pairCount = countPairs(input.tiles);

  return {
    yakuId: 'chiitoitsu',
    requiredTileCount: calculateSevenPairsDistance(
      input.tiles,
      ALL_TILE_IDS,
    ),
    reason: `현재 또이쯔가 ${pairCount}개 있습니다.`,
  };
}

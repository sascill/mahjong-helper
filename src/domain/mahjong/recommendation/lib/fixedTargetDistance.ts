import type { TileId } from '../../hand';
import { createTileCounts } from './tileGroups';

export function calculateFixedTargetDistance(
  tiles: readonly TileId[],
  targetTiles: readonly TileId[],
): number {
  if (targetTiles.length !== 14) {
    throw new Error('고정 화료형은 14장이어야 합니다.');
  }

  const handCounts = createTileCounts(tiles);
  const targetCounts = createTileCounts(targetTiles);

  if (targetCounts.some((count) => count > 4)) {
    throw new Error('고정 화료형에서 같은 패는 네 장을 초과할 수 없습니다.');
  }

  const overlap = targetCounts.reduce(
    (total, targetCount, tileIndex) =>
      total + Math.min(targetCount, handCounts[tileIndex]),
    0,
  );

  return 14 - overlap;
}

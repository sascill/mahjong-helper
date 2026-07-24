import type { TileId } from '../../hand';
import {
  createTileCounts,
  getTileIndex,
} from './tileGroups';

export type SevenPairsOptions = {
  requiredTileSets?: readonly (readonly TileId[])[];
};

export function calculateSevenPairsDistance(
  tiles: readonly TileId[],
  allowedTileIds: readonly TileId[],
  options: SevenPairsOptions = {},
): number {
  if (allowedTileIds.length < 7) {
    return 14;
  }

  const handCounts = createTileCounts(tiles);
  const requiredTileSets = options.requiredTileSets ?? [];
  const retainedCounts = allowedTileIds.map((tileId) => ({
    tileId,
    count: Math.min(handCounts[getTileIndex(tileId)], 2),
  }));

  if (requiredTileSets.length === 0) {
    const retainedTileCount = retainedCounts
      .map(({ count }) => count)
      .sort((left, right) => right - left)
      .slice(0, 7)
      .reduce((total, count) => total + count, 0);

    return 14 - retainedTileCount;
  }

  let maximumRetainedTileCount = 0;

  const searchPairs = (
    startIndex: number,
    selectedTileIds: TileId[],
    retainedTileCount: number,
  ): void => {
    if (selectedTileIds.length === 7) {
      const includesRequiredSets = requiredTileSets.every((tileIds) =>
        tileIds.some((tileId) => selectedTileIds.includes(tileId)),
      );

      if (includesRequiredSets) {
        maximumRetainedTileCount = Math.max(
          maximumRetainedTileCount,
          retainedTileCount,
        );
      }

      return;
    }

    const remainingPairCount = 7 - selectedTileIds.length;

    for (
      let index = startIndex;
      index <= retainedCounts.length - remainingPairCount;
      index += 1
    ) {
      const candidate = retainedCounts[index];

      searchPairs(
        index + 1,
        [...selectedTileIds, candidate.tileId],
        retainedTileCount + candidate.count,
      );
    }
  };

  searchPairs(0, [], 0);

  return 14 - maximumRetainedTileCount;
}

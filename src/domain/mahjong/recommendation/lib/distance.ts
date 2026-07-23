import { TILES, type TileId } from '../../hand';

type TileGroup = readonly (readonly [
  tileIndex: number,
  count: number,
])[];

export type WinningShapeRules = {
  allowedTileIds: readonly TileId[];
  sequenceStartIds: readonly TileId[];
};

const TILE_INDEX_BY_ID = new Map<TileId, number>(
  TILES.map(({ id }, index) => [id, index]),
);

const getTileIndex = (tileId: TileId): number => {
  const tileIndex = TILE_INDEX_BY_ID.get(tileId);

  if (tileIndex === undefined) {
    throw new Error(`정의되지 않은 패입니다: ${tileId}`);
  }

  return tileIndex;
};

const createTileCounts = (tiles: readonly TileId[]): number[] => {
  const counts = Array<number>(TILES.length).fill(0);

  for (const tileId of tiles) {
    counts[getTileIndex(tileId)] += 1;
  }

  return counts;
};

const createMeldCandidates = (
  rules: WinningShapeRules,
): TileGroup[] => {
  const triplets: TileGroup[] = rules.allowedTileIds.map((tileId) => [
    [getTileIndex(tileId), 3],
  ]);
  const sequences: TileGroup[] = rules.sequenceStartIds.map((tileId) => {
    const startIndex = getTileIndex(tileId);

    return [
      [startIndex, 1],
      [startIndex + 1, 1],
      [startIndex + 2, 1],
    ];
  });

  return [...triplets, ...sequences];
};

const getGroupOverlap = (
  group: TileGroup,
  handCounts: readonly number[],
): number =>
  group.reduce(
    (overlap, [tileIndex, count]) =>
      overlap + Math.min(count, handCounts[tileIndex]),
    0,
  );

const addGroup = (
  group: TileGroup,
  targetCounts: number[],
  handCounts: readonly number[],
): number | null => {
  if (
    group.some(
      ([tileIndex, count]) => targetCounts[tileIndex] + count > 4,
    )
  ) {
    return null;
  }

  let overlapDelta = 0;

  for (const [tileIndex, count] of group) {
    const previousCount = targetCounts[tileIndex];
    const nextCount = previousCount + count;

    overlapDelta +=
      Math.min(nextCount, handCounts[tileIndex]) -
      Math.min(previousCount, handCounts[tileIndex]);
    targetCounts[tileIndex] = nextCount;
  }

  return overlapDelta;
};

const removeGroup = (
  group: TileGroup,
  targetCounts: number[],
): void => {
  for (const [tileIndex, count] of group) {
    targetCounts[tileIndex] -= count;
  }
};

export function calculateStandardDistance(
  tiles: readonly TileId[],
  rules: WinningShapeRules,
): number {
  const handCounts = createTileCounts(tiles);
  const allowedTileIndexes = new Set(
    rules.allowedTileIds.map(getTileIndex),
  );
  const allowedHandTileCount = handCounts.reduce(
    (count, tileCount, tileIndex) =>
      count + (allowedTileIndexes.has(tileIndex) ? tileCount : 0),
    0,
  );
  const targetCounts = Array<number>(TILES.length).fill(0);
  const meldCandidates = createMeldCandidates(rules).sort(
    (left, right) =>
      getGroupOverlap(right, handCounts) -
      getGroupOverlap(left, handCounts),
  );
  const pairCandidates: TileGroup[] = rules.allowedTileIds
    .map((tileId) => [[getTileIndex(tileId), 2]] as TileGroup)
    .sort(
      (left, right) =>
        getGroupOverlap(right, handCounts) -
        getGroupOverlap(left, handCounts),
    );
  let bestDistance = 14;

  const searchMelds = (
    meldCount: number,
    startIndex: number,
    overlap: number,
  ): void => {
    if (bestDistance === 1) {
      return;
    }

    const selectedTileCount = 2 + meldCount * 3;
    const remainingTileCount = 14 - selectedTileCount;
    const maximumFinalOverlap = Math.min(
      allowedHandTileCount,
      overlap + remainingTileCount,
    );

    if (14 - maximumFinalOverlap >= bestDistance) {
      return;
    }

    if (meldCount === 4) {
      bestDistance = Math.min(bestDistance, 14 - overlap);
      return;
    }

    for (
      let candidateIndex = startIndex;
      candidateIndex < meldCandidates.length;
      candidateIndex += 1
    ) {
      const candidate = meldCandidates[candidateIndex];
      const overlapDelta = addGroup(
        candidate,
        targetCounts,
        handCounts,
      );

      if (overlapDelta === null) {
        continue;
      }

      searchMelds(
        meldCount + 1,
        candidateIndex,
        overlap + overlapDelta,
      );
      removeGroup(candidate, targetCounts);

      if (bestDistance === 1) {
        return;
      }
    }
  };

  for (const pair of pairCandidates) {
    const pairOverlap = addGroup(pair, targetCounts, handCounts);

    if (pairOverlap === null) {
      continue;
    }

    searchMelds(0, 0, pairOverlap);
    removeGroup(pair, targetCounts);

    if (bestDistance === 1) {
      break;
    }
  }

  return bestDistance;
}

export function calculateSevenPairsDistance(
  tiles: readonly TileId[],
  allowedTileIds: readonly TileId[],
): number {
  const handCounts = createTileCounts(tiles);
  const retainedTileCounts = allowedTileIds
    .map((tileId) => Math.min(handCounts[getTileIndex(tileId)], 2))
    .sort((left, right) => right - left)
    .slice(0, 7);
  const retainedTileCount = retainedTileCounts.reduce(
    (total, count) => total + count,
    0,
  );

  return 14 - retainedTileCount;
}

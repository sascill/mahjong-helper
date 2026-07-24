import {
  TILES,
  type TileId,
} from '../../hand';
import {
  ALL_MELDS,
  ALL_TILE_IDS,
  createSequenceMeld,
  createTileCounts,
  createTileGroup,
  createTripletMeld,
  getTileIndex,
  type MeldCandidate,
  type TileGroup,
} from './tileGroups';

export type WinningShapeRules = {
  allowedTileIds: readonly TileId[];
  sequenceStartIds: readonly TileId[];
};

export type StandardShapeOptions = {
  meldCandidates?: readonly MeldCandidate[];
  pairTileIds?: readonly TileId[];
  requiredMelds?: readonly MeldCandidate[];
  minimumSequenceCount?: number;
  minimumTripletCount?: number;
  requiredTileSets?: readonly (readonly TileId[])[];
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

const includesRequiredTileSets = (
  targetCounts: readonly number[],
  requiredTileSets: readonly (readonly TileId[])[],
): boolean =>
  requiredTileSets.every((tileIds) =>
    tileIds.some((tileId) => targetCounts[getTileIndex(tileId)] > 0),
  );

export function calculateStandardShapeDistance(
  tiles: readonly TileId[],
  options: StandardShapeOptions = {},
): number {
  const handCounts = createTileCounts(tiles);
  const targetCounts = Array<number>(TILES.length).fill(0);
  const requiredMelds = options.requiredMelds ?? [];
  const meldsToSelect = 4 - requiredMelds.length;
  const minimumSequenceCount = options.minimumSequenceCount ?? 0;
  const minimumTripletCount = options.minimumTripletCount ?? 0;
  const requiredTileSets = options.requiredTileSets ?? [];

  if (meldsToSelect < 0) {
    throw new Error('필수 몸통은 네 개를 초과할 수 없습니다.');
  }

  const meldCandidates = (options.meldCandidates ?? ALL_MELDS)
    .map((meld) => ({
      meld,
      group: createTileGroup(meld.tileIds),
    }))
    .sort(
      (left, right) =>
        getGroupOverlap(right.group, handCounts) -
        getGroupOverlap(left.group, handCounts),
    );
  const pairCandidates = (options.pairTileIds ?? ALL_TILE_IDS)
    .map((tileId) => createTileGroup([tileId, tileId]))
    .sort(
      (left, right) =>
        getGroupOverlap(right, handCounts) -
        getGroupOverlap(left, handCounts),
    );
  const requiredGroups = requiredMelds.map((meld) => ({
    meld,
    group: createTileGroup(meld.tileIds),
  }));
  const requiredSequenceCount = requiredMelds.filter(
    ({ kind }) => kind === 'sequence',
  ).length;
  const requiredTripletCount =
    requiredMelds.length - requiredSequenceCount;
  let bestDistance = 6;

  const searchMelds = (
    selectedMeldCount: number,
    startIndex: number,
    overlap: number,
    sequenceCount: number,
    tripletCount: number,
  ): void => {
    if (bestDistance === 1) {
      return;
    }

    const remainingMeldCount = meldsToSelect - selectedMeldCount;

    if (
      sequenceCount + remainingMeldCount < minimumSequenceCount ||
      tripletCount + remainingMeldCount < minimumTripletCount
    ) {
      return;
    }

    const selectedTileCount =
      2 + (requiredMelds.length + selectedMeldCount) * 3;
    const remainingTileCount = 14 - selectedTileCount;
    const maximumFinalOverlap = Math.min(
      tiles.length,
      overlap + remainingTileCount,
    );

    if (14 - maximumFinalOverlap >= bestDistance) {
      return;
    }

    if (selectedMeldCount === meldsToSelect) {
      if (
        sequenceCount >= minimumSequenceCount &&
        tripletCount >= minimumTripletCount &&
        includesRequiredTileSets(targetCounts, requiredTileSets)
      ) {
        bestDistance = Math.min(bestDistance, 14 - overlap);
      }

      return;
    }

    for (
      let candidateIndex = startIndex;
      candidateIndex < meldCandidates.length;
      candidateIndex += 1
    ) {
      const candidate = meldCandidates[candidateIndex];
      const nextSequenceCount =
        sequenceCount + (candidate.meld.kind === 'sequence' ? 1 : 0);
      const nextTripletCount =
        tripletCount + (candidate.meld.kind === 'triplet' ? 1 : 0);

      if (
        nextSequenceCount >
          4 - minimumTripletCount ||
        nextTripletCount >
          4 - minimumSequenceCount
      ) {
        continue;
      }

      const overlapDelta = addGroup(
        candidate.group,
        targetCounts,
        handCounts,
      );

      if (overlapDelta === null) {
        continue;
      }

      searchMelds(
        selectedMeldCount + 1,
        candidateIndex,
        overlap + overlapDelta,
        nextSequenceCount,
        nextTripletCount,
      );
      removeGroup(candidate.group, targetCounts);

      if (bestDistance === 1) {
        return;
      }
    }
  };

  for (const pair of pairCandidates) {
    let overlap = addGroup(pair, targetCounts, handCounts);

    if (overlap === null) {
      continue;
    }

    let requiredMeldsValid = true;
    let addedRequiredGroupCount = 0;

    for (const required of requiredGroups) {
      const overlapDelta = addGroup(
        required.group,
        targetCounts,
        handCounts,
      );

      if (overlapDelta === null) {
        requiredMeldsValid = false;
        break;
      }

      overlap += overlapDelta;
      addedRequiredGroupCount += 1;
    }

    if (requiredMeldsValid) {
      searchMelds(
        0,
        0,
        overlap,
        requiredSequenceCount,
        requiredTripletCount,
      );
    }

    for (
      let index = addedRequiredGroupCount - 1;
      index >= 0;
      index -= 1
    ) {
      removeGroup(requiredGroups[index].group, targetCounts);
    }

    removeGroup(pair, targetCounts);

    if (bestDistance === 1) {
      break;
    }
  }

  return bestDistance;
}

export function calculateStandardDistance(
  tiles: readonly TileId[],
  rules: WinningShapeRules,
): number {
  const triplets = rules.allowedTileIds.map(createTripletMeld);
  const sequences = rules.sequenceStartIds.map((tileId) => {
    const tile = TILES.find(({ id }) => id === tileId);

    if (
      !tile ||
      tile.suit === 'honor' ||
      typeof tile.value !== 'number'
    ) {
      throw new Error(`슌쯔 시작패로 사용할 수 없습니다: ${tileId}`);
    }

    return createSequenceMeld(tile.suit, tile.value);
  });

  return calculateStandardShapeDistance(tiles, {
    meldCandidates: [...triplets, ...sequences],
    pairTileIds: rules.allowedTileIds,
  });
}

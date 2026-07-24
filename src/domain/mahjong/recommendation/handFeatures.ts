import {
  TILES,
  type HandInput,
  type TileId,
} from '../hand';
import {
  DRAGON_TILE_IDS,
  NUMBER_SUITS,
  getNumberTileId,
  type NumberSuit,
} from './lib/distance';

export type HandFeatures = {
  exactPairCount: number;
  pairCandidateCount: number;
  tripletCount: number;
  simpleTileCount: number;
  terminalOrHonorCount: number;
  suitCounts: Record<NumberSuit, number>;
  honorCount: number;
  dominantSuit: NumberSuit;
  dominantSuitCount: number;
  dominantSuitAndHonorCount: number;
  valuePairCount: number;
  sequenceCandidateCount: number;
  ittsuuSegmentCandidateCount: number;
  sanshokuSuitCandidateCount: number;
  outsideSequenceCandidateCount: number;
  orphanUniqueCount: number;
};

const SEQUENCE_STARTS = [1, 2, 3, 4, 5, 6, 7] as const;
const ITTSUU_SEGMENT_STARTS = [1, 4, 7] as const;
const OUTSIDE_SEQUENCE_STARTS = [1, 7] as const;

const createTileCounts = (
  tiles: readonly TileId[],
): Map<TileId, number> => {
  const counts = new Map<TileId, number>();

  for (const tileId of tiles) {
    counts.set(tileId, (counts.get(tileId) ?? 0) + 1);
  }

  return counts;
};

const countSequenceTiles = (
  counts: ReadonlyMap<TileId, number>,
  suit: NumberSuit,
  start: number,
): number =>
  [start, start + 1, start + 2].filter(
    (value) => (counts.get(getNumberTileId(suit, value)) ?? 0) > 0,
  ).length;

const isSequenceCandidate = (
  counts: ReadonlyMap<TileId, number>,
  suit: NumberSuit,
  start: number,
): boolean => countSequenceTiles(counts, suit, start) >= 2;

const selectDominantSuit = (
  suitCounts: Record<NumberSuit, number>,
): NumberSuit =>
  NUMBER_SUITS.reduce((dominantSuit, suit) =>
    suitCounts[suit] > suitCounts[dominantSuit] ? suit : dominantSuit,
  );

export function extractHandFeatures(input: HandInput): HandFeatures {
  const counts = createTileCounts(input.tiles);
  const exactPairCount = [...counts.values()].filter(
    (count) => count === 2,
  ).length;
  const pairCandidateCount = [...counts.values()].filter(
    (count) => count >= 2,
  ).length;
  const tripletCount = [...counts.values()].filter(
    (count) => count >= 3,
  ).length;
  const suitCounts: Record<NumberSuit, number> = {
    man: 0,
    pin: 0,
    sou: 0,
  };
  let simpleTileCount = 0;
  let honorCount = 0;

  for (const tileId of input.tiles) {
    const tile = TILES.find(({ id }) => id === tileId);

    if (!tile) {
      continue;
    }

    if (tile.suit === 'honor') {
      honorCount += 1;
      continue;
    }

    suitCounts[tile.suit] += 1;

    if (typeof tile.value === 'number' && tile.value >= 2 && tile.value <= 8) {
      simpleTileCount += 1;
    }
  }

  const dominantSuit = selectDominantSuit(suitCounts);
  const dominantSuitCount = suitCounts[dominantSuit];
  const valueTileIds = new Set<TileId>([
    ...DRAGON_TILE_IDS,
    input.roundWind,
    input.seatWind,
  ]);
  const valuePairCount = [...valueTileIds].filter(
    (tileId) => (counts.get(tileId) ?? 0) >= 2,
  ).length;
  const sequenceCandidateCount = NUMBER_SUITS.reduce(
    (total, suit) =>
      total +
      SEQUENCE_STARTS.filter((start) =>
        isSequenceCandidate(counts, suit, start),
      ).length,
    0,
  );
  const ittsuuSegmentCandidateCount = Math.max(
    ...NUMBER_SUITS.map(
      (suit) =>
        ITTSUU_SEGMENT_STARTS.filter((start) =>
          isSequenceCandidate(counts, suit, start),
        ).length,
    ),
  );
  const sanshokuSuitCandidateCount = Math.max(
    ...SEQUENCE_STARTS.map(
      (start) =>
        NUMBER_SUITS.filter((suit) =>
          isSequenceCandidate(counts, suit, start),
        ).length,
    ),
  );
  const outsideSequenceCandidateCount = NUMBER_SUITS.reduce(
    (total, suit) =>
      total +
      OUTSIDE_SEQUENCE_STARTS.filter((start) =>
        isSequenceCandidate(counts, suit, start),
      ).length,
    0,
  );
  const orphanUniqueCount = TILES.filter(
    ({ id, suit, value }) =>
      (suit === 'honor' || value === 1 || value === 9) &&
      (counts.get(id) ?? 0) > 0,
  ).length;

  return {
    exactPairCount,
    pairCandidateCount,
    tripletCount,
    simpleTileCount,
    terminalOrHonorCount: input.tiles.length - simpleTileCount,
    suitCounts,
    honorCount,
    dominantSuit,
    dominantSuitCount,
    dominantSuitAndHonorCount: dominantSuitCount + honorCount,
    valuePairCount,
    sequenceCandidateCount,
    ittsuuSegmentCandidateCount,
    sanshokuSuitCandidateCount,
    outsideSequenceCandidateCount,
    orphanUniqueCount,
  };
}

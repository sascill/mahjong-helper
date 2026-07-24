import {
  TILES,
  type TileId,
} from '../../hand';

export type NumberSuit = 'man' | 'pin' | 'sou';

export type TileGroup = readonly (readonly [
  tileIndex: number,
  count: number,
])[];

export type MeldCandidate = {
  kind: 'sequence' | 'triplet';
  tileIds: readonly TileId[];
};

export const NUMBER_SUITS: readonly NumberSuit[] = [
  'man',
  'pin',
  'sou',
];

export const ALL_TILE_IDS: readonly TileId[] = TILES.map(
  ({ id }) => id,
);

export const HONOR_TILE_IDS: readonly TileId[] = TILES.filter(
  ({ suit }) => suit === 'honor',
).map(({ id }) => id);

export const WIND_TILE_IDS: readonly TileId[] = [
  'east',
  'south',
  'west',
  'north',
];

export const DRAGON_TILE_IDS: readonly TileId[] = [
  'white',
  'green',
  'red',
];

const TILE_INDEX_BY_ID = new Map<TileId, number>(
  TILES.map(({ id }, index) => [id, index]),
);

const SUIT_SUFFIX: Record<NumberSuit, 'm' | 'p' | 's'> = {
  man: 'm',
  pin: 'p',
  sou: 's',
};

export const getNumberTileId = (
  suit: NumberSuit,
  value: number,
): TileId => `${value}${SUIT_SUFFIX[suit]}` as TileId;

export const getTileIndex = (tileId: TileId): number => {
  const tileIndex = TILE_INDEX_BY_ID.get(tileId);

  if (tileIndex === undefined) {
    throw new Error(`정의되지 않은 패입니다: ${tileId}`);
  }

  return tileIndex;
};

export const createTileCounts = (
  tiles: readonly TileId[],
): number[] => {
  const counts = Array<number>(TILES.length).fill(0);

  for (const tileId of tiles) {
    counts[getTileIndex(tileId)] += 1;
  }

  return counts;
};

export const createTileGroup = (
  tileIds: readonly TileId[],
): TileGroup => {
  const counts = new Map<number, number>();

  for (const tileId of tileIds) {
    const tileIndex = getTileIndex(tileId);
    counts.set(tileIndex, (counts.get(tileIndex) ?? 0) + 1);
  }

  return [...counts.entries()];
};

export const createSequenceMeld = (
  suit: NumberSuit,
  start: number,
): MeldCandidate => ({
  kind: 'sequence',
  tileIds: [
    getNumberTileId(suit, start),
    getNumberTileId(suit, start + 1),
    getNumberTileId(suit, start + 2),
  ],
});

export const createTripletMeld = (
  tileId: TileId,
): MeldCandidate => ({
  kind: 'triplet',
  tileIds: [tileId, tileId, tileId],
});

export const ALL_SEQUENCE_MELDS: readonly MeldCandidate[] =
  NUMBER_SUITS.flatMap((suit) =>
    Array.from(
      { length: 7 },
      (_, index) => createSequenceMeld(suit, index + 1),
    ),
  );

export const ALL_TRIPLET_MELDS: readonly MeldCandidate[] =
  ALL_TILE_IDS.map(createTripletMeld);

export const ALL_MELDS: readonly MeldCandidate[] = [
  ...ALL_TRIPLET_MELDS,
  ...ALL_SEQUENCE_MELDS,
];

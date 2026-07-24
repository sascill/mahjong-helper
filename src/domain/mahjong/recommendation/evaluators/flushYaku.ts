import {
  TILES,
  type HandInput,
  type TileId,
} from '../../hand';
import {
  NUMBER_SUITS,
  calculateFixedTargetDistance,
  calculateSevenPairsDistance,
  calculateStandardShapeDistance,
  createSequenceMeld,
  createTripletMeld,
  getNumberTileId,
} from '../lib/distance';
import type { YakuEvaluation } from '../types';
import {
  countTiles,
  createEvaluation,
} from './helpers';

const SUIT_LABELS = {
  man: '만수',
  pin: '통수',
  sou: '삭수',
} as const;

const getSuitTileIds = (
  suit: (typeof NUMBER_SUITS)[number],
): TileId[] =>
  TILES.filter((tile) => tile.suit === suit).map(({ id }) => id);

export function evaluateChinitsu(
  input: HandInput,
): YakuEvaluation {
  let bestDistance = 14;
  let bestSuit = NUMBER_SUITS[0];

  for (const suit of NUMBER_SUITS) {
    const suitTileIds = getSuitTileIds(suit);
    const meldCandidates = [
      ...suitTileIds.map(createTripletMeld),
      ...Array.from(
        { length: 7 },
        (_, index) => createSequenceMeld(suit, index + 1),
      ),
    ];
    const distance = Math.min(
      calculateStandardShapeDistance(input.tiles, {
        meldCandidates,
        pairTileIds: suitTileIds,
      }),
      calculateSevenPairsDistance(input.tiles, suitTileIds),
    );

    if (distance < bestDistance) {
      bestDistance = distance;
      bestSuit = suit;
    }
  }

  const bestSuitTileIds = getSuitTileIds(bestSuit);

  return createEvaluation(
    'chinitsu',
    bestDistance,
    `${SUIT_LABELS[bestSuit]} 패가 ${countTiles(input.tiles, bestSuitTileIds)}장 있습니다.`,
  );
}

export function evaluateChuurenPoutou(
  input: HandInput,
): YakuEvaluation {
  let bestDistance = 14;
  let bestSuit = NUMBER_SUITS[0];

  for (const suit of NUMBER_SUITS) {
    const baseTiles: TileId[] = [
      getNumberTileId(suit, 1),
      getNumberTileId(suit, 1),
      getNumberTileId(suit, 1),
      getNumberTileId(suit, 2),
      getNumberTileId(suit, 3),
      getNumberTileId(suit, 4),
      getNumberTileId(suit, 5),
      getNumberTileId(suit, 6),
      getNumberTileId(suit, 7),
      getNumberTileId(suit, 8),
      getNumberTileId(suit, 9),
      getNumberTileId(suit, 9),
      getNumberTileId(suit, 9),
    ];

    for (let value = 1; value <= 9; value += 1) {
      const distance = calculateFixedTargetDistance(input.tiles, [
        ...baseTiles,
        getNumberTileId(suit, value),
      ]);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestSuit = suit;
      }
    }
  }

  return createEvaluation(
    'chuuren-poutou',
    bestDistance,
    `${SUIT_LABELS[bestSuit]}의 1112345678999 형태와 비교했습니다.`,
  );
}

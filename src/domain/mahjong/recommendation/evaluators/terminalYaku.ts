import type { HandInput, TileId } from '../../hand';
import {
  HONOR_TILE_IDS,
  NUMBER_SUITS,
  calculateSevenPairsDistance,
  calculateStandardShapeDistance,
  createSequenceMeld,
  createTripletMeld,
} from '../lib/distance';
import type { YakuEvaluation } from '../types';
import {
  TERMINAL_OR_HONOR_TILE_IDS,
  TERMINAL_TILE_IDS,
  countTiles,
  createEvaluation,
  createShapeEvaluation,
} from './helpers';

const OUTSIDE_SEQUENCE_MELDS = NUMBER_SUITS.flatMap((suit) => [
  createSequenceMeld(suit, 1),
  createSequenceMeld(suit, 7),
]);

const TERMINAL_TRIPLET_MELDS =
  TERMINAL_TILE_IDS.map(createTripletMeld);

const TERMINAL_OR_HONOR_TRIPLET_MELDS =
  TERMINAL_OR_HONOR_TILE_IDS.map(createTripletMeld);

export function evaluateChanta(input: HandInput): YakuEvaluation {
  const distance = calculateStandardShapeDistance(input.tiles, {
    meldCandidates: [
      ...OUTSIDE_SEQUENCE_MELDS,
      ...TERMINAL_OR_HONOR_TRIPLET_MELDS,
    ],
    pairTileIds: TERMINAL_OR_HONOR_TILE_IDS,
    minimumSequenceCount: 1,
    requiredTileSets: [HONOR_TILE_IDS],
  });

  return createShapeEvaluation(
    'chanta',
    distance,
    '각 몸통과 머리에 1·9·자패가 포함되고 자패와 슌쯔가 있는',
  );
}

export function evaluateHonroutou(
  input: HandInput,
): YakuEvaluation {
  const requiredTileSets = [
    TERMINAL_TILE_IDS,
    HONOR_TILE_IDS,
  ] as const;
  const standardDistance = calculateStandardShapeDistance(
    input.tiles,
    {
      meldCandidates: TERMINAL_OR_HONOR_TRIPLET_MELDS,
      pairTileIds: TERMINAL_OR_HONOR_TILE_IDS,
      minimumTripletCount: 4,
      requiredTileSets,
    },
  );
  const sevenPairsDistance = calculateSevenPairsDistance(
    input.tiles,
    TERMINAL_OR_HONOR_TILE_IDS,
    { requiredTileSets },
  );
  const outsideTileCount = countTiles(
    input.tiles,
    TERMINAL_OR_HONOR_TILE_IDS,
  );

  return createEvaluation(
    'honroutou',
    Math.min(standardDistance, sevenPairsDistance),
    `현재 1·9·자패가 ${outsideTileCount}장 있습니다.`,
  );
}

export function evaluateJunchan(input: HandInput): YakuEvaluation {
  const distance = calculateStandardShapeDistance(input.tiles, {
    meldCandidates: [
      ...OUTSIDE_SEQUENCE_MELDS,
      ...TERMINAL_TRIPLET_MELDS,
    ],
    pairTileIds: TERMINAL_TILE_IDS,
    minimumSequenceCount: 1,
  });

  return createShapeEvaluation(
    'junchan',
    distance,
    '모든 몸통과 머리에 1·9가 포함된 숫자패',
  );
}

const GREEN_TILE_IDS: readonly TileId[] = [
  '2s',
  '3s',
  '4s',
  '6s',
  '8s',
  'green',
];

export function evaluateRyuuiisou(
  input: HandInput,
): YakuEvaluation {
  const greenTileCount = countTiles(input.tiles, GREEN_TILE_IDS);

  return createEvaluation(
    'ryuuiisou',
    calculateStandardShapeDistance(input.tiles, {
      meldCandidates: [
        ...GREEN_TILE_IDS.map(createTripletMeld),
        createSequenceMeld('sou', 2),
      ],
      pairTileIds: GREEN_TILE_IDS,
    }),
    `현재 녹일색에 사용할 수 있는 패가 ${greenTileCount}장 있습니다.`,
  );
}

export function evaluateChinroutou(
  input: HandInput,
): YakuEvaluation {
  return createEvaluation(
    'chinroutou',
    calculateStandardShapeDistance(input.tiles, {
      meldCandidates: TERMINAL_TRIPLET_MELDS,
      pairTileIds: TERMINAL_TILE_IDS,
      minimumTripletCount: 4,
    }),
    `현재 숫자패 1·9가 ${countTiles(input.tiles, TERMINAL_TILE_IDS)}장 있습니다.`,
  );
}

export function evaluateTsuuiisou(
  input: HandInput,
): YakuEvaluation {
  const standardDistance = calculateStandardShapeDistance(
    input.tiles,
    {
      meldCandidates: HONOR_TILE_IDS.map(createTripletMeld),
      pairTileIds: HONOR_TILE_IDS,
      minimumTripletCount: 4,
    },
  );
  const sevenPairsDistance = calculateSevenPairsDistance(
    input.tiles,
    HONOR_TILE_IDS,
  );

  return createEvaluation(
    'tsuuiisou',
    Math.min(standardDistance, sevenPairsDistance),
    `현재 자패가 ${countTiles(input.tiles, HONOR_TILE_IDS)}장 있습니다.`,
  );
}

import {
  TILES,
  type HandInput,
  type TileSuit,
} from '../../hand';
import {
  calculateSevenPairsDistance,
  calculateStandardShapeDistance,
  createSequenceMeld,
  createTripletMeld,
} from '../lib/distance';
import type { YakuEvaluation } from '../types';

type NumberSuit = Exclude<TileSuit, 'honor'>;

const SUIT_OPTIONS: {
  label: string;
  suit: NumberSuit;
}[] = [
  { label: '만수', suit: 'man' },
  { label: '통수', suit: 'pin' },
  { label: '삭수', suit: 'sou' },
];

export function evaluateHonitsu(input: HandInput): YakuEvaluation {
  let bestEvaluation:
    | {
        distance: number;
        label: string;
        relevantTileCount: number;
      }
    | undefined;

  for (const option of SUIT_OPTIONS) {
    const suitTileIds = TILES.filter(
      (tile) => tile.suit === option.suit,
    ).map(({ id }) => id);
    const honorTileIds = TILES.filter(
      (tile) => tile.suit === 'honor',
    ).map(({ id }) => id);
    const allowedTileIds = [...suitTileIds, ...honorTileIds];
    const allowedTileIdSet = new Set(allowedTileIds);
    const requiredTileSets = [suitTileIds, honorTileIds];
    const standardDistance = calculateStandardShapeDistance(
      input.tiles,
      {
        meldCandidates: [
          ...allowedTileIds.map(createTripletMeld),
          ...Array.from(
            { length: 7 },
            (_, index) =>
              createSequenceMeld(option.suit, index + 1),
          ),
        ],
        pairTileIds: allowedTileIds,
        requiredTileSets,
      },
    );
    const sevenPairsDistance = calculateSevenPairsDistance(
      input.tiles,
      allowedTileIds,
      { requiredTileSets },
    );
    const distance = Math.min(
      standardDistance,
      sevenPairsDistance,
    );
    const relevantTileCount = input.tiles.filter(
      (tileId) => allowedTileIdSet.has(tileId),
    ).length;

    if (!bestEvaluation || distance < bestEvaluation.distance) {
      bestEvaluation = {
        distance,
        label: option.label,
        relevantTileCount,
      };
    }

    if (bestEvaluation.distance === 1) {
      break;
    }
  }

  if (!bestEvaluation) {
    throw new Error('혼일색 평가 대상을 찾을 수 없습니다.');
  }

  return {
    yakuId: 'honitsu',
    requiredTileCount: bestEvaluation.distance,
    reason: `${bestEvaluation.label}와 자패가 ${bestEvaluation.relevantTileCount}장으로 구성 비중이 높습니다.`,
  };
}

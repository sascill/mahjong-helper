import {
  TILES,
  type HandInput,
  type TileSuit,
} from '../../hand';
import {
  calculateSevenPairsDistance,
  calculateStandardDistance,
  type WinningShapeRules,
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

const createHonitsuRules = (
  suit: NumberSuit,
): WinningShapeRules => ({
  allowedTileIds: TILES.filter(
    (tile) => tile.suit === suit || tile.suit === 'honor',
  ).map(({ id }) => id),
  sequenceStartIds: TILES.filter(
    (tile) =>
      tile.suit === suit &&
      typeof tile.value === 'number' &&
      tile.value <= 7,
  ).map(({ id }) => id),
});

export function evaluateHonitsu(input: HandInput): YakuEvaluation {
  let bestEvaluation:
    | {
        distance: number;
        label: string;
        relevantTileCount: number;
      }
    | undefined;

  for (const option of SUIT_OPTIONS) {
    const rules = createHonitsuRules(option.suit);
    const allowedTileIds = new Set(rules.allowedTileIds);
    const standardDistance = calculateStandardDistance(
      input.tiles,
      rules,
    );
    const sevenPairsDistance = calculateSevenPairsDistance(
      input.tiles,
      rules.allowedTileIds,
    );
    const distance = Math.min(
      standardDistance,
      sevenPairsDistance,
    );
    const relevantTileCount = input.tiles.filter(
      (tileId) => allowedTileIds.has(tileId),
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

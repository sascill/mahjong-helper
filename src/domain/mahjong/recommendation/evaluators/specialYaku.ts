import type { HandInput } from '../../hand';
import {
  calculateFixedTargetDistance,
} from '../lib/distance';
import type { YakuEvaluation } from '../types';
import {
  TERMINAL_OR_HONOR_TILE_IDS,
  countTiles,
  createEvaluation,
} from './helpers';

export function evaluateKokushiMusou(
  input: HandInput,
): YakuEvaluation {
  let bestDistance = 14;

  for (const pairTileId of TERMINAL_OR_HONOR_TILE_IDS) {
    bestDistance = Math.min(
      bestDistance,
      calculateFixedTargetDistance(input.tiles, [
        ...TERMINAL_OR_HONOR_TILE_IDS,
        pairTileId,
      ]),
    );
  }

  const uniqueOutsideTileCount = new Set(
    input.tiles.filter((tileId) =>
      TERMINAL_OR_HONOR_TILE_IDS.includes(tileId),
    ),
  ).size;

  return createEvaluation(
    'kokushi-musou',
    bestDistance,
    `13종의 1·9·자패 중 ${uniqueOutsideTileCount}종, 총 ${countTiles(input.tiles, TERMINAL_OR_HONOR_TILE_IDS)}장을 가지고 있습니다.`,
  );
}

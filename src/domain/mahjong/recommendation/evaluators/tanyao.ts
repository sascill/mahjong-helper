import {
  TILES,
  type HandInput,
  type Tile,
} from '../../hand';
import {
  calculateSevenPairsDistance,
  calculateStandardDistance,
  type WinningShapeRules,
} from '../lib/distance';
import type { YakuEvaluation } from '../types';

const isSimpleTile = (tile: Tile): boolean =>
  tile.suit !== 'honor' &&
  typeof tile.value === 'number' &&
  tile.value >= 2 &&
  tile.value <= 8;

const TANYAO_RULES: WinningShapeRules = {
  allowedTileIds: TILES.filter(isSimpleTile).map(({ id }) => id),
  sequenceStartIds: TILES.filter(
    (tile) =>
      isSimpleTile(tile) &&
      typeof tile.value === 'number' &&
      tile.value <= 6,
  ).map(({ id }) => id),
};

const SIMPLE_TILE_IDS = new Set(TANYAO_RULES.allowedTileIds);

export function evaluateTanyao(input: HandInput): YakuEvaluation {
  const standardDistance = calculateStandardDistance(
    input.tiles,
    TANYAO_RULES,
  );
  const sevenPairsDistance = calculateSevenPairsDistance(
    input.tiles,
    TANYAO_RULES.allowedTileIds,
  );
  const incompatibleTileCount = input.tiles.filter(
    (tileId) => !SIMPLE_TILE_IDS.has(tileId),
  ).length;
  const reason =
    incompatibleTileCount === 0
      ? '모든 패가 숫자패 2~8로 구성되어 있습니다.'
      : `숫자패 2~8이 ${input.tiles.length - incompatibleTileCount}장이고 1·9·자패가 ${incompatibleTileCount}장입니다.`;

  return {
    yakuId: 'tanyao',
    requiredTileCount: Math.min(
      standardDistance,
      sevenPairsDistance,
    ),
    reason,
  };
}

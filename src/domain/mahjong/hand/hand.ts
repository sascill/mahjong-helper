import { TILES } from './tiles';
import type {
  HandInput,
  HandValidationError,
  HandValidationResult,
  TileId,
} from './types';

const INITIAL_HAND_SIZE = 13;
const MAX_IDENTICAL_TILE_COUNT = 4;

const TILE_ORDER = new Map(TILES.map(({ id, order }) => [id, order]));

export const sortTiles = (tiles: readonly TileId[]): TileId[] =>
  [...tiles].sort(
    (leftTile, rightTile) =>
      (TILE_ORDER.get(leftTile) ?? 0) - (TILE_ORDER.get(rightTile) ?? 0),
  );

export const canAddTile = (
  tiles: readonly TileId[],
  tileId: TileId,
): boolean =>
  tiles.length < INITIAL_HAND_SIZE &&
  tiles.filter((selectedTileId) => selectedTileId === tileId).length <
    MAX_IDENTICAL_TILE_COUNT;

export const validateHandInput = (
  input: HandInput,
): HandValidationResult => {
  const errors: HandValidationError[] = [];

  if (input.tiles.length !== INITIAL_HAND_SIZE) {
    errors.push('invalid-tile-count');
  }

  const tileCounts = input.tiles.reduce<Map<TileId, number>>(
    (counts, tileId) =>
      counts.set(tileId, (counts.get(tileId) ?? 0) + 1),
    new Map(),
  );

  if (
    [...tileCounts.values()].some(
      (tileCount) => tileCount > MAX_IDENTICAL_TILE_COUNT,
    )
  ) {
    errors.push('too-many-identical-tiles');
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
};

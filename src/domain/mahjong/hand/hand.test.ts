import { describe, expect, it } from 'vitest';

import {
  TILES,
  canAddTile,
  sortTiles,
  validateHandInput,
  type HandInput,
  type TileId,
} from './index';

const VALID_TILES: TileId[] = [
  '1m',
  '2m',
  '3m',
  '4m',
  '5m',
  '6m',
  '7m',
  '8m',
  '9m',
  '1p',
  '2p',
  '3p',
  '4p',
];

const createHandInput = (tiles: TileId[]): HandInput => ({
  tiles,
  roundWind: 'east',
  seatWind: 'south',
});

describe('패 데이터', () => {
  it('서로 다른 기본 패 34종을 정의한다', () => {
    const tileIds = TILES.map(({ id }) => id);

    expect(TILES).toHaveLength(34);
    expect(new Set(tileIds)).toHaveProperty('size', 34);
  });

  it('정해진 손패 정렬 순서로 패를 정의한다', () => {
    expect(TILES.map(({ id }) => id)).toEqual([
      '1m',
      '2m',
      '3m',
      '4m',
      '5m',
      '6m',
      '7m',
      '8m',
      '9m',
      '1p',
      '2p',
      '3p',
      '4p',
      '5p',
      '6p',
      '7p',
      '8p',
      '9p',
      '1s',
      '2s',
      '3s',
      '4s',
      '5s',
      '6s',
      '7s',
      '8s',
      '9s',
      'east',
      'south',
      'west',
      'north',
      'white',
      'green',
      'red',
    ]);
  });
});

describe('손패 정렬', () => {
  it('만수, 통수, 삭수, 자패 순서로 정렬한다', () => {
    const tiles: TileId[] = ['red', '2s', '1m', 'east', '9p', '1m'];

    expect(sortTiles(tiles)).toEqual([
      '1m',
      '1m',
      '9p',
      '2s',
      'east',
      'red',
    ]);
  });

  it('입력 배열을 변경하지 않는다', () => {
    const tiles: TileId[] = ['red', '1m', '9p'];
    const originalTiles = [...tiles];

    sortTiles(tiles);

    expect(tiles).toEqual(originalTiles);
  });
});

describe('패 추가 가능 여부', () => {
  it('13장 미만이고 같은 패가 4장 미만이면 추가할 수 있다', () => {
    expect(canAddTile(['1m', '1m', '1m'], '1m')).toBe(true);
  });

  it('손패가 이미 13장이면 추가할 수 없다', () => {
    expect(canAddTile(VALID_TILES, '5p')).toBe(false);
  });

  it('같은 패가 이미 4장이면 추가할 수 없다', () => {
    expect(canAddTile(['1m', '1m', '1m', '1m'], '1m')).toBe(false);
  });
});

describe('첫 손패 검증', () => {
  it('정상적인 13장 손패를 허용한다', () => {
    expect(validateHandInput(createHandInput(VALID_TILES))).toEqual({
      valid: true,
    });
  });

  it.each([
    ['13장 미만', VALID_TILES.slice(0, 12)],
    ['13장 초과', [...VALID_TILES, '5p'] satisfies TileId[]],
  ])('%s인 손패를 거부한다', (_, tiles) => {
    expect(validateHandInput(createHandInput(tiles))).toEqual({
      valid: false,
      errors: ['invalid-tile-count'],
    });
  });

  it('같은 패가 5장 이상인 손패를 거부한다', () => {
    const tiles: TileId[] = [
      '1m',
      '1m',
      '1m',
      '1m',
      '1m',
      '2m',
      '3m',
      '4m',
      '5m',
      '6m',
      '7m',
      '8m',
      '9m',
    ];

    expect(validateHandInput(createHandInput(tiles))).toEqual({
      valid: false,
      errors: ['too-many-identical-tiles'],
    });
  });
});

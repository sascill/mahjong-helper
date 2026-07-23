import { describe, expect, it } from 'vitest';

import type { HandInput, TileId } from '../hand';
import type { YakuId } from '../yaku';
import {
  recommendYaku,
  type Recommendation,
} from './index';

const createHandInput = (tiles: TileId[]): HandInput => ({
  tiles,
  roundWind: 'east',
  seatWind: 'south',
});

const getRecommendation = (
  recommendations: Recommendation[],
  yakuId: YakuId,
): Recommendation => {
  const recommendation = recommendations.find(
    (item) => item.yakuId === yakuId,
  );

  if (!recommendation) {
    throw new Error(`${yakuId} 추천 결과를 찾을 수 없습니다.`);
  }

  return recommendation;
};

const TANYAO_TENPAI: TileId[] = [
  '2m',
  '3m',
  '4m',
  '3m',
  '4m',
  '5m',
  '4p',
  '5p',
  '6p',
  '6s',
  '7s',
  '5p',
  '5p',
];

const SIMPLE_SIX_PAIRS: TileId[] = [
  '2m',
  '2m',
  '3m',
  '3m',
  '8m',
  '4p',
  '4p',
  '5p',
  '5p',
  '6s',
  '6s',
  '7s',
  '7s',
];

const HONITSU_TENPAI: TileId[] = [
  '1m',
  '2m',
  '3m',
  '4m',
  '5m',
  '6m',
  '7m',
  '8m',
  '9m',
  'east',
  'east',
  'east',
  'white',
];

describe('역 추천', () => {
  it('유효하지 않은 손패를 거부한다', () => {
    expect(() =>
      recommendYaku(createHandInput(TANYAO_TENPAI.slice(0, 12))),
    ).toThrow('유효하지 않은 손패입니다.');
  });

  it('탕야오 일반형 텐파이를 추천 거리 1로 계산한다', () => {
    const recommendations = recommendYaku(
      createHandInput(TANYAO_TENPAI),
    );
    const tanyao = getRecommendation(recommendations, 'tanyao');

    expect(tanyao.requiredTileCount).toBe(1);
    expect(tanyao.reason).toContain('숫자패 2~8');
  });

  it('탕야오에서 치또이츠형이 더 가까우면 해당 거리를 사용한다', () => {
    const recommendations = recommendYaku(
      createHandInput(SIMPLE_SIX_PAIRS),
    );

    expect(
      getRecommendation(recommendations, 'tanyao').requiredTileCount,
    ).toBe(1);
  });

  it('치또이츠 거리에서 또이쯔와 고유 패 종류를 함께 반영한다', () => {
    const tiles: TileId[] = [
      '1m',
      '1m',
      '1m',
      '1m',
      '2m',
      '2m',
      '3m',
      '3m',
      '4m',
      '4m',
      '5m',
      '5m',
      '6m',
    ];
    const recommendations = recommendYaku(createHandInput(tiles));
    const chiitoitsu = getRecommendation(
      recommendations,
      'chiitoitsu',
    );

    expect(chiitoitsu.requiredTileCount).toBe(3);
    expect(chiitoitsu.reason).toContain('5개');
  });

  it('혼일색에 가장 가까운 숫자패 종류를 선택한다', () => {
    const recommendations = recommendYaku(
      createHandInput(HONITSU_TENPAI),
    );
    const honitsu = getRecommendation(recommendations, 'honitsu');

    expect(honitsu.requiredTileCount).toBe(1);
    expect(honitsu.reason).toContain('만수와 자패가 13장');
  });

  it('추천 거리가 6 이상인 역을 제외한다', () => {
    const tiles: TileId[] = [
      '1m',
      '9m',
      '1p',
      '9p',
      '1s',
      '9s',
      'east',
      'south',
      'west',
      'north',
      'white',
      'green',
      'red',
    ];

    expect(recommendYaku(createHandInput(tiles))).toEqual([]);
  });

  it('가까운 거리부터 정렬한다', () => {
    const recommendations = recommendYaku(
      createHandInput(TANYAO_TENPAI),
    );

    expect(
      recommendations.map(({ requiredTileCount }) => requiredTileCount),
    ).toEqual(
      [...recommendations]
        .map(({ requiredTileCount }) => requiredTileCount)
        .sort((left, right) => left - right),
    );
  });

  it('거리가 같으면 탕야오를 치또이츠보다 먼저 추천한다', () => {
    const recommendations = recommendYaku(
      createHandInput(SIMPLE_SIX_PAIRS),
    );

    expect(recommendations.slice(0, 2).map(({ yakuId }) => yakuId)).toEqual([
      'tanyao',
      'chiitoitsu',
    ]);
    expect(
      recommendations
        .slice(0, 2)
        .map(({ requiredTileCount }) => requiredTileCount),
    ).toEqual([1, 1]);
  });

  it('입력한 손패 배열을 변경하지 않는다', () => {
    const input = createHandInput([...TANYAO_TENPAI]);
    const originalTiles = [...input.tiles];

    recommendYaku(input);

    expect(input.tiles).toEqual(originalTiles);
  });
});

import { describe, expect, it } from 'vitest';

import type { HandInput, TileId } from '../hand';
import {
  YAKUS,
  YAKU_IDS,
  type YakuId,
} from '../yaku';
import {
  evaluateYaku,
  recommendYaku,
} from './index';
import {
  YAKU_RECOMMENDATION_ROLES,
  type RecommendationTargetYakuId,
} from './policies';

const createHandInput = (tiles: TileId[]): HandInput => ({
  tiles,
  roundWind: 'east',
  seatWind: 'south',
});

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

const EVALUABLE_YAKU_IDS: readonly YakuId[] = [
  'pinfu',
  'iipeikou',
  'tanyao',
  'yakuhai',
  'chiitoitsu',
  'ittsuu',
  'sanshoku-doujun',
  'sanshoku-doukou',
  'toitoi',
  'sanankou',
  'chanta',
  'honroutou',
  'shousangen',
  'ryanpeikou',
  'honitsu',
  'junchan',
  'chinitsu',
  'kokushi-musou',
  'chuuren-poutou',
  'ryuuiisou',
  'suuankou',
  'chinroutou',
  'tsuuiisou',
  'daisangen',
  'shousuushii',
  'daisuushii',
];

const NON_RECOMMENDABLE_YAKU_IDS: readonly YakuId[] = [
  'riichi',
  'ippatsu',
  'menzen-tsumo',
  'chankan',
  'rinshan-kaihou',
  'haitei',
  'houtei',
  'double-riichi',
  'sankantsu',
  'tenhou',
  'chiihou',
  'suukantsu',
];

const PRIMARY_YAKU_IDS: readonly RecommendationTargetYakuId[] = [
  'tanyao',
  'pinfu',
  'yakuhai',
  'chiitoitsu',
  'toitoi',
  'honitsu',
  'ittsuu',
  'sanshoku-doujun',
  'chanta',
  'kokushi-musou',
];

const UPGRADE_YAKU_IDS: readonly YakuId[] = [
  'iipeikou',
  'sanshoku-doukou',
  'sanankou',
  'honroutou',
  'shousangen',
  'ryanpeikou',
  'junchan',
  'chinitsu',
  'chuuren-poutou',
  'ryuuiisou',
  'suuankou',
  'chinroutou',
  'tsuuiisou',
  'daisangen',
  'shousuushii',
  'daisuushii',
];

describe('역 추천', () => {
  it('유효하지 않은 손패를 거부한다', () => {
    expect(() =>
      recommendYaku(createHandInput(TANYAO_TENPAI.slice(0, 12))),
    ).toThrow('유효하지 않은 손패입니다.');
  });

  it('모든 역을 거리 평가 가능 또는 불가로 빠짐없이 구분한다', () => {
    const classifiedYakuIds = [
      ...EVALUABLE_YAKU_IDS,
      ...NON_RECOMMENDABLE_YAKU_IDS,
    ];

    expect(new Set(classifiedYakuIds).size).toBe(YAKU_IDS.length);
    expect([...classifiedYakuIds].sort()).toEqual(
      [...YAKU_IDS].sort(),
    );
  });

  it('모든 역에 목표·발전·도감 전용 역할을 빠짐없이 지정한다', () => {
    expect(Object.keys(YAKU_RECOMMENDATION_ROLES).sort()).toEqual(
      [...YAKU_IDS].sort(),
    );
    expect(
      Object.entries(YAKU_RECOMMENDATION_ROLES)
        .filter(([, role]) => role === 'primary')
        .map(([yakuId]) => yakuId)
        .sort(),
    ).toEqual([...PRIMARY_YAKU_IDS].sort());
    expect(
      Object.entries(YAKU_RECOMMENDATION_ROLES)
        .filter(([, role]) => role === 'upgrade')
        .map(([yakuId]) => yakuId)
        .sort(),
    ).toEqual([...UPGRADE_YAKU_IDS].sort());
    expect(
      Object.entries(YAKU_RECOMMENDATION_ROLES)
        .filter(([, role]) => role === 'catalog-only')
        .map(([yakuId]) => yakuId)
        .sort(),
    ).toEqual([...NON_RECOMMENDABLE_YAKU_IDS].sort());
  });

  it.each(EVALUABLE_YAKU_IDS)(
    '%s 완성 예시에서 한 장을 뺀 손패를 거리 1로 평가한다',
    (yakuId) => {
      const yaku = YAKUS.find(({ id }) => id === yakuId);

      if (!yaku) {
        throw new Error(`${yakuId} 역 데이터를 찾을 수 없습니다.`);
      }

      const completedTiles = yaku.example.flat();

      expect(completedTiles).toHaveLength(14);

      const evaluation = evaluateYaku(
        createHandInput(completedTiles.slice(0, 13)),
        yakuId,
      );

      expect(evaluation).toMatchObject({
        yakuId,
        requiredTileCount: 1,
      });
      expect(evaluation?.reason.length).toBeGreaterThan(0);
    },
  );

  it.each(NON_RECOMMENDABLE_YAKU_IDS)(
    '%s은 첫 손패만으로 평가하지 않는다',
    (yakuId) => {
      expect(
        evaluateYaku(createHandInput(TANYAO_TENPAI), yakuId),
      ).toBeNull();
    },
  );

  it('탕야오 일반형 텐파이를 추천 거리 1로 계산한다', () => {
    const tanyao = evaluateYaku(
      createHandInput(TANYAO_TENPAI),
      'tanyao',
    );

    expect(tanyao?.requiredTileCount).toBe(1);
    expect(tanyao?.reason).toContain('숫자패 2~8');
  });

  it('탕야오에서 치또이츠형이 더 가까우면 해당 거리를 사용한다', () => {
    const tanyao = evaluateYaku(
      createHandInput(SIMPLE_SIX_PAIRS),
      'tanyao',
    );

    expect(tanyao?.requiredTileCount).toBe(1);
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
    const chiitoitsu = evaluateYaku(
      createHandInput(tiles),
      'chiitoitsu',
    );

    expect(chiitoitsu?.requiredTileCount).toBe(3);
    expect(chiitoitsu?.reason).toContain('5개');
  });

  it('혼일색에 가장 가까운 숫자패 종류를 선택한다', () => {
    const honitsu = evaluateYaku(
      createHandInput(HONITSU_TENPAI),
      'honitsu',
    );

    expect(honitsu?.requiredTileCount).toBe(1);
    expect(honitsu?.reason).toContain('만수와 자패가 13장');
  });

  it('장풍과 자풍에 따라 역패 거리를 다르게 계산한다', () => {
    const tiles: TileId[] = [
      '1m',
      '2m',
      '3m',
      '4p',
      '5p',
      '6p',
      '7s',
      '8s',
      '9s',
      '5m',
      '5m',
      'east',
      'east',
    ];
    const eastValueEvaluation = evaluateYaku(
      {
        tiles,
        roundWind: 'east',
        seatWind: 'south',
      },
      'yakuhai',
    );
    const eastNonValueEvaluation = evaluateYaku(
      {
        tiles,
        roundWind: 'south',
        seatWind: 'west',
      },
      'yakuhai',
    );

    expect(eastValueEvaluation?.requiredTileCount).toBe(1);
    expect(eastNonValueEvaluation?.requiredTileCount).toBeGreaterThan(1);
  });

  it('혼일색은 숫자패 한 무늬와 자패를 모두 포함한 형태를 평가한다', () => {
    const chinitsuExample = YAKUS.find(
      ({ id }) => id === 'chinitsu',
    );

    if (!chinitsuExample) {
      throw new Error('청일색 역 데이터를 찾을 수 없습니다.');
    }

    const evaluation = evaluateYaku(
      createHandInput(chinitsuExample.example.flat().slice(0, 13)),
      'honitsu',
    );

    expect(evaluation?.requiredTileCount).toBeGreaterThan(1);
  });

  it('찬타는 슌쯔뿐 아니라 자패를 포함한 형태를 평가한다', () => {
    const junchanExample = YAKUS.find(
      ({ id }) => id === 'junchan',
    );

    if (!junchanExample) {
      throw new Error('준찬타 역 데이터를 찾을 수 없습니다.');
    }

    const evaluation = evaluateYaku(
      createHandInput(junchanExample.example.flat().slice(0, 13)),
      'chanta',
    );

    expect(evaluation?.requiredTileCount).toBeGreaterThan(1);
  });

  it('추천 거리가 4 이상인 역을 제외한다', () => {
    const tiles: TileId[] = [
      '2m',
      '5m',
      '8m',
      '2p',
      '5p',
      '8p',
      '2s',
      '5s',
      '8s',
      'east',
      'south',
      'white',
      'red',
    ];

    expect(recommendYaku(createHandInput(tiles))).toEqual([]);
  });

  it('또이쯔가 부족하면 치또이츠 거리가 3이어도 추천하지 않는다', () => {
    const tiles: TileId[] = [
      '1m',
      '1m',
      '1m',
      '2m',
      '2m',
      '3m',
      '3m',
      '4m',
      '4m',
      '5p',
      '6p',
      '7s',
      '8s',
    ];

    expect(
      evaluateYaku(createHandInput(tiles), 'chiitoitsu'),
    ).toMatchObject({
      requiredTileCount: 3,
    });
    expect(
      recommendYaku(createHandInput(tiles)).map(({ yakuId }) => yakuId),
    ).not.toContain('chiitoitsu');
  });

  it('정확한 또이쯔가 네 개면 치또이츠를 목표 역으로 추천할 수 있다', () => {
    const tiles: TileId[] = [
      '2m',
      '2m',
      '3m',
      '3m',
      '4p',
      '4p',
      '5p',
      '5p',
      '1s',
      '4s',
      '7s',
      'east',
      'south',
    ];

    expect(recommendYaku(createHandInput(tiles))).toContainEqual(
      expect.objectContaining({
        yakuId: 'chiitoitsu',
        requiredTileCount: 3,
        reason: expect.stringContaining('또이쯔가 4개'),
      }),
    );
  });

  it('발전 역은 거리가 1이어도 직접 추천하지 않는다', () => {
    const iipeikou = YAKUS.find(({ id }) => id === 'iipeikou');

    if (!iipeikou) {
      throw new Error('이페코 역 데이터를 찾을 수 없습니다.');
    }

    const input = createHandInput(iipeikou.example.flat().slice(0, 13));

    expect(evaluateYaku(input, 'iipeikou')).toMatchObject({
      requiredTileCount: 1,
    });
    expect(
      recommendYaku(input).map(({ yakuId }) => yakuId),
    ).not.toContain('iipeikou');
  });

  it('기존 세 역 밖의 역도 최종 추천 결과에 포함한다', () => {
    const kokushiThirteenTypes: TileId[] = [
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

    expect(
      recommendYaku(createHandInput(kokushiThirteenTypes)),
    ).toContainEqual(
      expect.objectContaining({
        yakuId: 'kokushi-musou',
        requiredTileCount: 1,
      }),
    );
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

  it('목표 역만 최대 세 개 추천한다', () => {
    const recommendations = recommendYaku(
      createHandInput(SIMPLE_SIX_PAIRS),
    );

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations.length).toBeLessThanOrEqual(3);
    expect(
      recommendations.every(
        ({ yakuId }) =>
          YAKU_RECOMMENDATION_ROLES[yakuId] === 'primary',
      ),
    ).toBe(true);
    expect(
      recommendations.every(
        ({ requiredTileCount }) => requiredTileCount <= 3,
      ),
    ).toBe(true);
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

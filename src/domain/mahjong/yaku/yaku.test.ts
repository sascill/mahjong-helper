import { describe, expect, it } from 'vitest';

import { TILES, type TileId } from '../hand';
import {
  YAKUS,
  YAKU_IDS,
  getYaku,
  type YakuId,
} from './index';

const EXPECTED_YAKU_IDS: readonly YakuId[] = [
  'riichi',
  'ippatsu',
  'menzen-tsumo',
  'pinfu',
  'iipeikou',
  'tanyao',
  'yakuhai',
  'chankan',
  'rinshan-kaihou',
  'haitei',
  'houtei',
  'double-riichi',
  'chiitoitsu',
  'ittsuu',
  'sanshoku-doujun',
  'sanshoku-doukou',
  'toitoi',
  'sanankou',
  'sankantsu',
  'chanta',
  'honroutou',
  'shousangen',
  'ryanpeikou',
  'honitsu',
  'junchan',
  'chinitsu',
  'tenhou',
  'chiihou',
  'kokushi-musou',
  'chuuren-poutou',
  'ryuuiisou',
  'suuankou',
  'suukantsu',
  'chinroutou',
  'tsuuiisou',
  'daisangen',
  'shousuushii',
  'daisuushii',
];

const countTiles = (tiles: readonly TileId[]) => {
  const counts = new Map<TileId, number>();

  for (const tileId of tiles) {
    counts.set(tileId, (counts.get(tileId) ?? 0) + 1);
  }

  return counts;
};

describe('역 데이터', () => {
  it('기준 룰의 역 38개를 중복과 누락 없이 정의한다', () => {
    const yakuIds = YAKUS.map(({ id }) => id);

    expect(YAKU_IDS).toEqual(EXPECTED_YAKU_IDS);
    expect(yakuIds).toEqual(EXPECTED_YAKU_IDS);
    expect(YAKUS).toHaveLength(38);
    expect(new Set(yakuIds)).toHaveProperty('size', YAKUS.length);
  });

  it('인화와 유국만관을 정의하지 않는다', () => {
    expect(YAKU_IDS).not.toContain('renhou');
    expect(YAKU_IDS).not.toContain('nagashi-mangan');
  });

  it('모든 역에 화면에 필요한 기본 정보를 정의한다', () => {
    for (const yaku of YAKUS) {
      expect(yaku.name).not.toHaveLength(0);
      expect(yaku.summary).not.toHaveLength(0);
      expect(yaku.requirements.length).toBeGreaterThan(0);

      if (yaku.value.type === 'han') {
        expect(yaku.value.closed).toBeGreaterThan(0);
      } else {
        expect(yaku.value.multiplier).toBe(1);
      }
    }
  });

  it('각 완성 예시를 존재하는 패로 구성한다', () => {
    const tileIds = new Set(TILES.map(({ id }) => id));

    for (const yaku of YAKUS) {
      const exampleTiles = yaku.example.flat();
      const counts = countTiles(exampleTiles);

      expect(exampleTiles).not.toHaveLength(0);
      expect(exampleTiles.every((tileId) => tileIds.has(tileId))).toBe(true);
      expect([...counts.values()].every((count) => count <= 4)).toBe(true);
    }
  });

  it('탕야오의 판수와 쿠이탕 허용을 정의한다', () => {
    expect(getYaku('tanyao').value).toEqual({
      type: 'han',
      closed: 1,
      open: 1,
    });
  });

  it('치또이츠를 멘젠 전용 2판 역으로 정의한다', () => {
    expect(getYaku('chiitoitsu').value).toEqual({
      type: 'han',
      closed: 2,
      open: null,
    });
  });

  it('혼일색의 멘젠과 울기 판수를 정의한다', () => {
    expect(getYaku('honitsu').value).toEqual({
      type: 'han',
      closed: 3,
      open: 2,
    });
  });

  it('모든 역만을 1배 역만으로 정의한다', () => {
    const yakuman = YAKUS.filter(
      ({ value }) => value.type === 'yakuman',
    );

    expect(yakuman).toHaveLength(12);

    for (const yaku of yakuman) {
      expect(yaku.value).toMatchObject({
        type: 'yakuman',
        multiplier: 1,
      });
    }
  });

  it('식별자로 요청한 역을 반환한다', () => {
    expect(getYaku('tanyao')).toBe(
      YAKUS.find(({ id }) => id === 'tanyao'),
    );
  });
});

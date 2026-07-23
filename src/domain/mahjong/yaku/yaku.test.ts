import { describe, expect, it } from 'vitest';

import { TILES } from '../hand';
import {
  YAKUS,
  getYaku,
  type YakuId,
} from './index';

const EXPECTED_YAKU_IDS: YakuId[] = [
  'tanyao',
  'chiitoitsu',
  'honitsu',
];

describe('역 데이터', () => {
  it('지원하는 역을 중복 없이 정의한다', () => {
    const yakuIds = YAKUS.map(({ id }) => id);

    expect(yakuIds).toEqual(EXPECTED_YAKU_IDS);
    expect(new Set(yakuIds)).toHaveProperty('size', YAKUS.length);
  });

  it('모든 역에 화면에 필요한 기본 정보를 정의한다', () => {
    for (const yaku of YAKUS) {
      expect(yaku.name).not.toHaveLength(0);
      expect(yaku.han.closed).toBeGreaterThan(0);
      expect(yaku.summary).not.toHaveLength(0);
      expect(yaku.requirements.length).toBeGreaterThan(0);
    }
  });

  it('각 완성 예시를 존재하는 패 14장으로 구성한다', () => {
    const tileIds = new Set(TILES.map(({ id }) => id));

    for (const yaku of YAKUS) {
      const exampleTiles = yaku.example.flat();

      expect(exampleTiles).toHaveLength(14);
      expect(exampleTiles.every((tileId) => tileIds.has(tileId))).toBe(true);
    }
  });

  it('탕야오의 판수를 정의한다', () => {
    expect(getYaku('tanyao').han).toEqual({
      closed: 1,
      open: 1,
    });
  });

  it('치또이츠를 멘젠 전용 2판 역으로 정의한다', () => {
    expect(getYaku('chiitoitsu').han).toEqual({
      closed: 2,
      open: null,
    });
  });

  it('혼일색의 멘젠과 울기 판수를 정의한다', () => {
    expect(getYaku('honitsu').han).toEqual({
      closed: 3,
      open: 2,
    });
  });

  it('식별자로 요청한 역을 반환한다', () => {
    expect(getYaku('tanyao')).toBe(
      YAKUS.find(({ id }) => id === 'tanyao'),
    );
  });
});

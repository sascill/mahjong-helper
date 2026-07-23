import { YAKUS } from './yakus';
import type { Yaku, YakuId } from './types';

export function getYaku(yakuId: YakuId): Yaku {
  const yaku = YAKUS.find(({ id }) => id === yakuId);

  if (!yaku) {
    throw new Error(`정의되지 않은 역입니다: ${yakuId}`);
  }

  return yaku;
}

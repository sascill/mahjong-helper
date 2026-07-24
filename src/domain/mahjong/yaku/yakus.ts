import { HIGH_VALUE_YAKUS } from './data/highValueYakus';
import { ONE_HAN_YAKUS } from './data/oneHanYakus';
import { TWO_HAN_YAKUS } from './data/twoHanYakus';
import { YAKUMAN_YAKUS } from './data/yakumanYakus';
import type { Yaku } from './types';

export const YAKUS: readonly Yaku[] = [
  ...ONE_HAN_YAKUS,
  ...TWO_HAN_YAKUS,
  ...HIGH_VALUE_YAKUS,
  ...YAKUMAN_YAKUS,
];

import type { TileId } from '../hand';

export const YAKU_IDS = [
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
] as const;

export type YakuId = (typeof YAKU_IDS)[number];

export type HanValue = {
  type: 'han';
  closed: number;
  open: number | null;
};

export type YakumanValue = {
  type: 'yakuman';
  open: boolean;
  multiplier: 1;
};

export type YakuValue = HanValue | YakumanValue;

export type YakuExample = readonly (readonly TileId[])[];

export type Yaku = {
  id: YakuId;
  name: string;
  value: YakuValue;
  summary: string;
  requirements: readonly string[];
  example: YakuExample;
};

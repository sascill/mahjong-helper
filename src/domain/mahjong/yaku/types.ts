import type { TileId } from '../hand';

export type YakuId =
  | 'tanyao'
  | 'chiitoitsu'
  | 'honitsu';

export type YakuHan = {
  closed: number;
  open: number | null;
};

export type YakuExample = readonly (readonly TileId[])[];

export type Yaku = {
  id: YakuId;
  name: string;
  han: YakuHan;
  summary: string;
  requirements: readonly string[];
  example: YakuExample;
};

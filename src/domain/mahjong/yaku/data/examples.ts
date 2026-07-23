import type { YakuExample } from '../types';

export const STANDARD_CLOSED_EXAMPLE = [
  ['1m', '2m', '3m'],
  ['4m', '5m', '6m'],
  ['7p', '8p', '9p'],
  ['2s', '3s', '4s'],
  ['5p', '5p'],
] as const satisfies YakuExample;

export const TRIPLET_EXAMPLE = [
  ['2m', '2m', '2m'],
  ['5p', '5p', '5p'],
  ['7s', '7s', '7s'],
  ['east', 'east', 'east'],
  ['white', 'white'],
] as const satisfies YakuExample;

import {
  TILES,
  type HandInput,
  type TileId,
} from '../../hand';
import {
  ALL_SEQUENCE_MELDS,
  DRAGON_TILE_IDS,
  NUMBER_SUITS,
  createSequenceMeld,
  calculateStandardShapeDistance,
  type MeldCandidate,
} from '../lib/distance';
import type { YakuEvaluation } from '../types';
import {
  calculateRequiredPatternDistance,
  createShapeEvaluation,
} from './helpers';

export function evaluatePinfu(input: HandInput): YakuEvaluation {
  const valueWindIds = new Set<TileId>([
    input.roundWind,
    input.seatWind,
  ]);
  const pairTileIds = TILES.filter(
    ({ id }) =>
      !DRAGON_TILE_IDS.includes(id) && !valueWindIds.has(id),
  ).map(({ id }) => id);
  const distance = calculateStandardShapeDistance(input.tiles, {
    meldCandidates: ALL_SEQUENCE_MELDS,
    pairTileIds,
    minimumSequenceCount: 4,
  });

  return createShapeEvaluation(
    'pinfu',
    distance,
    '네 개의 슌쯔와 가치패가 아닌 머리',
  );
}

export function evaluateIipeikou(
  input: HandInput,
): YakuEvaluation {
  const patterns = ALL_SEQUENCE_MELDS.map((sequence) => [
    sequence,
    sequence,
  ]);

  return createShapeEvaluation(
    'iipeikou',
    calculateRequiredPatternDistance(input.tiles, patterns),
    '같은 슌쯔 두 개',
  );
}

export function evaluateIttsuu(input: HandInput): YakuEvaluation {
  const patterns = NUMBER_SUITS.map((suit) => [
    createSequenceMeld(suit, 1),
    createSequenceMeld(suit, 4),
    createSequenceMeld(suit, 7),
  ]);

  return createShapeEvaluation(
    'ittsuu',
    calculateRequiredPatternDistance(input.tiles, patterns),
    '한 무늬의 123·456·789 슌쯔',
  );
}

export function evaluateSanshokuDoujun(
  input: HandInput,
): YakuEvaluation {
  const patterns = Array.from({ length: 7 }, (_, index) => {
    const start = index + 1;

    return NUMBER_SUITS.map((suit) =>
      createSequenceMeld(suit, start),
    );
  });

  return createShapeEvaluation(
    'sanshoku-doujun',
    calculateRequiredPatternDistance(input.tiles, patterns),
    '세 무늬의 같은 숫자 슌쯔',
  );
}

export function evaluateRyanpeikou(
  input: HandInput,
): YakuEvaluation {
  const patterns: MeldCandidate[][] = [];

  for (
    let firstIndex = 0;
    firstIndex < ALL_SEQUENCE_MELDS.length;
    firstIndex += 1
  ) {
    for (
      let secondIndex = firstIndex;
      secondIndex < ALL_SEQUENCE_MELDS.length;
      secondIndex += 1
    ) {
      const first = ALL_SEQUENCE_MELDS[firstIndex];
      const second = ALL_SEQUENCE_MELDS[secondIndex];

      patterns.push([first, first, second, second]);
    }
  }

  return createShapeEvaluation(
    'ryanpeikou',
    calculateRequiredPatternDistance(input.tiles, patterns),
    '같은 슌쯔 두 쌍',
  );
}

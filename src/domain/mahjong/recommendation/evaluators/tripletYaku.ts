import type { HandInput } from '../../hand';
import {
  ALL_MELDS,
  ALL_TILE_IDS,
  ALL_TRIPLET_MELDS,
  DRAGON_TILE_IDS,
  NUMBER_SUITS,
  WIND_TILE_IDS,
  calculateStandardShapeDistance,
  createTripletMeld,
  getNumberTileId,
} from '../lib/distance';
import type { YakuEvaluation } from '../types';
import {
  calculateRequiredPatternDistance,
  createEvaluation,
  createShapeEvaluation,
} from './helpers';

export function evaluateYakuhai(input: HandInput): YakuEvaluation {
  const valueTileIds = [
    ...DRAGON_TILE_IDS,
    input.roundWind,
    input.seatWind,
  ].filter(
    (tileId, index, tileIds) => tileIds.indexOf(tileId) === index,
  );
  const patterns = valueTileIds.map((tileId) => [
    createTripletMeld(tileId),
  ]);

  return createEvaluation(
    'yakuhai',
    calculateRequiredPatternDistance(input.tiles, patterns),
    `백·발·중과 현재 장풍·자풍 중 ${valueTileIds.length}종을 가치패로 평가했습니다.`,
  );
}

export function evaluateSanshokuDoukou(
  input: HandInput,
): YakuEvaluation {
  const patterns = Array.from({ length: 9 }, (_, index) => {
    const value = index + 1;

    return NUMBER_SUITS.map((suit) =>
      createTripletMeld(getNumberTileId(suit, value)),
    );
  });

  return createShapeEvaluation(
    'sanshoku-doukou',
    calculateRequiredPatternDistance(input.tiles, patterns),
    '세 무늬의 같은 숫자 커쯔',
  );
}

export function evaluateToitoi(input: HandInput): YakuEvaluation {
  return createShapeEvaluation(
    'toitoi',
    calculateStandardShapeDistance(input.tiles, {
      meldCandidates: ALL_TRIPLET_MELDS,
      pairTileIds: ALL_TILE_IDS,
      minimumTripletCount: 4,
    }),
    '네 개의 커쯔',
  );
}

export function evaluateSanankou(
  input: HandInput,
): YakuEvaluation {
  return createShapeEvaluation(
    'sanankou',
    calculateStandardShapeDistance(input.tiles, {
      meldCandidates: ALL_MELDS,
      pairTileIds: ALL_TILE_IDS,
      minimumTripletCount: 3,
    }),
    '멘젠을 유지한 커쯔 세 개',
  );
}

export function evaluateShousangen(
  input: HandInput,
): YakuEvaluation {
  let bestDistance = 14;

  for (const pairTileId of DRAGON_TILE_IDS) {
    const tripletTileIds = DRAGON_TILE_IDS.filter(
      (tileId) => tileId !== pairTileId,
    );

    bestDistance = Math.min(
      bestDistance,
      calculateStandardShapeDistance(input.tiles, {
        meldCandidates: ALL_MELDS,
        pairTileIds: [pairTileId],
        requiredMelds: tripletTileIds.map(createTripletMeld),
      }),
    );
  }

  return createShapeEvaluation(
    'shousangen',
    bestDistance,
    '삼원패 커쯔 두 개와 머리 하나',
  );
}

export function evaluateSuuankou(
  input: HandInput,
): YakuEvaluation {
  return createShapeEvaluation(
    'suuankou',
    calculateStandardShapeDistance(input.tiles, {
      meldCandidates: ALL_TRIPLET_MELDS,
      pairTileIds: ALL_TILE_IDS,
      minimumTripletCount: 4,
    }),
    '멘젠을 유지한 커쯔 네 개',
  );
}

export function evaluateDaisangen(
  input: HandInput,
): YakuEvaluation {
  return createShapeEvaluation(
    'daisangen',
    calculateStandardShapeDistance(input.tiles, {
      meldCandidates: ALL_MELDS,
      pairTileIds: ALL_TILE_IDS,
      requiredMelds: DRAGON_TILE_IDS.map(createTripletMeld),
    }),
    '백·발·중 커쯔 세 개',
  );
}

export function evaluateShousuushii(
  input: HandInput,
): YakuEvaluation {
  let bestDistance = 14;

  for (const pairTileId of WIND_TILE_IDS) {
    const tripletTileIds = WIND_TILE_IDS.filter(
      (tileId) => tileId !== pairTileId,
    );

    bestDistance = Math.min(
      bestDistance,
      calculateStandardShapeDistance(input.tiles, {
        meldCandidates: ALL_MELDS,
        pairTileIds: [pairTileId],
        requiredMelds: tripletTileIds.map(createTripletMeld),
      }),
    );
  }

  return createShapeEvaluation(
    'shousuushii',
    bestDistance,
    '풍패 커쯔 세 개와 머리 하나',
  );
}

export function evaluateDaisuushii(
  input: HandInput,
): YakuEvaluation {
  return createShapeEvaluation(
    'daisuushii',
    calculateStandardShapeDistance(input.tiles, {
      meldCandidates: ALL_MELDS,
      pairTileIds: ALL_TILE_IDS,
      requiredMelds: WIND_TILE_IDS.map(createTripletMeld),
    }),
    '동·남·서·북 커쯔 네 개',
  );
}

import { describe, expect, it } from 'vitest';

import type { HandFeatures } from './handFeatures';
import {
  RECOMMENDATION_POLICIES,
  type RecommendationTargetYakuId,
} from './policies';

const BASE_FEATURES: HandFeatures = {
  exactPairCount: 0,
  pairCandidateCount: 0,
  tripletCount: 0,
  simpleTileCount: 0,
  terminalOrHonorCount: 13,
  suitCounts: {
    man: 0,
    pin: 0,
    sou: 0,
  },
  honorCount: 0,
  dominantSuit: 'man',
  dominantSuitCount: 0,
  dominantSuitAndHonorCount: 0,
  valuePairCount: 0,
  sequenceCandidateCount: 0,
  ittsuuSegmentCandidateCount: 0,
  sanshokuSuitCandidateCount: 0,
  outsideSequenceCandidateCount: 0,
  orphanUniqueCount: 0,
};

const ELIGIBILITY_CASES: readonly {
  yakuId: RecommendationTargetYakuId;
  eligible: Partial<HandFeatures>;
  ineligible: Partial<HandFeatures>;
}[] = [
  {
    yakuId: 'tanyao',
    eligible: { terminalOrHonorCount: 3 },
    ineligible: { terminalOrHonorCount: 4 },
  },
  {
    yakuId: 'pinfu',
    eligible: {
      sequenceCandidateCount: 3,
      pairCandidateCount: 1,
    },
    ineligible: {
      sequenceCandidateCount: 2,
      pairCandidateCount: 1,
    },
  },
  {
    yakuId: 'yakuhai',
    eligible: { valuePairCount: 1 },
    ineligible: { valuePairCount: 0 },
  },
  {
    yakuId: 'chiitoitsu',
    eligible: { exactPairCount: 4 },
    ineligible: { exactPairCount: 3 },
  },
  {
    yakuId: 'toitoi',
    eligible: { pairCandidateCount: 3 },
    ineligible: { pairCandidateCount: 2 },
  },
  {
    yakuId: 'honitsu',
    eligible: {
      dominantSuitCount: 5,
      dominantSuitAndHonorCount: 9,
      honorCount: 1,
    },
    ineligible: {
      dominantSuitCount: 5,
      dominantSuitAndHonorCount: 9,
      honorCount: 0,
    },
  },
  {
    yakuId: 'ittsuu',
    eligible: { ittsuuSegmentCandidateCount: 2 },
    ineligible: { ittsuuSegmentCandidateCount: 1 },
  },
  {
    yakuId: 'sanshoku-doujun',
    eligible: { sanshokuSuitCandidateCount: 2 },
    ineligible: { sanshokuSuitCandidateCount: 1 },
  },
  {
    yakuId: 'chanta',
    eligible: {
      terminalOrHonorCount: 5,
      outsideSequenceCandidateCount: 1,
    },
    ineligible: {
      terminalOrHonorCount: 5,
      outsideSequenceCandidateCount: 0,
    },
  },
  {
    yakuId: 'kokushi-musou',
    eligible: { orphanUniqueCount: 9 },
    ineligible: { orphanUniqueCount: 8 },
  },
];

describe('역 추천 정책', () => {
  it.each(ELIGIBILITY_CASES)(
    '$yakuId의 최소 특징 경계값을 적용한다',
    ({ yakuId, eligible, ineligible }) => {
      const policy = RECOMMENDATION_POLICIES.find(
        (candidate) => candidate.yakuId === yakuId,
      );

      if (!policy) {
        throw new Error(`${yakuId} 추천 정책을 찾을 수 없습니다.`);
      }

      const eligibleFeatures = {
        ...BASE_FEATURES,
        ...eligible,
      };

      expect(policy.isEligible(eligibleFeatures)).toBe(true);
      expect(policy.createReason(eligibleFeatures).length).toBeGreaterThan(0);
      expect(
        policy.isEligible({
          ...BASE_FEATURES,
          ...ineligible,
        }),
      ).toBe(false);
    },
  );
});

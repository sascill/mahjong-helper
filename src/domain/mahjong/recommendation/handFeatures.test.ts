import { describe, expect, it } from 'vitest';

import type { HandInput } from '../hand';
import { extractHandFeatures } from './handFeatures';

describe('손패 특징 추출', () => {
  it('추천 정책에서 공통으로 쓰는 특징을 한 번에 계산한다', () => {
    const input: HandInput = {
      tiles: [
        '1m',
        '2m',
        '3m',
        '4m',
        '5m',
        '2p',
        '2p',
        'green',
        'green',
        'green',
        'east',
        'east',
        '9s',
      ],
      roundWind: 'east',
      seatWind: 'south',
    };

    expect(extractHandFeatures(input)).toMatchObject({
      exactPairCount: 2,
      pairCandidateCount: 3,
      tripletCount: 1,
      simpleTileCount: 6,
      terminalOrHonorCount: 7,
      suitCounts: {
        man: 5,
        pin: 2,
        sou: 1,
      },
      honorCount: 5,
      dominantSuit: 'man',
      dominantSuitCount: 5,
      dominantSuitAndHonorCount: 10,
      valuePairCount: 2,
      sequenceCandidateCount: 4,
      ittsuuSegmentCandidateCount: 2,
      sanshokuSuitCandidateCount: 1,
      outsideSequenceCandidateCount: 1,
      orphanUniqueCount: 4,
    });
  });
});

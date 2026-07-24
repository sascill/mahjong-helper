import { useState } from 'react'

import type { Yaku } from '../../../domain/mahjong/yaku'
import { MahjongTile } from '../../../shared/ui'
import styles from '../YakuCatalog.module.css'
import { getDetailValueLabels } from '../lib/yakuPresentation'
import { InlineGlossaryText } from './InlineGlossaryText'

type YakuDetailProps = {
  yaku: Yaku
}

export function YakuDetail({ yaku }: YakuDetailProps) {
  const valueLabels = getDetailValueLabels(yaku)
  const [activeGlossaryKey, setActiveGlossaryKey] = useState<string | null>(
    null,
  )

  return (
    <>
      <header className={styles.detailHeader}>
        <p className={styles.eyebrow}>역 상세</p>
        <div className={styles.detailTitleRow}>
          <h1>{yaku.name}</h1>
          <div
            className={styles.detailMeta}
            role="group"
            aria-label="판수와 울기 조건"
          >
            {valueLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
        <p className={styles.description}>
          <InlineGlossaryText
            text={yaku.summary}
            blockId={`${yaku.id}-summary`}
            activeKey={activeGlossaryKey}
            onToggle={setActiveGlossaryKey}
          />
        </p>
      </header>

      <section className={styles.infoCard} aria-labelledby="requirements-title">
        <h2 id="requirements-title">성립하는 모양</h2>
        <ul className={styles.requirements}>
          {yaku.requirements.map((requirement, index) => (
            <li key={requirement}>
              <InlineGlossaryText
                text={requirement}
                blockId={`${yaku.id}-requirement-${index}`}
                activeKey={activeGlossaryKey}
                onToggle={setActiveGlossaryKey}
              />
            </li>
          ))}
        </ul>
      </section>

      <section
        className={styles.exampleCard}
        aria-label={`${yaku.name} 완성 예시`}
      >
        <h2>완성 예시</h2>
        <ul className={styles.exampleGroups}>
          {yaku.example.map((group, groupIndex) => (
            <li className={styles.exampleGroup} key={groupIndex}>
              {group.map((tileId, tileIndex) => (
                <MahjongTile
                  key={`${tileId}-${tileIndex}`}
                  tileId={tileId}
                />
              ))}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

import type { Yaku } from '../../../domain/mahjong/yaku'
import { MahjongTile } from '../../../shared/ui'
import styles from '../YakuCatalog.module.css'
import { getDetailValueLabels } from '../lib/yakuPresentation'

type YakuDetailProps = {
  yaku: Yaku
}

export function YakuDetail({ yaku }: YakuDetailProps) {
  const valueLabels = getDetailValueLabels(yaku)

  return (
    <>
      <header className={styles.detailHeader}>
        <p className={styles.eyebrow}>역 상세</p>
        <h1>{yaku.name}</h1>
        <p className={styles.description}>{yaku.summary}</p>
        <div
          className={styles.detailMeta}
          role="group"
          aria-label="판수와 울기 조건"
        >
          {valueLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </header>

      <section className={styles.infoCard} aria-labelledby="requirements-title">
        <h2 id="requirements-title">성립하는 모양</h2>
        <ul className={styles.requirements}>
          {yaku.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
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

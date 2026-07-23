import { Link } from 'react-router'

import type { Yaku } from '../../../domain/mahjong/yaku'
import { MahjongTile } from '../../../shared/ui'
import styles from '../YakuCatalog.module.css'

type YakuDetailProps = {
  yaku: Yaku
}

export function YakuDetail({ yaku }: YakuDetailProps) {
  const canOpen = yaku.han.open !== null

  return (
    <>
      <Link className={styles.backLink} to="/yaku">
        ← 역 목록으로
      </Link>

      <header className={styles.detailHeader}>
        <p className={styles.eyebrow}>역 상세</p>
        <h1>{yaku.name}</h1>
        <p className={styles.description}>{yaku.summary}</p>
      </header>

      <section
        className={styles.infoCard}
        aria-label="판수와 울기 조건"
      >
        <h2>판수와 조건</h2>
        <div className={styles.hanList}>
          <span>멘젠 {yaku.han.closed}판</span>
          <span>
            {canOpen ? `울기 ${yaku.han.open}판` : '울기 불가'}
          </span>
        </div>
        <div className={styles.statusList}>
          <span>{canOpen ? '멘젠 필수 아님' : '멘젠 필수'}</span>
          <span>{canOpen ? '치·퐁·깡 가능' : '치·퐁·깡 불가'}</span>
        </div>
      </section>

      <section className={styles.infoCard} aria-labelledby="requirements-title">
        <h2 id="requirements-title">성립 조건</h2>
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

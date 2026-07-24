import { Link } from 'react-router'

import type { Yaku } from '../../../domain/mahjong/yaku'
import styles from '../YakuCatalog.module.css'
import {
  getOpenValueLabel,
  getPrimaryValueLabel,
  groupYakus,
} from '../lib/yakuPresentation'

type YakuListProps = {
  yakus: readonly Yaku[]
}

export function YakuList({ yakus }: YakuListProps) {
  const groups = groupYakus(yakus)

  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>리치마작 역 정보</p>
        <h1>역 도감</h1>
        <p className={styles.description}>
          현재 지원하는 역의 조건과 완성 형태를 살펴보세요.
        </p>
      </header>

      <section
        className={styles.list}
        aria-label="지원하는 역"
      >
        {groups.map((group) => (
          <section
            className={styles.listGroup}
            aria-label={`${group.label} 역`}
            key={group.label}
          >
            <h2>{group.label}</h2>
            <div className={styles.groupCards}>
              {group.yakus.map((yaku) => (
                <article className={styles.listCard} key={yaku.id}>
                  <Link
                    className={styles.listCardLink}
                    to={`/yaku/${yaku.id}`}
                    aria-label={`${yaku.name} 상세 보기`}
                  >
                    <div className={styles.listCardTitle}>
                      <h3>{yaku.name}</h3>
                      <span>{getPrimaryValueLabel(yaku)}</span>
                    </div>
                    <p>{yaku.summary}</p>
                    <div className={styles.listCardFooter}>
                      <span>{getOpenValueLabel(yaku)}</span>
                      <span aria-hidden="true">자세히 보기 →</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>
    </>
  )
}

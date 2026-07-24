import { Link } from 'react-router'

import type { Yaku } from '../../../domain/mahjong/yaku'
import styles from '../YakuCatalog.module.css'
import {
  getCompactYakuSummary,
  getYakuGroupAnchorId,
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
        <h1>역 정보</h1>
      </header>

      <nav
        className={styles.groupNavigation}
        aria-label="판수별 역 바로가기"
      >
        {groups.map((group) => (
          <a
            className={styles.groupNavigationLink}
            href={`#${getYakuGroupAnchorId(group.label)}`}
            key={group.label}
          >
            {group.label}
          </a>
        ))}
      </nav>

      <section
        className={styles.list}
        aria-label="지원하는 역"
      >
        {groups.map((group) => (
          <section
            className={styles.listGroup}
            aria-label={`${group.label} 역`}
            id={getYakuGroupAnchorId(group.label)}
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
                    <p>{getCompactYakuSummary(yaku)}</p>
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

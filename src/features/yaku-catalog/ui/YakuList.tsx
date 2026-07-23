import { Link } from 'react-router'

import type { Yaku } from '../../../domain/mahjong/yaku'
import styles from '../YakuCatalog.module.css'

type YakuListProps = {
  yakus: readonly Yaku[]
}

function getOpenHanLabel(yaku: Yaku) {
  return yaku.han.open === null
    ? '멘젠 전용'
    : `울기 ${yaku.han.open}판`
}

export function YakuList({ yakus }: YakuListProps) {
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
        {yakus.map((yaku) => (
          <article className={styles.listCard} key={yaku.id}>
            <Link
              className={styles.listCardLink}
              to={`/yaku/${yaku.id}`}
              aria-label={`${yaku.name} 상세 보기`}
            >
              <div className={styles.listCardTitle}>
                <h2>{yaku.name}</h2>
                <span>멘젠 {yaku.han.closed}판</span>
              </div>
              <p>{yaku.summary}</p>
              <div className={styles.listCardFooter}>
                <span>{getOpenHanLabel(yaku)}</span>
                <span aria-hidden="true">자세히 보기 →</span>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </>
  )
}

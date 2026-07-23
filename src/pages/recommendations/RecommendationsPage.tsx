import { Link, Navigate } from 'react-router'

import {
  TILES,
  type Tile,
  type TileId,
  type Wind,
} from '../../domain/mahjong/hand'
import { getYaku } from '../../domain/mahjong/yaku'
import { useHandAnalysis } from '../../features/hand-analysis'
import styles from './RecommendationsPage.module.css'

const WIND_LABELS: Record<Wind, string> = {
  east: '동',
  south: '남',
  west: '서',
  north: '북',
}

const HONOR_LABELS: Partial<Record<TileId, string>> = {
  east: '동',
  south: '남',
  west: '서',
  north: '북',
  white: '백',
  green: '발',
  red: '중',
}

const SUIT_LABELS = {
  man: '만',
  pin: '통',
  sou: '삭',
} as const

function getTile(tileId: TileId): Tile {
  const tile = TILES.find((candidate) => candidate.id === tileId)

  if (!tile) {
    throw new Error(`정의되지 않은 패입니다: ${tileId}`)
  }

  return tile
}

function getTileLabel(tile: Tile): string {
  if (tile.suit === 'honor') {
    return HONOR_LABELS[tile.id] ?? tile.id
  }

  return `${tile.value}${SUIT_LABELS[tile.suit]}`
}

function RecommendationsPage() {
  const { result } = useHandAnalysis()

  if (!result) {
    return <Navigate to="/hand" replace />
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>첫 손패 분석 결과</p>
        <h1>노려볼 만한 역</h1>
        <p className={styles.description}>
          목표를 하나 정한 뒤 직접 조패해 보세요.
        </p>
      </header>

      <section className={styles.handCard} aria-label="분석한 손패">
        <div className={styles.handCardHeader}>
          <h2>분석한 손패</h2>
          <span className={styles.tileCount}>13장</span>
        </div>

        <div className={styles.tiles}>
          {result.input.tiles.map((tileId, index) => {
            const tile = getTile(tileId)

            return (
              <span
                className={styles.tile}
                key={`${tileId}-${index}`}
                role="img"
                aria-label={getTileLabel(tile)}
              >
                {tile.symbol}
              </span>
            )
          })}
        </div>

        <div className={styles.winds}>
          <span className={styles.wind}>
            장풍 {WIND_LABELS[result.input.roundWind]}
          </span>
          <span className={styles.wind}>
            자풍 {WIND_LABELS[result.input.seatWind]}
          </span>
        </div>
      </section>

      <section
        className={styles.resultSection}
        aria-label="추천 결과"
      >
        {result.recommendations.length === 0 ? (
          <div className={styles.emptyResult}>
            <p>현재 기준으로 추천할 역이 없습니다.</p>
          </div>
        ) : (
          result.recommendations.map((recommendation, index) => {
            const yaku = getYaku(recommendation.yakuId)

            return (
              <article
                className={styles.recommendationCard}
                key={yaku.id}
                aria-label={`${yaku.name} 추천`}
              >
                <div className={styles.recommendationMeta}>
                  <span className={styles.rank}>추천 {index + 1}</span>
                  <span className={styles.distance}>
                    완성까지 {recommendation.requiredTileCount}장
                  </span>
                </div>
                <div className={styles.recommendationTitle}>
                  <h2>{yaku.name}</h2>
                  <p className={styles.han}>
                    멘젠 {yaku.han.closed}판
                  </p>
                </div>
                <p className={styles.reason}>{recommendation.reason}</p>
              </article>
            )
          })
        )}
      </section>

      <Link className={styles.backLink} to="/hand">
        손패 다시 선택하기
      </Link>
    </main>
  )
}

export default RecommendationsPage

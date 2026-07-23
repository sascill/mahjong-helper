import type { FormEvent } from 'react'

import type { HandInput, Wind } from '../../domain/mahjong/hand'
import { getTile, getTileLabel } from './lib/tilePresentation'
import {
  useHandSelection,
  type SelectedWind,
} from './model/useHandSelection'
import styles from './HandSelection.module.css'
import TilePalette from './ui/TilePalette'

type HandSelectionProps = {
  onAnalyze: (input: HandInput) => void
}

const WIND_OPTIONS: { label: string; value: Wind }[] = [
  { label: '동', value: 'east' },
  { label: '남', value: 'south' },
  { label: '서', value: 'west' },
  { label: '북', value: 'north' },
]

function HandSelection({ onAnalyze }: HandSelectionProps) {
  const selection = useHandSelection()

  const analyze = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (selection.analysisInput) {
      onAnalyze(selection.analysisInput)
    }
  }

  return (
    <form className={styles.form} onSubmit={analyze}>
      <section
        className={`${styles.section} ${styles.handSection}`}
        aria-label="선택한 손패"
      >
        <div className={styles.sectionHeader}>
          <h2>선택한 손패</h2>
          <output className={styles.count}>
            {selection.tiles.length} / 13
          </output>
        </div>

        <div className={styles.selectedTiles}>
          {selection.tiles.length === 0 ? (
            <p className={styles.emptyHand}>아래에서 패를 선택해 주세요.</p>
          ) : (
            selection.tiles.map((tileId, index) => {
              const tile = getTile(tileId)
              const tileLabel = getTileLabel(tile)

              return (
                <button
                  className={styles.tileButton}
                  key={`${tileId}-${index}`}
                  type="button"
                  aria-label={`선택한 ${tileLabel} 제거`}
                  onClick={() => selection.removeTile(index)}
                >
                  {tile.symbol}
                </button>
              )
            })
          )}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="wind-title">
        <div className={styles.sectionHeader}>
          <h2 id="wind-title">장풍과 자풍</h2>
        </div>

        <div className={styles.windFields}>
          <label>
            장풍
            <select
              value={selection.roundWind}
              onChange={(event) =>
                selection.setRoundWind(event.target.value as SelectedWind)
              }
            >
              <option value="">선택</option>
              {WIND_OPTIONS.map((wind) => (
                <option key={wind.value} value={wind.value}>
                  {wind.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            자풍
            <select
              value={selection.seatWind}
              onChange={(event) =>
                selection.setSeatWind(event.target.value as SelectedWind)
              }
            >
              <option value="">선택</option>
              {WIND_OPTIONS.map((wind) => (
                <option key={wind.value} value={wind.value}>
                  {wind.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <TilePalette
        canSelectTile={selection.canSelectTile}
        onSelectTile={selection.addTile}
      />

      <div className={styles.actions}>
        <button
          className={styles.resetButton}
          type="button"
          onClick={selection.reset}
        >
          초기화
        </button>
        <button
          className={styles.analyzeButton}
          type="submit"
          disabled={!selection.analysisInput}
        >
          분석하기
        </button>
      </div>
    </form>
  )
}

export default HandSelection

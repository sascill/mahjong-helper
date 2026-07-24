import type { FormEvent } from 'react'

import type { HandInput } from '../../domain/mahjong/hand'
import {
  getTile,
  getTileLabel,
} from '../../shared/lib/tilePresentation'
import { useHandSelection } from './model/useHandSelection'
import styles from './HandSelection.module.css'
import TilePalette from './ui/TilePalette'
import WindStepper from './ui/WindStepper'

type HandSelectionProps = {
  onAnalyze: (input: HandInput) => void
}

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
          <WindStepper
            label="장풍"
            value={selection.roundWind}
            onChange={selection.setRoundWind}
          />
          <WindStepper
            label="자풍"
            value={selection.seatWind}
            onChange={selection.setSeatWind}
          />
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

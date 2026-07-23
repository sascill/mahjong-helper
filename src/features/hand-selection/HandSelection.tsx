import { useState, type FormEvent } from 'react'

import {
  TILES,
  canAddTile,
  sortTiles,
  validateHandInput,
  type HandInput,
  type Tile,
  type TileId,
  type TileSuit,
  type Wind,
} from '../../domain/mahjong/hand'
import styles from './HandSelection.module.css'

type HandSelectionProps = {
  onAnalyze: (input: HandInput) => void
}

type SelectedWind = Wind | ''

const TILE_GROUPS: { label: string; suit: TileSuit }[] = [
  { label: '만수', suit: 'man' },
  { label: '통수', suit: 'pin' },
  { label: '삭수', suit: 'sou' },
  { label: '자패', suit: 'honor' },
]

const WIND_OPTIONS: { label: string; value: Wind }[] = [
  { label: '동', value: 'east' },
  { label: '남', value: 'south' },
  { label: '서', value: 'west' },
  { label: '북', value: 'north' },
]

const HONOR_LABELS: Record<string, string> = {
  east: '동',
  south: '남',
  west: '서',
  north: '북',
  white: '백',
  green: '발',
  red: '중',
}

const TILE_BY_ID = new Map(TILES.map((tile) => [tile.id, tile]))

const getTileLabel = (tile: Tile): string => {
  if (tile.suit === 'honor') {
    return HONOR_LABELS[tile.id]
  }

  const suitLabel = {
    man: '만',
    pin: '통',
    sou: '삭',
  }[tile.suit]

  return `${tile.value}${suitLabel}`
}

const getTile = (tileId: TileId): Tile => {
  const tile = TILE_BY_ID.get(tileId)

  if (!tile) {
    throw new Error(`정의되지 않은 패입니다: ${tileId}`)
  }

  return tile
}

function HandSelection({ onAnalyze }: HandSelectionProps) {
  const [tiles, setTiles] = useState<TileId[]>([])
  const [roundWind, setRoundWind] = useState<SelectedWind>('')
  const [seatWind, setSeatWind] = useState<SelectedWind>('')

  const addTile = (tileId: TileId) => {
    setTiles((currentTiles) =>
      canAddTile(currentTiles, tileId)
        ? sortTiles([...currentTiles, tileId])
        : currentTiles,
    )
  }

  const removeTile = (tileIndex: number) => {
    setTiles((currentTiles) =>
      currentTiles.filter((_, index) => index !== tileIndex),
    )
  }

  const reset = () => {
    setTiles([])
    setRoundWind('')
    setSeatWind('')
  }

  const canAnalyze =
    roundWind !== '' &&
    seatWind !== '' &&
    validateHandInput({
      tiles,
      roundWind,
      seatWind,
    }).valid

  const analyze = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canAnalyze) {
      return
    }

    onAnalyze({
      tiles: [...tiles],
      roundWind,
      seatWind,
    })
  }

  return (
    <form className={styles.form} onSubmit={analyze}>
      <section className={styles.section} aria-label="선택한 손패">
        <div className={styles.sectionHeader}>
          <h2>선택한 손패</h2>
          <output className={styles.count}>{tiles.length} / 13</output>
        </div>

        <div className={styles.selectedTiles}>
          {tiles.length === 0 ? (
            <p className={styles.emptyHand}>아래에서 패를 선택해 주세요.</p>
          ) : (
            tiles.map((tileId, index) => {
              const tile = getTile(tileId)
              const tileLabel = getTileLabel(tile)

              return (
                <button
                  className={styles.tileButton}
                  key={`${tileId}-${index}`}
                  type="button"
                  aria-label={`선택한 ${tileLabel} 제거`}
                  onClick={() => removeTile(index)}
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
              value={roundWind}
              onChange={(event) =>
                setRoundWind(event.target.value as SelectedWind)
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
              value={seatWind}
              onChange={(event) =>
                setSeatWind(event.target.value as SelectedWind)
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

      <div className={styles.tileGroups}>
        {TILE_GROUPS.map((group) => (
          <fieldset className={styles.tileGroup} key={group.suit}>
            <legend>{group.label}</legend>
            <div className={styles.tileGrid}>
              {TILES.filter((tile) => tile.suit === group.suit).map((tile) => {
                const tileLabel = getTileLabel(tile)

                return (
                  <button
                    className={styles.tileButton}
                    key={tile.id}
                    type="button"
                    aria-label={`${tileLabel} 추가`}
                    disabled={!canAddTile(tiles, tile.id)}
                    onClick={() => addTile(tile.id)}
                  >
                    {tile.symbol}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.resetButton}
          type="button"
          onClick={reset}
        >
          초기화
        </button>
        <button
          className={styles.analyzeButton}
          type="submit"
          disabled={!canAnalyze}
        >
          분석하기
        </button>
      </div>
    </form>
  )
}

export default HandSelection

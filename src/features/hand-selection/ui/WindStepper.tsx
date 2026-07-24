import type { Wind } from '../../../domain/mahjong/hand'
import styles from '../HandSelection.module.css'

const WINDS: readonly Wind[] = ['east', 'south', 'west', 'north']

const WIND_LABELS: Record<Wind, string> = {
  east: '동',
  south: '남',
  west: '서',
  north: '북',
}

type WindStepperProps = {
  label: '장풍' | '자풍'
  value: Wind
  onChange: (wind: Wind) => void
}

const moveWind = (currentWind: Wind, direction: -1 | 1): Wind => {
  const currentIndex = WINDS.indexOf(currentWind)
  const nextIndex = (currentIndex + direction + WINDS.length) % WINDS.length

  return WINDS[nextIndex]
}

function WindStepper({
  label,
  value,
  onChange,
}: WindStepperProps) {
  return (
    <div className={styles.windField}>
      <span className={styles.windLabel}>{label}</span>
      <div className={styles.windControl}>
        <button
          className={styles.windButton}
          type="button"
          aria-label={`${label} 이전`}
          onClick={() => onChange(moveWind(value, -1))}
        >
          {'<'}
        </button>
        <output
          className={styles.windValue}
          aria-label={`${label} 현재 값`}
        >
          {WIND_LABELS[value]}
        </output>
        <button
          className={styles.windButton}
          type="button"
          aria-label={`${label} 다음`}
          onClick={() => onChange(moveWind(value, 1))}
        >
          {'>'}
        </button>
      </div>
    </div>
  )
}

export default WindStepper

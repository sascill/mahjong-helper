import { useNavigate } from 'react-router'

import type { HandInput } from '../../domain/mahjong/hand'
import { useHandAnalysis } from '../../features/hand-analysis'
import { HandSelection } from '../../features/hand-selection'
import styles from './HandSelectPage.module.css'

function HandSelectPage() {
  const navigate = useNavigate()
  const { analyze } = useHandAnalysis()

  const handleAnalyze = (input: HandInput) => {
    analyze(input)
    navigate('/recommendations')
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>첫 손패 분석</p>
        <h1>첫 손패를 선택하세요</h1>
        <p className={styles.description}>
          패 13장과 장풍·자풍을 입력해 주세요.
        </p>
      </header>

      <HandSelection onAnalyze={handleAnalyze} />
    </main>
  )
}

export default HandSelectPage

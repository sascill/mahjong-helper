import { Link } from 'react-router'

import styles from './HomePage.module.css'

function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="app-title">
        <p className={styles.eyebrow}>리치마작 입문 도우미</p>
        <h1 id="app-title">Mahjong Helper</h1>
        <p className={styles.description}>
          첫 손패에서 목표로 삼을 역을 정하고, 게임은 직접
          플레이하세요.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryLink} to="/hand">
            첫 손패 분석하기
          </Link>
          <Link className={styles.secondaryLink} to="/yaku">
            역 찾아보기
          </Link>
        </div>
      </section>

      <section className={styles.guide} aria-labelledby="guide-title">
        <p className={styles.guideLabel}>처음 한 번만 확인하세요</p>
        <h2 id="guide-title">목표를 정하고 패에 집중하기</h2>
        <ol className={styles.steps}>
          <li className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <div>
              <strong>첫 손패 입력</strong>
              <p>13장과 장풍·자풍을 선택합니다.</p>
            </div>
          </li>
          <li className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <div>
              <strong>목표 역 선택</strong>
              <p>현재 손패에서 가까운 역을 확인합니다.</p>
            </div>
          </li>
          <li className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <div>
              <strong>직접 조패</strong>
              <p>휴대폰을 내려놓고 선택한 목표로 플레이합니다.</p>
            </div>
          </li>
        </ol>
      </section>
    </main>
  )
}

export default HomePage

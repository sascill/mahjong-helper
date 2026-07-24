import { Link } from 'react-router'

import styles from './HomePage.module.css'

function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="app-title">
        <p className={styles.eyebrow}>리치마작 역·룰 도우미</p>
        <h1 id="app-title">Mahjong Helper</h1>
        <p className={styles.description}>
          헷갈리는 역의 조건과 완성 예시를 빠르게 확인하고,
          게임에 집중하세요.
        </p>
        <div className={styles.actions}>
          <Link className={styles.secondaryLink} to="/yaku">
            역 찾아보기
          </Link>
        </div>
      </section>
    </main>
  )
}

export default HomePage

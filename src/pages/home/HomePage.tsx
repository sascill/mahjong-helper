import { Link } from 'react-router'

function HomePage() {
  return (
    <main className="app-shell">
      <section className="intro" aria-labelledby="app-title">
        <p className="eyebrow">리치마작 입문 도우미</p>
        <h1 id="app-title">Mahjong Helper</h1>
        <p>첫 손패에서 목표로 삼을 역을 찾아보세요.</p>
        <Link className="primary-link" to="/hand">
          첫 손패 분석하기
        </Link>
      </section>
    </main>
  )
}

export default HomePage

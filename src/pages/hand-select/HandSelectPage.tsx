import { HandSelection } from '../../features/hand-selection'

function HandSelectPage() {
  return (
    <main className="content-shell">
      <header className="page-header">
        <p className="eyebrow">첫 손패 분석</p>
        <h1>첫 손패를 선택하세요</h1>
        <p>패 13장과 장풍·자풍을 입력해 주세요.</p>
      </header>

      <HandSelection onAnalyze={() => undefined} />
    </main>
  )
}

export default HandSelectPage

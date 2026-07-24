import styles from './RuleReference.module.css'

const RULES = [
  {
    title: '역이 있어야 화료할 수 있습니다',
    description: '패 모양이 완성되어도 인정되는 역이 없으면 화료할 수 없습니다.',
  },
  {
    title: '도라는 역이 아닙니다',
    description: '도라는 점수를 올려 주지만, 도라만으로는 화료 조건이 되지 않습니다.',
  },
  {
    title: '리치는 멘젠에서만 가능합니다',
    description: '치·퐁·깡으로 울지 않은 상태에서 텐파이가 되어야 리치를 선언할 수 있습니다.',
  },
  {
    title: '울면 조건이 바뀔 수 있습니다',
    description: '일부 역은 울면 성립하지 않고, 일부 역은 울면 판수가 줄어듭니다.',
  },
]

export function RuleReference() {
  return (
    <main className={styles.reference}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>기본 룰</p>
        <h1>룰 정보</h1>
        <p className={styles.description}>
          게임 중 자주 헷갈리는 조건만 짧게 확인하세요.
        </p>
      </header>

      <section className={styles.rules} aria-label="기본 룰 목록">
        {RULES.map((rule) => (
          <article className={styles.ruleCard} key={rule.title}>
            <h2>{rule.title}</h2>
            <p>{rule.description}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

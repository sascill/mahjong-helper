import {
  getGlossaryTerm,
  type GlossaryTermId,
} from '../../domain/mahjong/glossary'
import styles from './TermReference.module.css'

type TermGroup = {
  title: string
  termIds: readonly GlossaryTermId[]
}

const TERM_GROUPS: readonly TermGroup[] = [
  {
    title: '기본 진행',
    termIds: ['menzen', 'open', 'chi', 'pon', 'kan', 'tenpai', 'agari'],
  },
  {
    title: '패와 형태',
    termIds: ['shuntsu', 'koutsu', 'toitsu', 'jantou', 'machi'],
  },
  {
    title: '역과 점수',
    termIds: ['yaku', 'han', 'yakuman', 'dora'],
  },
]

export function TermReference() {
  return (
    <main className={styles.reference}>
      <header className={styles.header}>
        <h1>용어</h1>
      </header>

      <div className={styles.groups}>
        {TERM_GROUPS.map((group) => (
          <section
            className={styles.group}
            key={group.title}
            aria-label={`${group.title} 용어`}
          >
            <h2>{group.title}</h2>

            <div className={styles.termList}>
              {group.termIds.map((termId) => {
                const term = getGlossaryTerm(termId)

                return (
                  <article className={styles.termCard} key={term.id}>
                    <h3>{term.label}</h3>
                    <p>{term.description}</p>
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

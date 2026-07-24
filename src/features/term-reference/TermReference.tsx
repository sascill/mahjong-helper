import { useState } from 'react'
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
  const [openTermId, setOpenTermId] = useState<GlossaryTermId | null>(null)

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

            <ul className={styles.termList}>
              {group.termIds.map((termId) => {
                const term = getGlossaryTerm(termId)
                const isOpen = openTermId === term.id
                const descriptionId = `term-description-${term.id}`

                return (
                  <li className={styles.termItem} key={term.id}>
                    <button
                      className={styles.termButton}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={isOpen ? descriptionId : undefined}
                      onClick={() => setOpenTermId(isOpen ? null : term.id)}
                    >
                      <span className={styles.termLabel}>{term.label}</span>
                      <span className={styles.termState} aria-hidden="true">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <p className={styles.termDescription} id={descriptionId}>
                        {term.description}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}

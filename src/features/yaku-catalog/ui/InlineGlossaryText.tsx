import type { ReactNode } from 'react'

import {
  GLOSSARY_TERMS,
  type GlossaryTerm,
} from '../../../domain/mahjong/glossary'
import styles from '../YakuCatalog.module.css'

type InlineGlossaryTextProps = {
  text: string
  blockId: string
  activeKey: string | null
  onToggle: (key: string | null) => void
}

type InlineGlossaryMatch = {
  term: GlossaryTerm
  keyword: string
}

const INLINE_SINGLE_CHARACTER_TERM_IDS = new Set<GlossaryTerm['id']>(['ron'])

const INLINE_GLOSSARY_MATCHES: readonly InlineGlossaryMatch[] = GLOSSARY_TERMS
  .flatMap((term) =>
    [term.label, ...term.aliases]
      .filter(
        (keyword) =>
          keyword.length > 1 || INLINE_SINGLE_CHARACTER_TERM_IDS.has(term.id),
      )
      .map((keyword) => ({ term, keyword })),
  )
  .sort((a, b) => b.keyword.length - a.keyword.length)

const getNoteId = (key: string): string =>
  `inline-glossary-${key.replace(/[^a-z0-9_-]/gi, '-')}`

const findGlossaryMatch = (
  text: string,
  index: number,
): InlineGlossaryMatch | undefined =>
  INLINE_GLOSSARY_MATCHES.find(({ keyword }) =>
    text.startsWith(keyword, index),
  )

export function InlineGlossaryText({
  text,
  blockId,
  activeKey,
  onToggle,
}: InlineGlossaryTextProps) {
  const nodes: ReactNode[] = []
  let activeTerm: GlossaryTerm | null = null
  let activeNoteId: string | null = null
  let cursor = 0

  while (cursor < text.length) {
    const match = findGlossaryMatch(text, cursor)

    if (!match) {
      const nextMatchIndex = INLINE_GLOSSARY_MATCHES.reduce(
        (closestIndex, { keyword }) => {
          const keywordIndex = text.indexOf(keyword, cursor + 1)

          return keywordIndex === -1
            ? closestIndex
            : Math.min(closestIndex, keywordIndex)
        },
        text.length,
      )

      nodes.push(text.slice(cursor, nextMatchIndex))
      cursor = nextMatchIndex
      continue
    }

    const glossaryKey = `${blockId}-${match.term.id}`
    const isActive = activeKey === glossaryKey
    const noteId = getNoteId(glossaryKey)

    if (isActive) {
      activeTerm = match.term
      activeNoteId = noteId
    }

    nodes.push(
      <button
        className={styles.inlineGlossaryButton}
        type="button"
        key={`${glossaryKey}-${cursor}`}
        aria-expanded={isActive}
        aria-controls={isActive ? noteId : undefined}
        onClick={() => onToggle(isActive ? null : glossaryKey)}
      >
        {match.keyword}
      </button>,
    )

    cursor += match.keyword.length
  }

  return (
    <>
      {nodes}
      {activeTerm && activeNoteId && (
        <span
          className={styles.inlineGlossaryNote}
          id={activeNoteId}
          role="note"
        >
          <strong className={styles.inlineGlossaryNoteTitle}>
            {activeTerm.label}
          </strong>
          <span>{activeTerm.description}</span>
        </span>
      )}
    </>
  )
}

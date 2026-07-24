import {
  TILES,
  type Tile,
  type TileSuit,
} from '../../domain/mahjong/hand'
import { getTileLabel } from '../../shared/lib/tilePresentation'
import { MahjongTile } from '../../shared/ui'
import styles from './TileReference.module.css'

const TILE_GROUPS: { title: string; suit: TileSuit }[] = [
  {
    title: '만수',
    suit: 'man',
  },
  {
    title: '통수',
    suit: 'pin',
  },
  {
    title: '삭수',
    suit: 'sou',
  },
  {
    title: '자패',
    suit: 'honor',
  },
]

const getTilesBySuit = (suit: TileSuit): readonly Tile[] =>
  TILES.filter((tile) => tile.suit === suit)

export function TileReference() {
  return (
    <main className={styles.reference}>
      <header className={styles.header}>
        <h1>패 읽는 법</h1>
      </header>

      <div className={styles.groups}>
        {TILE_GROUPS.map((group) => (
          <section
            className={styles.group}
            key={group.suit}
            aria-label={`${group.title} 읽는 법`}
          >
            <div className={styles.groupHeader}>
              <h2>{group.title}</h2>
            </div>

            <div className={styles.tileGrid}>
              {getTilesBySuit(group.suit).map((tile) => {
                const tileLabel = getTileLabel(tile)

                return (
                  <figure className={styles.tileItem} key={tile.id}>
                    <MahjongTile tileId={tile.id} />
                    <figcaption>{tileLabel}</figcaption>
                  </figure>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

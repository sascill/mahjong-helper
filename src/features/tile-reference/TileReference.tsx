import {
  TILES,
  type Tile,
  type TileSuit,
} from '../../domain/mahjong/hand'
import { getTileLabel } from '../../shared/lib/tilePresentation'
import { MahjongTile } from '../../shared/ui'
import styles from './TileReference.module.css'

const TILE_GROUPS: { title: string; suit: TileSuit; description: string }[] = [
  {
    title: '만수',
    suit: 'man',
    description: '한자 숫자와 만 자가 있는 패입니다.',
  },
  {
    title: '통수',
    suit: 'pin',
    description: '동그라미 무늬로 숫자를 읽는 패입니다.',
  },
  {
    title: '삭수',
    suit: 'sou',
    description: '대나무 무늬로 숫자를 읽는 패입니다.',
  },
  {
    title: '자패',
    suit: 'honor',
    description: '숫자가 아닌 바람패와 삼원패입니다.',
  },
]

const getTilesBySuit = (suit: TileSuit): readonly Tile[] =>
  TILES.filter((tile) => tile.suit === suit)

export function TileReference() {
  return (
    <main className={styles.reference}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>패 읽기</p>
        <h1>패 읽는 법</h1>
        <p className={styles.description}>
          패 모양은 그대로 보고, 아래 이름으로 읽는 법만 확인하세요.
        </p>
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
              <p>{group.description}</p>
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

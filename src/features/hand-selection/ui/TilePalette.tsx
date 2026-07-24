import {
  TILES,
  type TileId,
  type TileSuit,
} from '../../../domain/mahjong/hand'
import { getTileLabel } from '../../../shared/lib/tilePresentation'
import { MahjongTile } from '../../../shared/ui'
import styles from '../HandSelection.module.css'

type TilePaletteProps = {
  canSelectTile: (tileId: TileId) => boolean
  onSelectTile: (tileId: TileId) => void
}

const TILE_GROUPS: { label: string; suit: TileSuit }[] = [
  { label: '만수', suit: 'man' },
  { label: '통수', suit: 'pin' },
  { label: '삭수', suit: 'sou' },
  { label: '자패', suit: 'honor' },
]

function TilePalette({
  canSelectTile,
  onSelectTile,
}: TilePaletteProps) {
  return (
    <div className={styles.tileGroups}>
      {TILE_GROUPS.map((group) => (
        <fieldset className={styles.tileGroup} key={group.suit}>
          <legend>{group.label}</legend>
          <div className={styles.tileGrid}>
            {TILES.filter((tile) => tile.suit === group.suit).map((tile) => (
              <button
                className={styles.tileButton}
                key={tile.id}
                type="button"
                aria-label={`${getTileLabel(tile)} 추가`}
                disabled={!canSelectTile(tile.id)}
                onClick={() => onSelectTile(tile.id)}
              >
                <MahjongTile tileId={tile.id} />
              </button>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  )
}

export default TilePalette

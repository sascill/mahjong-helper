import type { TileId } from '../../domain/mahjong/hand'
import {
  getTile,
  getTileLabel,
} from '../lib/tilePresentation'
import styles from './MahjongTile.module.css'

type MahjongTileProps = {
  tileId: TileId
}

export function MahjongTile({ tileId }: MahjongTileProps) {
  const tile = getTile(tileId)

  return (
    <span
      className={styles.tile}
      role="img"
      aria-label={getTileLabel(tile)}
    >
      {tile.symbol}
    </span>
  )
}

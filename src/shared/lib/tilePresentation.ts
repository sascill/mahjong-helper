import {
  TILES,
  type Tile,
  type TileId,
} from '../../domain/mahjong/hand'

const HONOR_LABELS: Record<string, string> = {
  east: '동',
  south: '남',
  west: '서',
  north: '북',
  white: '백',
  green: '발',
  red: '중',
}

const TILE_BY_ID = new Map(TILES.map((tile) => [tile.id, tile]))

export const getTileLabel = (tile: Tile): string => {
  if (tile.suit === 'honor') {
    return HONOR_LABELS[tile.id]
  }

  const suitLabel = {
    man: '만',
    pin: '통',
    sou: '삭',
  }[tile.suit]

  return `${tile.value}${suitLabel}`
}

export const getTile = (tileId: TileId): Tile => {
  const tile = TILE_BY_ID.get(tileId)

  if (!tile) {
    throw new Error(`정의되지 않은 패입니다: ${tileId}`)
  }

  return tile
}

export const getTileImageSrc = (tile: Tile): string =>
  `/tiles/${tile.id}.png`

import { useState } from 'react'

import {
  canAddTile,
  sortTiles,
  validateHandInput,
  type HandInput,
  type TileId,
  type Wind,
} from '../../../domain/mahjong/hand'

export type SelectedWind = Wind | ''

export const useHandSelection = () => {
  const [tiles, setTiles] = useState<TileId[]>([])
  const [roundWind, setRoundWind] = useState<SelectedWind>('')
  const [seatWind, setSeatWind] = useState<SelectedWind>('')

  const canSelectTile = (tileId: TileId): boolean =>
    canAddTile(tiles, tileId)

  const addTile = (tileId: TileId) => {
    setTiles((currentTiles) =>
      canAddTile(currentTiles, tileId)
        ? sortTiles([...currentTiles, tileId])
        : currentTiles,
    )
  }

  const removeTile = (tileIndex: number) => {
    setTiles((currentTiles) =>
      currentTiles.filter((_, index) => index !== tileIndex),
    )
  }

  const reset = () => {
    setTiles([])
    setRoundWind('')
    setSeatWind('')
  }

  const handInput: HandInput | null =
    roundWind === '' || seatWind === ''
      ? null
      : {
          tiles: [...tiles],
          roundWind,
          seatWind,
        }

  const analysisInput =
    handInput && validateHandInput(handInput).valid ? handInput : null

  return {
    tiles,
    roundWind,
    seatWind,
    analysisInput,
    canSelectTile,
    addTile,
    removeTile,
    reset,
    setRoundWind,
    setSeatWind,
  }
}

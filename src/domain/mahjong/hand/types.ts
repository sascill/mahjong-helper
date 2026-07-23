export type TileSuit = 'man' | 'pin' | 'sou' | 'honor';

export type TileId =
  | '1m'
  | '2m'
  | '3m'
  | '4m'
  | '5m'
  | '6m'
  | '7m'
  | '8m'
  | '9m'
  | '1p'
  | '2p'
  | '3p'
  | '4p'
  | '5p'
  | '6p'
  | '7p'
  | '8p'
  | '9p'
  | '1s'
  | '2s'
  | '3s'
  | '4s'
  | '5s'
  | '6s'
  | '7s'
  | '8s'
  | '9s'
  | 'east'
  | 'south'
  | 'west'
  | 'north'
  | 'white'
  | 'green'
  | 'red';

export type Wind = 'east' | 'south' | 'west' | 'north';

export type Tile = {
  id: TileId;
  suit: TileSuit;
  value: number | string;
  symbol: string;
  order: number;
};

export type HandInput = {
  tiles: TileId[];
  roundWind: Wind;
  seatWind: Wind;
};

export type HandValidationError =
  | 'invalid-tile-count'
  | 'too-many-identical-tiles';

export type HandValidationResult =
  | { valid: true }
  | {
      valid: false;
      errors: HandValidationError[];
    };

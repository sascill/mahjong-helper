# 손패 도메인 스펙

## 목적

리치마작의 패와 첫 손패 입력값을 표현하고, 정렬 및 유효성 검증 규칙을 제공한다.

이 모듈은 React와 브라우저 API에 의존하지 않는 순수 TypeScript 코드로 작성한다.

## 패 정의

리치마작의 기본 패 34종을 지원한다.

- 만수: 1~9
- 통수: 1~9
- 삭수: 1~9
- 자패: 동·남·서·북·백·발·중

적도라는 현재 범위에서 제외한다.

```ts
type TileSuit = 'man' | 'pin' | 'sou' | 'honor';

type TileId =
  | '1m' | '2m' | '3m' | '4m' | '5m' | '6m' | '7m' | '8m' | '9m'
  | '1p' | '2p' | '3p' | '4p' | '5p' | '6p' | '7p' | '8p' | '9p'
  | '1s' | '2s' | '3s' | '4s' | '5s' | '6s' | '7s' | '8s' | '9s'
  | 'east' | 'south' | 'west' | 'north'
  | 'white' | 'green' | 'red';

type Wind = 'east' | 'south' | 'west' | 'north';

type Tile = {
  id: TileId;
  suit: TileSuit;
  value: number | string;
  symbol: string;
  order: number;
};
```

`symbol`은 화면에 표시할 유니코드 마작패다. 이후 이미지 에셋을 사용하더라도 `TileId`와 손패 데이터는 변경하지 않는다.

## 손패 입력값

```ts
type HandInput = {
  tiles: TileId[];
  roundWind: Wind;
  seatWind: Wind;
};
```

- `tiles`는 첫 손패 13장을 나타낸다.
- `roundWind`는 장풍이다.
- `seatWind`는 자풍이다.
- 장풍과 자풍은 같은 값을 가질 수 있다.

## 정렬 규칙

손패는 다음 순서로 정렬한다.

```text
만수 1~9
→ 통수 1~9
→ 삭수 1~9
→ 동·남·서·북·백·발·중
```

같은 패끼리는 연속해서 배치한다.

```ts
function sortTiles(tiles: readonly TileId[]): TileId[];
```

입력 배열은 직접 변경하지 않고 정렬된 새 배열을 반환한다.

## 패 추가 가능 여부

```ts
function canAddTile(
  tiles: readonly TileId[],
  tileId: TileId,
): boolean;
```

다음 조건을 모두 만족할 때만 `true`를 반환한다.

- 현재 손패가 13장 미만이다.
- 선택하려는 패가 현재 손패에 4장 미만 존재한다.

## 첫 손패 검증

```ts
type HandValidationError =
  | 'invalid-tile-count'
  | 'too-many-identical-tiles';

type HandValidationResult =
  | { valid: true }
  | {
      valid: false;
      errors: HandValidationError[];
    };

function validateHandInput(input: HandInput): HandValidationResult;
```

유효한 입력은 다음 조건을 만족한다.

- 패가 정확히 13장이다.
- 같은 패가 4장을 초과하지 않는다.
- 장풍과 자풍이 유효한 풍패 값이다.

## 테스트 기준

- 34종 패의 ID가 중복되지 않는다.
- 모든 패가 정의된 순서대로 정렬된다.
- 정렬 함수가 원본 배열을 변경하지 않는다.
- 13장 미만 또는 초과 손패를 거부한다.
- 같은 패가 5장 이상인 손패를 거부한다.
- 손패가 13장이면 추가 패를 허용하지 않는다.
- 같은 패가 이미 4장이면 해당 패를 추가할 수 없다.
- 정상적인 13장과 장풍·자풍 입력을 유효한 값으로 판정한다.

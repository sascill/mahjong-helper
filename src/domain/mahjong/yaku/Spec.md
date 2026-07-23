# 역 도메인 스펙

## 목적

리치마작 역의 이름, 판수, 설명, 조건과 완성 예시를 표현한다.

이 모듈은 역 목록과 상세 화면, 추천 결과가 공통으로 사용하는 정적 데이터를 제공한다. 역 추천 거리 계산은 담당하지 않는다.

React와 브라우저 API에 의존하지 않는 순수 TypeScript 코드로 작성한다.

## 지원 역

제품의 기준 룰에서 사용하는 모든 일반 역과 역만을 지원한다.

### 1판

- 리치
- 일발
- 멘젠쯔모
- 핑후
- 이페코
- 탕야오
- 역패
- 창깡
- 영상개화
- 해저로월
- 하저로어

### 2판

- 더블리치
- 치또이츠
- 일기통관
- 삼색동순
- 삼색동각
- 또이또이
- 산안커
- 산깡쯔
- 찬타
- 혼노두
- 소삼원

### 3판

- 량페코
- 혼일색
- 준찬타

### 6판

- 청일색

### 역만

- 천화
- 지화
- 국사무쌍
- 구련보등
- 녹일색
- 스앙커
- 스깡쯔
- 청노두
- 자일색
- 대삼원
- 소사희
- 대사희

인화와 유국만관은 지원하지 않는다. 특수 대기와 대사희를 더블 역만으로 취급하지 않으며, 서로 다른 역만의 복합은 허용한다.

## 역 식별자

```ts
type YakuId =
  | 'riichi'
  | 'ippatsu'
  | 'menzen-tsumo'
  | 'pinfu'
  | 'iipeikou'
  | 'tanyao'
  | 'yakuhai'
  | 'chankan'
  | 'rinshan-kaihou'
  | 'haitei'
  | 'houtei'
  | 'double-riichi'
  | 'chiitoitsu'
  | 'ittsuu'
  | 'sanshoku-doujun'
  | 'sanshoku-doukou'
  | 'toitoi'
  | 'sanankou'
  | 'sankantsu'
  | 'chanta'
  | 'honroutou'
  | 'shousangen'
  | 'ryanpeikou'
  | 'honitsu'
  | 'junchan'
  | 'chinitsu'
  | 'tenhou'
  | 'chiihou'
  | 'kokushi-musou'
  | 'chuuren-poutou'
  | 'ryuuiisou'
  | 'suuankou'
  | 'suukantsu'
  | 'chinroutou'
  | 'tsuuiisou'
  | 'daisangen'
  | 'shousuushii'
  | 'daisuushii';
```

화면과 추천 결과에서는 역 이름이 아닌 `YakuId`로 역을 참조한다.

## 판수

```ts
type HanValue = {
  type: 'han';
  closed: number;
  open: number | null;
};

type YakumanValue = {
  type: 'yakuman';
  open: boolean;
};

type YakuValue = HanValue | YakumanValue;
```

- `HanValue.closed`는 멘젠 상태의 판수다.
- `HanValue.open`은 치·퐁·명깡한 상태의 판수다.
- 멘젠에서만 성립하는 일반 역은 `open`을 `null`로 정의한다.
- 역만은 `YakumanValue`로 표현한다.
- 멘젠에서만 성립하는 역만은 `open`을 `false`로 정의한다.
- 모든 역만의 배수는 1로 취급한다.
- 룰 설정에 따른 판수 변경은 현재 범위에서 다루지 않는다.

## 완성 예시

```ts
type YakuExample = readonly (readonly TileId[])[];
```

- 완성 예시는 유효한 패로 구성한다.
- 바깥 배열은 완성 형태를 이해할 수 있도록 패의 묶음을 구분한다.
- 일반형은 몸통 네 개와 머리 한 개로 구분한다.
- 치또이츠는 일곱 개의 또이쯔로 구분한다.
- 국사무쌍은 특수 형태 전체를 하나의 묶음으로 표현할 수 있다.
- 깡을 포함한 예시는 물리적인 패가 14장을 초과할 수 있다.
- 패 구성과 무관한 상황역은 성립 가능한 대표 화료형을 사용한다.
- 예시는 역의 핵심 조건을 만족해야 한다.

## 역 데이터

```ts
type Yaku = {
  id: YakuId;
  name: string;
  value: YakuValue;
  summary: string;
  requirements: readonly string[];
  example: YakuExample;
};
```

### 필드 규칙

- `id`: 코드에서 사용하는 고유 식별자
- `name`: 화면에 표시하는 한글 역 이름
- `value`: 멘젠·울기 판수 또는 역만과 울기 가능 여부
- `summary`: 역을 처음 보는 사용자를 위한 한 줄 설명
- `requirements`: 성립에 필요한 핵심 조건
- `example`: 유니코드 패 표시에서 사용할 완성 패 묶음

추천 가능 여부와 추천 이유는 역 데이터에 포함하지 않는다. 해당 정보는 추천 도메인에서 관리한다.

## 공개 인터페이스

```ts
const YAKUS: readonly Yaku[];

function getYaku(yakuId: YakuId): Yaku;
```

- `YAKUS`는 지원하는 모든 역을 정의된 순서로 제공한다.
- `getYaku`는 `YakuId`에 해당하는 역을 반환한다.
- 정의된 `YakuId`에 대응하는 데이터가 없으면 오류를 발생시킨다.
- 외부 모듈은 역 도메인의 `index.ts`를 통해서만 공개 항목을 가져온다.

## 테스트 기준

- 지원하는 모든 `YakuId`에 역 데이터가 존재한다.
- 역 ID가 중복되지 않는다.
- 총 38개의 역을 정의한다.
- 인화와 유국만관을 정의하지 않는다.
- 각 역의 이름, 가치, 설명과 조건이 비어 있지 않다.
- 멘젠 전용 일반 역의 `open`은 `null`이다.
- 멘젠 전용 역만의 `open`은 `false`다.
- 모든 역만을 1배 역만으로 정의한다.
- 각 완성 예시에는 존재하는 `TileId`만 사용한다.
- 같은 패가 네 장을 초과하지 않는다.
- 탕야오, 치또이츠와 혼일색의 판수가 스펙과 일치한다.
- 천화부터 대사희까지 모든 역만을 정의한다.
- `getYaku`가 요청한 역을 반환한다.

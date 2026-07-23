# 프로젝트 문서

이 디렉터리는 프로젝트 전체에 적용되는 문서와 모듈별 스펙의 위치를 안내한다.

모듈의 상세 인터페이스와 동작 규칙은 구현 경로에 함께 배치된 `Spec.md`를 기준으로 한다.

## 전체 문서

### 제품 스펙

프로젝트의 목적, MVP 기능, 화면과 제외 범위를 정의한다.

- 문서: [product-spec.md](./product-spec.md)

### 기술 스펙

기술 구성, 프로젝트 구조, 레이어 책임과 검증 방법을 정의한다.

- 문서: [technical-spec.md](./technical-spec.md)

### 디자인 스펙

공통 시각 언어, 디자인 토큰, 레이아웃과 UI 원칙을 정의한다.

- 문서: [design-spec.md](./design-spec.md)

## 도메인

### 손패

마작패 타입, 손패 구성, 정렬과 유효성 검사를 담당한다.

- 스펙 경로: `src/domain/mahjong/hand/Spec.md`
- 구현 경로: `src/domain/mahjong/hand/`

### 역

역의 이름, 판수, 조건과 완성 예시 데이터를 관리한다.

- 스펙 경로: `src/domain/mahjong/yaku/Spec.md`
- 구현 경로: `src/domain/mahjong/yaku/`

### 추천

검증된 손패를 역별로 평가하고 가까운 역을 정렬한다.

- 스펙 경로: `src/domain/mahjong/recommendation/Spec.md`
- 구현 경로: `src/domain/mahjong/recommendation/`

## 기능

### 손패 선택

사용자가 첫 손패 13장과 장풍·자풍을 입력하는 기능이다.

- 스펙 경로: `src/features/hand-selection/Spec.md`
- 구현 경로: `src/features/hand-selection/`

### 손패 분석

입력을 검증하고 추천 엔진을 실행해 결과 화면으로 전달한다.

- 스펙 경로: `src/features/hand-analysis/Spec.md`
- 구현 경로: `src/features/hand-analysis/`

### 역 도감

역 목록과 상세 정보를 탐색하는 기능이다.

- 스펙 경로: `src/features/yaku-catalog/Spec.md`
- 구현 경로: `src/features/yaku-catalog/`

## 문서 관리 규칙

- 프로젝트 전체에 적용되는 내용만 `docs/`에서 관리한다.
- 모듈의 타입, 인터페이스, 동작과 테스트 기준은 해당 모듈의 `Spec.md`에서 관리한다.
- 동일한 스펙을 여러 문서에 중복해서 작성하지 않는다.
- 모듈을 추가·이동·삭제하면 이 문서의 설명과 경로를 함께 수정한다.
- 코드 동작을 변경할 때는 가장 가까운 `Spec.md`를 먼저 수정한다.

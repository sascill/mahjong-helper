# 기술 스펙

## 문서 목적

Mahjong Helper의 기술 구성, 프로젝트 구조, 레이어 책임과 검증 방법을 정의한다.

모듈별 타입, 인터페이스와 동작 규칙은 각 구현 경로의 `Spec.md`에서 정의한다.

## 기술 구성

- React
- TypeScript
- Vite
- React Router
- Vitest
- React Testing Library
- vite-plugin-pwa
- CSS Modules
- ESLint
- npm

별도의 서버와 전역 상태 관리 라이브러리는 사용하지 않는다.

패키지 버전은 `package.json`과 잠금 파일을 기준으로 관리한다.

## 프로젝트 구조

```text
src/
├─ app/
│  ├─ App.tsx
│  └─ router.tsx
├─ pages/
│  ├─ home/
│  ├─ hand-select/
│  ├─ recommendations/
│  ├─ yaku-list/
│  └─ yaku-detail/
├─ features/
│  ├─ hand-selection/
│  │  └─ Spec.md
│  ├─ hand-analysis/
│  │  └─ Spec.md
│  └─ yaku-catalog/
│     └─ Spec.md
├─ domain/
│  └─ mahjong/
│     ├─ hand/
│     │  └─ Spec.md
│     ├─ yaku/
│     │  └─ Spec.md
│     └─ recommendation/
│        └─ Spec.md
├─ shared/
│  └─ ui/
├─ test/
│  └─ setup.ts
└─ main.tsx
```

## 레이어 책임

### app

- 애플리케이션 진입점
- 라우터 설정
- 화면 사이에서 공유하는 최소 상태 제공

### pages

- URL과 연결되는 화면
- 기능과 UI를 조립
- 마작 판정 로직을 직접 구현하지 않음

### features

- 사용자가 수행하는 기능
- 기능 전용 컴포넌트, 상태와 훅 관리
- 기능 전용 테스트 배치

### domain

- 마작패, 손패, 역과 추천 규칙
- React에 의존하지 않는 순수 TypeScript 코드
- 도메인 테스트 배치

### shared

- 마작 규칙을 모르는 공용 UI
- 두 개 이상의 기능에서 실제로 재사용할 때만 추가

## 의존 방향

```text
app
→ pages
→ features
→ domain

features
→ shared
```

- 하위 레이어는 상위 레이어를 가져오지 않는다.
- `domain`은 React와 브라우저 API를 가져오지 않는다.
- 기능 전용 컴포넌트와 훅을 최상위 공용 폴더로 이동하지 않는다.
- 최상위 `components`, `hooks`, `utils` 폴더를 만들지 않는다.
- 공용화는 실제 중복이 발생한 뒤 진행한다.

## 스펙 배치

- 프로젝트 전체의 제품·기술 스펙은 `docs/`에서 관리한다.
- 도메인과 기능의 상세 스펙은 해당 구현 경로의 `Spec.md`에서 관리한다.
- `Spec.md`에는 모듈의 인터페이스, 입력과 출력, 동작, 예외 조건과 테스트 기준을 작성한다.
- 스펙, 테스트와 구현은 같은 작업 브랜치와 PR에서 함께 변경한다.
- 동일한 내용을 전역 문서와 모듈 스펙에 중복해서 작성하지 않는다.
- 전체 문서와 모듈 경로는 `docs/README.md`에서 확인한다.

## 화면 경로

```text
/
→ 홈

/hand
→ 손패 선택

/recommendations
→ 추천 결과

/yaku
→ 역 목록

/yaku/:yakuId
→ 역 상세
```

추천 결과 없이 `/recommendations`에 직접 접근하면 `/hand`로 이동한다.

존재하지 않는 역 ID로 상세 화면에 접근하면 역 목록으로 이동한다.

## 상태 관리

- 손패 선택 상태는 `hand-selection` 기능에서 관리한다.
- 분석 결과는 React Context를 사용해 손패 선택 화면과 추천 결과 화면 사이에서 공유한다.
- 게임 기록과 이전 손패는 저장하지 않는다.
- 브라우저를 새로고침하면 진행 중인 분석 상태는 초기화한다.

## 테스트

### 도메인 테스트

Vitest를 사용한다.

- 패 데이터
- 손패 입력 검증
- 역 평가
- 추천 거리와 정렬

도메인 테스트는 React와 브라우저 환경에 의존하지 않는다.

### UI 테스트

React Testing Library를 사용한다.

- 패 선택과 취소
- 장풍·자풍 선택
- 분석 버튼 상태
- 화면 이동
- 추천 결과와 역 상세 표시

컴포넌트 내부 구현보다 사용자가 화면에서 수행하는 동작과 결과를 검증한다.

## PWA

- 웹 앱 매니페스트를 제공한다.
- 서비스 워커를 등록한다.
- 애플리케이션 실행에 필요한 정적 파일을 캐시한다.
- 네트워크 없이 이미 설치된 앱의 기본 화면을 실행할 수 있어야 한다.
- 카메라 기능은 MVP에 포함하지 않는다.

## 프로젝트 명령

```text
npm run dev
npm run test
npm run test:watch
npm run typecheck
npm run lint
npm run build
```

각 명령은 다음 역할을 가진다.

- `dev`: 개발 서버 실행
- `test`: 전체 테스트 1회 실행
- `test:watch`: 변경된 테스트 반복 실행
- `typecheck`: TypeScript 타입 검사
- `lint`: 정적 코드 검사
- `build`: 프로덕션 빌드

## 완료 검증

구현 작업을 완료하기 전에 다음 명령이 모두 성공해야 한다.

```text
npm run test
npm run typecheck
npm run lint
npm run build
```

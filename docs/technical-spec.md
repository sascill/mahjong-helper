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
- Wrangler
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
│  ├─ hand-select/
│  ├─ recommendations/
│  ├─ tile-reference/
│  ├─ yaku-list/
│  └─ yaku-detail/
├─ features/
│  ├─ hand-selection/
│  │  ├─ Spec.md
│  │  ├─ index.ts
│  │  ├─ ui/
│  │  ├─ model/
│  │  └─ lib/
│  ├─ hand-analysis/
│  │  └─ Spec.md
│  ├─ yaku-catalog/
│  │  └─ Spec.md
│  └─ tile-reference/
│     └─ Spec.md
├─ domain/
│  └─ mahjong/
│     ├─ hand/
│     │  └─ Spec.md
│     ├─ yaku/
│     │  └─ Spec.md
│     ├─ glossary/
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

## 기능 내부 레이어

기능은 필요한 책임에 따라 다음 구조로 분리한다.

```text
features/<feature-name>/
├─ Spec.md
├─ index.ts
├─ <FeatureName>.tsx
├─ <FeatureName>.test.tsx
├─ <FeatureName>.module.css
├─ ui/
├─ model/
└─ lib/
```

### 기능 루트

- 기능을 외부에 제공하는 대표 컴포넌트
- 대표 컴포넌트와 직접 결합된 스타일 및 기능 단위 UI 테스트
- 기능 스펙과 외부 공개 범위
- 기능을 처음 탐색할 때 읽는 구현 진입점

### ui

- 대표 컴포넌트를 구성하는 비공개 React 컴포넌트
- 내부 컴포넌트와 직접 결합된 스타일 및 UI 테스트
- 화면 표시와 사용자 입력 전달
- 도메인 판정과 상태 변경 규칙을 직접 구현하지 않음

### model

- 기능 전용 상태와 훅
- 사용자 동작에 따른 상태 변경
- 도메인 함수를 조합한 파생 상태와 입력값 생성

### lib

- 기능 내부에서 사용하는 순수 함수
- React와 브라우저 API에 의존하지 않음
- 도메인 규칙을 중복 구현하지 않음

기능 루트에는 `Spec.md`, 외부 공개 범위를 정의하는 `index.ts`, 대표 컴포넌트와 직접 결합된 테스트·스타일만 둔다.

대표 컴포넌트는 기능 내부의 상태, 순수 함수와 비공개 UI를 조립하며 기능의 구현 진입점 역할을 한다.

`ui`에는 대표 컴포넌트를 구성하는 비공개 내부 컴포넌트를 둔다. 대표 컴포넌트와 내부 컴포넌트를 같은 폴더에 나열하지 않는다.

외부 레이어는 기능 루트의 `index.ts`를 통해서만 기능을 가져온다. 기능 내부 파일을 직접 가져오지 않는다.

모든 기능에 빈 `ui`, `model`, `lib` 폴더를 미리 만들지 않는다. 실제 책임이 생긴 레이어만 추가한다.

한 파일에서만 사용하는 타입과 상수는 사용하는 파일 가까이에 둔다. 여러 내부 파일에서 공유되거나 파일의 핵심 동작을 가릴 때만 별도 파일로 분리한다.

단순한 JSX와 이벤트 전달만 담당하는 작은 컴포넌트는 무조건 분리하지 않는다. 상태 로직, 순수 함수 또는 독립적인 UI 영역이 기존 컴포넌트의 핵심 흐름을 가릴 때 분리한다.

기능 내부 폴더는 `ui`, `model`, `lib` 아래에서 다시 계층화하지 않고 한 단계 깊이를 기본으로 한다.

다른 기능에서도 실제로 재사용하게 된 코드는 책임에 따라 `domain` 또는 `shared`로 이동한다.

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
→ 역 목록으로 이동

/hand
→ 손패 선택

/recommendations
→ 추천 결과

/yaku
→ 역 목록

/yaku/:yakuId
→ 역 상세

/tiles
→ 패 읽는 법
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
- `192x192`, `512x512` 일반 아이콘과 마스커블 아이콘을 제공한다.
- 서비스 워커를 등록한다.
- 애플리케이션 실행에 필요한 정적 파일을 캐시한다.
- 네트워크 없이 이미 설치된 앱의 기본 화면을 실행할 수 있어야 한다.
- 새 서비스 워커가 확인되면 자동으로 갱신한다.
- 카메라 기능은 MVP에 포함하지 않는다.

## 배포

Cloudflare Workers의 정적 에셋 기능을 사용한다.

- `wrangler.jsonc`에서 Worker 이름, 정적 에셋 경로와 SPA 폴백을 관리한다.
- Worker 이름은 `mahjong-helper`를 사용한다.
- 정적 에셋 경로는 `dist`다.
- 존재하지 않는 화면 경로는 `index.html`로 연결한다.
- 로컬 수동 배포는 `npm run deploy`로 실행한다.
- 실제 업로드 없이 설정과 번들을 검증할 때는 `npm run deploy:dry-run`을 사용한다.
- 자동 빌드 후 운영 반영을 수동으로 결정하려면 Cloudflare의 배포 명령을 `npx wrangler versions upload`로 설정한다.

## 프로젝트 명령

```text
npm run dev
npm run test
npm run test:watch
npm run typecheck
npm run lint
npm run build
npm run deploy
npm run deploy:dry-run
```

각 명령은 다음 역할을 가진다.

- `dev`: 개발 서버 실행
- `test`: 전체 테스트 1회 실행
- `test:watch`: 변경된 테스트 반복 실행
- `typecheck`: TypeScript 타입 검사
- `lint`: 정적 코드 검사
- `build`: 프로덕션 빌드
- `deploy`: 프로덕션 빌드 후 Cloudflare Worker에 수동 배포
- `deploy:dry-run`: 프로덕션 빌드 후 Cloudflare 배포 설정과 업로드 대상을 로컬에서 검증

## 완료 검증

구현 작업을 완료하기 전에 다음 명령이 모두 성공해야 한다.

```text
npm run test
npm run typecheck
npm run lint
npm run build
npm run deploy:dry-run
```

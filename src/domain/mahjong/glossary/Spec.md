# 마작 용어 스펙

## 목적

인라인 도움말에서 사용할 리치마작 용어와 짧은 설명을 정적 데이터로 제공한다.

이 모듈은 UI를 렌더링하지 않고, 용어 데이터와 조회 함수만 제공한다.

## 공개 인터페이스

```ts
const GLOSSARY_TERMS: readonly GlossaryTerm[];
const GLOSSARY_TERM_BY_ID: Readonly<Record<GlossaryTermId, GlossaryTerm>>;

function getGlossaryTerm(id: GlossaryTermId): GlossaryTerm;
```

외부 레이어는 `index.ts`를 통해서만 가져온다.

## 용어 데이터

각 용어는 다음 정보를 가진다.

- `id`: 코드에서 사용하는 안정적인 식별자
- `label`: 화면에 표시하는 용어
- `aliases`: 같은 의미로 감지할 수 있는 표현
- `description`: 초보자용 한두 문장 설명

초기 용어에는 다음 항목을 포함한다.

- 역
- 판
- 역만
- 멘젠
- 울기
- 치
- 퐁
- 깡
- 슌쯔
- 커쯔
- 또이쯔
- 머리
- 대기
- 텐파이
- 화료
- 쯔모
- 론
- 도라

## 제외 범위

- 툴팁 또는 팝오버 UI
- 텍스트 자동 마킹
- 룰 상세 페이지

## 테스트 기준

- 초기 용어를 모두 제공한다.
- 모든 용어의 `id`는 중복되지 않는다.
- `getGlossaryTerm`은 요청한 용어를 반환한다.

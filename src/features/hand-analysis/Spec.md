# 손패 분석 기능 스펙

## 목적

손패 선택 기능에서 전달한 유효한 입력으로 추천 엔진을 실행하고, 입력과 추천 결과를 추천 결과 화면에 전달한다.

이 기능은 추천 규칙을 직접 구현하지 않는다. 추천 거리와 정렬은 추천 도메인의 `recommendYaku`를 기준으로 한다.

## 입력과 결과

```ts
type HandAnalysisResult = {
  input: HandInput;
  recommendations: Recommendation[];
};
```

- `input`: 사용자가 선택한 첫 손패 13장과 장풍·자풍
- `recommendations`: 추천 도메인이 반환한 가까운 역 목록

분석을 실행하면 `recommendYaku(input)`의 반환값과 입력을 하나의 결과로 저장한다.

저장하는 손패 배열은 전달받은 배열과 별도로 복사해 이후 외부 변경의 영향을 받지 않게 한다.

## 공개 인터페이스

```ts
type HandAnalysisContextValue = {
  result: HandAnalysisResult | null;
  analyze: (input: HandInput) => HandAnalysisResult;
};

function HandAnalysisProvider(props: PropsWithChildren): JSX.Element;
function useHandAnalysis(): HandAnalysisContextValue;
```

- `HandAnalysisProvider`는 현재 분석 결과를 메모리에 보관한다.
- `analyze`는 추천 엔진을 실행하고 저장한 결과를 반환한다.
- `useHandAnalysis`는 공급자 내부에서만 사용할 수 있다.
- 공급자 외부에서 훅을 사용하면 오류를 발생시킨다.
- 유효하지 않은 입력은 추천 도메인의 오류를 그대로 전달하며 결과로 저장하지 않는다.

## 애플리케이션 연결

애플리케이션 진입점에서 라우터를 `HandAnalysisProvider`로 감싼다.

손패 선택 화면은 유효한 `HandInput`을 전달받으면 다음 순서로 처리한다.

1. `analyze(input)`을 실행한다.
2. 분석이 완료되면 `/recommendations`로 이동한다.

## 추천 결과 화면

추천 결과 화면은 저장된 분석 결과를 사용한다.

다음 정보를 표시한다.

- 입력한 손패 13장
- 장풍과 자풍
- 역 이름
- 멘젠 기준 판수
- 완성까지 필요한 최소 장수
- 추천 이유

결과 화면은 버릴 패, 실제 확률, 점수와 이후 행동을 표시하지 않는다.

추천 결과가 비어 있으면 현재 기준으로 추천할 역이 없다는 안내와 손패를 다시 선택하는 이동 수단을 표시한다.

역 상세 화면은 이 기능의 범위에 포함하지 않는다. 상세 화면이 구현되기 전까지 추천 카드는 이동 기능을 제공하지 않는다.

## 상태 수명

- 분석 결과는 브라우저 메모리에만 유지한다.
- 새 분석을 실행하면 이전 결과를 교체한다.
- 새로고침하면 분석 결과를 초기화한다.
- 결과 없이 `/recommendations`에 접근하면 `/hand`로 이동한다.
- 게임 기록이나 이전 손패를 브라우저 저장소에 보관하지 않는다.

## 화면 경로

```text
/hand
→ 손패 입력 및 분석 실행

/recommendations
→ 추천 결과 표시
```

## 테스트 기준

- 유효한 입력을 분석하면 입력과 추천 결과를 저장한다.
- 저장한 손패 배열은 원본 배열과 같은 참조를 사용하지 않는다.
- 공급자 외부에서 분석 훅을 사용할 수 없다.
- 손패 선택 화면에서 분석하면 추천 결과 화면으로 이동한다.
- 추천 결과 화면에 손패, 장풍과 자풍을 표시한다.
- 추천 결과에 역 이름, 멘젠 판수, 필요한 장수와 이유를 표시한다.
- 결과가 없으면 빈 결과 안내를 표시한다.
- 저장된 분석 결과 없이 추천 결과 경로에 접근하면 손패 선택 화면으로 이동한다.

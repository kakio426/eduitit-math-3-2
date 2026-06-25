# 매스몬 분수만큼 담기 제작 보고 (3-2-4-2)

## 한 일

- `3-2-4-1-mathmon-pizza-fraction`을 복제해 **전체의 분수만큼 구하기** 차시로 개조했습니다.
- 1단계 분수 선택을 **2단계(한 묶음 크기 → 담을 개수) 그룹 토큰 선택**으로 확장했습니다.
- 보상 룰렛(5종)·결과 측정·등급 트랙·정답 수 게이트·오디오·Stage/소리 계약·rAF 모션은 그대로 재사용하고 라벨만 담기 테마로 바꿨습니다.

## 핵심 구현

- 문제 생성: `buildScoopProblem()`.
  - `N ∈ {6,8,9,10,12,15,16}`, `den`=N의 약수, `num ∈ [1,den-1]`. `perGroup=N/den`, `answer=perGroup×num`(정수 보장).
  - `makeNumberOptions(correct, distractors)`: 정답 + 대표 오답 + 보충으로 4개 distinct 숫자 보기 생성.
- SVG 보드: `drawGroupTokens(problem)` — N개 토큰을 `den`묶음으로 그룹 박스에 배치. 2단계에서 담는 `num`묶음을 `group-box.is-on`/`token.is-on`으로 강조.
- 단계 엔진: `buildSteps`(2단계, 각 `correctText`), `renderStep`(단계별 phaseLabel·보드 재렌더), `handleStepChoice`(보드 펄스 + 다음 단계). 1단계 완료 → 2단계 자동 진입 → 2단계 완료 → 보상.

## 검증

- 인라인 JS `node --check` 통과.
- 로직 시뮬레이션 **300,000회**: `perGroup`·`answer` 모두 정수, 두 단계 각 4 distinct·정답 1개, 1단계에 분모/전체 오답·2단계에 "한 묶음만" 오답 항상 포함(모든 카운터 0).
- 브라우저(프리뷰 1280×800): 1단계(묶음 나누기) → 2단계(담는 묶음 강조) 전환, 숫자 선택지, 결과 등급까지 확인. 2단계 10문제 자동 풀이 완주.
- `node scripts/check-stage-ratio.mjs` 통과(단원 묶음 배포 시 재확인).

## 동적 HTML 오버레이 범위

- 문제 화면 그룹 토큰(SVG), 숫자 선택지, 한 줄 지시문, 진행도, 좌측 담기 점수 미터·등급 트랙, 결과 점수·등급·칭찬·다시하기는 모두 HTML/JS로 매 판 갱신.

## 생성형 이미지 자산 연결

- `cover-generated.webp`는 글자 없는 담기 배경으로 생성하고, 첫 화면 제목은 `title-logo-source.png` → `title-logo-generated.png` → `title-logo-generated.webp` 3종으로 보관했습니다.
- 결과 등급 6장(`result-{handful,smallbasket,basket,bigbasket,cartfull,rainbow}-generated.webp`)을 생성해 `DESTINATIONS[].image`와 연결했습니다.
- 매스몬 동행은 `fraction-pack`의 `mathmon-fr-02-basketroo.webp`를 커버/결과에 HTML 오버레이로 한 마리만 얹었습니다.
- 첫 화면을 `data-cover-standard="generated-title-overlay"` 표준으로 승격했고, `node scripts/check-stage-ratio.mjs` 통과 및 스크린샷 5장 갱신을 완료했습니다.

# 매스몬 분수 줄다리기 제작 보고 (3-2-4-4) ★ 단원 정점

## 한 일

- `3-2-4-1-mathmon-pizza-fraction`을 복제해 **분수 크기 비교(단원 정점)** 차시로 개조했습니다.
- 피자 분수 보드를 **두 분수 비교 막대 + 2지선다**로 바꿨습니다.
- 보상 룰렛(5종)·결과 측정·등급 트랙·정답 수 게이트·오디오·Stage/소리 계약·rAF 모션은 그대로 재사용하고 라벨만 줄다리기 테마로 바꿨습니다.

## 핵심 구현

- 문제 생성: `buildCompareProblem()`.
  - 분모 같음(같은 den 3~8, 서로 다른 num) 또는 단위분수(num=1, 서로 다른 den 2~8)를 50%로 선택.
  - 정답 위치(좌/우) 랜덤. `candidates`=두 분수, 더 큰 쪽이 `isAnswer`. `biggerText`로 정답 표기.
- 보드: `drawFractionBars(problem)` + `fractionBar(y,f,side,W,padx)` — 두 분수를 같은 전체 길이 막대에 `den`칸으로 나누고 `num`칸 채움. 길이로 크기 비교가 보이게.
- 단계 엔진: `buildSteps`(1단계 비교, 유형별 hint), `renderStep`(막대+2선택지), `handleStepChoice`(보드 펄스+공개).

## 검증

- 인라인 JS `node --check` 통과.
- 로직 시뮬레이션 **300,000회**: 보기 2개·정답 1개, **정답이 항상 실제로 더 큰 분수**(wrongAnswer=0), 두 분수 값이 항상 다름(equalVals=0), `biggerText` 일치, 단위/분모같음 균등 분포.
- 브라우저(프리뷰 1280×800): 두 비교 막대(예 2/3 vs 1/3)와 2지선다, 결과 등급까지 확인. 10문제 자동 풀이 완주.
- `node scripts/check-stage-ratio.mjs` 통과(단원 묶음 배포 시 재확인).

## 동적 HTML 오버레이 범위

- 문제 화면 비교 막대(SVG), 분수 2선택지, 한 줄 지시문, 진행도, 좌측 줄다리기 점수 미터·등급 트랙, 결과 점수·등급·칭찬·다시하기는 모두 HTML/JS로 매 판 갱신.

## 남은 일 (이미지 도구 보유 세션 — `_shared/mathmon/UNIT4_IMAGE_GUIDE.md`)

- 생성형 자산: `cover-generated.webp` + 제목 타이틀 아트 3종 + `result-{draw,smallwin,win,bigwin,champion,rainbow}-generated.webp` + `fraction-pack` 매스몬 동행 1종.
- 자산 연결 후 첫 화면을 `generated-title-overlay` 표준으로 승격, 결과 래스터 교체, 스크린샷 5장 촬영.

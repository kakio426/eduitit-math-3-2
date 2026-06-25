# 매스몬 분수 분류 컨베이어 제작 보고 (3-2-4-3)

## 한 일

- `3-2-4-1-mathmon-pizza-fraction`을 복제해 **진분수·가분수·대분수 분류** 차시로 개조했습니다.
- 피자 분수 보드를 **분수 표기(숫자) + 원 조각 그림 + 통 3선택지**로 바꿨습니다.
- 보상 룰렛(5종)·결과 측정·등급 트랙·정답 수 게이트·오디오·Stage/소리 계약·rAF 모션은 그대로 재사용하고 라벨만 분류 테마로 바꿨습니다.

## 핵심 구현

- 문제 생성: `buildSortProblem()`.
  - 진분수(`num<den`, den 3~8), 가분수(`num∈[den,2den-1]`, 5/5 포함, 정수배 제외), 대분수(자연수 1~3 + 진분수).
  - `candidates` = 진분수/가분수/대분수 통 3개, 실제 종류가 `isAnswer`.
- 보드: `drawFractionWholes(problem)` + `oneCircle(cx,cy,r,den,shaded)` — 분수 값을 가득 찬 원 + 부분 원으로 표현. 숫자는 `buildProblemDisplay`(대분수는 자연수 + 분수).
- 단계 엔진: `buildSteps`(1단계 분류, `SORT_LABEL`/`SORT_EXPLAIN`), `renderStep`(보드+통 선택지), `handleStepChoice`(보드 펄스+공개).

## 검증

- 인라인 JS `node --check` 통과.
- 로직 시뮬레이션 **300,000회**: 통 3개·정답 1개, **모든 문제의 정답 통이 실제 종류와 일치**(wrongClass=0), 정수배 가분수 0, `5/5` 사례 등장(약 3.2만), 세 종류 균등 분포.
- 브라우저(프리뷰 1280×800): 분수 숫자+원 그림, 통 3선택지, 결과 등급까지 확인. 10문제 자동 풀이 완주.
- `node scripts/check-stage-ratio.mjs` 통과(단원 묶음 배포 시 재확인).

## 동적 HTML 오버레이 범위

- 문제 화면 분수 숫자(HTML)·원 그림(SVG), 통 3선택지, 한 줄 지시문, 진행도, 좌측 분류 점수 미터·등급 트랙, 결과 점수·등급·칭찬·다시하기는 모두 HTML/JS로 매 판 갱신.

## 생성형 이미지 자산 연결

- `cover-generated.webp`는 글자 없는 분류 컨베이어 배경으로 생성하고, 첫 화면 제목은 `title-logo-source.png` → `title-logo-generated.png` → `title-logo-generated.webp` 3종으로 보관했습니다.
- 결과 등급 6장(`result-{first,row,line,bigline,manager,rainbow}-generated.webp`)을 생성해 `DESTINATIONS[].image`와 연결했습니다.
- 매스몬 동행은 `fraction-pack`의 `mathmon-fr-03-sorterbeaver.webp`를 커버/결과에 HTML 오버레이로 한 마리만 얹었습니다.
- 첫 화면을 `data-cover-standard="generated-title-overlay"` 표준으로 승격했고, `node scripts/check-stage-ratio.mjs` 통과 및 스크린샷 5장 갱신을 완료했습니다.

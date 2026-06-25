# 매스몬 피자 분수 가게 제작 보고 (3-2-4-1)

## 한 일

- `3-2-3-1-mathmon-target-hit`(검증된 SVG 보드 스캐폴드)을 복제해 **4단원(분수) 도입 차시**로 개조했습니다.
- 원 도형 선택 보드를 **피자 등분 SVG + 분수 1단계 선택**으로 교체했습니다.
- 보상 룰렛(5종)·결과 측정·등급 트랙·정답 수 게이트·오디오·Stage/소리 계약은 그대로 재사용하고 라벨만 피자 테마로 바꿨습니다.

## 핵심 구현

- 문제 생성: `buildProblems`(10문제) → `buildPizzaProblem()`.
  - `den ∈ {2,3,4,5,6,8}`, `num = randomInt(1, den-1)`. 정답 `num/den`.
  - 오답 풀: 뒤바꿈 `den/num`, 여집합 `(den-num)/den`, 전체±1, 색칠±1 → 4개 distinct 보장(부족 시 분모 키워 보충).
- SVG 렌더: `drawPizzaSlices`(원을 `den`등분, 앞 `num`조각 색칠) + `wedgePath`/`polarPt`(부채꼴 경로) + `pulseBoard`(정답 pop·오답 shake).
- 분수 표기: `fracHtml`(분자/분모 세로 스택, `.frac` CSS). 선택지 버튼에 분수 그대로 렌더.
- 단계 엔진: `buildSteps`(1단계, `correctKey`/`correctText`), `renderStep`(피자+선택지), `handleStepChoice`(보드 펄스+공개). 원·산술 전용 함수(candSvg/highlightCandidate/labelPos 등)는 제거.

## 검증

- 인라인 JS `node --check` 통과.
- 로직 시뮬레이션 **200,000회**: 모든 문제 보기 4개 distinct, 정답 정확히 1개, 뒤바꿈/여집합 오답 항상 포함(badLen=0, dup=0, ansNot1=0, noMisconception=0).
- 브라우저(프리뷰 1280×800): 첫 화면·문제(피자 3/4 + 분수 선택지)·결과 전 흐름 렌더 확인. 10문제 자동 풀이 완주, 모든 문제 정답 매칭·오답 공개 0회, 결과 등급·점수 산정 정상.
- `node scripts/check-stage-ratio.mjs` 통과(아래 단원 묶음 배포 시 재확인).

## 동적 HTML 오버레이 범위

- 문제 화면 피자(SVG), 분수 선택지, 한 줄 지시문, 진행도, 좌측 피자 점수 미터·등급 트랙, 결과 점수·등급·칭찬·다시하기는 모두 HTML/JS로 매 판 갱신.

## 남은 일 (이미지 도구 보유 세션 — `_shared/mathmon/UNIT4_IMAGE_GUIDE.md`)

- 생성형 자산: `cover-generated.webp`(글자 없는 배경) + 제목 타이틀 아트 3종(한글 철자 검수) + `result-{slice,half,whole,jumbo,shopstar,legend}-generated.webp` + `fraction-pack` 매스몬 동행 1종.
- 자산 연결 후 첫 화면을 `data-cover-standard="generated-title-overlay"` 표준으로 승격하고 결과 래스터를 등급 이미지로 교체.
- 좌측 점수 패널의 레거시 캡슐 비주얼은 피자 소품으로 교체 예정.
- 스크린샷(첫·설명·문제·보상·결과)은 자산 연결 후 최종본으로 촬영.

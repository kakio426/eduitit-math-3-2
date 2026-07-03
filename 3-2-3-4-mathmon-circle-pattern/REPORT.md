# 매스몬 원 무늬 디자이너 제작 보고 (3-2-3-4) ★ 단원 정점

## 한 일

- `3-2-3-1-mathmon-target-hit`(라벨형 후보 스캐폴드)를 복제해 원 무늬 배치 도메인으로 개조했습니다.
- 보상 룰렛·결과 측정·등급 트랙·오디오·Stage/소리 계약·`handleStepChoice`·`highlightCandidate`는 그대로 재사용하고 라벨을 무늬 테마로 바꿨습니다.
- 생성형 커버 배경, 제목 아트, 시작 버튼 아트, 결과 등급 이미지 6장과 retry 이미지를 연결했습니다.
- `circle-pack`을 공용 매스몬 팩으로 등록하고 4차시는 `무늬공작몬` 콘셉트로 문서화했습니다.
- 설정 버튼을 `modal-controls` 기준으로 이관하고 배경 소리/효과 소리를 분리했습니다.

## 핵심 구현

- 문제 생성: `buildProblems`(10문제) → `buildPatternProblem()`.
  - 반지름 14~18, 간격 2r+12~18, 놓인 원 2~3개. 후보 4종: 정답·far·off·big.
  - 정답 정확히 1개, 후보 4개 distinct 라벨, 모두 보드 범위 안(20000회 검증).
- SVG 보드: `drawPatternBoard` + `candCircle` — 놓인 원(파랑 채움) + 후보 링(점선 가나다라) + 안내선. `.cand-ring` 하이라이트 CSS 추가(정답 민트/오답 로즈).
- 단계: `buildSteps`(1단계, 규칙 안내 지시문). `handleStepChoice`/`buildStepOptions`는 3-1 라벨형 그대로 재사용.

## 검증

- `node scripts/check-stage-ratio.mjs` → OK(18 lesson packages, 3단원 4차시 전부 포함).
- 인라인 JS `node --check` 통과.
- 로직 시뮬 20000회: 정답 1개·후보 4개 distinct·보드 안.
- JSON 검증: `_shared/mathmon/catalog.json`, `_shared/mathmon/circle-pack/manifest.json` 파싱 통과.
- 브라우저 QA: 로컬 서버 `http://127.0.0.1:4173`에서 1280×800, 1024×768 각각 첫 화면·설정·설명·문제 1·문제 2·보상·결과 캡처. 콘솔 에러 0, 이미지 404 0, 텍스트 넘침·요소 겹침 감지 0.
- Humanizer 학생 문구 QA: 새로 보이는 설정/커버/결과 문구를 점검하고 `측정`을 `보기`로 바꿨습니다.

## 동적 HTML 오버레이 범위

- 문제 화면 무늬(SVG), 가나다라 선택지, 한 줄 지시, 좌측 무늬 점수 미터·등급 트랙은 HTML/JS로 갱신합니다.
- 결과 화면은 생성형 배경 이미지 위에 SVG 동적 슬롯(`정답 n/10`, 짧은 점수값)과 투명 다시하기 hitbox만 둡니다.

## 최종 자산

- 커버/제목/시작: `cover-generated.webp`, `title-logo-generated.webp`, `start-button-generated.webp`.
- 결과: `result-retry-generated.webp`, `result-{dot,small,pattern,big,design,rainbow}-generated.webp`.
- 공용 팩: `_shared/mathmon/circle-pack` (`ci-04-pattern-peacock`).
- 스크린샷: `screenshots/qa-{desktop-1280x800,tablet-1024x768}-{cover,settings,tutorial,play-step1,play-step2,reward,result}.png`.

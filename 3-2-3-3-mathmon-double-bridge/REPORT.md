# 매스몬 두 배 다리 제작 보고 (3-2-3-3)

## 한 일

- `3-2-3-2-mathmon-compass-ring`(숫자 선택 스캐폴드)를 복제해 두 배/반 변환 도메인으로 개조했습니다.
- 보상 룰렛·결과 측정·등급 트랙·오디오·Stage/소리 계약은 그대로 재사용하고 라벨을 다리 테마로 바꿨습니다.
- 생성형 커버 배경, 제목 아트, 시작 버튼 아트, 결과 등급 이미지 6장과 retry 이미지를 연결했습니다.
- `circle-pack`을 공용 매스몬 팩으로 등록하고 3차시는 `두배수달몬` 콘셉트로 문서화했습니다.
- 설정 버튼을 `modal-controls` 기준으로 이관하고 배경 소리/효과 소리를 분리했습니다.

## 핵심 구현

- 문제 생성: `buildProblems`(10문제) → `buildDoubleProblem()`.
  - 방향 랜덤(반지름→지름 ×2 / 지름→반지름 ÷2). 정답 + 핵심 오답(두 배 잊음 r / 반 안 나눔 2r) + 근접.
  - 작은 값에서 보기 겹침 → 채움 로직으로 4개 distinct 보장(버그 수정 후 20000회 검증).
- SVG 보드: `drawBridge` — 위(반지름)·아래(지름=반지름 두 칸+divider). 주어진 칸 채움, 묻는 칸 점선+"?". "반지름×2=지름?"/"지름÷2=반지름?" 안내.
- 질문문/지시문/해설은 방향(`problem.ask`)에 따라 분기.

## 검증

- `node scripts/check-stage-ratio.mjs` → OK(18 lesson packages).
- 인라인 JS `node --check` 통과.
- 로직 시뮬 20000회: 항등(지름=반지름×2) 성립, 4개 distinct, 정답·핵심 오답 항상 포함.
- JSON 검증: `_shared/mathmon/catalog.json`, `_shared/mathmon/circle-pack/manifest.json` 파싱 통과.
- 브라우저 QA: 로컬 서버 `http://127.0.0.1:4173`에서 1280×800, 1024×768 각각 첫 화면·설정·설명·문제 1·문제 2·보상·결과 캡처. 콘솔 에러 0, 이미지 404 0, 텍스트 넘침·요소 겹침 감지 0.
- Humanizer 학생 문구 QA: 새로 보이는 설정/커버/결과 문구를 점검하고 `측정`을 `보기`로 바꿨습니다.

## 동적 HTML 오버레이 범위

- 문제 화면 다리(SVG), cm 선택지, 한 줄 지시, 좌측 다리 점수 미터·등급 트랙은 HTML/JS로 갱신합니다.
- 결과 화면은 생성형 배경 이미지 위에 SVG 동적 슬롯(`정답 n/10`, 짧은 점수값)과 투명 다시하기 hitbox만 둡니다.

## 최종 자산

- 커버/제목/시작: `cover-generated.webp`, `title-logo-generated.webp`, `start-button-generated.webp`.
- 결과: `result-retry-generated.webp`, `result-{log,small,bridge,big,grand,rainbow}-generated.webp`.
- 공용 팩: `_shared/mathmon/circle-pack` (`ci-03-bridge-otter`).
- 스크린샷: `screenshots/qa-{desktop-1280x800,tablet-1024x768}-{cover,settings,tutorial,play-step1,play-step2,reward,result}.png`.

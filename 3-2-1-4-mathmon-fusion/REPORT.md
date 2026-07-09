# 매스몬 로봇 합체 설명 보고서

## 1. 개요

`매스몬 로봇 합체`는 3학년 2학기 1단원 4차시에서 (몇)×(몇십몇), (몇십몇)×(몇십몇)을 연습하는 에듀잇티 수학 게임입니다. 학생은 아래 수를 일의 자리와 십의 자리로 나누어 두 곱셈 조각을 만들고, 마지막에 두 값을 더해 로봇을 완성합니다.

핵심 목표는 `두 번 곱하고 더해서 로봇을 완성해요.`입니다.

## 2. 학습 설계

- 문제 유형: (몇)×(몇십몇), (몇십몇)×(몇십몇)
- 라운드: 10문제
- 입력: 첫 조각, 둘째 조각, 두 값 더하기 3단계 4지선다
- 1단계: `윗수 × 아랫수의 일의 자리`
- 2단계: `윗수 × 아랫수의 십의 자리`를 계산하고 0을 붙인 값
- 3단계: 두 곱셈 조각을 더한 최종 곱
- 대표 오답: 받아올림 실수, 0 빠뜨림, 십의 자리 값을 밀지 않고 더한 값

문제 화면은 한 번에 한 행동만 크게 보여 줍니다. 현재 곱할 자리만 노란색으로 강조하고, 학생이 고른 값은 로봇 조각 칸에 들어간 뒤 다음 단계로 넘어갑니다.

## 3. 화면 흐름

```text
첫 화면 -> 설명 1단계 -> 설명 2단계 -> 문제 3단계 풀이 -> 합체 점수 보상 -> 다음 문제 -> 10문제 완료 -> 결과 -> 전국 순위
```

설명 화면은 생성 이미지 2장입니다. 첫 장은 계산 방법, 둘째 장은 보상과 순위 흐름을 보여 줍니다. HTML은 접근성 설명, 단계 상태값, 투명 hitbox만 맡습니다.

## 4. 화면별 최신 기준

### 첫 화면

- 배경: `cover-generated.webp`
- 제목: `title-poster-generated.webp`
- 시작 버튼: `start-button-generated.webp`
- 보이는 HTML 문구: `두 번 곱하고 더해서 로봇을 완성해요.`

첫 화면은 `generated-title-overlay`와 `generated-button-art` 기준입니다. 제목과 시작 버튼은 CSS 글자가 아니라 생성형 이미지 자산입니다.

### 설명 화면

- 설명 1단계: `tutorial-solve-generated.webp`
- 설명 2단계: `tutorial-goal-generated.webp`
- 버튼 aria-label: 1단계 `다음`, 2단계 `합체 준비`

최신 캡처는 `screenshots/02-tutorial-solve.png`, `screenshots/03-tutorial-goal.png`입니다. 2026-07-09 문서 갱신 중 실제 브라우저 클릭 흐름으로 `solve -> goal` 전환을 확인했습니다. 전환 후 상태는 `data-tutorial-step="goal"`, 설명 1단계 opacity `0`, 설명 2단계 opacity `1`, 버튼 `합체 준비`였습니다.

### 문제 화면

- 공방 배경: `fusion-workshop-generated.webp`
- 로봇 상태: `mathmon-rfa-01-standby.webp` ~ `mathmon-rfa-04-complete.webp`
- 상단 목표 지도: `play-robot-goal-*-1232-generated.webp`

상단 목표 지도 최신 계약은 `6장`, `1232×166`, `각 장 로봇 슬롯 6개`, `현재 등급 1개만 컬러`, `나머지 5개 실루엣`, `잔상/중복/진행 노드 없음`, `로봇과 플랫폼 상하 잘림 없음`입니다. v2 세트는 롤백 전 간결한 결과 화면의 등급별 로봇 외형을 기준으로 다시 만들었습니다. 4단계부터 날개형 실루엣이 보이고, 5~6단계는 더 큰 날개와 전설 장식이 보입니다.

최신 캡처는 `screenshots/04-problem-step1.png`, `screenshots/08-tablet-problem.png`입니다.

### 보상 화면

보상 화면은 점수 이미지 8장만 크게 보여 줍니다.

- `reward-score-plus-50-generated.webp`
- `reward-score-plus-100-generated.webp`
- `reward-score-plus-200-generated.webp`
- `reward-score-plus-500-generated.webp`
- `reward-score-minus-50-generated.webp`
- `reward-score-minus-100-generated.webp`
- `reward-score-zero-generated.webp`
- `reward-score-rainbow-generated.webp`

무지개 이미지는 실제 `+800점` 보상입니다. `0점`은 변화 없음이며 기존 점수를 0으로 되돌리지 않습니다. 최신 무지개 보상 캡처는 `screenshots/05-reward-rainbow.png`입니다.

### 결과 화면

결과는 간결한 hybrid 생성형 화면입니다.

- 배경: `result-small-generated.webp` ~ `result-legend-generated.webp`
- 큰 등급 라벨: `result-title-*-generated.webp`
- 정답 수: `_shared/result-count/result-correct-*-generated.webp`
- 동적 UI: SVG 점수, 에너지 선, 버튼 표면, 투명 HTML hitbox

합체 힘 등급 기준은 아래와 같습니다.

- 소형: 0점 이상
- 중형: 100점 이상
- 대형: 200점 이상
- 거대: 500점 이상
- 초거대: 1500점 이상
- 전설: 2000점 이상

최신 전설 결과 캡처는 `screenshots/06-result-legend.png`입니다.

### 전국 순위 화면

전국 순위 화면은 `_shared/scoreboard` 공통 SVG UI를 사용합니다. 생성 이미지는 배경과 `scoreboard-title-fusion-generated.webp` 타이틀만 맡고, 내 기록 박스, 순위 행, 버튼, 동적 텍스트는 SVG가 그립니다.

API 주소가 없으면 안내 상태로 동작합니다. API 주소가 있으면 `session -> score -> weekly leaderboard` 흐름으로 기록을 제출하고 순위판을 그립니다. 최신 API 연결 캡처는 `screenshots/07-scoreboard-api.png`입니다.

## 5. 보상 구조

보상은 `합체 힘` 하나입니다. 도감 수집이나 별도 재화는 없습니다.

- 정답 문제: 랜덤 합체 점수 이미지 1장
- 오답이 있었던 문제: `-100점`
- 모든 보상: 10문제 완료 전에는 결과로 조기 이동하지 않음
- 최고 보상: 한 판에 쉽게 닿지 않도록 전설 기준을 2000점으로 유지
- 빈손 방지: 0점 이상이면 소형 로봇 결과를 보여 줌

학생 화면 문구는 짧은 행동 말로 유지했습니다. `부분곱`, `게이트`, `메커니즘` 같은 제작자 말은 보이는 화면에 쓰지 않습니다.

## 6. 최신 스크린샷 세트

2026-07-09 문서 갱신 기준으로 아래 캡처를 최신 세트로 전환했습니다.

- `screenshots/01-cover.png` - 첫 화면, 1440×900
- `screenshots/02-tutorial-solve.png` - 설명 1단계, 1440×900
- `screenshots/03-tutorial-goal.png` - 설명 2단계, 1440×900
- `screenshots/04-problem-step1.png` - 문제 1단계, 1440×900
- `screenshots/05-reward-rainbow.png` - 무지개 보상, 1440×900
- `screenshots/06-result-legend.png` - 전설 결과, 1440×900
- `screenshots/07-scoreboard-api.png` - API 연결 전국 순위, 1440×900
- `screenshots/08-tablet-problem.png` - 태블릿 가로 문제 화면, 1024×768

상단 목표 지도 6상태 컨택시트는 `screenshots/play-robot-goal-1232-contact-sheet.png`입니다.

## 7. QA 기록

### 화면 QA

- 첫 화면: 생성형 제목과 생성형 시작 버튼이 16:10 Stage 안에 들어옴
- 설명 화면: 실제 클릭 흐름으로 1단계에서 2단계로 전환됨
- 문제 화면: 1440×900과 1024×768에서 상단 목표 지도, 문제식, 선택지, 로봇 영역 겹침 없음
- 보상 화면: `reward-score-rainbow-generated.webp`가 `naturalWidth=960`, `naturalHeight=615`로 로드된 뒤 캡처됨
- 결과 화면: 전설 배경, 전설 라벨, `10/10` 공용 이미지, `2000점`, 버튼 2개가 패널 안에 들어옴
- 순위 화면: 로컬 메모리 API 응답값이 내 기록 박스와 1위 행에 들어오고, 텍스트가 박스 밖으로 나가지 않음

### 백엔드 연결 QA

문서 갱신용 순위판 캡처는 로컬 메모리 API로 검증했습니다.

- `POST /api/v1/sessions`: 201
- `POST /api/v1/scores`: 201
- `GET /api/v1/leaderboards/weekly?lessonId=3-2-1-4-mathmon-fusion&limit=100`: 200
- 순위판 표시값: 이름 `초록 점프 15`, 얻은 로봇 `거대 로봇`, 내 등수 `1위`, 주차 `2026-07-06 주`

### 텍스트 넘침·요소 겹침 QA

최신 스크린샷 기준 첫 화면, 설명 1단계, 설명 2단계, 문제 1단계, 무지개 보상, 전설 결과, API 순위판, 태블릿 문제 화면을 확인했습니다. 보이는 텍스트가 버튼, 카드, 배지, 패널 밖으로 튀어나간 화면은 발견하지 않았습니다.

### 정적 검증

- 4차시 inline script 파싱 통과
- 4차시 문서 `git diff --check` 통과

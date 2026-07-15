# 매스몬 10배 점프섬

3학년 2학기 1단원 3차시용 수학 게임입니다. `(몇십)×(몇십)`, `(몇십몇)×(몇십)`에서 0을 잠깐 가리고 곱한 뒤, 가렸던 0을 다시 붙이는 과정을 연습합니다.

## 실행

- 배포 파일: `index.html`
- 제작 원본: `_lessons/3-2-1-3-mathmon-jump-islands/`
- 공용 엔진: `_engine/v1/`
- 빌드: `node scripts/build-lesson.mjs 3-2-1-3-mathmon-jump-islands`
- 권장 화면: 컴퓨터, 태블릿 가로
- Stage: `16:10`, 기준 `1280x800`

## 화면 흐름

1. 첫 화면: 생성형 커버 배경, 제목 아트, 목표 문장, 생성형 시작 버튼
2. 설명: 0 가리기, 먼저 곱하기, 0 다시 붙이기
3. 문제: 섬 지도, 현재 문제, 현재 단계 계산판, 선택지
4. 보상: 바람 이미지 모달과 다음 점프 버튼
5. 결과: 도착 섬 전체 장면, 공용 정답 수 이미지, 순위 보기 버튼
6. 전국 순위: `_shared/scoreboard` 공통 SVG 순위판

## 문제 방식

- 한 판 10문제입니다.
- `0 한 개 붙이기` 문제 5개, `0 두 개 붙이기` 문제 5개를 뽑습니다.
- 1단계는 0을 가린 작은 곱을 고릅니다.
- 2단계는 작은 곱 뒤에 0을 몇 개 붙일지 고릅니다.
- 두 단계를 모두 첫 시도에 맞힌 문제만 정답 수에 더합니다.

## 순위 API

기본 실행에서는 순위판이 안내 상태로 열립니다. API를 붙일 때는 쿼리나 전역 값으로 주소를 넘깁니다.

```text
index.html?scoreboardApi=https://your-scoreboard-api.example.com
```

호출 endpoint는 기존 1단원 순위판과 같습니다.

- `POST /api/v1/sessions`
- `POST /api/v1/scores`
- `GET /api/v1/leaderboards/weekly?lessonId=...&limit=100`

3차시 payload에는 `answers`, `clientCorrectCount`, `clientScore`, `rewardResult.islandId`가 포함됩니다.

## QA

2026-07-09 엔진 v1.1 이관 후 브라우저에서 확인했습니다.

- `1280x800`: cover → tutorial → 10문제 → reward modal → result → scoreboard 완주
- `1024x768`: 같은 흐름 완주
- 텍스트 넘침 0건, 보이는 이미지 누락 0건
- 로컬 API stub으로 세 scoreboard endpoint 호출 확인

대표 증거는 `.omo/ulw-loop/evidence/engine-v1-1/`에 있습니다.

# 매스몬 로봇 합체

에듀잇티 수학 게임 시리즈 3학년 2학기 1단원 4차시입니다.

- 대상: 3학년 2학기 1단원 4차시
- 학습: (몇)×(몇십몇), (몇십몇)×(몇십몇)
- 문제: 10문제 랜덤 출제
- 방식: `첫 조각 -> 둘째 조각 -> 두 값 더하기` 3단계 선택형
- 보상: 한 문제를 끝낼 때마다 합체 점수 이미지 1장을 보여 줌
- 결과: 합체 힘 점수로 소형, 중형, 대형, 거대, 초거대, 전설 로봇을 공개
- 순위: `순위 보기`를 누르면 이번 주 전국 합체 순위 화면으로 이동
- 실행: `index.html`을 브라우저에서 열기

## 최신 화면 기준

`index.html`은 시리즈 최신 Stage 계약을 따릅니다.

- Stage: `data-stage-ratio="16:10"`, `data-stage-size="1280x800"`
- 첫 화면: `data-cover-standard="generated-title-overlay"`
- 시작 버튼: `data-cover-start-standard="generated-button-art"`
- 결과 화면: `data-result-visual-standard="generated-assets"`, `data-result-render-mode="hybrid-generated-dynamic"`
- 설정: `data-settings-standard="modal-controls"`

첫 화면은 글자 없는 `cover-generated.webp` 위에 생성형 제목 자산 `title-poster-generated.webp`와 생성형 시작 버튼 `start-button-generated.webp`를 얹습니다. 한 줄 목표만 보이는 HTML 문장으로 둡니다.

설명 화면은 생성 이미지 2장 흐름입니다.

- `tutorial-solve-generated.webp`: 아래 수를 둘로 나누어 따로 곱한 뒤 더하는 풀이 흐름
- `tutorial-goal-generated.webp`: 10문제, 합체 점수, 로봇 결과, 순위 흐름

문제 화면 상단 목표 지도는 `1232×166` 상태 이미지 6장입니다. 런타임 슬롯도 같은 `1232 / 166` 비율로 표시하며, 각 이미지는 로봇 슬롯 6개를 유지하고 현재 등급 1개만 컬러로 보여 줍니다. 최신 세트는 3번 슬롯의 날개형 그림자를 날개 없는 로봇 그림자로 교체해, 날개가 있다가 사라지는 예고처럼 보이지 않게 정리했습니다.

## 보상과 결과

보상은 합체 힘 하나로만 운영합니다.

- 소형: 0점 이상
- 중형: 100점 이상
- 대형: 200점 이상
- 거대: 500점 이상
- 초거대: 1500점 이상
- 전설: 2000점 이상

정답 문제는 `+50점`, `+100점`, `+200점`, `+500점`, `-50점`, `0점`, `무지개` 중 하나가 랜덤으로 나옵니다. 무지개는 실제 `+800점` 보상입니다. 문제 안에서 한 번이라도 틀리면 `-100점`으로 처리합니다. 어떤 보상이 나와도 10문제를 모두 푼 뒤에만 결과로 이동합니다.

결과 화면은 생성형 배경 6장과 생성형 라벨 자산을 함께 씁니다. 큰 등급 라벨은 `result-title-*-generated.webp`, 정답 수는 `_shared/result-count/result-correct-*-generated.webp`가 맡고, 합체 점수와 버튼 hitbox는 SVG/HTML 동적 레이어가 맡습니다.

## 주요 자산

- `cover-generated.webp`: 첫 화면 글자 없는 대표 장면
- `title-poster-generated.webp`: 첫 화면 생성형 제목
- `start-button-generated.webp`: 첫 화면 생성형 시작 버튼
- `tutorial-solve-generated.webp`: 설명 1단계
- `tutorial-goal-generated.webp`: 설명 2단계
- `fusion-workshop-generated.webp`: 문제 화면 공방 배경
- `play-robot-goal-*-1232-generated.webp`: 문제 화면 상단 목표 지도 6상태
- `mathmon-rfa-01-standby.webp` ~ `mathmon-rfa-04-complete.webp`: 문제 화면 로봇 상태
- `reward-score-*-generated.webp`: 보상 점수 이미지 8장
- `result-*-generated.webp`: 결과 등급별 배경
- `result-title-*-generated.webp`: 결과 등급 라벨
- `../_shared/result-count/result-correct-*-generated.webp`: 결과 정답 수 공용 이미지
- `../_shared/scoreboard/*`: 전국 순위 공통 SVG UI와 API 브리지

`cover-robot-mathmon-generated.webp`, `play-robot-goal-*-generated.webp`, `tutorial-fulltext-generated.webp` 같은 이전 자산은 호환과 기록을 위해 남겨 두지만 현재 학생 흐름의 기준 자산은 아닙니다.

## 최신 스크린샷

2026-07-09 기준 최신 화면 스크린샷은 아래 파일입니다.

- `screenshots/01-cover.png` - 첫 화면, 1440×900
- `screenshots/02-tutorial-solve.png` - 설명 1단계, 1440×900
- `screenshots/03-tutorial-goal.png` - 설명 2단계, 1440×900
- `screenshots/04-problem-step1.png` - 문제 1단계, 1440×900
- `screenshots/05-reward-rainbow.png` - 무지개 보상, 1440×900
- `screenshots/06-result-legend.png` - 전설 결과, 1440×900
- `screenshots/07-scoreboard-api.png` - API 연결 순위판, 1440×900
- `screenshots/08-tablet-problem.png` - 태블릿 가로 문제 화면, 1024×768

상단 목표 지도 상태 세트 검증용 컨택시트는 `screenshots/play-robot-goal-1232-contact-sheet.png`입니다.

## 전국 순위 백엔드 연결

기본 파일만 열면 순위 화면은 API 비연결 안내 상태로 동작합니다. 실제 서버를 붙일 때는 정적 HTML을 열기 전에 아래 값 중 하나를 넣습니다.

```html
<script>
  window.MATHMON_SCOREBOARD_API_URL = "https://your-scoreboard-api.example.com";
</script>
```

또는 쿼리 파라미터를 사용할 수 있습니다.

```text
index.html?scoreboardApi=https%3A%2F%2Fyour-scoreboard-api.example.com
```

연동 위치는 `LESSON_ID = "3-2-1-4-mathmon-fusion"`, `SCOREBOARD_API_URL`, `scoreboardBridge`, `scoreboardAnswers`, `scoreboardScreen`입니다. 4차시는 `partial1`, `partial2`, `fusion` 세 단계 선택과 합체 힘 보상을 서버에 보냅니다. 업체 인계 기준은 `../scoreboard-api/docs/GAME_INTEGRATION.md`입니다.

## 작업 파일

- `index.html`: 게임 본문
- `README.md`: 실행 기준과 자산 요약
- `REPORT.md`: 화면 흐름, 보상 구조, QA 기록
- `QUALITY_AUDIT.md`: 1단원 비교와 보강 기록
- `screenshots/`: 화면별 최신 캡처와 컨택시트

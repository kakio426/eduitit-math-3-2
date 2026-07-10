# 매스몬 로봇 합체

에듀잇티 수학 게임 시리즈 3학년 2학기 1단원 4차시입니다.

- 대상: 3학년 2학기 1단원 4차시
- 학습: (몇)×(몇십몇), (몇십몇)×(몇십몇)
- 문제: 한 판에 10문제
- 방식: `첫 조각 -> 둘째 조각 -> 두 값 더하기` 3단계 선택형
- 보상: 한 문제를 끝낼 때마다 합체 힘 이미지 1장
- 결과: 합체 힘으로 소형, 중형, 대형, 거대, 초거대, 전설 로봇 공개
- 순위: `순위 보기`를 누르면 이번 주 전국 합체 순위로 이동
- 실행: `index.html`을 브라우저에서 열기

## 화면 계약

`index.html`은 시리즈 최신 Stage 계약을 따릅니다.

- Stage: `data-stage-ratio="16:10"`, `data-stage-size="1280x800"`
- 첫 화면: `data-cover-standard="generated-title-overlay"`
- 시작 버튼: `data-cover-start-standard="generated-button-art"`
- 결과 화면: `data-result-visual-standard="generated-assets"`, `data-result-render-mode="hybrid-generated-dynamic"`
- 설정: `data-settings-standard="modal-controls"`

첫 화면은 글자 없는 `cover-generated.webp` 위에 생성형 제목 `title-poster-generated.webp`와 생성형 시작 버튼 `start-button-generated.webp`를 얹습니다. 한 줄 목표만 보이는 HTML 문장으로 둡니다.

설명 화면은 생성 이미지 2장입니다.

- `tutorial-solve-generated.webp`: `23×45`를 `23×40=920`, `23×5=115`, `920+115=1035`로 푸는 정확한 예시
- `tutorial-goal-generated.webp`: 10문제, 합체 힘, 로봇 결과, 순위 흐름

두 설명 이미지는 각각 `1586×992`이며 런타임에서 Stage 전체에 `cover`로 표시합니다. 생성 원본은 `tutorial-*-source.png`로 함께 보관합니다.

## 문제와 정답 확인

온라인 순위 서버가 연결된 경우 문제 10개와 정답 문제의 보상은 세션 seed로 정해집니다. 서버와 브라우저가 같은 seed 계산을 사용하므로 서버는 제출된 `expected`, 문제 순서, 보상을 다시 계산할 수 있습니다. 서버가 없을 때는 브라우저에서 로컬 seed를 만들어 같은 규칙으로 한 판을 구성합니다.

학생이 정답을 고르면 다음 단계로 바로 넘어가지 않습니다.

- 현재 계산식의 `?`가 실제 정답으로 바뀜
- 계산 카드가 초록색 확인 상태로 바뀜
- 짧은 확인 문구가 보인 뒤 다음 단계로 이동
- 마지막 단계는 완성식을 보여 준 뒤 합체 연출과 보상으로 이동

문제 화면 상단 목표 지도는 `1232×166` 상태 이미지 6장입니다. 런타임 슬롯도 같은 비율을 사용하며, 각 이미지에는 로봇 슬롯 6개가 유지되고 현재 단계 1개만 컬러로 보입니다.

## 보상과 결과

보상은 합체 힘 하나로만 운영합니다.

- 정답 문제: `+50`, `+100`, `-50`, `+200`, `+500`, `0`, `+800` 중 하나
- 한 문제 안에서 오답이 한 번이라도 있었을 때: `-100`
- 점수 범위: `0~8000`
- 표시값: 이벤트의 원래 값이 아니라 실제로 바뀐 값

예를 들어 합체 힘이 0점일 때 `-100` 이벤트가 생겨도 화면에는 `0점`, `합체 힘은 그대로예요.`가 보입니다. 무지개 보상 이미지는 장식 이름이 아니라 실제 변화량인 `+800점`을 표시합니다.

결과 기준은 아래와 같습니다.

- 소형: 0점 이상
- 중형: 100점 이상
- 대형: 200점 이상
- 거대: 500점 이상
- 초거대: 1500점 이상
- 전설: 2000점 이상

0점도 소형 로봇 결과를 보여 줍니다. 도달할 수 없던 별도 `다시 도전` 결과 분기는 제거했으며, 예전 자산과 캡처는 `_archive/legacy-retry-state/`에 보존합니다.

## 소리와 설정

오른쪽 위 설정 모달에는 `배경 소리`, `효과 소리`, `방법 다시 보기`, `처음부터`, `닫기`가 있습니다. 배경 소리와 효과 소리는 각각 아래 키로 따로 저장됩니다.

- `mathmon-audio-bgm-enabled`
- `mathmon-audio-sfx-enabled`

배경 소리를 켜면 Web Audio 기반의 짧은 반복 음악이 실제로 재생되고, 끄면 타이머와 재생이 멈춥니다.

## 주요 자산

- `cover-generated.webp`: 첫 화면 글자 없는 대표 장면
- `title-poster-generated.webp`: 첫 화면 생성형 제목
- `start-button-generated.webp`: 첫 화면 생성형 시작 버튼
- `tutorial-solve-generated.webp`, `tutorial-goal-generated.webp`: 설명 2장
- `fusion-workshop-generated.webp`: 문제 화면 배경
- `play-robot-goal-*-1232-generated.webp`: 상단 목표 지도 6상태
- `mathmon-rfa-01-standby.webp` ~ `mathmon-rfa-04-complete.webp`: 문제 화면 로봇 상태
- `reward-score-*-generated.webp`: 보상 점수 이미지 8장
- `result-*-generated.webp`: 결과 단계별 배경 6장
- `result-title-*-generated.webp`: 결과 단계별 라벨 6장
- `../_shared/result-count/result-correct-*-generated.webp`: 결과 정답 수 공용 이미지
- `../_shared/scoreboard/*`: 전국 순위 공통 SVG UI와 API 브리지

4차시 실행 화면의 로봇은 기존 예외 팩 `robot-fusion-action-pack`을 유지합니다. 새 매스몬 팩은 만들지 않았습니다.

## 최신 스크린샷과 컨택시트

2026-07-10 브라우저 QA에서 아래 캡처를 갱신했습니다.

컴퓨터 화면 `1280×800`:

- `screenshots/01-cover.png`: 첫 화면
- `screenshots/02-tutorial-solve.png`: 설명 1단계
- `screenshots/03-tutorial-goal.png`: 설명 2단계
- `screenshots/04-problem-step1.png`: 문제 1단계
- `screenshots/05-problem-confirmed.png`: 정답이 계산식에 들어간 확인 상태
- `screenshots/06-problem-step2.png`: 문제 2단계
- `screenshots/05-reward-rainbow.png`: 실제 `+800점` 보상
- `screenshots/07-reward-zero.png`: 변화 없음 보상
- `screenshots/07-defect-reward.png`: 0점에서 오답이 있었을 때 실제 변화량 0 표시
- `screenshots/06-result-legend.png`: 전설 결과
- `screenshots/08-result-small.png`: 0점 소형 결과

태블릿 가로 `1024×768`:

- `screenshots/06-tablet-cover.png`
- `screenshots/09-tablet-tutorial-solve.png`
- `screenshots/10-tablet-tutorial-goal.png`
- `screenshots/08-tablet-problem.png`
- `screenshots/11-tablet-problem-step2.png`
- `screenshots/12-tablet-reward-zero.png`
- `screenshots/13-tablet-result-legend.png`

상태 이미지 세트 검증 자료:

- `screenshots/reward-score-contact-sheet.png`: 보상 8상태와 자연 크기
- `screenshots/tutorial-refresh-contact-sheet.png`: 새 설명 2장
- `screenshots/play-robot-goal-1232-contact-sheet.png`: 목표 지도 6상태

## 전국 순위 백엔드 연결

API 주소가 없으면 순위 화면은 비연결 안내 상태로 동작합니다. 실제 서버를 붙일 때는 정적 HTML을 열기 전에 아래 값을 넣습니다.

```html
<script>
  window.MATHMON_SCOREBOARD_API_URL = "https://your-scoreboard-api.example.com";
</script>
```

또는 쿼리 파라미터를 사용할 수 있습니다.

```text
index.html?scoreboardApi=https%3A%2F%2Fyour-scoreboard-api.example.com
```

4차시는 세션 생성이 끝난 뒤 서버 seed를 받아 문제를 시작합니다. 점수 제출 시 서버는 아래 항목을 다시 계산합니다.

- 10개 문제와 순서
- `partial1`, `partial2`, `fusion` 정답
- 오답 여부에 따른 `-100` 보상
- 정답 문제의 seed 기반 랜덤 보상
- 0점 아래로 내려가지 않는 최종 점수

조작된 정답값이나 임의의 무지개 보상은 거절합니다. 업체 인계 기준은 `../scoreboard-api/docs/GAME_INTEGRATION.md`입니다.

## 작업 파일

- `index.html`: 게임 본문
- `README.md`: 실행 기준과 자산 요약
- `REPORT.md`: 화면 흐름, 보상 구조, QA 기록
- `QUALITY_AUDIT.md`: 비교 감사와 수정 결과
- `screenshots/`: 화면별 최신 캡처와 컨택시트
- `_archive/`: 현재 흐름에서 쓰지 않는 예전 자산 보관

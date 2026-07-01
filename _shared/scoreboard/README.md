# 매스몬 공통 순위 화면

전국 순위 화면은 모든 차시가 같은 축하 배경과 SVG 순위판 컴포넌트를 공유합니다. 차시별로 바뀌는 것은 제목, 점수 이름, `LESSON_ID`, 점수 계산 함수뿐입니다.

생성 이미지는 매스몬, 불꽃, 무대 조명, 축하 분위기만 맡습니다. 순위판, 내 기록 박스, 순위 행, 버튼 껍데기, 글자는 SVG `viewBox="0 0 1280 800"` 안에서 공통 컴포넌트가 그립니다. 브라우저 크기가 바뀌어도 배경과 UI가 같은 좌표계로 함께 축소되고, 실제 버튼은 보이지 않는 HTML hitbox만 맡습니다.

## 자산

- `scoreboard-celebration-bg-source.png`: imagegen으로 만든 축하 배경 원본
- `scoreboard-celebration-bg-generated.png`: 1280x800 확인용 PNG
- `scoreboard-celebration-bg-generated.webp`: 학생 화면 배포용 WebP
- `scoreboard-ui.css`: SVG 순위판, 카드, 행, 버튼, 글자 스타일과 투명 hitbox 정렬
- `scoreboard-ui.js`: 상태별 문구와 SVG 순위 목록 렌더러

## 포함 파일

```html
<link rel="stylesheet" href="../_shared/scoreboard/scoreboard-ui.css">
<script src="../_shared/scoreboard/scoreboard-ui.js"></script>
```

차시 폴더 깊이가 다르면 상대 경로만 맞춥니다.

## 화면 구조

```html
<section class="screen mathmon-scoreboard" id="scoreboardScreen" aria-labelledby="scoreboardTitle">
  <svg class="mathmon-scoreboard-stage" viewBox="0 0 1280 800" preserveAspectRatio="xMidYMid meet">
    <image
      class="mathmon-scoreboard-stage-art"
      href="../_shared/scoreboard/scoreboard-celebration-bg-generated.webp"
      x="0"
      y="0"
      width="1280"
      height="800"
      preserveAspectRatio="xMidYMid slice"
    ></image>

    <rect class="mathmon-scoreboard-board" ...></rect>
    <rect class="mathmon-scoreboard-card" ...></rect>
    <text class="mathmon-scoreboard-title" id="scoreboardTitle">전국 로켓 순위</text>
    <g class="mathmon-scoreboard-list" data-scoreboard-list></g>
    <rect class="mathmon-scoreboard-button-face" ...></rect>
  </svg>
  <div class="mathmon-scoreboard-hitboxes">
    <button id="scoreboardRefreshButton" data-scoreboard-refresh type="button" aria-label="새로 보기"></button>
    <button id="scoreboardResultButton" type="button" aria-label="결과로"></button>
    <button id="scoreboardRestartButton" type="button" aria-label="다시하기"></button>
  </div>
  <div class="top-row">...</div>
</section>
```

## 구현 원칙

- 생성 이미지는 축하 배경, 매스몬 장식, 무대 조명만 맡습니다.
- 순위판, 내 기록 3칸, 순위 행, 스크롤 영역, 버튼 표면은 공통 SVG/CSS가 그립니다.
- SVG `<text>`는 실제로 바뀌는 제목, 이름, 점수, 등수, 순위 목록, 버튼 라벨을 그립니다.
- 학생 화면에는 자유 닉네임 입력, 학교명, 지역명, 참가코드를 보이지 않습니다.
- 버튼 표면과 보이는 버튼 글자는 SVG가 맡고, HTML 버튼은 투명 hitbox와 접근성 라벨만 맡습니다.
- 배경 이미지 안에 만든 박스에 글자를 맞추지 않습니다. 위치를 조정할 때는 공통 SVG 컴포넌트의 도형과 `<text>` 좌표를 함께 바꿉니다.
- URL에 `?scoreboardDebug=1`을 붙이면 목록 viewport와 버튼 hitbox의 디버그 선이 켜집니다. 이 선은 학생 화면에는 보이지 않습니다.
- 한 화면에는 4행을 안정적으로 보여 줍니다. 렌더러는 최대 10개를 받을 수 있고 목록은 순위판 안에서 스크롤됩니다.

## 렌더 계약

각 차시는 순위 상태가 바뀔 때 아래처럼 호출합니다.

```js
window.MathmonScoreboard.render({
  root: el.scoreboardScreen,
  apiEnabled: Boolean(SCOREBOARD_API_URL),
  loading: state.scoreboardLoading,
  error: Boolean(state.scoreboardError),
  session: state.scoreboardSession,
  submission: state.scoreboardSubmission,
  score: getScoreboardScore(),
  myEntry: findMyLeaderboardEntry(),
  weekLabel: getLeaderboardWeekLabel(),
  entries: state.scoreboardEntries,
  totalQuestions: TOTAL_QUESTIONS
});
```

`session.nickname`은 API가 정한 이름만 사용합니다. 학생이 직접 닉네임을 쓰는 입력은 만들지 않습니다.

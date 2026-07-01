# 게임 연동 가이드

정적 HTML 게임은 API 주소만 환경값으로 주입받는 구조를 권장합니다.

## 업체 작업 범위

업체가 맡을 일은 아래 4가지입니다.

1. GitHub 저장소의 `scoreboard-api` 폴더를 별도 백엔드 서비스로 배포합니다.
2. PostgreSQL을 연결하고 migration과 seed를 실행합니다.
3. 배포된 API 주소를 게임 HTML에 `window.MATHMON_SCOREBOARD_API_URL`로 주입합니다.
4. 공개 전 `/health`, 세션 생성, 점수 제출, 주간 랭킹 조회를 한 번씩 확인합니다.

게임 정적 파일은 기존 GitHub Pages 또는 정적 호스팅에 그대로 두고, 백엔드 서비스는 API만 담당합니다.

```html
<script>
  window.MATHMON_SCOREBOARD_API_URL = "https://your-scoreboard-api.example.com";
</script>
```

## 시작 시 세션 만들기

```ts
const response = await fetch(`${SCOREBOARD_API_URL}/api/v1/sessions`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    lessonId: "3-2-1-2-mathmon-rocket-charge",
    participationCode
  })
})
const session = await response.json()
```

게임은 `session.sessionId`, `session.seed`, `session.nickname`을 보관합니다.

## 결과에서 점수 제출

```ts
await fetch(`${SCOREBOARD_API_URL}/api/v1/scores`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    sessionId: session.sessionId,
    lessonId: "3-2-1-2-mathmon-rocket-charge",
    nickname: session.nickname,
    participationCode,
    clientScore: String(finalScore),
    clientCorrectCount,
    playTimeMs,
    answers,
    rewardResult
  })
})
```

## answer log 계약

`answers`는 기본 10개를 보냅니다. `instantLaunch`처럼 게임 규칙상 조기 종료되는 보상이 마지막에 나온 경우에는 10개보다 적어도 됩니다.

```json
{
  "questionIndex": 0,
  "elapsedMs": 4200,
  "steps": [
    { "stepId": "ones", "selected": 6, "expected": 6, "elapsedMs": 900 }
  ],
  "reward": { "id": "normal", "amount": 5 }
}
```

1차 MVP는 차시별 보상 이벤트 ID와 범위를 검산합니다. 다음 단계에서 각 차시의 seed 기반 문제 생성까지 서버와 완전히 맞추면 조작 방지 강도가 더 올라갑니다.

## API 실패 fallback

스코어보드 API가 실패해도 게임 완료는 막지 않습니다.

- 세션 생성 실패: 로컬 플레이로 진행
- 점수 제출 실패: 결과 화면은 보여 주고 랭킹만 숨김
- 랭킹 조회 실패: 다시 시도 버튼 제공

업체 QA에서는 API 주소를 비운 상태와 실제 API 주소를 넣은 상태를 모두 확인합니다. API 주소가 비어 있으면 학생 화면에는 순위 기능이 꺼진 안내만 보이고, 게임 결과는 정상으로 남아야 합니다.

## 화면 진입

학생 화면에서는 결과 화면 뒤에 별도 순위 화면을 붙입니다.

```text
문제 풀이 -> 결과 화면 -> 순위 보기 -> 전국 순위 화면
```

전국 순위 화면에는 서버가 만든 기록 이름, 점수, 정답 수, 등수만 보여 줍니다. 자유 닉네임 입력, 학교명, 지역명, 참가코드는 학생 화면에 노출하지 않습니다.

공통 화면은 `_shared/scoreboard/scoreboard-celebration-bg-generated.webp`, `_shared/scoreboard/scoreboard-ui.css`, `_shared/scoreboard/scoreboard-ui.js`를 사용합니다. 생성 이미지는 매스몬, 불꽃, 무대 조명 같은 축하 배경만 맡습니다. 순위판, 내 기록 3칸, 순위 행, 스크롤 영역, 버튼 표면, 보이는 글자는 SVG `viewBox="0 0 1280 800"` 안의 공통 컴포넌트가 그립니다. 배경 이미지 안에 만든 박스에 글자를 맞추지 않습니다. HTML 버튼은 보이지 않는 hitbox와 접근성 라벨만 맡습니다. 차시별 화면은 제목과 점수 라벨만 바꾸고, 중앙 순위판과 버튼 배치는 유지합니다.

## 공개 전 QA 순서

```text
1. /health 확인
2. POST /api/v1/sessions 성공 확인
3. 게임에서 결과 화면까지 플레이
4. 순위 보기 클릭
5. POST /api/v1/scores 201 확인
6. GET /api/v1/leaderboards/weekly 200 확인
7. 순위 화면에 서버 닉네임, 점수, 등수 표시 확인
```

랭킹 응답에는 참가코드, 세션 ID, DB ID, IP 주소가 들어가면 안 됩니다.

## 연동 대상 차시

- `3-2-1-1-mathmon-box-run`
- `3-2-1-2-mathmon-rocket-charge`
- `3-2-1-3-mathmon-jump-islands`
- `3-2-1-4-mathmon-fusion`

# 매스몬 10배 점프섬 REPORT

## 구현 요약

- 대상: 3학년 2학기 1단원 3차시 `(몇십)×(몇십), (몇십몇)×(몇십)`
- 배포 파일: `3-2-1-3-mathmon-jump-islands/index.html`
- 제작 원본: `_lessons/3-2-1-3-mathmon-jump-islands/lesson.json`, `model.js`, `view.js`, `lesson.css`
- 공용 엔진: `_engine/v1` 산출물
- Stage: `16:10`, `1280x800`
- 선언 마커: `data-engine-version="mathmon-engine-v1"`, `data-workbench-type="jump-islands"`, `data-reward-mode="modal-art"`, `data-result-render-mode="fullscene-score-slot"`, `data-scoreboard-enabled="true"`

## 엔진 이관 범위

공용 엔진이 맡는 부분:

- 첫 화면, 설명 화면, 문제 흐름, 설정 모달
- 정답 확인 후 보상 버튼 노출
- 보상 이벤트 선택과 적용
- 보상 이미지 모달
- 결과 화면 전환과 공용 정답 수 이미지 연결
- `_shared/scoreboard` 순위판 브리지

1-3 차시가 맡는 부분:

- 10배/100배 문제 생성
- 작은 곱 선택과 0 붙이기 검증
- 점프섬 지도 조작판 렌더링
- 바람 이미지, 결과 섬 이미지, 순위 버튼 좌표

## 문제 구조

한 판은 10문제입니다.

- `(A0)×(B0)`: `A×B`를 고르고 `0 두 개 붙이기`
- `(AB)×(C0)`: `AB×C`를 고르고 `0 한 개 붙이기`
- 각 문제는 두 단계를 모두 첫 시도에 맞혀야 정답 수 1개로 셉니다.
- 최종 답은 한 판 안에서 겹치지 않게 뽑습니다.

## 보상과 결과

보상은 `modal-art` 모드입니다. 문제 화면을 가리지 않도록 보상은 모달 이미지 한 장과 바람 이름, 다음 버튼만 보여 줍니다.

보상 이벤트:

| 바람 | 변화 | 가중치 |
| --- | ---: | ---: |
| 살랑 바람 | +2~+5 | 6400 |
| 앞바람 | -8~-4 | 1700 |
| 잠깐 멈춤 | 0 | 1284 |
| 쌩쌩 바람 | +8~+13 | 598 |
| 무지개 길 | +14 | 18 |
| 길이 흔들렸어요 | -14~-8 | 오답 문제 |

결과는 `fullscene-score-slot` 모드입니다. `result-final-*` 이미지가 도착 섬 장면과 버튼 표면을 맡고, 정답 수는 `_shared/result-count/result-correct-*-generated.webp` 공용 이미지로 표시합니다.

## 순위판

1-3은 엔진의 `MathmonScoreboard.createApiBridge(...)` 경로를 사용합니다. 브라우저 QA에서 로컬 stub으로 아래 endpoint 호출을 확인했습니다.

- `POST /api/v1/sessions`
- `POST /api/v1/scores`
- `GET /api/v1/leaderboards/weekly?lessonId=3-2-1-3-mathmon-jump-islands&limit=100`

`POST /api/v1/scores` payload에는 다음 값이 들어갑니다.

- `lessonId: "3-2-1-3-mathmon-jump-islands"`
- `clientCorrectCount: 10`
- `answers`: 10문제, 각 문제별 `smallProduct`/`scaleFooting` 단계 기록
- `rewardResult.islandId`

## 검증

실행한 검사:

- `node scripts/build-lesson.mjs 3-2-1-3-mathmon-jump-islands`
- `node scripts/build-lesson.mjs 3-2-5-1-mathmon-water-fill`
- `node scripts/build-lesson.mjs 3-2-6-1-mathmon-data-rangers`
- `node scripts/check-lesson-contract.mjs`
- 생성된 3개 `index.html` inline script 문법 검사
- 브라우저 QA `1280x800`: cover → tutorial → 10문제 → reward modal → result → scoreboard
- 브라우저 QA `1024x768`: 같은 흐름 완주
- 로컬 scoreboard API stub 연동 확인

브라우저 QA 결과:

- 텍스트 넘침 0건
- 보이는 이미지 누락 0건
- 결과 정답 수 이미지 `10/10` 정상 표시
- 결과 화면 `순위 보기` hitbox와 버튼 아트 좌표 일치
- 순위판 진입 정상
- API stub 연결 시 순위 데이터 표시 정상

증거 파일:

- `.omo/ulw-loop/evidence/engine-v1-1/1-3-desktop-clean-flow.json`
- `.omo/ulw-loop/evidence/engine-v1-1/1-3-tablet-flow.json`
- `.omo/ulw-loop/evidence/engine-v1-1/1-3-api-flow.json`
- `.omo/ulw-loop/evidence/engine-v1-1/1-3-desktop-clean-result.png`
- `.omo/ulw-loop/evidence/engine-v1-1/1-3-tablet-result.png`
- `.omo/ulw-loop/evidence/engine-v1-1/1-3-api-scoreboard-current.png`

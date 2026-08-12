# 소셜몬 세종과 조선의 변화 잇기

## 완료 요약

`socialmon-5-2-u2-g09-sejong-joseon-change`를 profile-v2 / contract-v3 정식 6문제 단일 HTML로 만들었다. 화면 흐름은 `cover → tutorial → play → result` 네 화면이며, 고르기·이어 보기·순서 놓기 3종 조작만 썼다.

- q1·q3: 지도서 crop을 보는 `source-choice` 2문항
- q2·q5: 과학 기구와 주변 나라 관계를 잇는 `match` 2문항
- q4: 훈민정음 창제 까닭을 고르는 `choice` 1문항
- q6: 농사직설 편찬 흐름을 놓는 `sequence` 1문항
- 결과 후보: 공용 discovery-pack-v1의 `cranemon`, `elephantmon`, `platypusmon`

## 지도서 검증

원자료 `~/Downloads/5_2_사회_2_지도서.pdf`의 SHA-256은
`cfa9afd5c46c9b871aafdf771615580946d16e3f5730b4b3ed03f204135777d9`이며 출처 카탈로그와 일치한다. PDF 34~36·44쪽을 텍스트·렌더링으로 대조해 농사직설, 측우기·앙부일구·자격루, 훈민정음, 명·일본·청 관계를 확인했다. 자료에서 직접 보이는 사실과 학생의 연결·순서 판단은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 분리했다.

생성형 이미지는 표지 제목 아트에만 쓰며 정답 근거로 쓰지 않았다. q1·q3의 source/option 이미지는 지도서 렌더링 crop이고, 모두 alt·출처를 연결했다.

## Humanizer 학생 문구 QA

[HUMANIZER_QA.md](HUMANIZER_QA.md) 기준으로 학생 문구를 검토했다. 제작자 말인 `생산량`, `출하`, `등급`, `토큰`, `오브젝트`, `게이트`, `힘`은 쓰지 않았고, 기구 이름은 그림과 함께 `비의 양을 재었어요`, `시각을 알렸어요`처럼 풀었다. 한 문장에 행동 하나만 남겼다.

## 빌드·정적 검사·브라우저 QA

현재 `index.html`과 QA 영수증은 2026-08-12에 같은 입력으로 생성했다.

| 입력 | SHA-256 |
|---|---|
| quiz.json | `8baeeaba4fc809920e2fb355abf3068c723f6afdc908ece6ced6d09c39dd95f9` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 5-2 joseon-v1 theme pack | `1dcc1ea59d64485c857d26efe0e82e94e67611eefc7eb0dbfcc69d08c244f82f` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| current QA harness | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |
- `node scripts/build-social-quiz.mjs socialmon-5-2-u2-g09-sejong-joseon-change` — PASS
- `node scripts/check-social-quiz.mjs socialmon-5-2-u2-g09-sejong-joseon-change` — PASS
- `node scripts/check-socialmon-source-catalog.mjs socialmon-5-2-u2-g09-sejong-joseon-change` — PASS
- `node scripts/check-socialmon-pack.mjs` — PASS
- `node scripts/check-stage-ratio.mjs` — PASS
- `node scripts/check-socialmon-interaction-policy.mjs` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u2-g09-sejong-joseon-change` — PASS

브라우저 QA는 `desktop-1280x800`, `tablet-landscape-1024x768`, `feedback-reported-1079x929`, `feedback-reported-1079x842`에서 전체 흐름을 검사했다. 총 4 viewport, 120 state audit, 120 PNG이며 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이다. 최신 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이고 현재 정책·하네스 지문을 포함한다.

## 개별 final gate

`node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-5-2-u2-g09-sejong-joseon-change`를 마지막에 실행한다. 공용 엔진·프로필·정책·루트 문서는 수정하지 않았고, 커밋하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `8baeeaba4fc809920e2fb355abf3068c723f6afdc908ece6ced6d09c39dd95f9` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `1dcc1ea59d64485c857d26efe0e82e94e67611eefc7eb0dbfcc69d08c244f82f` |
| 실행 자산 | `2add215fc3b2f489bfe1ab843de2e388d8507ffae2fb76665f8dbaf919a49698` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| QA 하네스 | `c72dfa523dc66c70647889ba23d47d67687e5c4d7578ae9d8d5eff90322174aa` |

- QA 생성 시각: `2026-08-12T20:44:06.753Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

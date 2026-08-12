# 소셜몬 유교 질서 속 생활 찾기

## 완료 요약

`socialmon-5-2-u2-g08-confucian-order-life`를 profile-v2 / contract-v3 정식 6문제 단일 HTML로 만들었다. 화면 흐름은 `cover → tutorial → play → result` 네 화면이며, 고르기·나누어 보기·이어 보기 3종 조작만 썼다.

- q1·q3: 지도서 crop을 보는 `source-choice` 2문항
- q2·q5: 책 내용과 여성 생활 모습을 나누는 `classify` 2문항
- q4: 신분에 따른 생활을 고르는 `choice` 1문항
- q6: 신분과 맡은 일을 잇는 `match` 1문항
- 결과 후보: 공용 discovery-pack-v1의 `pangolinmon`, `elephantmon`, `meerkatmon`

## 지도서 검증

원자료 `~/Downloads/5_2_사회_2_지도서.pdf`의 SHA-256은
`cfa9afd5c46c9b871aafdf771615580946d16e3f5730b4b3ed03f204135777d9`이며 출처 카탈로그와 일치한다. PDF 21~24쪽을 텍스트·렌더링으로 대조해 삼강행실도, 경국대전의 생활 규정, 신분별 역할, 조선 전기·후기 여성 생활을 확인했다. 자료에서 직접 보이는 사실과 학생의 분류·연결 판단은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 분리했다.

생성형 이미지는 표지 제목 아트에만 쓰며 정답 근거로 쓰지 않았다. q1·q3의 source/option 이미지는 지도서 렌더링 crop이고, 모두 alt·출처를 연결했다.

## Humanizer 학생 문구 QA

[HUMANIZER_QA.md](HUMANIZER_QA.md) 기준으로 학생 문구를 검토했다. 제작자 말인 `생산량`, `출하`, `등급`, `토큰`, `오브젝트`, `게이트`, `힘`은 쓰지 않았고, 긴 법전 문장은 `부모를 돌보면 아들 한 명은 군대에 안 가도 됐어요`처럼 줄였다. 시대별 여성 생활은 지도서의 시기 구분을 유지하고 현대의 평가를 섞지 않았다.

## 빌드·정적 검사·브라우저 QA

현재 `index.html`과 QA 영수증은 2026-08-12에 같은 입력으로 생성했다.

| 입력 | SHA-256 |
|---|---|
| quiz.json | `4f7d28ee50ae46754fe73aab37306d729488aa6f108746fc6d8732d7e02cf11a` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 5-2 joseon-v1 theme pack | `1dcc1ea59d64485c857d26efe0e82e94e67611eefc7eb0dbfcc69d08c244f82f` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| current QA harness | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |
- `node scripts/build-social-quiz.mjs socialmon-5-2-u2-g08-confucian-order-life` — PASS
- `node scripts/check-social-quiz.mjs socialmon-5-2-u2-g08-confucian-order-life` — PASS
- `node scripts/check-socialmon-source-catalog.mjs socialmon-5-2-u2-g08-confucian-order-life` — PASS
- `node scripts/check-socialmon-pack.mjs` — PASS
- `node scripts/check-stage-ratio.mjs` — PASS
- `node scripts/check-socialmon-interaction-policy.mjs` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u2-g08-confucian-order-life` — PASS

브라우저 QA는 `desktop-1280x800`, `tablet-landscape-1024x768`, `feedback-reported-1079x929`, `feedback-reported-1079x842`에서 전체 흐름을 검사했다. 총 4 viewport, 120 state audit, 120 PNG이며 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이다. 최신 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이고 현재 정책·하네스 지문을 포함한다.

## 개별 final gate

`node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-5-2-u2-g08-confucian-order-life`를 마지막에 실행한다. 공용 엔진·프로필·정책·루트 문서는 수정하지 않았고, 커밋하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `4f7d28ee50ae46754fe73aab37306d729488aa6f108746fc6d8732d7e02cf11a` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `1dcc1ea59d64485c857d26efe0e82e94e67611eefc7eb0dbfcc69d08c244f82f` |
| 실행 자산 | `516f8b19e2a7e9f74c24babd126aea59b80480370ab736c2bbc669b01254da68` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| QA 하네스 | `4311e2b76bd42939807336a04129bfb518c22856b174241715a2a75168ebbdc5` |

- QA 생성 시각: `2026-08-12T19:39:19.076Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

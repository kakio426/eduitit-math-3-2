# 소셜몬 서민 문화와 새 문물 찾기

## 완료 요약

`socialmon-5-2-u2-g11-commoner-culture-modern-goods`를 profile-v2 / contract-v3 정식 6문제 단일 HTML로 만들었다. 화면 흐름은 `cover → tutorial → play → result` 네 화면이며, 고르기·이어 보기·순서 놓기 3종 조작만 썼다.

- q1·q3: 지도서 crop을 보는 `source-choice` 2문항
- q2·q5: 서민 문화·근대 문물과 특징을 잇는 `match` 2문항
- q4: 서민 문화 발달 배경을 고르는 `choice` 1문항
- q6: 통상 요구 → 개항 → 교류 흐름을 놓는 `sequence` 1문항
- 결과 후보: 공용 discovery-pack-v1의 `meerkatmon`, `elephantmon`, `cranemon`

## 지도서 검증

원자료 `~/Downloads/5_2_사회_2_지도서.pdf`의 SHA-256은
`cfa9afd5c46c9b871aafdf771615580946d16e3f5730b4b3ed03f204135777d9`이며 출처 카탈로그와 일치한다. PDF 67~68·75·77쪽을 텍스트·렌더링으로 대조해 전기수와 한글 소설, 민화, 개항 흐름, 전등·전신·전화·전차의 생활 변화를 확인했다. 자료에서 직접 보이는 사실과 학생의 연결·순서 판단은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 분리했다.

생성형 이미지는 표지 제목 아트에만 쓰며 정답 근거로 쓰지 않았다. q1·q3의 source/option 이미지는 지도서 렌더링 crop이고, 모두 alt·출처를 연결했다. 후기·근대 테마팩 `socialmon-5-2-late-joseon-modern-v1`은 대표 작업자의 승인 팩을 참조했다.

## Humanizer 학생 문구 QA

[HUMANIZER_QA.md](HUMANIZER_QA.md) 기준으로 학생 문구를 검토했다. 제작자 말인 `생산량`, `출하`, `등급`, `토큰`, `오브젝트`, `게이트`, `힘`은 쓰지 않았고, `경제적 여유`는 `살림에 여유가 생겼어요`로 풀었다. `개항`의 흐름과 새 문물의 변화는 행동 중심 문장으로 짧게 정리했다.

## 빌드·정적 검사·브라우저 QA

현재 `index.html`과 QA 영수증은 2026-08-12에 같은 입력으로 생성했다.

| 입력 | SHA-256 |
|---|---|
| quiz.json | `31c742a0cb860632210b7aafc3ca113c652732b0ab17803428085a15355a9802` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| late-joseon-modern-v1 theme pack | `18dfc1e7615bfc5596a335e4b8242353b5b317763134f399466d26f8d0afd395` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| current QA harness | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |
- `node scripts/build-social-quiz.mjs socialmon-5-2-u2-g11-commoner-culture-modern-goods` — PASS
- `node scripts/check-social-quiz.mjs socialmon-5-2-u2-g11-commoner-culture-modern-goods` — PASS
- `node scripts/check-socialmon-source-catalog.mjs socialmon-5-2-u2-g11-commoner-culture-modern-goods` — PASS
- `node scripts/check-socialmon-pack.mjs` — PASS
- `node scripts/check-stage-ratio.mjs` — PASS
- `node scripts/check-socialmon-interaction-policy.mjs` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u2-g11-commoner-culture-modern-goods` — PASS

브라우저 QA는 `desktop-1280x800`, `tablet-landscape-1024x768`, `feedback-reported-1079x929`, `feedback-reported-1079x842`에서 전체 흐름을 검사했다. 총 4 viewport, 120 state audit, 120 PNG이며 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이다. 최신 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이고 현재 정책·하네스 지문을 포함한다.

## 개별 final gate

`node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-5-2-u2-g11-commoner-culture-modern-goods`를 마지막에 실행한다. 공용 엔진·프로필·정책·루트 문서는 수정하지 않았고, 커밋하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `31c742a0cb860632210b7aafc3ca113c652732b0ab17803428085a15355a9802` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `18dfc1e7615bfc5596a335e4b8242353b5b317763134f399466d26f8d0afd395` |
| 실행 자산 | `fe096d3fe972d4a21ca2c51bdd1affc723e1f80a692214d0051b0bfe8a365d2f` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| QA 하네스 | `4311e2b76bd42939807336a04129bfb518c22856b174241715a2a75168ebbdc5` |

- QA 생성 시각: `2026-08-12T19:39:19.616Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

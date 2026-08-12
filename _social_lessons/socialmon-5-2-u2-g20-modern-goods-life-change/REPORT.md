# 소셜몬 새 문물과 생활 변화 찾기

## 완료 요약

`socialmon-5-2-u2-g20-modern-goods-life-change`를 profile-v2 / contract-v3 정식
6문제 단일 HTML로 만들었다. 화면 흐름은 `cover → tutorial → play → result` 네
화면이며, 고르기·이어 보기·순서 놓기 3종 조작만 썼다.

- q1·q3: 생활 사진과 1899년 신문 광고를 보는 `source-choice` 2문항
- q2·q5: 새 문물과 달라진 생활을 잇는 `match` 2문항
- q4: 개항 뒤 새 문물이 들어온 까닭을 고르는 `choice` 1문항
- q6: 통상 요구에서 생활 변화까지 놓는 `sequence` 1문항
- 결과 후보: 공용 discovery-pack-v1의 `meerkatmon`, `elephantmon`, `cranemon`

## 지도서 검증

원자료 `~/Downloads/5_2_사회_2_지도서.pdf`의 SHA-256은
`cfa9afd5c46c9b871aafdf771615580946d16e3f5730b4b3ed03f204135777d9`이며 출처
카탈로그와 일치한다. PDF 75~96쪽(인쇄 230~251쪽)을 모두 렌더링해 개항 흐름,
서양식 옷·음식·건물, 전등·전신·전화·전차, 독립신문 광고, 학교·커피 자료를
확인했다. 직접 확인한 사실과 학생 판단은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에
나눠 기록했다.

생성형 이미지는 표지 제목·목표 아트에만 쓰며 정답 근거로 쓰지 않았다. q1·q3의
자료와 네 그림 선택지는 지도서 렌더링 crop이고, 모두 alt와 출처를 연결했다.

## Humanizer 학생 문구 QA

[HUMANIZER_QA.md](HUMANIZER_QA.md) 기준으로 표지 목표, 방법 안내, 문제 지시문,
선택지, 피드백, 결과 문구를 검토했다. `근대화`, `생활권 확대`, `문물 수용`,
`이벤트`, `토큰` 같은 말은 `달라진 생활`, `더 먼 곳까지 오갔어요`, `새 문물이
들어왔어요`처럼 학생이 바로 그릴 수 있는 장면으로 고쳤다.

## 빌드·정적 검사·브라우저 QA

현재 `index.html`과 QA 영수증은 2026-08-12에 같은 입력으로 생성했다.

| 입력 | SHA-256 |
|---|---|
| quiz.json | `7e747984c2a08939a573699cd04602fdb2657b3a69e86d13c2a3e06a90cd0257` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 5-2 late-joseon-modern-v1 theme pack | `18dfc1e7615bfc5596a335e4b8242353b5b317763134f399466d26f8d0afd395` |
| lesson assets | `2ac6c2374a3ceca589c982cac9b01f706c5e02b8fe9969f1155fdd23a49171b3` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| current QA harness | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |
- `node scripts/build-social-quiz.mjs socialmon-5-2-u2-g20-modern-goods-life-change` — PASS
- `node scripts/check-social-quiz.mjs socialmon-5-2-u2-g20-modern-goods-life-change` — PASS
- `node scripts/check-socialmon-source-catalog.mjs socialmon-5-2-u2-g20-modern-goods-life-change` — PASS
- `node scripts/test-social-quiz-contract.mjs` — PASS
- `node scripts/check-socialmon-pack.mjs` — PASS
- `node scripts/check-stage-ratio.mjs` — PASS
- `node scripts/check-socialmon-interaction-policy.mjs` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:43119 node scripts/qa-social-quiz.mjs socialmon-5-2-u2-g20-modern-goods-life-change` — PASS

브라우저 QA는 `desktop-1280x800`, `tablet-landscape-1024x768`,
`feedback-reported-1079x929`, `feedback-reported-1079x842`에서 전체 흐름을 검사했다.
총 4 viewport, 120 state audit, 120 PNG이며 text overflow 0, Stage 밖 0, critical
overlap 0, small target 0, browser error 0이다. 최신 영수증은
[screenshots/qa-report.json](screenshots/qa-report.json)이고 현재 정책·하네스 지문을
포함한다.

## 기존 차시 이관

g20은 기존 g11 q5의 근대 문물 판단과 q6의 개항 흐름을 독립 차시로 옮긴 구성이다.
소유 범위를 지키기 위해 g11 파일은 수정하지 않았으며, 기존 두 문항의 삭제·대체는
시리즈 통합 담당자가 처리할 후속 항목이다.

## 개별 final gate

마지막 단일 명령은
`node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-5-2-u2-g20-modern-goods-life-change`다.
공용 엔진·profile·policy·scripts·hooks·문서와 5-2 시리즈 계획·manifest는 수정하지
않았고, 커밋하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `7e747984c2a08939a573699cd04602fdb2657b3a69e86d13c2a3e06a90cd0257` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `18dfc1e7615bfc5596a335e4b8242353b5b317763134f399466d26f8d0afd395` |
| 실행 자산 | `2ac6c2374a3ceca589c982cac9b01f706c5e02b8fe9969f1155fdd23a49171b3` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| QA 하네스 | `4311e2b76bd42939807336a04129bfb518c22856b174241715a2a75168ebbdc5` |

- QA 생성 시각: `2026-08-12T19:43:49.397Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

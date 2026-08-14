# 소셜몬 한대·고산 기후 생활

## 완료 요약

1단원 11차시용 `socialmon-quiz-lite-profile-v2`·`socialmon-quiz-lite-contract-v3` 정식 6문제 단일 HTML을 새로 만들었다. 고르기·이어 보기·나누어 보기 세 조작을 사용했고, 출판사 한대·고산 생활 crop을 읽는 `source-choice` 2개, `match` 2개, `choice` 1개, `classify` 1개로 구성했다. 지도 위치 버튼은 없다.

표지 WebP의 외부 크로마는 alpha 0으로 제거해 네 모서리 RGBA가 모두 `(0,0,0,0)`이다. 실제 커버 캡처에서 연두색 사각형·녹색 외곽선이 없고, 표지 아트를 위쪽으로 축소 배치해 시작 버튼이 목표 리본을 가리지 않는 것도 확인했다.

## 자료·Humanizer 점검

원자료 `6_2_사회_1_지도서.pdf`의 SHA-256은 `b5a319833c36ac3876f85e00589ce328f934ca3e95b6b170addeeeb89752b9a5`이며 사용 범위는 PDF 80~86쪽(인쇄 95~101쪽), 교과서 41~43쪽이다. PDF 80쪽의 한대 생활과 81쪽의 고산 생활 crop을 사실 근거로 사용했다. 자세한 기록은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 있다.

[HUMANIZER_QA.md](HUMANIZER_QA.md) 기준으로 `고위도`와 `일교차`를 `극에 가까운 곳`, `낮과 밤의 기온 차이`와 함께 설명했다. 눈·빙하·높은 초원처럼 먼저 보이는 환경을 제시한 뒤 생활과 연결했으며, 장식 그림 alt는 실제 장면과 일치한다.

## 빌드·브라우저 QA

| 입력 | SHA-256 |
|---|---|
| quiz.json | `5809e82a558404f8d5135bce286967661c4af77dbe879e469ecd45172472e293` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `a29725fd4ce7a4aa2869ec58b76bd63b2c98a587c066290ed17e9bfc6a7fa658` |
| 실행 자산 | `f076f0ae9634c594d27b7678b9101815322962425e30cc5d196785e52d1c6746` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| 현재 QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

- QA 생성 시각: `2026-08-12T13:54:57.947Z`

- `node scripts/build-social-quiz.mjs socialmon-6-2-u1-g20-polar-highland-climate-life` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u1-g20-polar-highland-climate-life` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-6-2-u1-g20-polar-highland-climate-life` — PASS

브라우저 QA는 4 viewport, 120개 상태, 120개 PNG에서 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0으로 통과했다. 현재 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이다.

공용 엔진·프로필·테마팩·브랜드·정책·하네스는 수정하지 않았고 커밋하거나 푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `93c9ae4830604c378a9b54c19fb0cb28a11e3da76377efd74ac5ad7128e79c23` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `a29725fd4ce7a4aa2869ec58b76bd63b2c98a587c066290ed17e9bfc6a7fa658` |
| 실행 자산 | `bac3af0842e21e44e5df6994da34cfe800615848d33e30d6afbcceb2f153c5c6` |
| 엔진 | `4e714a1bdc0e6caf20e362a2a182ad9d0d64d8a5f378c2ebee2f4e155e8fb75a` |
| 정책·스킬 | `fa7ce4222ee3e03a5643e058725c0a43e6aa2ba37c02351baaf1fed89ab91d50` |
| QA 하네스 | `72c00eaa8fed8ba2552f0a559ef49d149c446db98a46f51529ef8cc8dfa504ab` |
| 캡처 PNG 집합 | `e700fe62d09cc71b2785e6529c873509a95c02e07a2b5954aaa88bfbe8ed388e` |

- QA 생성 시각: `2026-08-14T09:04:37.222Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

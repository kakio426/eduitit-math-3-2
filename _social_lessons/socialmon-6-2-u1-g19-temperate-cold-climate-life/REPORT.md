# 소셜몬 온대·냉대 기후 생활

## 완료 요약

1단원 10차시용 `socialmon-quiz-lite-profile-v2`·`socialmon-quiz-lite-contract-v3` 정식 6문제 단일 HTML을 새로 만들었다. 고르기·이어 보기·나누어 보기 세 조작을 사용했고, 출판사 온대·냉대 생활 crop을 읽는 `source-choice` 2개, `match` 2개, `choice` 1개, `classify` 1개로 구성했다. 지도 위치 버튼은 없다.

표지 WebP는 외부 크로마를 alpha 0으로 제거해 네 모서리 RGBA가 모두 `(0,0,0,0)`이며, 실제 커버 캡처에서 연두색 사각형이나 녹색 외곽선이 보이지 않는다.

## 자료·Humanizer 점검

원자료 `6_2_사회_1_지도서.pdf`의 SHA-256은 `b5a319833c36ac3876f85e00589ce328f934ca3e95b6b170addeeeb89752b9a5`이며 사용 범위는 PDF 73~79쪽(인쇄 88~94쪽), 교과서 37~40쪽이다. PDF 73쪽의 온대 농업·관광과 74쪽의 냉대 침엽수림·통나무집 crop을 사실 근거로 사용했다. 자세한 기록은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 있다.

[HUMANIZER_QA.md](HUMANIZER_QA.md) 기준으로 `연중 고른 강수`를 `한 해 동안 비가 고르게 와요`처럼 풀고, 침엽수림·펄프는 자료와 함께 이해할 수 있게 배치했다. 한 문장에는 한 가지 판단만 두었으며 장식 그림 alt는 실제 장면과 일치한다.

## 빌드·브라우저 QA

| 입력 | SHA-256 |
|---|---|
| quiz.json | `01d47923fc2cebd0644f8a6bcfc3a54ce768864dbef6f9164474f5524cf1e0b2` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `a29725fd4ce7a4aa2869ec58b76bd63b2c98a587c066290ed17e9bfc6a7fa658` |
| 실행 자산 | `8623c0a9ef6571af517628d6549516257617a4c155f401c804e5e3416690b34c` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| 현재 QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

- QA 생성 시각: `2026-08-12T13:54:58.424Z`

- `node scripts/build-social-quiz.mjs socialmon-6-2-u1-g19-temperate-cold-climate-life` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u1-g19-temperate-cold-climate-life` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-6-2-u1-g19-temperate-cold-climate-life` — PASS

브라우저 QA는 4 viewport, 120개 상태, 120개 PNG에서 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0으로 통과했다. 현재 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이다.

공용 엔진·프로필·테마팩·브랜드·정책·하네스는 수정하지 않았고 커밋하거나 푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `a3e2c9083f78b01e82a0d7376dc975ad40c9a0f717a8cf69f1e1af8390fda5c9` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `a29725fd4ce7a4aa2869ec58b76bd63b2c98a587c066290ed17e9bfc6a7fa658` |
| 실행 자산 | `8623c0a9ef6571af517628d6549516257617a4c155f401c804e5e3416690b34c` |
| 엔진 | `4e714a1bdc0e6caf20e362a2a182ad9d0d64d8a5f378c2ebee2f4e155e8fb75a` |
| 정책·스킬 | `fa7ce4222ee3e03a5643e058725c0a43e6aa2ba37c02351baaf1fed89ab91d50` |
| QA 하네스 | `72c00eaa8fed8ba2552f0a559ef49d149c446db98a46f51529ef8cc8dfa504ab` |
| 캡처 PNG 집합 | `a61fb3b755e2547f27243eefd27bf4da7cdc5c62739c4c297cf172524a0298ed` |

- QA 생성 시각: `2026-08-13T13:31:19.660Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

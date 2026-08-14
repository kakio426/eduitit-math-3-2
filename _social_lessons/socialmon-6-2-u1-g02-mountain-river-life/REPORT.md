# 소셜몬 산과 강 곁의 생활

## 완료 요약

`socialmon-quiz-lite-profile-v2`·`socialmon-quiz-lite-contract-v3` 기준의 정식 6문제 단일 HTML이다. 자료를 보고 고르기와 이어 보기 두 조작만 사용했다. 출판사 산지·하천 자료를 직접 읽는 `source-choice` 2개와 지형·생활의 관계를 잇는 `match` 2개를 포함한다. 지도 위치 버튼은 없다.

## 자료·Humanizer 점검

원자료 `6_2_사회_1_지도서.pdf`의 SHA-256은 `b5a319833c36ac3876f85e00589ce328f934ca3e95b6b170addeeeb89752b9a5`다. 사진·지도·설명 crop은 출판사 자료만 사용하고 생성형 표지는 사실 근거에서 제외했다. 문항별 근거와 페이지는 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 기록했다.

[HUMANIZER_QA.md](HUMANIZER_QA.md) 기준으로 산지·하천의 자연 모습과 생활을 짧고 자연스러운 학생 말로 다듬었다. 문제마다 행동 하나만 안내하며, 공용 장식 삽화의 alt는 실제 산지·해안·열대·한대 장면을 정확히 설명한다.

## 빌드·브라우저 QA

| 입력 | SHA-256 |
|---|---|
| quiz.json | `b08a6ff44219726ccb68fc4b6d160edc7565e20d5d1a7f41aec85f8b74b16b71` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `e5de70ff21ac7fbc4f58d982beb8ab83b662c8110389c38c6ec8996ddde53428` |
| 실행 자산 | `ba5632d4d7b6db4c12ab19eafd9ba115b2931689240a3842f5b38ca6930b3bf5` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| 현재 QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

- QA 생성 시각: `2026-08-12T13:48:49.068Z`

- `node scripts/build-social-quiz.mjs socialmon-6-2-u1-g02-mountain-river-life` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u1-g02-mountain-river-life` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-6-2-u1-g02-mountain-river-life` — PASS

브라우저 QA는 4 viewport, 120개 상태, 120개 PNG에서 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0으로 통과했다. 현재 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이다.

공용 엔진·프로필·테마팩·브랜드·정책·하네스는 수정하지 않았고 커밋하거나 푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `248f97f9b68af24cfeac21e414261101780421e0333850eecf5a6508c409b354` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `e5de70ff21ac7fbc4f58d982beb8ab83b662c8110389c38c6ec8996ddde53428` |
| 실행 자산 | `e269c5516795e0f759f999d95f48fb41dffeab67c99558d9f44b2c0ddca5c3b5` |
| 엔진 | `4e714a1bdc0e6caf20e362a2a182ad9d0d64d8a5f378c2ebee2f4e155e8fb75a` |
| 정책·스킬 | `fa7ce4222ee3e03a5643e058725c0a43e6aa2ba37c02351baaf1fed89ab91d50` |
| QA 하네스 | `72c00eaa8fed8ba2552f0a559ef49d149c446db98a46f51529ef8cc8dfa504ab` |
| 캡처 PNG 집합 | `413c8a6e0c296e0c04cc183ec1a0b468fd43eb6916a26f1c107c9e6a2eddc9aa` |

- QA 생성 시각: `2026-08-14T08:50:50.468Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

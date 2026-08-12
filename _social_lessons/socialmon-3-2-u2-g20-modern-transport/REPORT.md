# 소셜몬 오늘날 빠른 교통 — 제작·검증 보고서

## 완료 범위

`socialmon-3-2-u2-g20-modern-transport`는 지도서의 독립 학습 주제 **오늘날 사람들이 이용하는 교통수단**을 다루는 6문제 소셜몬 퀴즈다. 학생 화면은 표지 → 방법 보기 → 문제 → 결과의 네 화면이며, 문제마다 흔적을 모아 2·4문제 뒤 힌트를 보고 마지막에 소셜몬을 발견한다.

- 지도서 차시: 14~15차시
- 성취기준: `[4사04-02]`
- 학습 목표: 오늘날 교통수단과 교통 시설의 특징을 알고 옛날과 달라진 점을 설명한다.
- 문항 구성: 자료 고르기 2, 이어 보기 3, 순서 놓기 1
- 화면 계약: `socialmon-quiz-lite-profile-v2` / `socialmon-quiz-lite-contract-v3`

## 지도서·출처 검증

사용자가 제공한 `3_2_사회_2_지도서.pdf`의 SHA-256은 `30da1fbc23bc4229595e2b2cbe705539ef2515fd79a599023fef54bd2c39e3c3`이다. 지도서 PDF 81~89쪽, 인쇄 196~204쪽의 학습 자료와 문항 근거를 대조했다. 자료형 문항의 사실 근거는 출판사 자료에서 가져왔고, 생성 이미지는 표지·분위기·선택지 이해를 돕는 장식에만 사용했다. 자세한 쪽수와 crop 기록은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 남겼다.

## Humanizer 학생 문구 QA

표지 목표, 지시문, 보기, 자료 글, 피드백과 결과를 3학년 학생이 소리 내어 읽는 기준으로 점검했다. 한 문장에 행동 하나만 남겼고, 사실·정답·수치·고유명사·인과관계는 그대로 보존했다. S1 0건, S2 0건, 자연도 A이며 세부 기록은 [HUMANIZER_QA.md](HUMANIZER_QA.md)에 있다.

## 최신 브라우저 QA

2026. 08. 12. 23:04 KST에 현재 입력으로 전체 흐름을 다시 캡처했다.

- viewport: 4개
- 상태 audit: 120개
- PNG: 120개
- 텍스트 넘침: 0건
- Stage 이탈: 0건
- 치명적 요소 겹침: 0건
- 작은 조작부: 0건
- 브라우저 오류·실패한 자산 요청: 0건

브라우저 QA 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)에 있으며, 차시가 실제 참조하는 PNG·WebP·SVG·오디오 바이트를 합친 `lessonAssetsSha256`도 기록한다.

## 현재 입력 지문

| 입력 | SHA-256 |
|---|---|
| `quiz.json` | `e56593b65ad6abcad6d9bdb225c3ceebeaca5375de9c7151dd0009ab1b578b22` |
| `profile.json` | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `7c1ed1b1a467e625e5b47d1ede47d2a707b5107f930f01edd4e7aa05915376a8` |
| 실행 자산 (`lessonAssetsSha256`) | `8ef5d38961f8f083410a845d4af63dc035ea0054202134c88e98b7dac6d641d7` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 3-2 policy | `03568037a28f1559d28a68cfae4820515fcdb5633f7eb05cfcee614f8f931a91` |
| QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

## 검사 결과

- `node scripts/build-social-quiz.mjs socialmon-3-2-u2-g20-modern-transport` — PASS
- `node scripts/check-social-quiz.mjs socialmon-3-2-u2-g20-modern-transport` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4199 node scripts/qa-social-quiz.mjs socialmon-3-2-u2-g20-modern-transport` — PASS

사용자가 수정 중인 `socialmon-3-2-u1-g01-changing-life`은 이번 제작·검증·보고서 대상에서 제외했으며, 공용 엔진·프로필·스키마·정책·훅·검증 스크립트는 수정하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `e56593b65ad6abcad6d9bdb225c3ceebeaca5375de9c7151dd0009ab1b578b22` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `7c1ed1b1a467e625e5b47d1ede47d2a707b5107f930f01edd4e7aa05915376a8` |
| 실행 자산 | `8ef5d38961f8f083410a845d4af63dc035ea0054202134c88e98b7dac6d641d7` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `bbdc556a881f303e366e915ab48ee445bb614101fa30b5733a876b1eb3f43575` |
| QA 하네스 | `4311e2b76bd42939807336a04129bfb518c22856b174241715a2a75168ebbdc5` |

- QA 생성 시각: `2026-08-12T19:43:03.640Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

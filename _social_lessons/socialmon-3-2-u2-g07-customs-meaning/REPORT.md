# 소셜몬 풍습 속 뜻 찾기 — 제작·검증 보고서

## 완료 범위

`socialmon-3-2-u2-g07-customs-meaning`는 지도서의 독립 학습 주제 **풍습·세시 풍속과 두레·품앗이의 뜻**을 다루는 6문제 소셜몬 퀴즈다. 학생 화면은 표지 → 방법 보기 → 문제 → 결과의 네 화면이며, 문제마다 흔적을 모아 2·4문제 뒤 힌트를 보고 마지막에 소셜몬을 발견한다.

- 지도서 차시: 1~3차시
- 성취기준: `[4사04-01]`
- 학습 목표: 풍습의 뜻을 알고 옛날 일상생활 풍습에 담긴 생각을 설명한다.
- 문항 구성: 자료 고르기 2, 이어 보기 2, 고르기 1, 나누어 보기 1
- 화면 계약: `socialmon-quiz-lite-profile-v2` / `socialmon-quiz-lite-contract-v3`

## 지도서·출처 검증

사용자가 제공한 `3_2_사회_2_지도서.pdf`의 SHA-256은 `30da1fbc23bc4229595e2b2cbe705539ef2515fd79a599023fef54bd2c39e3c3`이다. 지도서 PDF 1~26쪽, 인쇄 116~141쪽의 학습 자료와 문항 근거를 대조했다. 자료형 문항의 사실 근거는 출판사 자료에서 가져왔고, 생성 이미지는 표지·분위기·선택지 이해를 돕는 장식에만 사용했다. 자세한 쪽수와 crop 기록은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 남겼다.

## Humanizer 학생 문구 QA

표지 목표, 지시문, 보기, 자료 글, 피드백과 결과를 3학년 학생이 소리 내어 읽는 기준으로 점검했다. 한 문장에 행동 하나만 남겼고, 사실·정답·수치·고유명사·인과관계는 그대로 보존했다. S1 0건, S2 0건, 자연도 A이며 세부 기록은 [HUMANIZER_QA.md](HUMANIZER_QA.md)에 있다.

## 최신 브라우저 QA

2026. 08. 12. 22:59 KST에 현재 입력으로 전체 흐름을 다시 캡처했다.

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
| `quiz.json` | `0815dd7b9096d4a01334f88fcdfabbfa2e95c3604b8d17a515e33e8024294d6b` |
| `profile.json` | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `c14bca05b9bb24e24712aab62d7694155c3ef7628f2896ad969324d4bb0fcc7f` |
| 실행 자산 (`lessonAssetsSha256`) | `9d05fe82f9f4765819220cab04a42fa795a3740a6a21d7ce774ec82ad1d7b57f` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 3-2 policy | `03568037a28f1559d28a68cfae4820515fcdb5633f7eb05cfcee614f8f931a91` |
| QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

## 검사 결과

- `node scripts/build-social-quiz.mjs socialmon-3-2-u2-g07-customs-meaning` — PASS
- `node scripts/check-social-quiz.mjs socialmon-3-2-u2-g07-customs-meaning` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4199 node scripts/qa-social-quiz.mjs socialmon-3-2-u2-g07-customs-meaning` — PASS

사용자가 수정 중인 `socialmon-3-2-u1-g01-changing-life`은 이번 제작·검증·보고서 대상에서 제외했으며, 공용 엔진·프로필·스키마·정책·훅·검증 스크립트는 수정하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `4fe429f0d09e83bae9a5ddd99d2ec3b33d60b027866425f24fe312e28e548b44` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `c14bca05b9bb24e24712aab62d7694155c3ef7628f2896ad969324d4bb0fcc7f` |
| 실행 자산 | `9d05fe82f9f4765819220cab04a42fa795a3740a6a21d7ce774ec82ad1d7b57f` |
| 엔진 | `f87dfdf6ebe0f009de9ed9f018591d3df1d15fd01d655e79948946421e932fdc` |
| 정책·스킬 | `6bad9e9bea5fe4ae1c53a1a81833fbea52a033375f71407107163aff02b229cf` |
| QA 하네스 | `68955bd66faf6a57a11237c3f350f92aad4ce683cc66d20a2dfe7da0abbf2f2c` |
| 캡처 PNG 집합 | `e478af4a3ea244b73293ae69230bd6d7505307ca972e087b86a82c9823a49114` |

- QA 생성 시각: `2026-08-16T08:22:09.423Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

# 소셜몬 옛날 소식 전하기 — 제작·검증 보고서

## 완료 범위

`socialmon-3-2-u2-g14-old-communication`는 지도서의 독립 학습 주제 **통신의 뜻과 옛날 소식 전달 방법**을 다루는 6문제 소셜몬 퀴즈다. 학생 화면은 표지 → 방법 보기 → 문제 → 결과의 네 화면이며, 문제마다 흔적을 모아 2·4문제 뒤 힌트를 보고 마지막에 소셜몬을 발견한다.

- 지도서 차시: 21~22차시
- 성취기준: `[4사04-03]`
- 학습 목표: 통신과 통신수단의 뜻을 알고 옛날 사람들이 소식과 정보를 주고받은 방법을 설명한다.
- 문항 구성: 자료 고르기 2, 이어 보기 2, 고르기 1, 나누어 보기 1
- 화면 계약: `socialmon-quiz-lite-profile-v2` / `socialmon-quiz-lite-contract-v3`

## 지도서·출처 검증

사용자가 제공한 `3_2_사회_2_지도서.pdf`의 SHA-256은 `30da1fbc23bc4229595e2b2cbe705539ef2515fd79a599023fef54bd2c39e3c3`이다. 지도서 PDF 119~134쪽, 인쇄 234~249쪽의 학습 자료와 문항 근거를 대조했다. 자료형 문항의 사실 근거는 출판사 자료에서 가져왔고, 생성 이미지는 표지·분위기·선택지 이해를 돕는 장식에만 사용했다. 자세한 쪽수와 crop 기록은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 남겼다.

## Humanizer 학생 문구 QA

표지 목표, 지시문, 보기, 자료 글, 피드백과 결과를 3학년 학생이 소리 내어 읽는 기준으로 점검했다. 한 문장에 행동 하나만 남겼고, 사실·정답·수치·고유명사·인과관계는 그대로 보존했다. S1 0건, S2 0건, 자연도 A이며 세부 기록은 [HUMANIZER_QA.md](HUMANIZER_QA.md)에 있다.

## 최신 브라우저 QA

2026. 08. 12. 23:01 KST에 현재 입력으로 전체 흐름을 다시 캡처했다.

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
| `quiz.json` | `dcb8e2f0ac6bf61f50ab140c0ae081ed5e935355bb4c7c7f89ea918938b92e51` |
| `profile.json` | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `523272229d1bb589d1f97d20c661d93f62dbed5a264992ef2f7d2012e3ca1436` |
| 실행 자산 (`lessonAssetsSha256`) | `96a2465bed29a6070789fc4182b66f5b5d72c012f20e3171a16cfdbc4185e5b6` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 3-2 policy | `03568037a28f1559d28a68cfae4820515fcdb5633f7eb05cfcee614f8f931a91` |
| QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

## 검사 결과

- `node scripts/build-social-quiz.mjs socialmon-3-2-u2-g14-old-communication` — PASS
- `node scripts/check-social-quiz.mjs socialmon-3-2-u2-g14-old-communication` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4199 node scripts/qa-social-quiz.mjs socialmon-3-2-u2-g14-old-communication` — PASS

사용자가 수정 중인 `socialmon-3-2-u1-g01-changing-life`은 이번 제작·검증·보고서 대상에서 제외했으며, 공용 엔진·프로필·스키마·정책·훅·검증 스크립트는 수정하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `ec57125cf9aaf4817b5df8df531f79aae9350f5b1f0fd2b4d31437d58003bc91` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `523272229d1bb589d1f97d20c661d93f62dbed5a264992ef2f7d2012e3ca1436` |
| 실행 자산 | `118418923b643257617a2e684cbfc20a43aa2c35d59886d26356031377978ab9` |
| 엔진 | `4e714a1bdc0e6caf20e362a2a182ad9d0d64d8a5f378c2ebee2f4e155e8fb75a` |
| 정책·스킬 | `e0079acbc29c6b79a1bcea499e77ed9de7c4f0576ddcfb2b25f8d15a3432005b` |
| QA 하네스 | `72c00eaa8fed8ba2552f0a559ef49d149c446db98a46f51529ef8cc8dfa504ab` |
| 캡처 PNG 집합 | `693c67412e9b625f2570a6ac9df582bed16c3363df0317c8a8f4be07a18a9da8` |

- QA 생성 시각: `2026-08-13T13:10:10.157Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

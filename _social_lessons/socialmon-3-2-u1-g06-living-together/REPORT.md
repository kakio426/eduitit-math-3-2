# 소셜몬 함께 사는 약속 — 제작·검증 보고서

## 완료 범위

`socialmon-3-2-u1-g06-living-together`는 지도서의 독립 학습 주제 **편견·차별·갈등 상황에서 서로 존중하기**을 다루는 6문제 소셜몬 퀴즈다. 학생 화면은 표지 → 방법 보기 → 문제 → 결과의 네 화면이며, 문제마다 흔적을 모아 2·4문제 뒤 힌트를 보고 마지막에 소셜몬을 발견한다.

- 지도서 차시: 14~18차시
- 성취기준: `[4사03-02]`
- 학습 목표: 편견과 차별이 담긴 말이나 행동을 알아보고, 다양한 문화를 존중하는 행동을 고른다.
- 문항 구성: 자료 고르기 2, 상황 고르기 2, 나누어 보기 2
- 화면 계약: `socialmon-quiz-lite-profile-v1` / `socialmon-quiz-lite-contract-v2`

## 지도서·출처 검증

사용자가 제공한 `3_2_사회_1_지도서.pdf`의 SHA-256은 `950003b6b2aa4034ffe6bd646068817664631127adc5a9bee4ef9404bbc02d22`이다. 지도서 PDF 83~98쪽, 인쇄 98~113쪽의 학습 자료와 문항 근거를 대조했다. 자료형 문항의 사실 근거는 출판사 자료에서 가져왔고, 생성 이미지는 표지·분위기·선택지 이해를 돕는 장식에만 사용했다. 자세한 쪽수와 crop 기록은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 남겼다.

## Humanizer 학생 문구 QA

표지 목표, 지시문, 보기, 자료 글, 피드백과 결과를 3학년 학생이 소리 내어 읽는 기준으로 점검했다. 한 문장에 행동 하나만 남겼고, 사실·정답·수치·고유명사·인과관계는 그대로 보존했다. S1 0건, S2 0건, 자연도 A이며 세부 기록은 [HUMANIZER_QA.md](HUMANIZER_QA.md)에 있다.

## 최신 브라우저 QA

2026. 08. 12. 22:58 KST에 현재 입력으로 전체 흐름을 다시 캡처했다.

- viewport: 2개
- 상태 audit: 46개
- PNG: 46개
- 텍스트 넘침: 0건
- Stage 이탈: 0건
- 치명적 요소 겹침: 0건
- 작은 조작부: 0건
- 브라우저 오류·실패한 자산 요청: 0건

브라우저 QA 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)에 있으며, 차시가 실제 참조하는 PNG·WebP·SVG·오디오 바이트를 합친 `lessonAssetsSha256`도 기록한다.

## 현재 입력 지문

| 입력 | SHA-256 |
|---|---|
| `quiz.json` | `4decc8cbbe3985d5286b495bfa6e7d12a064a486c276e768a5d204fd2fb43dd4` |
| `profile.json` | `112f4bb6da35db12398e06679d549cfca1ae685973d88e11ec0293415fc32e67` |
| theme pack | `a82ea6391ee5ac4ae1a51d06f0af96159020c90096447afdb8a4458a5bc3c7c1` |
| 실행 자산 (`lessonAssetsSha256`) | `07e4d485f1b18e3b67e38749806da5fae5775ccc751ddf50ce10de6e73255daf` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 3-2 policy | `03568037a28f1559d28a68cfae4820515fcdb5633f7eb05cfcee614f8f931a91` |
| QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

## 검사 결과

- `node scripts/build-social-quiz.mjs socialmon-3-2-u1-g06-living-together` — PASS
- `node scripts/check-social-quiz.mjs socialmon-3-2-u1-g06-living-together` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4199 node scripts/qa-social-quiz.mjs socialmon-3-2-u1-g06-living-together` — PASS

사용자가 수정 중인 `socialmon-3-2-u1-g01-changing-life`은 이번 제작·검증·보고서 대상에서 제외했으며, 공용 엔진·프로필·스키마·정책·훅·검증 스크립트는 수정하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `4decc8cbbe3985d5286b495bfa6e7d12a064a486c276e768a5d204fd2fb43dd4` |
| profile.json | `112f4bb6da35db12398e06679d549cfca1ae685973d88e11ec0293415fc32e67` |
| 테마팩 | `a82ea6391ee5ac4ae1a51d06f0af96159020c90096447afdb8a4458a5bc3c7c1` |
| 실행 자산 | `07e4d485f1b18e3b67e38749806da5fae5775ccc751ddf50ce10de6e73255daf` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `bbdc556a881f303e366e915ab48ee445bb614101fa30b5733a876b1eb3f43575` |
| QA 하네스 | `4311e2b76bd42939807336a04129bfb518c22856b174241715a2a75168ebbdc5` |

- QA 생성 시각: `2026-08-12T19:36:58.433Z`
- 브라우저 QA: 2개 viewport, 46개 상태, 46개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

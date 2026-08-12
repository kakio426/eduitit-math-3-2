# 소셜몬 도시 생활 살펴보기 — 제작·검증 보고서

## 결과

4학년 2학기 3단원 12~13차시(지도서 PDF 69~86쪽)를 바탕으로 도시 생활의 모습, 편리한 점, 문제점, 해결 노력을 함께 살피는 6문제 차시를 완성했다. 도시와 촌락을 우열로 비교하지 않고, q2·q5에서 좋은 점과 문제점을 함께 나누고 q4·q6에서 자료와 생활 속 해결 행동을 판단하게 했다.

## 제품 계약

- profile: `socialmon-quiz-lite-profile-v2`
- contract: `socialmon-quiz-lite-contract-v3`
- flow: `socialmon-four-screen-flow-v1` (`cover`, `tutorial`, `play`, `result`)
- interactions: `고르기`(source-choice 2, situation-choice 1), `나누어 보기`(classify 2), `이어 보기`(match 1)
- reward: `socialmon-trace-reveal-v1` — 2문제 뒤 그림자, 4문제 뒤 특징, 마지막 소셜몬 공개
- 사실 자료: 출판사 지도서 PDF crop만 사용. 생성형 표지·선택지 그림은 장식이며 사실 근거가 아님.

## 원자료 대조

`/Users/yubyeongju/Downloads/4_2_사회_3_지도서.pdf`를 `pdfinfo`, `pdftotext -layout`, `pdftoppm`으로 확인하고 69~86쪽을 시각·텍스트 대조했다. 도시의 생활 모습은 69~70쪽, 좋은 점과 문제점은 81~82쪽, 바람길 숲·생활 쓰레기 줄이기 기사는 83쪽, 생활 속 해결 방법은 85~86쪽을 사용했다. 상세 출처·crop 좌표·자산 경계는 [SOURCE_LEDGER.md](./SOURCE_LEDGER.md)에 기록했다.

## 자산

- 표지 문구: [cover-copy-v1-generated.webp](./assets/cover-copy-v1-generated.webp), 원본 [cover-copy-v1-source.png](./assets/cover-copy-v1-source.png) — 투명 생성형 래스터 한 덩어리
- 사실 자료: [source-city-life-v1.webp](./assets/source-city-life-v1.webp), [source-city-solutions-v1.webp](./assets/source-city-solutions-v1.webp) 및 각 `*-source.png` 원본
- q1/q4 선택지: 1254×1254 원본 PNG 8장과 512px 이상 WebP 8장. 생성형 장식이며 정답 근거로 사용하지 않음.

## 최신 브라우저 QA

실행 URL: `http://127.0.0.1:4175/_social_lessons/socialmon-4-2-u3-g15-city-life/`

명령:

```bash
node scripts/build-social-quiz.mjs socialmon-4-2-u3-g15-city-life
node scripts/check-social-quiz.mjs socialmon-4-2-u3-g15-city-life
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u3-g15-city-life
```

결과: 4 viewport(`desktop-1280x800`, `tablet-landscape-1024x768`, `feedback-reported-1079x929`, `feedback-reported-1079x842`)에서 120 상태 audit·120 PNG를 통과했다. 텍스트 넘침 0, Stage 밖 0, 핵심 겹침 0, 작은 조작 대상 0, 브라우저 오류 0이며 trace 0~6, 설정, 오답·정답 피드백, 두 source-choice, 결과 6종을 포함한다. 전체 영수증은 [screenshots/qa-report.json](./screenshots/qa-report.json)이다.

## 현재 입력 지문

| 입력 | SHA-256 |
| --- | --- |
| `quiz.json` | `96f31c96d5fb71857f9d6c08a23835c5e5b3750e43d4bd52ac16f621a8b9a6fe` |
| `quiz-lite-v2/profile.json` | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| `city-life-v1/pack.json` | `5d522d1603aa540ff520b12e58a6225e3b41608e4dee141bbf80220677cdbec3` |
| 공용 engine 입력 | `ab7fdc1e4b14f8fc8725353d48d9cee1a9e1815b9069016455c726b1e66165ce` |
| 현재 정책·스킬 지문 | `8e2c364fd20b6f00a1246721ec25d658d9ea0ed84dd478612a386dd1b688401b` |
| 현재 하네스 지문 | `9b89ab7937d3473112eebcf559eca40b11caf0e69b33594fe15da2e6ef9f1a45` |

## 문구 QA 및 최종 게이트

Humanizer 학생 문구 QA는 [HUMANIZER_QA.md](./HUMANIZER_QA.md)에 기록했다. 목표·지시문·선택지·설명·결과 문구를 초등학생이 소리 내어 읽는 기준으로 확인했고, 내부 제작 용어와 예전 브랜드명을 배제했다.

최종 브라우저 증거와 REPORT의 지문을 포함해 다음 개별 final gate를 실행한다.

```bash
node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u3-g15-city-life
```

결과: `SOCIALMON_DELIVERY_GATE: PASS (1 series, 1 lessons, 1 changed paths)`. 공유 worktree의 다른 작업자 변경은 게이트 입력에서 제외하고, 이 차시의 `quiz.json`을 기준으로 테마팩·시리즈·브라우저 영수증·REPORT 지문을 확인했다.

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:36:15.088Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | 96f31c96d5fb71857f9d6c08a23835c5e5b3750e43d4bd52ac16f621a8b9a6fe |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | 5d522d1603aa540ff520b12e58a6225e3b41608e4dee141bbf80220677cdbec3 |
| 실행 자산 | 4255ebddf3b2927e04210eb2e1ee91e03fdc862dd2edc61009127cd1ffd011c2 |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `96f31c96d5fb71857f9d6c08a23835c5e5b3750e43d4bd52ac16f621a8b9a6fe` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `5d522d1603aa540ff520b12e58a6225e3b41608e4dee141bbf80220677cdbec3` |
| 실행 자산 | `4255ebddf3b2927e04210eb2e1ee91e03fdc862dd2edc61009127cd1ffd011c2` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a6bb69510ff5258dd2d5b9a3ef74635f1f3369bc32b821d5bfb88500ac034978` |
| QA 하네스 | `c72dfa523dc66c70647889ba23d47d67687e5c4d7578ae9d8d5eff90322174aa` |

- QA 생성 시각: `2026-08-12T20:42:04.741Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

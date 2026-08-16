# 소셜몬 지구촌 문제 원인 찾기 완료 보고서

## 완료 내용

`socialmon-6-2-u3-g17-global-problem-causes`를 profile-v2 / contract-v3 정식 6문제로 완성했다. 고르기·이어 보기 2종을 사용하며, 출판사 자료를 직접 읽는 `source-choice` 3문항과 관계형 `match` 2문항을 포함한다. q6은 실제 crop에 보이는 온실가스와 지구 밖 에너지 방출의 관계를 묻도록 맞췄다. `map-hotspots`는 사용하지 않는다.

## 출처·시각 점검

- 원자료 SHA-256: `ff9e47406a829468cefe527d5ca535bb490b457719b9424ec5197041ef5cc8ba`
- manifest 범위: PDF 49~66쪽 / 지도서 인쇄 308~325쪽 / 교과서 140~147쪽
- 자료형 3문항은 지도서의 열대 우림 기사, 아프리카 가뭄 편지, 온실 효과 그림 crop을 직접 사용한다.
- 통신 주제였던 영상 통화·대화·편지·방문 장식과 미사용 패스트패션 crop은 제거했다. 남은 선택지의 `alt`는 실제 그림만 설명하며 정답 근거로 쓰지 않는다.

자세한 쪽별 근거는 `SOURCE_LEDGER.md`에 기록했다.

## Humanizer 학생 문구 QA

Humanizer v1.6.0 기준으로 표지 목표, 6문제 지시문·선택지·자료 설명·피드백·결과 문구·접근성 문구를 점검했다. 열대 우림 원인은 `농사, 에너지 사용, 가축 사육, 산업 활동이 늘어서`로 풀어 쓰고, q6은 그림에서 직접 비교할 에너지 이동만 묻는다. S1 0건, S2 0건, 자연도 A이며 문제·원인·영향, 에너지 이동 방향, 정답, 출처 쪽, 조작 의미 보존을 확인했다.

## 빌드 지문

| 입력 | SHA-256 |
|---|---|
| quiz.json | `099dbc7453830d5bab92414b6e588231494d928fcd492b59cdab9635af793c90` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `5314b5a5ad9e0acdd32625c4434952ae09aab770c00349c3c4b1ab36ebd0178c` |
| 실행 자산 | `cc56af142095ab047ea5b38331d9c6b2d397cd9a1c35b266983bd573238d1114` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| current QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

## 검사 결과

- `node scripts/build-social-quiz.mjs socialmon-6-2-u3-g17-global-problem-causes` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u3-g17-global-problem-causes` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4193 node scripts/qa-social-quiz.mjs socialmon-6-2-u3-g17-global-problem-causes` — PASS
- 브라우저 QA 생성 시각: `2026-08-12T13:52:25.310Z`
- 브라우저 QA: 4 viewport / 120 state audits / 120 screenshots
- overflow 0 / outside Stage 0 / critical overlap 0 / small target 0 / browser error 0

최신 브라우저 QA 영수증은 `screenshots/qa-report.json`에 있다. 이 작업에서는 커밋하거나 푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `9bbd2e6d1ac89c4566a676015244a27f1343841aa8c14f1b8e07c1666d65dc3d` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `5314b5a5ad9e0acdd32625c4434952ae09aab770c00349c3c4b1ab36ebd0178c` |
| 실행 자산 | `07bf46e1b4eb58fcd18812171218354af2438336f33b2b941a63ca5363e47e08` |
| 엔진 | `f87dfdf6ebe0f009de9ed9f018591d3df1d15fd01d655e79948946421e932fdc` |
| 정책·스킬 | `f4e45655f33a1c7cabf8bdf51458a2c9a424ff29cc14a4a6735d0d49e3c9add3` |
| QA 하네스 | `68955bd66faf6a57a11237c3f350f92aad4ce683cc66d20a2dfe7da0abbf2f2c` |
| 캡처 PNG 집합 | `cecffe0bcf5c963db46ccedbc1d2c95e79b014a6527151143f698f5cb1440262` |

- QA 생성 시각: `2026-08-16T08:50:48.325Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

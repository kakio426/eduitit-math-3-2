# 소셜몬 우리 지역 알리기

## 완료 요약

4학년 2학기 2단원 14~16차시용 `socialmon-quiz-lite-profile-v2`·
`socialmon-quiz-lite-contract-v3` 정식 6문제 단일 HTML을 만들었다. 고르기·나누어 보기·
순서 놓기 세 조작을 사용했고, 출판사 상품 기획서와 단원 생각그물을 읽는
`source-choice` 2개, `choice` 1개, `classify` 1개, `sequence` 1개,
`situation-choice` 1개로 구성했다. OX, 새 문항 type, 필수 드래그, 지도 위치 버튼,
새 공용 런타임은 쓰지 않았다.

표지 문구는 imagegen 생성 RGB 크로마 원본과 투명 PNG·WebP 실행본을 함께 보존했다.
실행본의 네 모서리 alpha는 0이며 아래쪽 투명 여백에 공용 시작 버튼을 따로 놓았다.
실제 1280×800과 1024×768 커버를 눈으로 확인해 제목·목표·시작 버튼의 겹침이 없고,
크로마 사각형이나 녹색 외곽선이 보이지 않는 것을 확인했다.

## 출처·문항 감사

원자료 `/Users/yubyeongju/Downloads/4_2_사회_2_지도서.pdf`의 SHA-256은
`730e9f176bbe73318908a2d007ea729c463ba21fcd91be16295485afce4d6186`이다.
PDF 79~82쪽을 `pdftotext -layout` 결과와 180dpi 렌더 네 장으로 대조하고, q1·q4
crop은 360dpi 렌더에서 다시 확인했다. q1은 PDF 79쪽의 상품 기획서, q4는 PDF
81쪽의 생각그물을 사실 근거로 쓰며, 두 crop 원본 PNG와 실행 WebP·대체 텍스트·
출처를 갖췄다. 각 자료형 문항의 네 선택지는 600×600 원본 PNG와 실행 WebP·대체
텍스트를 갖춘 생성형 장식이고 정답 근거로 쓰지 않는다.

초안 q5의 `자료 확인·고쳐 쓰기`는 PDF 81쪽 생각그물의 정확한 네 단계인
`소개할 자랑거리 정하기 → 소개 방법 정하기 → 소개 자료 만들기 → 소개하기`로
고쳤다. q6도 지정 범위에 직접 나오지 않는 사진 허락·출처 표시 대신 PDF 79쪽
기획서의 `자랑거리·까닭·기획한 상품`을 판단하게 했다. 자세한 쪽수·crop 좌표·자산
경계는 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 기록했다.

## Humanizer 학생 문구 QA

[HUMANIZER_QA.md](HUMANIZER_QA.md)에 따라 4학년이 소리 내어 읽기 쉬운지 확인했다.
화면에 별도 자료가 없는 q3은 `자료와 같은 말/다른 말` 대신 `바른 말/잘못된 말`로
고쳤고, `지역문제`는 `지역 문제`로 띄어 썼다. 어색했던 q3 설명은
`지역마다 자랑거리가 다르고, 자랑거리에 따라 알리는 방법도 달라요.`로 다듬었다.
정답과 출판사 근거의 뜻은 그대로 유지했으며 학생 화면과 접근성 문구에 금지 어휘를
쓰지 않았다.

## 빌드·브라우저 QA

| 입력 | SHA-256 |
| --- | --- |
| `quiz.json` | `0e349a94c4dae4b039956b728786bf07251fd3717ce403fe6f343020ba55c716` |
| `profile.json` | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `e962c2027d3c78162b12a796addf75d07ed6992af33b3d7d79a5e62b5891ed30` |
| 실행 자산 | `f4374f2eac480c7af7a1c0313646abfa14f25ce54ca70dd7450f61e0ad510e31` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 policy | `0360a28ee2085006abe1bb851b8f9b04a3f6aff8e44b62722fabf4a3a5a46126` |
| 현재 QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

- `node scripts/build-social-quiz.mjs socialmon-4-2-u2-g10-share-our-region` — PASS
- `node scripts/check-social-quiz.mjs socialmon-4-2-u2-g10-share-our-region` — PASS
- `node scripts/check-socialmon-source-catalog.mjs socialmon-4-2-u2-g10-share-our-region` — PASS
- `node scripts/check-social-series.mjs 4-2 --require-sources` — PASS
- `node scripts/check-socialmon-interaction-policy.mjs` — PASS
- `node scripts/check-socialmon-pack.mjs` — PASS
- `node scripts/check-stage-ratio.mjs` — PASS
- `node scripts/test-social-quiz-contract.mjs` — PASS
- `node scripts/test-socialmon-delivery-gate.mjs` — PASS
- `node scripts/test-socialmon-hooks.mjs` — PASS
- `node scripts/test-socialmon-series-contract.mjs` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u2-g10-share-our-region` — PASS

최신 브라우저 QA 성공 시각은 `2026-08-12T13:35:02.561Z`(한국 시각
2026-08-12 22:35:02)다. 등록 viewport 4종인 1280×800, 1024×768,
1079×929, 1079×842에서 각각 30상태를 검사해 전체 120상태·120 PNG를 만들었다.
text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0으로
통과했으며, 각 viewport의 최종 상태는 6문제 정답·흔적 6개·천산갑몬 결과였다. 현재
영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이다.

4175 서버에서 차시 Page와 두 자료 실행본도 직접 요청했다. 차시 Page는
`200 text/html`, `source-product-plan-v1.webp`와 `source-region-history-v1.webp`는
각각 `200 image/webp`로 응답했다.

공용 엔진·프로필·스크립트·훅·루트 정책·공용 소셜몬 컴포넌트·캐릭터·카탈로그는
수정하지 않았고, 공유 worktree의 다른 변경도 건드리지 않았다. 최신 QA 이후 현재 policy와
harness 지문을 다시 계산해 영수증과 같은 것을 확인했으며, 이 확인 시점까지 이후 외부 지문
변경은 없었다. 마지막 개별 배달 게이트의 정확한 결과는 작업 완료 보고에 함께 남긴다.

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:30:55.185Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | 0e349a94c4dae4b039956b728786bf07251fd3717ce403fe6f343020ba55c716 |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | e962c2027d3c78162b12a796addf75d07ed6992af33b3d7d79a5e62b5891ed30 |
| 실행 자산 | f4374f2eac480c7af7a1c0313646abfa14f25ce54ca70dd7450f61e0ad510e31 |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `0e349a94c4dae4b039956b728786bf07251fd3717ce403fe6f343020ba55c716` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `e962c2027d3c78162b12a796addf75d07ed6992af33b3d7d79a5e62b5891ed30` |
| 실행 자산 | `f4374f2eac480c7af7a1c0313646abfa14f25ce54ca70dd7450f61e0ad510e31` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a6bb69510ff5258dd2d5b9a3ef74635f1f3369bc32b821d5bfb88500ac034978` |
| QA 하네스 | `4311e2b76bd42939807336a04129bfb518c22856b174241715a2a75168ebbdc5` |

- QA 생성 시각: `2026-08-12T19:48:19.836Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

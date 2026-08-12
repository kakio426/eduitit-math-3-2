# 소셜몬 바닷가 생활 탐험

## 완료 요약

`socialmon-quiz-lite-profile-v2`·`socialmon-quiz-lite-contract-v3` 기준의 정식 6문제 단일 HTML이다. 고르기와 이어 보기 두 조작으로 구성했고, 해안 지형 자료를 보는 `source-choice` 2개와 지형·생활 관계를 잇는 `match` 2개를 포함한다. 지도 위치 버튼은 없다.

## 자료·Humanizer 점검

원자료 `6_2_사회_1_지도서.pdf`의 SHA-256은 `b5a319833c36ac3876f85e00589ce328f934ca3e95b6b170addeeeb89752b9a5`다. 해안 지형과 생활 사진은 출판사 crop만 사실 근거로 사용했다. 생성형 표지와 공용 선택지 그림은 장식이며, 문항별 근거는 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 기록했다.

[HUMANIZER_QA.md](HUMANIZER_QA.md) 기준으로 지시문과 설명을 소리 내어 읽어도 자연스러운 길이로 정리했다. 해안에서 보이는 지형과 생활의 까닭을 한 문장에 하나씩 제시했고, 무관한 그림과 거짓 alt는 없다.

## 빌드·브라우저 QA

| 입력 | SHA-256 |
|---|---|
| quiz.json | `58248ebd895280e7d599c1500f7a191992378391374dad39a84693362589a4ea` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `e5de70ff21ac7fbc4f58d982beb8ab83b662c8110389c38c6ec8996ddde53428` |
| 실행 자산 | `ff3fd68eafaf7f0fd790f09b411b177e4b5f55c0f14bd885df9cb59e8f3b1e8c` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| 현재 QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

- QA 생성 시각: `2026-08-12T13:50:54.244Z`

- `node scripts/build-social-quiz.mjs socialmon-6-2-u1-g03-coast-landform-journey` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u1-g03-coast-landform-journey` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-6-2-u1-g03-coast-landform-journey` — PASS

브라우저 QA는 4 viewport, 120개 상태, 120개 PNG에서 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0으로 통과했다. 현재 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이다.

공용 엔진·프로필·테마팩·브랜드·정책·하네스는 수정하지 않았고 커밋하거나 푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `58248ebd895280e7d599c1500f7a191992378391374dad39a84693362589a4ea` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `e5de70ff21ac7fbc4f58d982beb8ab83b662c8110389c38c6ec8996ddde53428` |
| 실행 자산 | `ff3fd68eafaf7f0fd790f09b411b177e4b5f55c0f14bd885df9cb59e8f3b1e8c` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `6d7e3cf825ff48f182b7e5527f3c092e95ccffea8b740aa0740fd159dbfea4b5` |
| QA 하네스 | `4311e2b76bd42939807336a04129bfb518c22856b174241715a2a75168ebbdc5` |

- QA 생성 시각: `2026-08-12T19:43:50.597Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

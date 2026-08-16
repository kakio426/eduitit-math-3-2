# 소셜몬 세계 지형 한눈에

## 완료 요약

`socialmon-quiz-lite-profile-v2`·`socialmon-quiz-lite-contract-v3` 기준의 정식 6문제 단일 HTML이다. 고르기·이어 보기·나누어 보기 세 조작을 사용했으며, 출판사 세계 지도를 보는 자료형 문항 3개와 관계형 문항을 함께 구성했다. 승인된 두 문항만 `source-choice + map-hotspots`로 표시하고 다른 문항에는 지도 위치 버튼을 쓰지 않았다.

지도 버튼 좌표는 출판사 인쇄 마커 중심인 북부 유럽 9/21, 북부 아프리카 11/54, 동아시아 38/47, 오스트레일리아 43/86을 사용했다. 3000×1240 지도, 네 위치 버튼의 접근성 이름, 안전 여백과 키보드 선택을 브라우저에서 확인했다.

## 자료·Humanizer 점검

원자료 `6_2_사회_1_지도서.pdf`의 SHA-256은 `b5a319833c36ac3876f85e00589ce328f934ca3e95b6b170addeeeb89752b9a5`다. 출판사 지도와 지형 자료만 사실 근거로 사용했고 생성형 이미지는 표지 장식에만 사용했다. 자세한 연결은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 기록했다.

[HUMANIZER_QA.md](HUMANIZER_QA.md) 기준으로 목표·지시문·선택지·설명·결과 문구를 다시 읽었다. 한 문장에는 한 판단만 남기고, 지도에서 누를 위치와 지형 이름을 6학년 학생이 바로 이해할 수 있는 말로 정리했다. 무관한 삽화와 실제 그림과 다른 alt는 없다.

## 빌드·브라우저 QA

| 입력 | SHA-256 |
|---|---|
| quiz.json | `8ed3c05a25eea3a65de41ac0d38d342d48c0615fa92d60fa9575b9062dab78e8` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `e5de70ff21ac7fbc4f58d982beb8ab83b662c8110389c38c6ec8996ddde53428` |
| 실행 자산 | `0e80e1b6e4eb5723e757aeec19be5f62c0bd9bced2c1f40d8448ddbd180f7427` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| 현재 QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

- QA 생성 시각: `2026-08-12T13:48:50.667Z`

- `node scripts/build-social-quiz.mjs socialmon-6-2-u1-g01-world-landform-map` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u1-g01-world-landform-map` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-6-2-u1-g01-world-landform-map` — PASS

브라우저 QA는 4 viewport에서 120개 상태와 120개 PNG를 새로 검사했다. text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이며 지도 문항 감사 8건도 통과했다. 현재 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이다.

공용 엔진·프로필·테마팩·브랜드·정책·하네스는 수정하지 않았고 커밋하거나 푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `5aa1edc3b26a3ceb56b200042c548f6a5fe9ef1e9135f074aaca384c586cc7f8` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `e5de70ff21ac7fbc4f58d982beb8ab83b662c8110389c38c6ec8996ddde53428` |
| 실행 자산 | `79b1984c542f48ea9fc488903f6986038e7f0cf909b0cc8ddb75be359222d8f4` |
| 엔진 | `f87dfdf6ebe0f009de9ed9f018591d3df1d15fd01d655e79948946421e932fdc` |
| 정책·스킬 | `f4e45655f33a1c7cabf8bdf51458a2c9a424ff29cc14a4a6735d0d49e3c9add3` |
| QA 하네스 | `68955bd66faf6a57a11237c3f350f92aad4ce683cc66d20a2dfe7da0abbf2f2c` |
| 캡처 PNG 집합 | `7c7cc985f1d715a8f8fd973a9a1532d0ba04d093a43c7d1322253bf97f09edc1` |

- QA 생성 시각: `2026-08-16T08:42:22.308Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG, 지도 위치 문항 8건
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

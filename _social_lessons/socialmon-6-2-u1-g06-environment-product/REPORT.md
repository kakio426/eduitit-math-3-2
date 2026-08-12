# 소셜몬 자연환경 맞춤 상품

## 완료 요약

`socialmon-quiz-lite-profile-v2`·`socialmon-quiz-lite-contract-v3` 기준의 정식 6문제 단일 HTML이다. 자료·상황을 보고 고르기와 나누어 보기 두 조작만 사용했다. 출판사 자료를 보는 `source-choice` 2개, 실제 생활 조건을 판단하는 `situation-choice` 2개, 관계형 `classify` 2개로 구성했다. 지도 위치 버튼은 없다.

## 자료·Humanizer 점검

원자료 `6_2_사회_1_지도서.pdf`의 SHA-256은 `b5a319833c36ac3876f85e00589ce328f934ca3e95b6b170addeeeb89752b9a5`다. 지역의 자연환경 조사와 생활 물건 구상 자료는 출판사 crop만 사실 근거로 사용했고 생성형 표지는 장식으로만 사용했다. 문항별 근거는 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 기록했다.

[HUMANIZER_QA.md](HUMANIZER_QA.md) 기준으로 물건의 기능을 `잘 미끄러지지 않아요`, `바람은 통하고 벌레는 막아요`처럼 눈에 보이는 말로 설명했다. 제작자 용어와 무관한 삽화·거짓 alt는 없다.

## 빌드·브라우저 QA

| 입력 | SHA-256 |
|---|---|
| quiz.json | `137b0a92dbf30fff2f84ed528c18c161ef53371c8fc01fc8395c153697428875` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `a29725fd4ce7a4aa2869ec58b76bd63b2c98a587c066290ed17e9bfc6a7fa658` |
| 실행 자산 | `a40acd5986fa7f6975ec4352eec9d63e29d92d02a014ad29c1d7b2646a67a0ab` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| 현재 QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

- QA 생성 시각: `2026-08-12T13:52:53.250Z`

- `node scripts/build-social-quiz.mjs socialmon-6-2-u1-g06-environment-product` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u1-g06-environment-product` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-6-2-u1-g06-environment-product` — PASS

브라우저 QA는 4 viewport, 120개 상태, 120개 PNG에서 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0으로 통과했다. 현재 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이다.

공용 엔진·프로필·테마팩·브랜드·정책·하네스는 수정하지 않았고 커밋하거나 푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `137b0a92dbf30fff2f84ed528c18c161ef53371c8fc01fc8395c153697428875` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `a29725fd4ce7a4aa2869ec58b76bd63b2c98a587c066290ed17e9bfc6a7fa658` |
| 실행 자산 | `a40acd5986fa7f6975ec4352eec9d63e29d92d02a014ad29c1d7b2646a67a0ab` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `6d7e3cf825ff48f182b7e5527f3c092e95ccffea8b740aa0740fd159dbfea4b5` |
| QA 하네스 | `4311e2b76bd42939807336a04129bfb518c22856b174241715a2a75168ebbdc5` |

- QA 생성 시각: `2026-08-12T19:46:07.456Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

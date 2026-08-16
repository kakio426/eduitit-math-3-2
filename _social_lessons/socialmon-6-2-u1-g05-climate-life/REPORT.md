# 소셜몬 열대·건조 기후 생활

## 완료 요약

기존 묶음 범위를 1단원 9차시로 좁혀 제목·주제·목표·단원 배지를 모두 `소셜몬 열대·건조 기후 생활`에 맞췄다. `socialmon-quiz-lite-profile-v2`·`socialmon-quiz-lite-contract-v3` 기준의 정확히 6문제이며, 고르기와 이어 보기 두 조작만 쓴다. 출판사 crop을 직접 읽는 `source-choice` 3개와 관계형 `match` 2개를 포함한다.

표지 WebP는 모서리에서 연결된 크로마 배경을 alpha 0으로 제거했고 네 모서리 RGBA가 모두 `(0,0,0,0)`임을 확인했다. 실제 커버 캡처에서도 연두색 사각형과 녹색 외곽선이 보이지 않는다.

## 자료·Humanizer 점검

원자료 `6_2_사회_1_지도서.pdf`의 SHA-256은 `b5a319833c36ac3876f85e00589ce328f934ca3e95b6b170addeeeb89752b9a5`이며 사용 범위는 PDF 65~72쪽(인쇄 80~87쪽), 교과서 34~36쪽이다. 열대 기후 그래프·열대 생활·건조 생활 crop을 사실 근거로 사용했고 생성형 이미지는 표지에만 사용했다. 자세한 기록은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 있다.

[HUMANIZER_QA.md](HUMANIZER_QA.md) 기준으로 `연 강수량`과 `일교차`를 학생 화면에서 `일 년 동안 내리는 비`, `낮과 밤의 기온 차이`로 풀었다. 냉대·한대 범위의 문항과 무관한 삽화·거짓 alt는 제거했다.

## 빌드·브라우저 QA

| 입력 | SHA-256 |
|---|---|
| quiz.json | `ebec99833775095d9eee41a10e62ab0a5a1acf4f7a0f86d1640b5f1c951145b7` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `a29725fd4ce7a4aa2869ec58b76bd63b2c98a587c066290ed17e9bfc6a7fa658` |
| 실행 자산 | `ca2934519944686ca5fbf998f6327aeab405a5f746fa49c42c6ce94a7e97e9d0` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| 현재 QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

- QA 생성 시각: `2026-08-12T13:52:53.856Z`

- `node scripts/build-social-quiz.mjs socialmon-6-2-u1-g05-climate-life` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u1-g05-climate-life` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-6-2-u1-g05-climate-life` — PASS

브라우저 QA는 4 viewport, 120개 상태, 120개 PNG에서 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0으로 통과했다. 현재 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이다.

공용 엔진·프로필·테마팩·브랜드·정책·하네스는 수정하지 않았고 커밋하거나 푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `c3d85cdf4d0ee3d9c74b5dd592a41b136c3c0f14edf0c2be4a2731d4d10af621` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `a29725fd4ce7a4aa2869ec58b76bd63b2c98a587c066290ed17e9bfc6a7fa658` |
| 실행 자산 | `4e936aade9e456d41e642150f52d7d52f03e9f622822b174808169955fb87a2d` |
| 엔진 | `f87dfdf6ebe0f009de9ed9f018591d3df1d15fd01d655e79948946421e932fdc` |
| 정책·스킬 | `f4e45655f33a1c7cabf8bdf51458a2c9a424ff29cc14a4a6735d0d49e3c9add3` |
| QA 하네스 | `68955bd66faf6a57a11237c3f350f92aad4ce683cc66d20a2dfe7da0abbf2f2c` |
| 캡처 PNG 집합 | `5645ae661dcf5c0ec11335d602628506d5e46d6f78faaa01d76f3b4dcaaf10db` |

- QA 생성 시각: `2026-08-16T08:44:03.588Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

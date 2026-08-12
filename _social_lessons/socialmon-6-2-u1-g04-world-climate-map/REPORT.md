# 소셜몬 세계 기후 지도

## 완료 요약

`socialmon-quiz-lite-profile-v2`·`socialmon-quiz-lite-contract-v3` 기준의 정식 6문제 단일 HTML이다. 고르기와 나누어 보기 두 조작을 사용했으며, 출판사 세계 기후 지도를 읽는 자료형 3문항과 관계형 문항을 함께 구성했다. 승인된 두 문항에만 `source-choice + map-hotspots`를 쓰고 다른 U1 기후 생활 게임에는 지도 위치 버튼을 넣지 않았다.

학생 화면 지도는 출판사 두 쪽을 기하학적으로 잘라 지도·범례·위도선만 3000×1240에 배치한 실행본이다. 잘린 캐릭터·말풍선·답 상자는 제거했으며, 지도 내용을 생성하거나 복원하지 않았다. 네 버튼의 안전 여백·좌표·접근성 이름·키보드 선택을 실제 화면에서 확인했다.

## 자료·Humanizer 점검

원자료 `6_2_사회_1_지도서.pdf`의 SHA-256은 `b5a319833c36ac3876f85e00589ce328f934ca3e95b6b170addeeeb89752b9a5`다. 지도와 기후 분포는 출판사 자료만 근거로 사용했고 생성형 표지는 장식으로만 사용했다. 자세한 출처 연결은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 기록했다.

[HUMANIZER_QA.md](HUMANIZER_QA.md) 기준으로 지도 범례와 위도선을 보고 바로 판단할 수 있도록 지시문을 짧게 다듬었다. 지도 버튼의 접근성 이름도 위치와 기후 지역을 구체적으로 설명한다.

## 빌드·브라우저 QA

| 입력 | SHA-256 |
|---|---|
| quiz.json | `300e37492ebe603dd59350578d6bf5d249eb732223ed41c73c72c02be1881da3` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `a29725fd4ce7a4aa2869ec58b76bd63b2c98a587c066290ed17e9bfc6a7fa658` |
| 실행 자산 | `e32eaabfe7a230097c4094812afbfc36521dfa940630e4290b3cf2d6b6f338f0` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| 현재 QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

- QA 생성 시각: `2026-08-12T13:50:55.170Z`

- `node scripts/build-social-quiz.mjs socialmon-6-2-u1-g04-world-climate-map` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u1-g04-world-climate-map` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-6-2-u1-g04-world-climate-map` — PASS

브라우저 QA는 4 viewport에서 120개 상태와 120개 PNG를 검사했다. text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이며 지도 문항 감사 8건도 통과했다. 현재 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이다.

공용 엔진·프로필·테마팩·브랜드·정책·하네스는 수정하지 않았고 커밋하거나 푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `300e37492ebe603dd59350578d6bf5d249eb732223ed41c73c72c02be1881da3` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `a29725fd4ce7a4aa2869ec58b76bd63b2c98a587c066290ed17e9bfc6a7fa658` |
| 실행 자산 | `e32eaabfe7a230097c4094812afbfc36521dfa940630e4290b3cf2d6b6f338f0` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `6d7e3cf825ff48f182b7e5527f3c092e95ccffea8b740aa0740fd159dbfea4b5` |
| QA 하네스 | `c72dfa523dc66c70647889ba23d47d67687e5c4d7578ae9d8d5eff90322174aa` |

- QA 생성 시각: `2026-08-12T20:47:59.887Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG, 지도 위치 문항 8건
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

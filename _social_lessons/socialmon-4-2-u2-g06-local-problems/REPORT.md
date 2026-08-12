# 소셜몬 우리 지역 문제 찾기 - 제작 보고서

## 구현 결과

- 게임: `socialmon-4-2-u2-g06-local-problems`
- 프로필: `socialmon-quiz-lite-profile-v2`
- 계약: `socialmon-quiz-lite-contract-v3`
- 테마팩: `socialmon-4-2-regional-problems-v1`
- 문항: 정확히 6문제
- 자료형: `source-choice` 2문제
- 관계형: `classify` 1문제, `match` 1문제
- 학생 조작: 고르기·나누어 보기·이어 보기 3종
- OX·새 type·필수 드래그·새 공용 런타임: 0건

## 지도서와 자산

- 지도서 PDF 12~19쪽을 텍스트 추출과 PNG 렌더로 직접 대조했다.
- 문항 1은 PDF 12쪽의 교과서 61쪽 동네 그림을 사실 자료로 쓴다.
- 문항 4는 PDF 18쪽의 교과서 65쪽 조사표만 자르고, 최종 선택 문장은 제외했다.
- 두 자료형 문항의 선택지 8장은 GPT Image로 만든 장식이며 정답 근거가 아니다.
- 표지는 정확한 시리즈명·제목·목표를 담은 생성형 투명 래스터를 쓴다.
- 승인된 소셜몬 팩과 공용 배경만 참조한다.

## Humanizer

4학년 학생이 소리 내어 읽는 기준으로 전 문구를 확인했다. S1 0건, S2 0건이며 의미 보존 6항을 통과했다. 자세한 기록은 `HUMANIZER_QA.md`에 있다.

## 검증

### 정적·출처·시리즈 검사

- `node scripts/build-social-quiz.mjs socialmon-4-2-u2-g06-local-problems`: PASS
- `node scripts/check-social-quiz.mjs socialmon-4-2-u2-g06-local-problems`: PASS
- `node scripts/check-socialmon-source-catalog.mjs socialmon-4-2-u2-g06-local-problems`: PASS
- `node scripts/check-social-series.mjs 4-2 --require-sources`: PASS
- `node scripts/check-socialmon-interaction-policy.mjs`: PASS
- `node scripts/test-social-quiz-contract.mjs`: PASS
- `node scripts/check-socialmon-pack.mjs`: PASS

### 브라우저 QA

- 실행 서버: `http://127.0.0.1:4175`
- 명령: `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u2-g06-local-problems`
- 마지막 성공 시각: `2026-08-12T13:01:06.689Z`
- 영수증: `screenshots/qa-report.json`
- 표준: `socialmon-quiz-browser-qa-v3`
- 등록 viewport: `desktop-1280x800`, `tablet-landscape-1024x768`, `feedback-reported-1079x929`, `feedback-reported-1079x842`
- viewport 4개 / 상태 감사 120개 / PNG 캡처 120개
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

### 현재 입력·증거 지문

| 입력 | SHA-256 |
|---|---|
| `quiz.json` | `44f6086aff6ec8a4d85add84b79d0fd7c7ab360f124e4f8a068d62c68aabe636` |
| `profile.json` | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `4052397e9909367d1245802a5b2eac982e1251d81f064dee6b5b3dfefbe55628` |
| 실행 자산 | `85569f3481c9e9e4d2ec84354175c9a5f254326f540aa325a1ecdcbc416099d3` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 정책·스킬 | `0360a28ee2085006abe1bb851b8f9b04a3f6aff8e44b62722fabf4a3a5a46126` |
| 현재 QA 하네스 | `e7991027b8d468068ee85471edc385cc40f2576e97292a478bc625e1f868a7ee` |

첫 성공 시각 `2026-08-12T12:55:57.610Z` 뒤 다른 작업자의 하네스 변경으로 지문이 `70cfc4b359abba7d84b1796686939980802568c66c471751166a0f958b3824d6`에서 현재 값으로 바뀌었다. 바뀐 하네스로 전체 120상태를 한 번 다시 캡처했고, 이후 같은 외부 변경 때문에 무한 재실행하지 않는다. 최종 개별 게이트는 대상 `quiz.json`만 변경 파일로 지정해 실행한다.

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:27:28.068Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | 44f6086aff6ec8a4d85add84b79d0fd7c7ab360f124e4f8a068d62c68aabe636 |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | 4052397e9909367d1245802a5b2eac982e1251d81f064dee6b5b3dfefbe55628 |
| 실행 자산 | 85569f3481c9e9e4d2ec84354175c9a5f254326f540aa325a1ecdcbc416099d3 |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `44f6086aff6ec8a4d85add84b79d0fd7c7ab360f124e4f8a068d62c68aabe636` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `4052397e9909367d1245802a5b2eac982e1251d81f064dee6b5b3dfefbe55628` |
| 실행 자산 | `85569f3481c9e9e4d2ec84354175c9a5f254326f540aa325a1ecdcbc416099d3` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a6bb69510ff5258dd2d5b9a3ef74635f1f3369bc32b821d5bfb88500ac034978` |
| QA 하네스 | `4311e2b76bd42939807336a04129bfb518c22856b174241715a2a75168ebbdc5` |

- QA 생성 시각: `2026-08-12T19:47:35.421Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

# 소셜몬 산·들·바다 비교하기 — 제작·검증 보고서

## 결과

4학년 2학기 사회 3단원 3~5차시를 바탕으로 산지·평야·해안의 특징과 생활을 비교하는 6문항 차시를 완성했다. 지도서 PDF 17·30쪽의 산지·해안 그림을 직접 crop해 사실 자료로 사용했다.

## 제품·문항

- `socialmon-quiz-lite-profile-v2` / `socialmon-quiz-lite-contract-v3`
- 자료 고르기 2, 이어 보기 3, 상황 고르기 1
- 생성형 표지·선택지 그림은 사실 근거가 아닌 장식으로만 사용
- Humanizer 기록: [HUMANIZER_QA.md](./HUMANIZER_QA.md)
- 출처·crop 기록: [SOURCE_LEDGER.md](./SOURCE_LEDGER.md)

## 빌드·브라우저 QA

`build-social-quiz`와 `check-social-quiz`를 통과했다. `2026-08-12T15:03:11.069Z`에 등록 viewport 4종의 전체 흐름 120상태·120 PNG를 검사했다. 텍스트 넘침 0, Stage 밖 0, 핵심 겹침 0, 작은 조작 대상 0, 브라우저 오류 0이다. 영수증은 [screenshots/qa-report.json](./screenshots/qa-report.json)이다.

## 입력 지문

| 입력 | SHA-256 |
| --- | --- |
| `quiz.json` | `21839819accf85c1e7343bf1ac5834e7cbb7150883f47479361b0ef9a5064157` |
| profile | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `da5fcdd6a03b5f64ab84e2597abc34e75e9b9ab44f28f77f1df1d19c6975e4a5` |
| 실행 자산 | `00fa9a51b8501c6676123fc2bde9e11f9de14c2a14340c41fe961da3f074df04` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `0360a28ee2085006abe1bb851b8f9b04a3f6aff8e44b62722fabf4a3a5a46126` |
| 하네스 | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

공용 동결 요청에 따라 `verify-socialmon-delivery`와 `test-socialmon-hooks`는 실행하지 않았다.

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:32:44.514Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | 21839819accf85c1e7343bf1ac5834e7cbb7150883f47479361b0ef9a5064157 |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | da5fcdd6a03b5f64ab84e2597abc34e75e9b9ab44f28f77f1df1d19c6975e4a5 |
| 실행 자산 | 00fa9a51b8501c6676123fc2bde9e11f9de14c2a14340c41fe961da3f074df04 |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `21839819accf85c1e7343bf1ac5834e7cbb7150883f47479361b0ef9a5064157` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `da5fcdd6a03b5f64ab84e2597abc34e75e9b9ab44f28f77f1df1d19c6975e4a5` |
| 실행 자산 | `00fa9a51b8501c6676123fc2bde9e11f9de14c2a14340c41fe961da3f074df04` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a6bb69510ff5258dd2d5b9a3ef74635f1f3369bc32b821d5bfb88500ac034978` |
| QA 하네스 | `c72dfa523dc66c70647889ba23d47d67687e5c4d7578ae9d8d5eff90322174aa` |

- QA 생성 시각: `2026-08-12T20:40:38.780Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

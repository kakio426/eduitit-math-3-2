# 소셜몬 도시 특징 찾기 — 제작·검증 보고서

## 결과

4학년 2학기 사회 3단원 9~11차시를 바탕으로 도시의 인구·산업·교통 특징을 찾는 6문항 차시를 완성했다. 지도서의 도시 사진과 부산광역시 교통 지도를 사실 자료로 사용했다.

## 제품·문항

- `socialmon-quiz-lite-profile-v2` / `socialmon-quiz-lite-contract-v3`
- 자료 고르기 2, 고르기 1, 나누어 보기 1, 이어 보기 2
- Humanizer 기록: [HUMANIZER_QA.md](./HUMANIZER_QA.md)
- 출처·crop 기록: [SOURCE_LEDGER.md](./SOURCE_LEDGER.md)

## 브라우저 회귀와 수정

첫 QA에서 1024×768의 4번 자료 문제 `답 확인` 버튼이 문제 카드 아래에 걸린 1건을 발견했다. 질문·자료 안내·선택지 문장을 학생 말로 줄이고 재빌드한 뒤 전체 120상태를 처음부터 다시 캡처했다.

최종 성공 시각은 `2026-08-12T15:08:37.493Z`다. 등록 viewport 4종, 120상태·120 PNG에서 텍스트 넘침 0, Stage 밖 0, 핵심 겹침 0, 작은 조작 대상 0, 브라우저 오류 0이다. 영수증은 [screenshots/qa-report.json](./screenshots/qa-report.json)이다.

## 입력 지문

| 입력 | SHA-256 |
| --- | --- |
| `quiz.json` | `df7983e875008230502717b9118931a990f7ce057f60126a95098f05319ab149` |
| profile | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `e5c49bdf94bfd95b120a6fbf70bc2b861be7c9d777eee3959218ac9637b3d3f9` |
| 실행 자산 | `d03fab5678650ee990aa333b28b1cbc6e21bbedfe38bd7a9eb8e85efb26b8280` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `0360a28ee2085006abe1bb851b8f9b04a3f6aff8e44b62722fabf4a3a5a46126` |
| 하네스 | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

공용 동결 요청에 따라 `verify-socialmon-delivery`와 `test-socialmon-hooks`는 실행하지 않았다.

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:34:28.880Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | df7983e875008230502717b9118931a990f7ce057f60126a95098f05319ab149 |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | e5c49bdf94bfd95b120a6fbf70bc2b861be7c9d777eee3959218ac9637b3d3f9 |
| 실행 자산 | d03fab5678650ee990aa333b28b1cbc6e21bbedfe38bd7a9eb8e85efb26b8280 |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `2abe09772812183394ba905dc19c1ba56281fa11cee6f9d8f698d0ac621f99ec` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `e5c49bdf94bfd95b120a6fbf70bc2b861be7c9d777eee3959218ac9637b3d3f9` |
| 실행 자산 | `d03fab5678650ee990aa333b28b1cbc6e21bbedfe38bd7a9eb8e85efb26b8280` |
| 엔진 | `f87dfdf6ebe0f009de9ed9f018591d3df1d15fd01d655e79948946421e932fdc` |
| 정책·스킬 | `92100d77a42bc809fffc35f62af85de7e269eb9ca0a984b26cf3118f662d0e9a` |
| QA 하네스 | `68955bd66faf6a57a11237c3f350f92aad4ce683cc66d20a2dfe7da0abbf2f2c` |
| 캡처 PNG 집합 | `09de17b3416fc760235a5470e846102f43e2e789a98ffe3eb47ee3d5d21d59d8` |

- QA 생성 시각: `2026-08-16T08:32:17.099Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

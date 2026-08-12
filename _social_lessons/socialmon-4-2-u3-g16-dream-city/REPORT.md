# 소셜몬 살고 싶은 도시 — 제작·검증 보고서

## 결과

4학년 2학기 사회 3단원 14~16차시를 바탕으로 편리한 생활과 자연을 함께 생각한 도시 해결안을 고르는 6문항 차시를 완성했다. 지도서의 도시 에너지 그림과 해결안 게시판을 사실 자료로 사용했다.

## 제품·문항

- `socialmon-quiz-lite-profile-v2` / `socialmon-quiz-lite-contract-v3`
- 자료 고르기 2, 고르기 1, 나누어 보기 1, 이어 보기 1, 순서 놓기 1
- Humanizer 기록: [HUMANIZER_QA.md](./HUMANIZER_QA.md)
- 출처·crop 기록: [SOURCE_LEDGER.md](./SOURCE_LEDGER.md)

## 빌드·브라우저 QA

`build-social-quiz`와 `check-social-quiz`를 통과했다. `2026-08-12T15:10:40.891Z`에 등록 viewport 4종의 전체 흐름 120상태·120 PNG를 검사했다. 텍스트 넘침 0, Stage 밖 0, 핵심 겹침 0, 작은 조작 대상 0, 브라우저 오류 0이다. 영수증은 [screenshots/qa-report.json](./screenshots/qa-report.json)이다.

## 입력 지문

| 입력 | SHA-256 |
| --- | --- |
| `quiz.json` | `dab8786038c3c06527041aa443ae97521f79cb76be7425ce8285aa86a6f6dab3` |
| profile | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `cbbc5baf762ba999afd1ee928e5ac7d94d4cb43db64b133a16d50fe10719235f` |
| 실행 자산 | `41fc33b6ffc65c437235d43ca34f4b26d1d9c25a05629cb7a77865f567d1ef76` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `0360a28ee2085006abe1bb851b8f9b04a3f6aff8e44b62722fabf4a3a5a46126` |
| 하네스 | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

공용 동결 요청에 따라 `verify-socialmon-delivery`와 `test-socialmon-hooks`는 실행하지 않았다.

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:36:15.089Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | dab8786038c3c06527041aa443ae97521f79cb76be7425ce8285aa86a6f6dab3 |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | cbbc5baf762ba999afd1ee928e5ac7d94d4cb43db64b133a16d50fe10719235f |
| 실행 자산 | 41fc33b6ffc65c437235d43ca34f4b26d1d9c25a05629cb7a77865f567d1ef76 |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

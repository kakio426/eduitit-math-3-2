# 소셜몬 문제 해결 길 잇기 실행 보고서

## 결과

지도서 PDF 23~46쪽을 텍스트와 화면으로 대조해 6문항을 확정하고, profile-v2·contract-v3 단일 HTML로 빌드했다. 주차 자료와 쓰레기 해결 방안 평가표는 지도서에서 자른 사실 자료이며, 두 자료형 문항의 8개 그림과 표지 문구는 생성형 장식·표지 자산으로 분리했다. Humanizer 학생 문구 QA와 등록된 4개 viewport의 최신 브라우저 QA를 통과했다.

## 원고·제품 계약

- 차시: `socialmon-4-2-u2-g07-problem-solving-path`
- 학년·학기·단원: 4학년 2학기 2단원
- 문항: 6개
- 자료 고르기: 2개
- 관계형: `match` 1개, `sequence` 2개
- 학생 조작: 고르기·이어 보기·순서 놓기 3종
- 화면: cover·tutorial·play·result
- 보상: 승인된 discovery pack의 `pangolinmon` 후보를 포함한 trace-reveal

## 근거 자료

`assets/source-parking-data-v1-source.png`와 `assets/source-parking-data-v1.webp`는 PDF 23쪽의 교과서 66쪽 자동차 수 그래프·주차 공간 표를 보존한다. `assets/source-solution-evaluation-table-v1-source.png`와 `assets/source-solution-evaluation-table-v1.webp`는 PDF 32쪽의 교과서 71~72쪽 평가표만 960×660px로 잘라 10·8·7점 합계를 작은 화면에서도 읽을 수 있게 했다. 생성형 선택지 8장은 각각 `*-source.png` 원본과 512px 이상 `*.webp` 실행본이며 모두 `생성형 장식 그림 · 정답 근거 아님`으로 구분했다.

## Humanizer

`HUMANIZER_QA.md`에서 표지 목표, 방법 안내, 문제 지시문, 선택지, 피드백, 결과 문구를 점검했다. 학생 화면에는 `핵심`, `등급`, `적용`, `토큰`, `오브젝트`, `게이트`, `힘` 같은 내부·어른 말을 쓰지 않았다.

## 브라우저 QA

- 실행 서버: `http://127.0.0.1:4175`
- 영수증: `screenshots/qa-report.json`
- 표준: `socialmon-quiz-browser-qa-v3`
- 등록 viewport: desktop-1280x800, tablet-landscape-1024x768, feedback-reported-1079x929, feedback-reported-1079x842
- viewport 4개 / 상태 감사 120개 / PNG 캡처 120개
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

## 현재 입력 지문

| 입력 | SHA-256 |
|---|---|
| quiz.json | `d322dd6a2d5532d53f979246a1c38c367fad156d3c6c1b19d985c2a4665b28ce` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `355253483676b423502a39e68c0182ee61a459dfe8f7af66cd49de4f415c9660` |
| engine | `ab7fdc1e4b14f8fc8725353d48d9cee1a9e1815b9069016455c726b1e66165ce` |
| 현재 정책·스킬 | `8e2c364fd20b6f00a1246721ec25d658d9ea0ed84dd478612a386dd1b688401b` |
| 현재 QA 하네스 | `3dfc1aa4ce9a4f8700c0fc786cbf770ab549b55eb808639d3b59c3496648ac60` |

최종 명령: `node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u2-g07-problem-solving-path`

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:29:12.250Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | d322dd6a2d5532d53f979246a1c38c367fad156d3c6c1b19d985c2a4665b28ce |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | 355253483676b423502a39e68c0182ee61a459dfe8f7af66cd49de4f415c9660 |
| 실행 자산 | 639b993499f6a51f0cdc6c32bd2e1f5fbc7a16ef2148754c66b02cd95c0bd26d |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `8a9c16240e8b176ea768e78cdd26a278c3122e9885ef9a07d08f4309c47e1938` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `355253483676b423502a39e68c0182ee61a459dfe8f7af66cd49de4f415c9660` |
| 실행 자산 | `2eb3da37f0ed62fd78365a6e7449793ae59bc30f1b0c40c7d86e5c9e9cd19ea9` |
| 엔진 | `f87dfdf6ebe0f009de9ed9f018591d3df1d15fd01d655e79948946421e932fdc` |
| 정책·스킬 | `92100d77a42bc809fffc35f62af85de7e269eb9ca0a984b26cf3118f662d0e9a` |
| QA 하네스 | `68955bd66faf6a57a11237c3f350f92aad4ce683cc66d20a2dfe7da0abbf2f2c` |
| 캡처 PNG 집합 | `bb3c9b5143a0e8cbd984b93525c1e845d24ff60cbc7c5129671ce954f290c0a6` |

- QA 생성 시각: `2026-08-16T08:28:56.098Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

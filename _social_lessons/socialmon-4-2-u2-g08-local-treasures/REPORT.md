# 소셜몬 우리 지역 보물 찾기 실행 보고서

## 결과

지도서 PDF 52~55쪽을 텍스트와 렌더 화면으로 직접 대조해 6문항을 확정했다. 생산물 카드와 축제 행진 그림은 출판사 PDF crop이며, 두 자료형 문항의 8개 선택지 그림과 표지 문구는 생성형 장식·표지 자산으로 분리했다. profile-v2·contract-v3 단일 HTML 빌드, Humanizer 학생 문구 QA, 등록 viewport 4종의 브라우저 QA 결과는 아래에 기록한다.

## 원고·제품 계약

- 차시: `socialmon-4-2-u2-g08-local-treasures`
- 학년·학기·단원: 4학년 2학기 2단원
- 문항: 6개
- 자료 고르기: 2개
- 관계형: `classify` 1개, `match` 1개
- 학생 조작: 고르기·나누어 보기·이어 보기 3종
- 화면: cover·tutorial·play·result
- 보상: 승인된 discovery pack의 `kiwimon` 후보를 포함한 trace-reveal

## 근거 자료

`assets/source-local-products-v1-source.png`와 실행 WebP는 PDF 52쪽 생산물 카드에서 담양 죽세공품과 완도 김을 보존한다. `assets/source-festival-parade-v1-source.png`와 실행 WebP는 PDF 53쪽 축제 행진 그림을 보존한다. 생성형 선택지 8장은 각각 `*-source.png` 원본과 자연폭 625px 이상 `*.webp` 실행본이며 모두 `생성형 장식 그림 · 정답 근거 아님`으로 구분했다.

## Humanizer

`HUMANIZER_QA.md`에서 표지 목표, 방법 안내, 문제 지시문, 선택지, 피드백, 결과 문구를 점검했다. 학생 화면에는 내부 제작 용어나 번역투를 쓰지 않았고, 교과 말은 사진·글·모둠 행동과 함께 이해하도록 두었다.

## 브라우저 QA

- 실행 서버: `http://127.0.0.1:4175`
- 영수증: `screenshots/qa-report.json`
- 성공 시각: 2026-08-12 22:32:58 KST (`2026-08-12T13:32:58.683Z`)
- 표준: `socialmon-quiz-browser-qa-v3`
- 등록 viewport: desktop-1280x800, tablet-landscape-1024x768, feedback-reported-1079x929, feedback-reported-1079x842
- viewport 4개 / 상태 감사 120개 / PNG 캡처 120개
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

## 현재 입력 지문

| 입력 | SHA-256 |
|---|---|
| quiz.json | `3b3fd082f49546a59c21eb3a391307129015a03784f761a2e5e7be53076161d4` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `c829e7c1f218ebe384df162ebb2c57bd92a449613589dcce9f47174382f21e86` |
| 실행 자산 | `d598bdc420e3b2d6ea0d0d8200a73c8d1af885e9e847825520ac6cdc5512e5ff` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 정책·스킬 | `0360a28ee2085006abe1bb851b8f9b04a3f6aff8e44b62722fabf4a3a5a46126` |
| 현재 QA 하네스 | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

이 지문들은 위 성공 시각의 `screenshots/qa-report.json`과 같다.

최종 명령: `SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-4-2-u2-g08-local-treasures/quiz.json"]' node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u2-g08-local-treasures`

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:29:11.820Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | 3b3fd082f49546a59c21eb3a391307129015a03784f761a2e5e7be53076161d4 |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | c829e7c1f218ebe384df162ebb2c57bd92a449613589dcce9f47174382f21e86 |
| 실행 자산 | d598bdc420e3b2d6ea0d0d8200a73c8d1af885e9e847825520ac6cdc5512e5ff |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

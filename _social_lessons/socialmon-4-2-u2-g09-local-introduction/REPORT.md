# 소셜몬 지역 알림 자료 만들기 실행 보고서

## 결과

지도서 PDF 57~72쪽을 `pdftotext` 결과와 16장 렌더 이미지로 대조해 6문항을 확정하고, profile-v2·contract-v3 단일 HTML로 빌드했다. 보령 누리집과 통영 소식지는 지도서에서 자른 사실 자료이며, 두 자료형 문항의 선택지 그림 8장과 표지 문구는 생성형 장식·표지 자산으로 분리했다. Humanizer 학생 문구 QA와 등록된 4개 viewport의 최신 브라우저 QA를 통과했다.

## 원고·제품 계약

- 차시: `socialmon-4-2-u2-g09-local-introduction`
- 학년·학기·단원: 4학년 2학기 2단원 10~13차시
- 문항: 6개
- 자료 고르기: 2개
- 관계형: `match` 2개, `sequence` 1개
- 학생 조작: 고르기·이어 보기·순서 놓기 3종
- 화면: cover·tutorial·play·result
- 보상: 기존 승인 `cranemon`·`kiwimon`·`pangolinmon` 후보와 trace-reveal

## 근거 자료

`assets/source-boryeong-mud-v1-source.png`와 실행 WebP는 PDF 57쪽의 교과서 84쪽 보령 누리집 자료를 보존한다. `assets/source-tongyeong-history-v1-source.png`와 실행 WebP는 PDF 58쪽의 교과서 85쪽 통영 역사 여행 소식지를 보존한다. 생성형 선택지 8장은 각각 `*-source.png` 원본과 자연폭 1536px `*.webp` 실행본이며 모두 `생성형 장식 그림 · 정답 근거 아님`으로 구분했다.

## Humanizer

`HUMANIZER_QA.md`에서 표지 목표, 방법 안내, 문제 지시문, 선택지, 피드백, 결과 문구를 점검했다. 태블릿에서 첫 질문이 두 줄로 길어져 `자료를 보고 지역을 알리려고 한 일을 골라 볼까요?`로 뜻을 유지하며 줄였다. 학생 화면에는 `핵심`, `등급`, `적용`, `토큰`, `오브젝트`, `게이트`, `힘` 같은 내부·어른 말을 쓰지 않았다.

## 브라우저 QA

- 실행 서버: `http://127.0.0.1:4175`
- 마지막 성공 시각: `2026-08-12T13:12:59.376Z` (`2026-08-12 22:12:59 KST`)
- 영수증: `screenshots/qa-report.json`
- 표준: `socialmon-quiz-browser-qa-v3`
- 등록 viewport: desktop-1280x800, tablet-landscape-1024x768, feedback-reported-1079x929, feedback-reported-1079x842
- viewport 4개 / 상태 감사 120개 / PNG 캡처 120개
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0
- 마지막 성공 뒤 확인 시점까지 공용 엔진·정책·하네스의 외부 지문 변경 없음

## 현재 입력 지문

| 입력 | SHA-256 |
|---|---|
| quiz.json | `1fa1a4ec9978ceab1c98eff90b1c4b4aab17d2a3cee91e914d7dd2370e9ab308` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `5b41c6b6a402dccf95928d9fb516cf98564a2ce704bf61005baf9b8d619a81b1` |
| lesson assets | `03c0df51f368847663803a53f814094c8188652a1eb93cfb93d757f1848997a7` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 정책·스킬 | `0360a28ee2085006abe1bb851b8f9b04a3f6aff8e44b62722fabf4a3a5a46126` |
| 현재 QA 하네스 | `62c5d0d6f4c2feea2df54c25fadb670d1933520b17819642d2b410c2997043db` |

최종 개별 게이트 명령은 `SOCIALMON_GATE_CHANGED_FILES_JSON`에 대상 `quiz.json` 한 경로만 넣어 실행한다.

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:30:56.182Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | 1fa1a4ec9978ceab1c98eff90b1c4b4aab17d2a3cee91e914d7dd2370e9ab308 |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | 5b41c6b6a402dccf95928d9fb516cf98564a2ce704bf61005baf9b8d619a81b1 |
| 실행 자산 | 03c0df51f368847663803a53f814094c8188652a1eb93cfb93d757f1848997a7 |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `55c22754dabaf878fe4b4f538e1de2b3e53a84661a1755cbcba8e06798c539f5` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `5b41c6b6a402dccf95928d9fb516cf98564a2ce704bf61005baf9b8d619a81b1` |
| 실행 자산 | `03c0df51f368847663803a53f814094c8188652a1eb93cfb93d757f1848997a7` |
| 엔진 | `f87dfdf6ebe0f009de9ed9f018591d3df1d15fd01d655e79948946421e932fdc` |
| 정책·스킬 | `92100d77a42bc809fffc35f62af85de7e269eb9ca0a984b26cf3118f662d0e9a` |
| QA 하네스 | `68955bd66faf6a57a11237c3f350f92aad4ce683cc66d20a2dfe7da0abbf2f2c` |
| 캡처 PNG 집합 | `d51b638edd61db964e8ededaad410747bdda69fcf79ca6484830032d3773beba` |

- QA 생성 시각: `2026-08-16T08:30:35.592Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

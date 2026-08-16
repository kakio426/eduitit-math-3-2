# 소셜몬 우리 지역 자치 찾기 · 제작·검증 보고서

검증일: 2026-08-12
대상: `socialmon-4-2-u1-g04-local-autonomy`
실행본: `_social_lessons/socialmon-4-2-u1-g04-local-autonomy/index.html`

## 결과

4학년 2학기 1단원 11~13차시를 바탕으로 주민 자치 사례, 조사 방법, 협력 역할,
참여 행동을 살피는 6문제 실행본을 제작했다. 제품은
`socialmon-quiz-lite-profile-v2`·`socialmon-quiz-lite-contract-v3`이며, 자료 고르기
2문항과 이어 보기 3문항, 상황 고르기 1문항으로 구성했다.

## 제품 계약

- 화면: `cover → tutorial → play → result`
- 문항: 6개
- 학생 조작: 고르기·이어 보기 2종
- 자료 문항: `source-choice` 2개, 출판사 사실 crop·대체 텍스트·출처·네 장식 선택지 포함
- 관계형: `match` 3개, 문항마다 3쌍
- 보상: `socialmon-trace-reveal-v1` — 모든 답 뒤 흔적 1개, 2개 뒤 그림자,
  4개 뒤 특징, 마지막 소셜몬 한 종과 맞힌 문제 수 공개
- 새 type·별도 OX·필수 드래그·새 공용 런타임 없음

## 원자료 대조

`/Users/yubyeongju/Downloads/4_2_사회_1_지도서.pdf`의 68~84쪽을
`pdftotext -layout`과 PNG 렌더로 모두 직접 대조했다. q1·q3의 사실 이미지는 PDF
74쪽을 300dpi로 렌더한 뒤 깨끗한 상가 만들기 캠페인과 한쪽 주차제 사례를 각각 자른
원본 PNG와 실행 WebP다. 생성형 표지 문구와 두 문항의 선택지 8장은 사실 근거가 아닌
표지·장식 자산으로 분리했다. 상세 쪽수·파일·SHA-256은
[SOURCE_LEDGER.md](./SOURCE_LEDGER.md)에 기록했다.

## 자산 눈 확인

- 생성형 표지 문구의 `소셜몬 발견 퀴즈`, `소셜몬 우리 지역 자치 찾기`, 목표 문구의
  철자와 투명 알파를 확인했다.
- q1·q3의 출판사 crop에서 사진·펼침막·표지판과 문항 설명이 맞는지 확인했다.
- 선택지 시트 2장과 분리한 PNG·WebP 8장을 눈으로 확인했다. 각 장면은 선택지 뜻과
  구분되며, 실행 자산의 자연폭은 모두 768px다.
- 기존 승인 공용 배경과 팡골린몬·미어캣몬·키위몬 결과 후보만 참조한다.

## Humanizer 학생 문구 감사

표지 목표, 방법 안내, 여섯 문제의 질문·지시문·자료 글·선택지·설명, 피드백, 흔적,
결과와 접근성 문구를 4학년이 소리 내어 읽는 기준으로 확인했다. 어른 말과 제작자 말을
생활 속 행동으로 바꿨고, 의미 보존 검토는 [HUMANIZER_QA.md](./HUMANIZER_QA.md)에
기록했다.

## 브라우저 QA

실행 주소 `http://127.0.0.1:4174/_social_lessons/socialmon-4-2-u1-g04-local-autonomy/`
에서 현재 실행본을 열어 등록 viewport 4종의 전체 흐름을 검사했다. 최신 영수증은
`socialmon-quiz-browser-qa-v3`이며 생성 시각은 `2026-08-12T13:41:01.224Z`다.

| viewport | 상태 audit | PNG |
| --- | ---: | ---: |
| `desktop-1280x800` | 30 | 30 |
| `tablet-landscape-1024x768` | 30 | 30 |
| `feedback-reported-1079x929` | 30 | 30 |
| `feedback-reported-1079x842` | 30 | 30 |
| 합계 | **120** | **120** |

`screenshots/qa-report.json`은 `passed: true`이며 텍스트 넘침 0, Stage 밖 요소 0,
핵심 겹침 0, 작은 조작 대상 0, 브라우저 오류 0이다. 흔적 0~6, 설정, 정답·오답
피드백, q1·q3 자료 문항, q2·q4·q5 이어 보기, q6 상황 고르기, 승인 소셜몬 결과를
각 viewport에서 확인했다.

두 자료 문항은 발견 패널 폭 24.5%, 학습 영역과의 간격 1.5625%, 자료 이미지 폭 약
22%, 자료 제목 24px 이상, 본문 20px 이상, 선택지 높이 94px·글자 21px 이상,
답 확인 버튼 150×52px 이상을 지켰다. 선택지 이미지 8장은 모두 자연폭 768px로
정상 로드됐고, 출처는 자료 카드 밖 오른쪽 아래에 한 번만 표시됐다.

대표 캡처는 [표지](./screenshots/desktop-1280x800-cover.png),
[방법](./screenshots/desktop-1280x800-tutorial.png),
[q1 자료](./screenshots/desktop-1280x800-q1-source-choice-ready.png),
[q3 자료](./screenshots/desktop-1280x800-q3-source-choice-ready.png),
[q5 이어 보기](./screenshots/desktop-1280x800-q5-match-ready.png),
[q6 상황](./screenshots/desktop-1280x800-q6-situation-choice-ready.png),
[흔적 6](./screenshots/desktop-1280x800-discovery-trace-6.png),
[결과](./screenshots/desktop-1280x800-result-pangolinmon.png)에서 확인할 수 있다.

## 현재 입력·증거 지문

| 입력 | SHA-256 |
| --- | --- |
| `quiz.json` | `ef727182ecdc80c274c13db54e6ed99f21e2bdb93e4f446ed5d11f89f573714f` |
| `profile.json` | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| `theme pack` | `21620332e94349bcdb5c72bbd386c3e3b5995f28bca42360634e82fd1fb69ffe` |
| 실행 자산 | `3afed61a9b7918d0a7c7007b409b0c11a5932c2ee8d6b793e07ee71e35a6e577` |
| 공용 engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 정책·스킬 | `0360a28ee2085006abe1bb851b8f9b04a3f6aff8e44b62722fabf4a3a5a46126` |
| 현재 QA 하네스 | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

QA 영수증에는 실제 실행본이 참조하는 PNG·WebP와 현재 정책·하네스 지문이 함께
기록되어 있다.

기존 영수증의 하네스 지문이 현재 검사 코드와 달라진 것을 확인해 13:41:01에 전체
120상태를 다시 캡처했다. 위 표와 영수증은 현재 하네스 지문
`509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300`을 기준으로 한다.

## 최종 게이트

다음 명령에서 변경 경로를 이 차시 `quiz.json` 하나로 고정해 개별 gate를 실행한다.

```bash
SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-4-2-u1-g04-local-autonomy/quiz.json"]' node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u1-g04-local-autonomy
```

최종 실행 결과:

```text
SOCIALMON_DELIVERY_GATE: PASS (1 series, 1 lessons, 1 changed paths)
```

게이트는 스킬 링크, 전체 출처 카탈로그, 4학년 상호작용 정책, 이 차시 출처 매핑,
4-2 series, contract fixture, 소셜몬 pack, 16:10 Stage, 현재 빌드·정적 계약,
현재 브라우저 증거와 REPORT 지문을 모두 PASS로 확인했다.

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:25:44.132Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | ef727182ecdc80c274c13db54e6ed99f21e2bdb93e4f446ed5d11f89f573714f |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | 21620332e94349bcdb5c72bbd386c3e3b5995f28bca42360634e82fd1fb69ffe |
| 실행 자산 | 3afed61a9b7918d0a7c7007b409b0c11a5932c2ee8d6b793e07ee71e35a6e577 |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `2bbf427262f22dde2fe7b03f297077d9f10d430b5c3b9c20a5f693be3f3239fa` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `21620332e94349bcdb5c72bbd386c3e3b5995f28bca42360634e82fd1fb69ffe` |
| 실행 자산 | `3afed61a9b7918d0a7c7007b409b0c11a5932c2ee8d6b793e07ee71e35a6e577` |
| 엔진 | `f87dfdf6ebe0f009de9ed9f018591d3df1d15fd01d655e79948946421e932fdc` |
| 정책·스킬 | `92100d77a42bc809fffc35f62af85de7e269eb9ca0a984b26cf3118f662d0e9a` |
| QA 하네스 | `68955bd66faf6a57a11237c3f350f92aad4ce683cc66d20a2dfe7da0abbf2f2c` |
| 캡처 PNG 집합 | `8fd12a0bb6830f5d6436b23536019b825cf97351d27f2833c21c74fd848a4b73` |

- QA 생성 시각: `2026-08-16T08:27:44.817Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

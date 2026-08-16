# 소셜몬 민주 참여 약속 검증 보고서

검증일: 2026-08-12
대상: `socialmon-4-2-u1-g05-democratic-participation`
실행본: `_social_lessons/socialmon-4-2-u1-g05-democratic-participation/index.html`

## 결과

`socialmon-quiz-lite-contract-v3`·`socialmon-quiz-lite-profile-v2`로 정식 6문제를
구성했다. 화면은 `cover → tutorial → play → result` 네 단계이며, 학생 조작은
`choice`·`classify`·`match` 세 종류다. OX·새 문항 type·드래그 필수 조작·새 공용
런타임은 사용하지 않았다.

현재 공용 엔진으로 단일 `index.html`을 빌드했고 정적 계약·출처 카탈로그·4-2 시리즈
원본 SHA·상호작용 정책·소셜몬 pack·Stage 비율 검사를 통과했다. 공용 엔진, 프로필,
하네스, 루트 정책, 공용 캐릭터와 카탈로그는 수정하지 않았다.

## 지도서 원문과 문항 근거

`/Users/yubyeongju/Downloads/4_2_사회_1_지도서.pdf`의 PDF 85~88쪽을
`pdftotext -layout`와 150 dpi 렌더 이미지로 직접 대조했다. 파일 SHA-256은
`416f72fcc3496d4ceea0403cf3a28761c508153855cd4c0c5ff7faa8d244e28b`이며,
PDF 85/86/87/88쪽은 인쇄 100/101/102/103쪽과 대응한다.

| 문항 | 틀 | 학습 근거 |
| --- | --- | --- |
| q1 | `source-choice` | 주민 참여 포스터 세 장, PDF 85쪽·인쇄 100쪽 |
| q2 | `choice` | 주민 자치와 주민 참여의 뜻, PDF 86쪽·인쇄 101쪽 |
| q3 | `classify` | 대화·경청·타협하는 태도, PDF 87쪽·인쇄 102쪽 |
| q4 | `source-choice` | 어린이 공간 만들기 제안서, PDF 85쪽·인쇄 100쪽 |
| q5 | `match` | 학생 자치회·학교 구성원 회의·주민 자치회, PDF 87쪽·인쇄 102쪽 |
| q6 | `situation-choice` | 다른 의견을 듣고 참여하는 태도, PDF 88쪽·인쇄 103쪽 |

q1과 q4는 지도서 사실 crop의 source PNG와 실행 WebP, 대체 텍스트, 화면 출처를
갖춘다. q4는 첫 눈 확인에서 표 전체의 글이 작아 활동 이름과 제안한 까닭 두 행을 더
가까이 자른 뒤 다시 빌드하고 120상태 QA를 새로 수행했다. 두 자료형 문항의 선택지
8장은 모두 600×600 실행 WebP이며, 뜻을 돕는 생성형 장식일 뿐 정답 근거가 아니다.
자세한 대응은 [SOURCE_LEDGER.md](./SOURCE_LEDGER.md)에 기록했다.

## 생성형 자산 눈 확인

표지 문구의 `소셜몬 발견 퀴즈`, `소셜몬 민주 참여 약속`,
`다른 의견을 듣고 함께 참여하는 행동을 찾아봐요.` 철자와 투명 배경을 확인했다.
q1·q4 선택지 8장의 생성 원본 PNG와 실행 WebP도 모두 확인했다. 주민이 포스터를 함께
만드는 모습, 한 사람만 지시하는 모습, 지역 안내판을 지나치는 모습, 교실 활동,
어린이 공간, 안내문 게시판, 학교 의견 상자, 넓은 길 장면이 서로 구분되고 깨진 글자나
로드 실패가 없다.

## 학생 문구 Humanizer 감사

학생에게 보이는 목표·질문·안내·선택지·자료 글·설명·결과 문구와 대체 텍스트를
Humanizer 기준으로 검토했다. 최종 판정은 A이며 S1·S2·S3는 모두 0건이다. 교과
낱말은 사례와 함께 유지하고 제작자 중심 말, 번역투, 불필요한 쉼표와 반복 결말은 쓰지
않았다. 자세한 의미 보존 결과는 [HUMANIZER_QA.md](./HUMANIZER_QA.md)에 있다.

## 브라우저 QA

4174 서버에서 다음 네 viewport의 전체 흐름을 검사했다.

`SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174`

| viewport | 상태 audit | 캡처 |
| --- | ---: | ---: |
| `desktop-1280x800` | 30 | 30 |
| `tablet-landscape-1024x768` | 30 | 30 |
| `feedback-reported-1079x929` | 30 | 30 |
| `feedback-reported-1079x842` | 30 | 30 |
| 합계 | **120** | **120** |

최신 [screenshots/qa-report.json](./screenshots/qa-report.json)의 생성 시각은
`2026-08-12T13:42:51.533Z`이며 `passed: true`다. text overflow 0, Stage 밖 요소 0,
핵심 겹침 0, 작은 조작 대상 0, 브라우저 오류 0을 확인했다.

자료형 실측은 모든 등록 viewport에서 왼쪽 발견 패널 폭 약 24.5%, 학습 영역 간격
1.5625%, 자료 이미지 폭 약 22%, 자료 제목 24px 이상, 본문 20px 이상, 선택지 높이
94px 이상·글자 21px 이상, 답 확인 버튼 150×52px 이상을 만족했다. q1/q4 자료 이미지
자연 폭은 1400px/900px이고 선택지 이미지 자연 폭은 모두 600px이다.

대표 캡처는 [표지](./screenshots/desktop-1280x800-cover.png),
[방법](./screenshots/desktop-1280x800-tutorial.png),
[q1 주민 참여 포스터](./screenshots/desktop-1280x800-q1-source-choice-ready.png),
[q3 나누어 보기](./screenshots/desktop-1280x800-q3-classify-ready.png),
[q4 어린이 공간 제안서](./screenshots/desktop-1280x800-q4-source-choice-ready.png),
[q5 이어 보기](./screenshots/desktop-1280x800-q5-match-ready.png),
[q6 상황](./screenshots/desktop-1280x800-q6-situation-choice-ready.png),
[결과](./screenshots/desktop-1280x800-result-pangolinmon.png),
[태블릿 q4](./screenshots/tablet-landscape-1024x768-q4-source-choice-ready.png)에서 확인할 수 있다.

## 현재 빌드와 QA 지문

| 항목 | SHA-256 |
| --- | --- |
| `quiz.json` | `a93a98b887e6f58a136fced1ab898cea5f067ad4f52f8f89da4c13876a62b89c` |
| `profile.json` | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 활성 theme pack | `99e7385b87c8e155663ba96ab47740e1d32217a521a50017aba7cbd6d60c0f45` |
| 차시 실행 자산 | `bb8b097a702e6f082fa70b0190ad0a77d3307abe5e30e3773daa6a51dd15daae` |
| 공용 engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 소셜몬 정책 | `0360a28ee2085006abe1bb851b8f9b04a3f6aff8e44b62722fabf4a3a5a46126` |
| 브라우저 QA 하네스 | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

## 검사 결과

- `build-social-quiz`: PASS, 현재 자산 지문을 담은 단일 실행본 생성
- `check-social-quiz`: PASS, contract-v3·6문제·tap interaction 3종
- `check-socialmon-source-catalog`: PASS, 대상 차시 1개
- `check-social-series 4-2 --require-sources`: PASS, 16게임·48차시 근거 원본 SHA 확인
- `check-socialmon-interaction-policy`: PASS
- `test-social-quiz-contract`: PASS
- `check-socialmon-pack`: PASS
- `check-stage-ratio`: PASS
- `qa-social-quiz`: PASS, 4 viewport·120상태·120캡처

## 최종 게이트 상태

`2026-08-12T13:42:51.533Z`(`2026-08-12 22:42:51 KST`)에 현재 실행 입력과
하네스 지문 `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300`로
브라우저 QA 120상태를 모두 통과했다. 대상 `quiz.json` 하나만 changed path로 지정한
개별 delivery gate를 마지막 명령으로 실행했으며, skill discovery, 출처 카탈로그,
학년 상호작용 정책, 4-2 시리즈, 계약 fixture, 소셜몬 pack, Stage, 대상 build와 static
contract는 모두 PASS했다. 현재 브라우저 증거와 `REPORT.md` 지문까지 확인한 최종 결과는
`SOCIALMON_DELIVERY_GATE: PASS`다.

## 확인 명령

```text
node scripts/build-social-quiz.mjs socialmon-4-2-u1-g05-democratic-participation
node scripts/check-social-quiz.mjs socialmon-4-2-u1-g05-democratic-participation
node scripts/check-socialmon-source-catalog.mjs socialmon-4-2-u1-g05-democratic-participation
node scripts/check-social-series.mjs 4-2 --require-sources
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-4-2-u1-g05-democratic-participation
SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-4-2-u1-g05-democratic-participation/quiz.json"]' node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u1-g05-democratic-participation
```

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:27:27.970Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | 4be5537f109dc76503a08c7067ae6d078b222923ecd61cd6998a7b3c54e02c6c |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | 21620332e94349bcdb5c72bbd386c3e3b5995f28bca42360634e82fd1fb69ffe |
| 실행 자산 | bb8b097a702e6f082fa70b0190ad0a77d3307abe5e30e3773daa6a51dd15daae |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `ff0cfbcf5abf826beea7cff8d779cd00c181ad509bedcc38842c0f1062209ab5` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `21620332e94349bcdb5c72bbd386c3e3b5995f28bca42360634e82fd1fb69ffe` |
| 실행 자산 | `bb8b097a702e6f082fa70b0190ad0a77d3307abe5e30e3773daa6a51dd15daae` |
| 엔진 | `f87dfdf6ebe0f009de9ed9f018591d3df1d15fd01d655e79948946421e932fdc` |
| 정책·스킬 | `92100d77a42bc809fffc35f62af85de7e269eb9ca0a984b26cf3118f662d0e9a` |
| QA 하네스 | `68955bd66faf6a57a11237c3f350f92aad4ce683cc66d20a2dfe7da0abbf2f2c` |
| 캡처 PNG 집합 | `df4e0bcb56c22c6dc618a1da53c81c126729d6390b282e1b58e88f584f5ff59b` |

- QA 생성 시각: `2026-08-16T08:28:53.049Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

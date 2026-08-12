# 소셜몬 학교 문제 함께 풀기 검증 보고서

검증일: 2026-08-12
대상: `socialmon-4-2-u1-g02-school-democracy`
실행본: `_social_lessons/socialmon-4-2-u1-g02-school-democracy/index.html`

## 결과

`socialmon-quiz-lite-profile-v2`·`socialmon-quiz-lite-contract-v3`으로 정식 6문제를 만들었다.
화면은 `cover → tutorial → play → result` 네 개이고, 학생 조작은 고르기와 순서 놓기 두
종류다. `source-choice`는 q1·q4 두 문항이며, 두 개의 `sequence`가 관계형 문항을 맡는다.
OX·필수 드래그·새 문항 type·새 공용 런타임은 사용하지 않았다.

현재 공용 엔진으로 단일 `index.html`을 빌드했다. 정적 계약, 출처 카탈로그, 4-2 시리즈,
학년 조작 정책, 소셜몬 팩, 16:10 Stage 검사를 통과했고, 4174 서버에서 등록 viewport 4종의
전체 브라우저 QA를 새로 수행했다.

## 현재 빌드와 QA 지문

`screenshots/qa-report.json`은 `socialmon-quiz-browser-qa-v3`이며 생성 시각은
`2026-08-12T13:34:02.105Z`다.

| 항목 | SHA-256 |
| --- | --- |
| `quiz.json` | `53f63793985c2c705513056a332db200b4841e9e39938adf4472c57f6b46add0` |
| `profile.json` | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `5e44c5df6b0dc19f7075d3a2419c99544ab7ee06c736f51fc73c7d16f0f1ae27` |
| 차시 실행 자산 | `7fa5c88b8611d4bddbee519da7451fd8932b1ed7cdcd743d1267fc8b0a7ab82f` |
| 공용 engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책 | `0360a28ee2085006abe1bb851b8f9b04a3f6aff8e44b62722fabf4a3a5a46126` |
| 브라우저 QA 하네스 | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

첫 브라우저 QA는 `2026-08-12T12:58:48.940Z`에 통과했지만, 최종 게이트 직전 다른 작업자의
소유 범위에서 QA 하네스가 바뀌어 지문이
`4ff1a755dfa0890c7a983e0eed7109ec3df6e698e90242a5cb0a286dc15052ad`에서
`e7991027b8d468068ee85471edc385cc40f2576e97292a478bc625e1f868a7ee`로 달라졌다. 예전
manifest만 고치지 않고 네 viewport의 120상태를 모두 다시 캡처했다. 새 하네스 기준 마지막
성공 시각은 `2026-08-12T13:34:02.105Z`다.

## PDF 직접 대조

기준 PDF `/Users/yubyeongju/Downloads/4_2_사회_1_지도서.pdf`의 SHA-256은
`416f72fcc3496d4ceea0403cf3a28761c508153855cd4c0c5ff7faa8d244e28b`로 출처
카탈로그와 같다. PDF 26~44쪽을 `pdftotext -layout`로 뽑고 150dpi PNG로 렌더해 19쪽을
한 장씩 확인했다.

| 문항 | 틀 | 출판사 근거 |
| --- | --- | --- |
| q1 | `source-choice` | 학생 참여 예산제와 우산 빗물 제거기, PDF 28쪽·인쇄 43쪽·교과서 21쪽 |
| q2 | `choice` | 학교 구성원이 함께 참여하는 까닭, PDF 27쪽·인쇄 42쪽·교과서 20쪽 |
| q3 | `sequence` | 학교 문제 해결 과정, PDF 39쪽·인쇄 54쪽 |
| q4 | `source-choice` | 오래된 놀이 기구와 움푹 파인 모래밭, PDF 33쪽·인쇄 48쪽·교과서 22쪽 |
| q5 | `sequence` | 방법 결정·실천·결과 확인, PDF 35쪽·인쇄 50쪽·교과서 25쪽 |
| q6 | `situation-choice` | 평등한 자리에서 함께 만드는 민주주의, PDF 43쪽·인쇄 58쪽·교과서 27쪽 |

초안 q4의 `돌과 유리 조각`, `드러난 못`은 PDF 33쪽에서 확인되지 않았다. 보이는 그림과
말풍선에 맞춰 `놀이 기구가 낡고 모래밭이 움푹 파였어요.`로 고쳤다. 자세한 대조와 자산
매핑은 [SOURCE_LEDGER.md](./SOURCE_LEDGER.md)에 기록했다.

## 자료·생성 자산

q1의 `source-student-budget-v1-source.png/.webp`는 PDF 28쪽 기사와 사진을 400dpi로
자른 `1500×1100` 출판사 자료다. q4의 `source-playground-safety-v1-source.png/.webp`는
PDF 33쪽 교과서 장면과 네 학생의 말을 자른 `1693×2112` 출판사 자료다. 두 자료에는
대체 텍스트와 화면 오른쪽 아래 출처가 한 번씩 표시된다.

q1·q4 선택지 8개는 각각 별도 imagegen 호출로 만든 `*-source.png`와 자연폭 `1254px`
실행 WebP를 갖춘다. 여덟 장을 눈으로 확인했고 우산 빗물 제거기, 새 놀이터, 급식 메뉴,
학교 이름판, 낡은 놀이터, 새 놀이터, 빈 운동장, 책 읽는 의자가 서로 구분된다. 모두
선택지 뜻을 돕는 장식이며 `생성형 장식 그림 · 사실 근거 아님`으로 분리했다.

표지 문구는 `cover-copy-v1-source.png`, 투명 `cover-copy-v1-generated.png/.webp` 한
덩어리다. 실제 표지에서 `소셜몬 발견 퀴즈`, `소셜몬 학교 문제 함께 풀기`, 목표 문구의
철자와 투명 가장자리를 눈으로 확인했다. 표지·방법·문제·결과 배경, 보라 구름, 결과
소셜몬은 공용 profile과 승인된 `discovery-pack-v1` 자산만 참조한다.

## 브라우저 QA

실행 주소는 다음과 같다.

`http://127.0.0.1:4174/_social_lessons/socialmon-4-2-u1-g02-school-democracy/`

| viewport | 상태 audit | 캡처 |
| --- | ---: | ---: |
| `desktop-1280x800` | 30 | 30 |
| `tablet-landscape-1024x768` | 30 | 30 |
| `feedback-reported-1079x929` | 30 | 30 |
| `feedback-reported-1079x842` | 30 | 30 |
| 합계 | **120** | **120** |

`qa-report.json`은 `passed: true`다. 글자 넘침 0, Stage 밖 요소 0, 핵심 요소 겹침 0,
작은 조작 대상 0, 브라우저 오류 0을 확인했다. 왼쪽 발견 패널은 Stage 폭 24.5%이고 학습
영역과의 간격은 최소 1.5625%다. source-choice의 자료 이미지 폭, 픽셀 밀도, 자료 제목
24px 이상, 본문 20px 이상, 선택지 높이 94px 이상, 선택지 글자 21px 이상, 자연폭
512px 이상, 답 확인 150×52px 이상을 네 viewport에서 검사했다.

대표 화면은 [표지](./screenshots/desktop-1280x800-cover.png),
[방법](./screenshots/desktop-1280x800-tutorial.png),
[q1 자료](./screenshots/desktop-1280x800-q1-source-choice-ready.png),
[q3 순서](./screenshots/desktop-1280x800-q3-sequence-ready.png),
[q4 자료](./screenshots/desktop-1280x800-q4-source-choice-ready.png),
[태블릿 q1](./screenshots/tablet-landscape-1024x768-q1-source-choice-ready.png),
[1079×842 q4](./screenshots/feedback-reported-1079x842-q4-source-choice-ready.png),
[결과](./screenshots/desktop-1280x800-result-pangolinmon.png)에서 확인할 수 있다. 전체 120장과
현재 지문은 [screenshots/qa-report.json](./screenshots/qa-report.json)에 연결했다.

## 보상과 결과

모든 답은 설명을 확인하면 흔적 하나를 받는다. 두 문제 뒤 그림자, 네 문제 뒤 특징을
보여 주고 마지막에 천산갑몬·키위몬·미어캣몬 중 한 종과 정확한 맞힌 문제 수를 표시한다.
테스트 흐름에서는 여섯 문제를 모두 맞혀 흔적 6개와 천산갑몬 결과를 확인했다. 누적 점수,
감점, 희귀 상자, 등급, 랭킹은 없다.

## Humanizer 학생 문구 감사

학생에게 보이는 목표·문항·선택지·자료 글·피드백·흔적·결과 문구와 `aria-label`을
Humanizer 기준으로 확인했다. 한 문장에 한 행동만 두고 제작자 용어, 번역투, 불필요한
쉼표와 명사화를 넣지 않았다. 판정은 A이며 S1·S2·S3 모두 0건이다. 의미 보존 검토는
[HUMANIZER_QA.md](./HUMANIZER_QA.md)에 기록했다.

## 확인 명령

```text
node scripts/build-social-quiz.mjs socialmon-4-2-u1-g02-school-democracy
node scripts/check-social-quiz.mjs socialmon-4-2-u1-g02-school-democracy
node scripts/check-socialmon-source-catalog.mjs socialmon-4-2-u1-g02-school-democracy
node scripts/check-social-series.mjs 4-2 --require-sources
node scripts/test-social-quiz-contract.mjs
node scripts/check-socialmon-interaction-policy.mjs
node scripts/check-socialmon-pack.mjs
node scripts/check-stage-ratio.mjs
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-4-2-u1-g02-school-democracy
SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-4-2-u1-g02-school-democracy/quiz.json"]' node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u1-g02-school-democracy
```

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:23:47.521Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | 53f63793985c2c705513056a332db200b4841e9e39938adf4472c57f6b46add0 |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | 5e44c5df6b0dc19f7075d3a2419c99544ab7ee06c736f51fc73c7d16f0f1ae27 |
| 실행 자산 | 7fa5c88b8611d4bddbee519da7451fd8932b1ed7cdcd743d1267fc8b0a7ab82f |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

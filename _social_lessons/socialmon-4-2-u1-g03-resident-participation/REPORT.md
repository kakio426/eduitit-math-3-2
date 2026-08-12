# 소셜몬 주민 참여 길 찾기 검증 보고서

검증일: 2026-08-12
대상: `socialmon-4-2-u1-g03-resident-participation`
실행본: `_social_lessons/socialmon-4-2-u1-g03-resident-participation/index.html`

## 결과

`socialmon-quiz-lite-contract-v3`·`socialmon-quiz-lite-profile-v2`로 6문제를 구성했다.
화면은 `cover → tutorial → play → result` 네 단계, 조작은 `choice`와 `match` 두
종류다. 새 조작 type·공용 엔진·프로필·정책·캐릭터·카탈로그는 만들거나 수정하지 않았다.

현재 공용 엔진으로 단일 `index.html`을 빌드했고 정적 계약·출처 카탈로그·4-2 시리즈
원본 SHA·상호작용 정책·Stage 비율 검사를 모두 통과했다. 4174 서버에서 등록된 PC·
태블릿 viewport 4종의 전체 흐름을 새로 캡처했으며, 최신 QA receipt도 현재 실행 입력과
정책·하네스 지문을 담고 있다.

## 문항·자료 근거

| 문항 | 틀 | 학습 근거 |
| --- | --- | --- |
| q1 | `source-choice` | 어두운 골목길 밝히기, PDF 48쪽·인쇄 63쪽 |
| q2 | `choice` | 주민 자치의 뜻, PDF 48쪽·인쇄 63쪽 |
| q3 | `match` | 주민 회의·참여 예산·지역 축제, PDF 49쪽·인쇄 64쪽 |
| q4 | `source-choice` | 돌봄 로봇과 아이 돌봄, PDF 54쪽·인쇄 69쪽 |
| q5 | `match` | 누리집·주민 회의·주민 투표, PDF 62쪽·인쇄 77쪽 |
| q6 | `situation-choice` | 주민 회의에서 지역 불편 알리기, PDF 62쪽·인쇄 77쪽 |

두 자료형 문항은 출판사 PDF를 300dpi로 렌더한 crop PNG와 실행 WebP, 대체 텍스트,
화면 출처를 갖춘다. 선택지 8장은 자연 폭 610px의 source PNG와 실행 WebP로 분리했고,
뜻을 돕는 장식일 뿐 정답 근거가 아니다. 자세한 대응은 [SOURCE_LEDGER.md](./SOURCE_LEDGER.md)에 있다.

## 학생 문구 Humanizer 감사

학생에게 보이는 목표·안내·문항·선택지·설명·결과 문구의 자연스러움과 의미 보존은
[HUMANIZER_QA.md](./HUMANIZER_QA.md)에 기록했다. 최종 판정은 A이며 S1·S2·S3는 0건이다.

## 브라우저 QA

다음 주소에서 전체 흐름을 검사했다.

`SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174`

| viewport | 상태 audit | 캡처 |
| --- | ---: | ---: |
| `desktop-1280x800` | 30 | 30 |
| `tablet-landscape-1024x768` | 30 | 30 |
| `feedback-reported-1079x929` | 30 | 30 |
| `feedback-reported-1079x842` | 30 | 30 |
| 합계 | **120** | **120** |

`screenshots/qa-report.json` 생성 시각은 `2026-08-12T13:39:05.899Z`이며 결과는
`passed: true`다. text overflow 0, Stage 밖 요소 0, 핵심 겹침 0, 작은 조작 대상 0,
브라우저 오류 0을 확인했다. 자료형 두 문제의 실행 이미지 자연 폭은 각각 1150px와
1200px, 선택지 이미지 자연 폭은 모두 610px였고, 모든 이미지가 정상 로드됐다.

자료형 실측은 모든 등록 viewport에서 왼쪽 발견 패널 폭 24.5%, 학습 영역 간격
1.5625%, 자료 이미지 폭 약 22%, 자료 제목 24px 이상, 자료 본문 20px 이상, 선택지
높이 94px 이상·글자 21px 이상, 답 확인 버튼 150×52px 이상을 만족했다. 가장 큰 핵심
세로 간격도 Stage 높이 4% 이내였다.

대표 캡처는 [표지](./screenshots/desktop-1280x800-cover.png),
[방법](./screenshots/desktop-1280x800-tutorial.png),
[q1 골목길 자료](./screenshots/desktop-1280x800-q1-source-choice-ready.png),
[q3 이어 보기](./screenshots/desktop-1280x800-q3-match-ready.png),
[q4 마을 돌봄 자료](./screenshots/desktop-1280x800-q4-source-choice-ready.png),
[q6 상황](./screenshots/desktop-1280x800-q6-situation-choice-ready.png),
[결과](./screenshots/desktop-1280x800-result-pangolinmon.png)에서 확인할 수 있다.

## 현재 빌드와 QA 지문

| 항목 | SHA-256 |
| --- | --- |
| `quiz.json` | `b121a8108ab154daed572abfa9f04af20038163a9cfbef73034fa00008866213` |
| `profile.json` | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 활성 theme pack | `21620332e94349bcdb5c72bbd386c3e3b5995f28bca42360634e82fd1fb69ffe` |
| 차시 실행 자산 | `fc1171351ba3eb9cc954ba2445a360efe0705f2c647f4c568aeda73de8daa555` |
| 공용 engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 소셜몬 정책 | `0360a28ee2085006abe1bb851b8f9b04a3f6aff8e44b62722fabf4a3a5a46126` |
| 브라우저 QA 하네스 | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

시리즈가 지정한 활성 pack은 승인된 `socialmon-4-2-local-autonomy-v1`이고, 공용
`social-change-cover-v1.webp`와 승인 소셜몬만 참조한다. 작업 소유 경로의
`resident-participation-v1/pack.json`은 다른 pack과 ID가 겹치지 않는 주민 참여 설정으로
보존했으며, 활성 실행본의 series 계약과 공용 pack은 바꾸지 않았다.

## 검사 결과

- `build-social-quiz`: PASS, 단일 실행본과 빌드 입력 지문 기록
- `check-social-quiz`: PASS, contract-v3·6문제·tap interaction 2종
- `check-socialmon-source-catalog`: PASS, 대상 차시 1개
- `check-social-series 4-2 --require-sources`: PASS, 16게임·48차시 근거 원본 SHA 확인
- `check-socialmon-interaction-policy`: PASS
- `check-socialmon-pack`: PASS
- `check-stage-ratio`: PASS
- `qa-social-quiz`: PASS, 4 viewport·120상태·120캡처

## 자산 눈 확인

표지에서 생성형 문구 `소셜몬 발견 퀴즈`, `소셜몬 주민 참여 길 찾기`, 목표 문장의
철자와 투명 배경을 확인했다. q1·q4의 출판사 crop은 각각 골목길 기사와 두 마을 돌봄
사례가 문항 설명과 맞고, 자료 출처가 오른쪽 아래에 한 번만 표시되는 것을 확인했다.
선택지 8장도 불 켜진 골목, 높은 건물 공사, 집 안 주민, 물길과 배, 함께 돌봄, 마을을
떠나는 사람들, 서로 떨어진 주민들, 빈 지역 안내판으로 서로 구분되며 깨진 글자·로드
실패·잘못된 투명 영역은 없었다.

## 최종 게이트 상태

`2026-08-12 22:39 KST`에 대상 `quiz.json`만 changed path로 지정한 개별 배달 게이트를
실행했다. skill discovery, 출처 카탈로그, 학년 상호작용 정책, 4-2 시리즈 원본, 계약
fixture, 소셜몬 pack, Stage, build, static contract, current browser evidence, REPORT 현재
지문이 모두 PASS했고 최종 결과는 `SOCIALMON_DELIVERY_GATE: PASS (1 series, 1 lessons,
1 changed paths)`였다.

## 확인 명령

```text
node scripts/build-social-quiz.mjs socialmon-4-2-u1-g03-resident-participation
node scripts/check-social-quiz.mjs socialmon-4-2-u1-g03-resident-participation
node scripts/check-socialmon-source-catalog.mjs socialmon-4-2-u1-g03-resident-participation
node scripts/check-social-series.mjs 4-2 --require-sources
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-4-2-u1-g03-resident-participation
SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-4-2-u1-g03-resident-participation/quiz.json"]' node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u1-g03-resident-participation
```

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:25:44.122Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | b121a8108ab154daed572abfa9f04af20038163a9cfbef73034fa00008866213 |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | 21620332e94349bcdb5c72bbd386c3e3b5995f28bca42360634e82fd1fb69ffe |
| 실행 자산 | fc1171351ba3eb9cc954ba2445a360efe0705f2c647f4c568aeda73de8daa555 |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

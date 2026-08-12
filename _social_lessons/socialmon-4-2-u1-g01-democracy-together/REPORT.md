# 소셜몬 함께 정하는 민주주의 검증 보고서

검증일: 2026-08-12
대상: `socialmon-4-2-u1-g01-democracy-together`
실행본: `_social_lessons/socialmon-4-2-u1-g01-democracy-together/index.html`

## 결과

현재 공용 엔진으로 다시 빌드하고, 등록된 PC·태블릿 viewport 4종에서 전체 브라우저 QA를 새로 수행했다. 계약은 `socialmon-quiz-lite-contract-v3`·`socialmon-quiz-lite-profile-v2`이며, 화면은 `cover → tutorial → play → result` 네 단계, 문항은 6개, 조작은 `choice`·`match`·`classify` 세 종류다. 새 조작 type·공용 엔진·profile·정책·shared 4-2 pack은 만들거나 수정하지 않았다.

대상 lesson에 대한 build·static contract·current browser evidence·REPORT fingerprint 검사는 최종 게이트에서 모두 PASS했다. 다만 같은 명령의 전역 fixture 단계는 공유 worktree의 소유 범위 밖 동시 변경 때문에 현재 exit 1이다. `socialmon-4-2-u2-g07-problem-solving-path`의 `quiz.json`·QA receipt·REPORT 누락, 다른 series fixture의 기대 범위 불일치(21 대 18), contract fixture 실패가 원인이며 이 보고서에서는 해당 파일을 건드리지 않았다.

## 현재 빌드와 QA 지문

현재 `screenshots/qa-report.json`은 `socialmon-quiz-browser-qa-v3`이며, 생성 시각은 `2026-08-12T11:41:39.450Z`이다. QA receipt에는 실행본 입력과 현재 정책·하네스 지문이 다음처럼 기록되어 있다.

| 항목 | SHA-256 |
| --- | --- |
| `quiz.json` | `d7803ab1a44462e75263cfb5b5f19ec276810c593666cc86be102dfb64151b85` |
| `profile.json` | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| `theme pack` | `1e3f66a3ad3face8f189c69c26af6fd0fb48ea0ef97c08395bbd2ae5595dd133` |
| 공용 engine | `ab7fdc1e4b14f8fc8725353d48d9cee1a9e1815b9069016455c726b1e66165ce` |
| `SOCIALMON_INTERACTION_POLICY.json` | `8e2c364fd20b6f00a1246721ec25d658d9ea0ed84dd478612a386dd1b688401b` |
| 브라우저 QA 하네스 | `a418f0335aa4f7be7d4ff875866910d96ccc642c4e18475e8bd824be5c9af756` |

## 문항·자료 근거

| 문항 | 틀 | 학습 근거 |
| --- | --- | --- |
| q1 | `source-choice` | 건의함의 쓰임, PDF 11쪽·인쇄 26쪽 |
| q2 | `choice` | 민주주의의 뜻, PDF 12쪽·인쇄 27쪽 |
| q3 | `match` | 가정·학교·마을의 함께 정하는 일, PDF 13쪽·인쇄 28쪽 |
| q4 | `source-choice` | 자치회 임원 선거, PDF 12쪽·인쇄 27쪽 |
| q5 | `classify` | 민주주의를 돕는 태도와 다시 생각할 태도, PDF 19쪽·인쇄 34쪽 |
| q6 | `situation-choice` | 의견이 다를 때의 민주적 결정, PDF 20쪽·인쇄 35쪽 |

정식 자료형 문항은 q1·q4 두 개이며, 각 자료는 출판사 지도서에서 잘라낸 근거 이미지와 자료 설명·출처를 사용한다. 자세한 페이지·파일·출처 매핑은 [SOURCE_LEDGER.md](./SOURCE_LEDGER.md)와 `_social_sources/4-2/source-catalog.json`, PDF 확인 기록은 `_social_lessons/series/4-2/PDF_VERIFICATION.md`에 남겼다. q1 자료 이미지는 `source-school-suggestion-v1` 1360×1750, q4 자료 이미지는 `source-student-election-v1` 1030×800이며, 일반 자료형 선택지 8장은 정답 근거가 아닌 장식 이미지로 분리했다.

## 자산 눈 확인

생성형 표지 자산의 `소셜몬 발견 퀴즈`, `소셜몬 함께 정하는 민주주의`, 목표 문구 철자를 확인했고, 사용 WebP의 투명 알파도 확인했다. q1·q4 선택지 8장의 source PNG와 배포 WebP를 모두 눈으로 확인했다. 학교 아이디어, 분실물, 대여, 알림 모으기, 선거 투표, 선생님과 의논하기, 제비뽑기, 먼저 하기 장면이 각각 구분되고 깨진 글자·잘못된 알파·로드 실패가 없어 재생성하지 않았다.

q1·q4의 출판사 자료 crop도 눈으로 확인해 문제 설명과 자료 장면이 맞고, 출처 표기가 자료 근거를 가리지 않는 것을 확인했다. `screenshots/qa-report.json`의 전체 source-choice viewport 검사에서도 여덟 선택지 이미지와 두 자료 이미지가 모두 로드됐다.

## 실행본 호환성 점검

q5 분류 모둠의 두 필드만 현재 공용 renderer가 읽는 `label` 키로 맞췄다. 보이는 문자열 `민주주의를 돕는 태도`, `다시 생각할 태도`와 뜻은 바꾸지 않았으며, 재빌드 후 두 버튼이 실행 화면에 표시되는 것을 확인했다. 그 밖의 기존 quiz 내용·crop·생성형 자산·screenshots는 보존했다.

## 보상과 결과

모든 답을 확인하면 흔적을 하나 받고, 흔적 2개에서 그림자, 4개에서 특징을 열며, 마지막에는 소셜몬 한 종과 정확한 맞힌 문제 수를 보여 준다. 테스트 흐름에서는 여섯 문제를 모두 맞혀 흔적 6개와 팡골린몬 결과를 확인했다. 점수·랭킹·토큰·문제마다 여는 상자 같은 별도 보상 체계는 사용하지 않았다.

## 브라우저 QA

다음 주소로 현재 실행본을 열어 전체 흐름을 검사했다.

`SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175`

| viewport | 상태 audit | 캡처 |
| --- | ---: | ---: |
| `desktop-1280x800` | 30 | 30 |
| `tablet-landscape-1024x768` | 30 | 30 |
| `feedback-reported-1079x929` | 30 | 30 |
| `feedback-reported-1079x842` | 30 | 30 |
| 합계 | **120** | **120** |

`qa-report.json` 결과는 `passed: true`, text overflow 0, Stage 밖 요소 0, 핵심 겹침 0, 작은 터치 대상 0, 브라우저 오류 0이다. Stage는 16:10이며, 발견 패널은 24.5%, 학습 영역과의 간격은 1.5625%였다. source-choice 점검은 자료 이미지 폭 약 22%, 자료 제목 24px 이상, 본문 20px 이상, 선택지 높이 94px 이상·글자 21px 이상·폭 31% 이하, 답 확인 버튼 150×52px 이상을 모든 등록 viewport에서 확인했다.

대표 캡처는 [표지](./screenshots/desktop-1280x800-cover.png), [방법](./screenshots/desktop-1280x800-tutorial.png), [q1 자료](./screenshots/desktop-1280x800-q1-source-choice-ready.png), [q2 고르기](./screenshots/desktop-1280x800-q2-choice-ready.png), [q3 이어 보기](./screenshots/desktop-1280x800-q3-match-ready.png), [q5 나누어 보기](./screenshots/desktop-1280x800-q5-classify-ready.png), [q6 상황](./screenshots/desktop-1280x800-q6-situation-choice-ready.png), [정답 피드백](./screenshots/desktop-1280x800-q1-correct-feedback.png), [흔적 0](./screenshots/desktop-1280x800-discovery-trace-0.png), [흔적 6](./screenshots/desktop-1280x800-discovery-trace-6.png), [결과](./screenshots/desktop-1280x800-result-pangolinmon.png), [태블릿 q1](./screenshots/tablet-landscape-1024x768-q1-source-choice-ready.png)에서 확인할 수 있다. 전체 120개 상태 캡처와 최신 QA 지문은 [screenshots/qa-report.json](./screenshots/qa-report.json)에 연결되어 있다.

## 학생 문구 Humanizer 감사

학생에게 보이는 목표·안내·문항·선택지·피드백·흔적·결과 문구의 자연스러움과 의미 보존은 [HUMANIZER_QA.md](./HUMANIZER_QA.md)에 기록했다. 교과 낱말은 유지하되 제작자 중심 표현과 번역투를 제거했으며, q5의 `text`→`label` 호환 수정은 문구 의미를 바꾸지 않았다.

## 최종 게이트 상태

필수 명령 `node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u1-g01-democracy-together`를 현재 worktree에서 실행했다. 대상 lesson 자체의 `current browser evidence: PASS`와 `REPORT current fingerprints: PASS`는 확인했지만, 공유 series·다른 lesson fixture 실패로 전체 명령은 PASS까지 도달하지 못했다. 사용자 지시대로 다른 차시·공용 engine·profile·scripts·hooks·루트 정책·shared 4-2 pack은 수정하지 않았으므로, 외부 fixture가 정리된 뒤 같은 명령을 다시 실행해야 한다.

## 확인 명령

```text
node scripts/build-social-quiz.mjs socialmon-4-2-u1-g01-democracy-together
node scripts/check-social-quiz.mjs socialmon-4-2-u1-g01-democracy-together
node scripts/check-socialmon-interaction-policy.mjs
node scripts/check-socialmon-pack.mjs
node scripts/check-stage-ratio.mjs
node scripts/check-socialmon-source-catalog.mjs socialmon-4-2-u1-g01-democracy-together
node scripts/check-social-series.mjs 4-2 --require-sources
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u1-g01-democracy-together
node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u1-g01-democracy-together
```

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:23:47.690Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | d7803ab1a44462e75263cfb5b5f19ec276810c593666cc86be102dfb64151b85 |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | 1e3f66a3ad3face8f189c69c26af6fd0fb48ea0ef97c08395bbd2ae5595dd133 |
| 실행 자산 | 48cf433db71008497d1792c7caa9cced9534feb79a39a0744dc9d7743c741c8a |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

# 소셜몬 살고 싶은 도시

4학년 2학기 사회 3단원 14~16차시(교과서 143~149쪽)를 바탕으로 만든 소셜몬 발견 퀴즈다. 도시가 고른 방법을 자료에서 읽고, 도시 문제에 맞는 생활 속 방법을 이으며, 오늘부터 할 수 있는 실천을 고른다.

## 학생 흐름

```text
표지 → 방법 보기 1장 → 6문제와 흔적 도장 → 2문제 뒤 그림자 → 4문제 뒤 특징 → 소셜몬 공개 → 결과
```

- 화면은 `cover`, `tutorial`, `play`, `result` 네 개다.
- 답을 확인하면 정답 여부와 한 줄 까닭을 먼저 보고, 다음 버튼을 눌러 흔적을 받는다.
- 정답이든 오답이든 설명을 확인하면 흔적 1개를 받고, 맞힌 문제 수는 따로 센다.
- 결과는 `맞힌 문제 수 + 오늘 만난 소셜몬 1종 + 오늘의 발견`으로 끝난다.

## 6문제

| 순서 | 문항 | 형식 | 학생 조작 |
|---:|---|---|---|
| 1 | 그림 속 도시는 전기를 어떻게 얻고 있을까요? | `source-choice` | 고르기 |
| 2 | 도시에 만들고 싶은 시설을 두 곳으로 나누어 볼까요? | `classify` | 나누어 보기 |
| 3 | 이 판에 모은 말들은 무엇을 하려고 적었을까요? | `source-choice` | 고르기 |
| 4 | 도시 문제와 생활 속 방법을 이어 볼까요? | `match` | 이어 보기 |
| 5 | 도시 생활의 좋은 점과 함께 풀 문제를 나누어 볼까요? | `classify` | 나누어 보기 |
| 6 | 우리가 오늘부터 할 수 있는 방법은 무엇일까요? | `situation-choice` | 고르기 |

학생 조작은 `고르기`, `나누어 보기`, `이어 보기` 3종이며 모두 탭으로 끝난다. 필수 드래그와 별도 OX 조작은 없다.

## 조립 구조

```text
socialmon-quiz-lite-profile-v2 + socialmon-4-2-dream-city-v1 + quiz.json → index.html
```

- 공용 엔진: `_engine/social-quiz-lite/v1` (`socialmon-quiz-lite-v1`)
- 공용 프로필: `_shared/socialmon/profiles/quiz-lite-v2/profile.json`
- 테마팩: `_shared/socialmon/theme-packs/4-2/dream-city-v1/pack.json`
- 제품 계약: `socialmon-quiz-lite-contract-v3`
- 차시 원본에는 문항·근거·후보 소셜몬·오늘의 발견만 두고 공용 화면·보상·결과·QA 값은 복사하지 않는다.

## 자산

- 표지 문구 아트: `assets/cover-copy-v1-generated.webp` (원본 `assets/cover-copy-v1-source.png`)
- 사실 자료 2장: `assets/source-dream-city-energy-v1.webp`, `assets/source-city-solution-board-v1.webp` (각 `*-source.png` 원본 보관)
- 선택지 장식 8장: `assets/option-*-v1.webp` (각 `*-source.png` 원본 보관), 실행 원본 가로 512px 이상
- 사실 자료는 지도서 PDF 86·87쪽 crop만 쓰고, 생성 이미지는 표지와 선택지 장식에만 쓴다.

## 빌드와 검사

```bash
node scripts/build-social-quiz.mjs socialmon-4-2-u3-g16-dream-city
node scripts/check-social-quiz.mjs socialmon-4-2-u3-g16-dream-city
node scripts/check-socialmon-source-catalog.mjs socialmon-4-2-u3-g16-dream-city
python3 -m http.server 4175
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u3-g16-dream-city
node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u3-g16-dream-city
```

브라우저 QA는 `desktop-1280x800`, `tablet-landscape-1024x768`, `feedback-reported-1079x929`, `feedback-reported-1079x842` 네 화면 크기에서 전체 흐름을 캡처한다. 현재 실행본 기준 증거는 [REPORT.md](./REPORT.md)와 [screenshots/qa-report.json](./screenshots/qa-report.json)에 있다.

## 문서

- [PLAN.md](./PLAN.md) — 수업 자리, 문항 배치, 완료 조건
- [SOURCE_LEDGER.md](./SOURCE_LEDGER.md) — 문항별 지도서 근거와 자료 사용 범위
- [HUMANIZER_QA.md](./HUMANIZER_QA.md) — 학생 문구 점검
- [REPORT.md](./REPORT.md) — 현재 실행본의 검사·브라우저 증거와 지문

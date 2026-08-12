# 소셜몬 우리 지역 알리기

4학년 2학기 2단원 14~16차시의 지역 자랑거리와 알리는 노력을 확인하는 6문제
소셜몬 퀴즈입니다. 학생은 상품 기획서와 단원 생각그물을 읽고, 알맞은 소개 말과 순서를
고릅니다.

## 수업에서 쓰기

1. `index.html`을 엽니다.
2. 한 장짜리 방법 포스터를 봅니다.
3. 자료를 읽고 고르기·나누어 보기·순서 놓기 문제를 풉니다.
4. 여섯 흔적을 모은 뒤 맞힌 문제 수와 소셜몬을 확인합니다.

한 판은 약 5~7분이며 로그인, 랭킹, 도감, 답안 전송은 없습니다. 오답이어도 설명을 본
뒤 흔적 하나를 받고, 맞힌 문제 수는 결과에서 따로 보여 줍니다.

## 제품 구성

- 프로필: `socialmon-quiz-lite-profile-v2`
- 계약: `socialmon-quiz-lite-contract-v3`
- 화면: `cover`·`tutorial`·`play`·`result`
- 문항: `source-choice` 2개, `choice` 1개, `classify` 1개, `sequence` 1개,
  `situation-choice` 1개
- 학생 조작: 고르기·나누어 보기·순서 놓기 3종
- 보상: 승인된 discovery pack의 소셜몬 한 종과 흔적 6개

사실 자료 두 장은 지도서 PDF를 자른 PNG·WebP이며, 자료형 선택지 8장은 글의 뜻을 돕는
생성형 장식 그림입니다. 장식 그림은 정답 근거로 쓰지 않습니다. 표지 문구만 차시 전용
생성형 투명 래스터를 사용하고 나머지 화면 자산은 공용 profile과 테마팩을 참조합니다.

## 실행·검증

```bash
node scripts/build-social-quiz.mjs socialmon-4-2-u2-g10-share-our-region
node scripts/check-social-quiz.mjs socialmon-4-2-u2-g10-share-our-region
node scripts/check-socialmon-source-catalog.mjs socialmon-4-2-u2-g10-share-our-region
node scripts/check-social-series.mjs 4-2 --require-sources
python3 -m http.server 4175
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u2-g10-share-our-region
SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-4-2-u2-g10-share-our-region/quiz.json"]' node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u2-g10-share-our-region
```

문항 근거와 자산 경계는 `SOURCE_LEDGER.md`, 학생 문구 감사는 `HUMANIZER_QA.md`, 최신
브라우저 증거와 지문은 `REPORT.md`와 `screenshots/qa-report.json`에서 확인합니다.

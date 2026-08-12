# 소셜몬 민주 참여 약속

4학년 2학기 1단원 14~16차시에서 주민 참여와 민주적인 참여 태도를 확인하는 6문제
퀴즈입니다.

## 수업에서 쓰기

1. `index.html`을 엽니다.
2. 그림으로 만든 방법 보기 한 장을 함께 봅니다.
3. 주민 참여 포스터와 어린이 공간 제안서를 읽고 학교·지역의 참여 행동을 살펴봅니다.
4. 마지막에 맞힌 문제 수와 만난 소셜몬을 봅니다.

한 판은 약 5~7분이며 학생 계정, 랭킹, 답안 전송은 없습니다. 문제 화면 왼쪽에서는 같은
소셜몬이 여섯 흔적에 따라 천천히 나타나고, 오른쪽에서는 자료와 선택지를 살펴봅니다.

q1과 q4의 자료 이미지는 출판사 지도서 PDF에서 잘라 만든 사실 근거입니다. 각 자료형
문항의 선택지 그림 네 장은 뜻을 돕는 장식이며, 정답의 사실 근거가 아닙니다.

## 문제 형식

- 자료를 보고 하나 고르기 2문항
- 주민 참여의 뜻 고르기 1문항
- 다른 의견을 대하는 행동 나누어 보기 1문항
- 학교와 지역의 참여 모습 이어 보기 1문항
- 의견이 다를 때 행동 고르기 1문항

학생 조작은 고르기·나누어 보기·이어 보기 세 종류이며 모두 탭으로 끝납니다.

문항 근거는 `SOURCE_LEDGER.md`, 제작 범위는 `PLAN.md`, 학생 문구 점검은
`HUMANIZER_QA.md`, 최신 실행 검증은 `REPORT.md`에서 확인합니다.

## 빌드와 검사

```bash
node scripts/build-social-quiz.mjs socialmon-4-2-u1-g05-democratic-participation
node scripts/check-social-quiz.mjs socialmon-4-2-u1-g05-democratic-participation
node scripts/check-socialmon-source-catalog.mjs socialmon-4-2-u1-g05-democratic-participation
node scripts/check-social-series.mjs 4-2 --require-sources
python3 -m http.server 4175
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u1-g05-democratic-participation
node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u1-g05-democratic-participation
```

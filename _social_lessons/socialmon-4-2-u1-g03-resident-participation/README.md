# 소셜몬 주민 참여 길 찾기

4학년 2학기 1단원 8~10차시 `주민 자치의 뜻과 여러 주민 참여 방법`을 확인하는
6문제 퀴즈입니다.

## 수업에서 쓰기

1. `index.html`을 엽니다.
2. 그림으로 만든 방법 보기 한 장을 함께 봅니다.
3. 골목길 밝히기, 주민 회의, 주민 참여 예산, 지역 축제, 마을 돌봄 사례를 살펴봅니다.
4. 마지막에 맞힌 문제 수와 만난 소셜몬을 봅니다.

한 판은 약 5~7분이며 학생 계정, 랭킹, 답안 전송은 없습니다. 문제를 풀 때마다 흔적을
하나씩 받고, 같은 소셜몬이 왼쪽 발견 자리에서 조금씩 나타납니다.

## 문제 형식

- 출판사 자료를 보고 하나 고르기 2문항
- 주민 자치의 뜻 고르기 1문항
- 참여 방법과 사례 이어 보기 1문항
- 참여 방법과 전할 의견 이어 보기 1문항
- 지역의 불편을 알리는 행동 고르기 1문항

학생 조작은 고르기와 이어 보기 두 종류이며 모두 탭으로 끝납니다. 두 자료 문항에는
지도서 지면에서 자른 사실 자료와 네 선택지 그림을 함께 둡니다. 선택지 그림은 글의
뜻을 돕는 장식이며 정답의 사실 근거가 아닙니다.

문항 근거는 `SOURCE_LEDGER.md`, 제작 범위는 `PLAN.md`, 학생 문구 감사는
`HUMANIZER_QA.md`, 최신 실행 검증은 `REPORT.md`에서 확인합니다.

## 빌드와 검사

```bash
node scripts/build-social-quiz.mjs socialmon-4-2-u1-g03-resident-participation
node scripts/check-social-quiz.mjs socialmon-4-2-u1-g03-resident-participation
node scripts/check-socialmon-source-catalog.mjs socialmon-4-2-u1-g03-resident-participation
node scripts/check-social-series.mjs 4-2 --require-sources
python3 -m http.server 4175
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u1-g03-resident-participation
SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-4-2-u1-g03-resident-participation/quiz.json"]' node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u1-g03-resident-participation
```

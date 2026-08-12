# 소셜몬 학교 문제 함께 풀기

4학년 2학기 1단원 4~7차시 `학교생활 속 민주주의`를 확인하는 6문제 퀴즈입니다.

## 수업에서 쓰기

1. `index.html`을 엽니다.
2. 방법 포스터 한 장을 함께 봅니다.
3. 학생 참여 예산제와 오래된 놀이터 자료를 살펴봅니다.
4. 학교 문제를 찾고 정하고 실천하는 순서를 탭으로 놓아 봅니다.
5. 마지막에 맞힌 문제 수와 만난 소셜몬을 봅니다.

한 판은 약 5~7분입니다. 학생 계정, 답안 전송, 랭킹은 없습니다.

표지 문구는 생성형 투명 래스터 `assets/cover-copy-v1-generated.webp`로 보여 줍니다.
방법 화면과 네 화면 배경, 보라 구름, 결과 소셜몬은 승인된 공용 자산을 씁니다. 문제
화면에서는 같은 소셜몬이 여섯 흔적에 따라 천천히 나타납니다.

## 문제 형식

- 출판사 자료를 보고 하나 고르기 2문항
- 학교 일에 함께 참여하는 까닭 고르기 1문항
- 학교 문제 해결 순서 놓기 2문항
- 생각이 다를 때 함께 정하는 행동 고르기 1문항

학생 조작은 고르기와 순서 놓기 두 종류이며 모두 탭으로 끝납니다. 문제를 찾고 여러
생각을 들은 뒤 함께 정하고 실천하며 달라진 점을 살피는 흐름을 다룹니다.

문항 근거와 자료 자산은 `SOURCE_LEDGER.md`, 학생 문구 점검은 `HUMANIZER_QA.md`, 최신
브라우저 증거는 `REPORT.md`에서 확인합니다.

## 빌드와 검사

```bash
node scripts/build-social-quiz.mjs socialmon-4-2-u1-g02-school-democracy
node scripts/check-social-quiz.mjs socialmon-4-2-u1-g02-school-democracy
node scripts/check-socialmon-source-catalog.mjs socialmon-4-2-u1-g02-school-democracy
node scripts/check-social-series.mjs 4-2 --require-sources
node scripts/check-socialmon-interaction-policy.mjs
node scripts/check-socialmon-pack.mjs
node scripts/check-stage-ratio.mjs
python3 -m http.server 4175
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u1-g02-school-democracy
SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-4-2-u1-g02-school-democracy/quiz.json"]' node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u1-g02-school-democracy
```

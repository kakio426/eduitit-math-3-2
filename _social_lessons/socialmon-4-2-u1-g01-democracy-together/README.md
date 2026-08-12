# 소셜몬 함께 정하는 민주주의

4학년 2학기 1단원 1~3차시 `민주주의의 뜻과 실천 태도`를 확인하는 6문제 퀴즈입니다.

## 수업에서 쓰기

1. `index.html`을 엽니다.
2. 그림으로 만든 방법 보기 한 장을 함께 봅니다.
3. 건의함, 학생 자치회 선거, 생활 속 회의와 학급회의 사례를 6문제로 살펴봅니다.
4. 마지막에 맞힌 문제 수와 만난 소셜몬을 봅니다.

한 판은 약 5~7분이며 학생 계정, 랭킹, 답안 전송은 없습니다.

표지 문구와 방법 화면은 승인된 생성 이미지로 보여 줍니다. 문제 화면에서는 같은
소셜몬이 여섯 흔적에 따라 천천히 나타나고, 오른쪽에서 자료와 선택지를 살펴봅니다.
자료를 직접 읽는 두 문항은 출판사 지도서 지면을 자른 자료 이미지와 네 선택지 그림을
함께 사용합니다. 선택지 그림은 뜻을 돕는 장식이며 정답의 사실 근거가 아닙니다.

## 문제 형식

- 자료를 보고 하나 고르기 2문항
- 알맞은 답 하나 고르기 1문항
- 생활 속 사례 이어 보기 1문항
- 민주주의를 돕는 태도 나누어 보기 1문항
- 의견이 다를 때 행동 고르기 1문항

학생 조작은 고르기·이어 보기·나누어 보기 세 종류이며 모두 탭으로 끝납니다. 민주주의를
다수결 하나로 줄이지 않고, 서로의 말을 듣고 존중하며 소수 의견을 살피고 함께 정한 일을
실천하는 태도를 함께 다룹니다.

문항 근거는 `SOURCE_LEDGER.md`, 제작 범위는 `PLAN.md`, 지도서 검증은
`../series/4-2/PDF_VERIFICATION.md`, 최신 실행 검증은 `REPORT.md`에서 확인합니다.

## 빌드와 검사

```bash
node scripts/build-social-quiz.mjs socialmon-4-2-u1-g01-democracy-together
node scripts/check-social-quiz.mjs socialmon-4-2-u1-g01-democracy-together
node scripts/check-socialmon-pack.mjs
node scripts/check-stage-ratio.mjs
python3 -m http.server 4173
node scripts/qa-social-quiz.mjs socialmon-4-2-u1-g01-democracy-together
node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u1-g01-democracy-together
```

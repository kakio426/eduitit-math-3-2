# 소셜몬 달라진 생활 찾기

3학년 2학기 1단원 2차시 `우리 사회의 변화 모습`을 확인하는 6문제 퀴즈입니다.

## 수업에서 쓰기

1. `index.html`을 엽니다.
2. 방법 보기 한 장을 함께 읽습니다.
3. 옛 학교와 오늘날 학교, 사회가 달라진 까닭을 6문제로 확인합니다.
4. 마지막에 맞힌 문제 수와 만난 소셜몬을 봅니다.

한 판은 약 5~7분이며 학생 계정, 랭킹, 답안 전송은 없습니다.

## 문제 형식

- 알맞은 답 하나 고르기
- 자료를 보고 하나 고르기
- 옛날과 오늘의 모습 짝 잇기
- 달라진 까닭에 따라 나누기

문항 근거는 `SOURCE_LEDGER.md`, 제작 범위는 `PLAN.md`, 최신 실행 검증은
`REPORT.md`에서 확인합니다.

## 빌드와 검사

```bash
node scripts/build-social-quiz.mjs socialmon-3-2-u1-g01-changing-life
node scripts/check-social-quiz.mjs socialmon-3-2-u1-g01-changing-life
node scripts/check-socialmon-pack.mjs
python3 -m http.server 4173
node scripts/qa-social-quiz.mjs socialmon-3-2-u1-g01-changing-life
```

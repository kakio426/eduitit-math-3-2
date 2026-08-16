# 소셜몬 달라진 생활 찾기

3학년 2학기 1단원 2차시 `우리 사회의 변화 모습`을 확인하는 6문제 퀴즈입니다.

## 수업에서 쓰기

1. `index.html`을 엽니다.
2. 그림으로 만든 방법 보기 한 장을 함께 봅니다.
3. 옛 학교와 오늘날 학교, 사회가 달라진 까닭을 6문제로 확인합니다.
4. 마지막에 맞힌 문제 수와 만난 소셜몬을 봅니다.

한 판은 약 5~7분이며 학생 계정, 랭킹, 답안 전송은 없습니다.

표지 문구와 방법 화면은 생성 이미지로 보여 줍니다. 문제 화면에서는 왼쪽의
소셜몬이 여섯 흔적에 따라 천천히 나타나고, 오른쪽에서 자료와 큰 선택지를
살펴봅니다. 첫 문제는 출판사 원본 사진을 고밀도로 표시하고, 모든 화면 보기마다
뜻을 돕는 작은 그림을 함께 둡니다. 짝 잇기에서는 두 카드를 완성한 뒤 실제 연결선이
나타나며, 처음부터 행끼리 이어 보이지 않습니다. 상단 진행 표시는 문제 번호 하나만 보입니다.

## 문제 형식

- 알맞은 답 하나 고르기
- 자료를 보고 하나 고르기
- 옛날과 오늘의 모습 짝 잇기
- 달라진 까닭에 따라 나누기
- 모든 화면 보기의 뜻 그림과 대체 텍스트

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

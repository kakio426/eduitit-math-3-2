# 소셜몬 우리 지역 자치 찾기

4학년 2학기 1단원 11~13차시의 주민 자치 사례와 참여 방법을 살펴보는 6문제
소셜몬 퀴즈입니다. 한 판은 약 5~7분이며 학생 계정, 랭킹, 답안 전송은 없습니다.

## 수업에서 쓰기

1. `index.html`을 엽니다.
2. 방법 포스터에서 자료 보기와 흔적 모으기를 확인합니다.
3. 깨끗한 상가 만들기와 한쪽 주차제 사진을 보고 주민이 한 일을 고릅니다.
4. 조사 방법, 협력 역할, 지역 문제와 참여 방법을 이어 봅니다.
5. 마지막에 맞힌 문제 수와 만난 소셜몬을 확인합니다.

표지 문구와 두 자료 문항의 선택지 그림은 생성형 이미지입니다. 선택지 그림은 글의
뜻을 돕는 장식이고, 정답의 사실 근거는 출판사 지도서에서 직접 자른 두 자료 이미지와
문항 근거에 있습니다.

## 문제 형식

- 자료를 보고 하나 고르기 2문항
- 조사 방법 이어 보기 1문항
- 주민 자치 역할 이어 보기 1문항
- 지역 문제와 참여 방법 이어 보기 1문항
- 참여할 첫 행동 고르기 1문항

학생 조작은 고르기·이어 보기 두 종류이며 모두 탭으로 끝납니다. 화면은
`cover → tutorial → play → result` 네 개이고, 정답 확인과 흔적 공개는 `play` 안의
흐름 상태입니다.

## 실행과 검사

```bash
node scripts/build-social-quiz.mjs socialmon-4-2-u1-g04-local-autonomy
node scripts/check-social-quiz.mjs socialmon-4-2-u1-g04-local-autonomy
python3 -m http.server 4175
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u1-g04-local-autonomy
node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u1-g04-local-autonomy
```

문항 근거와 자산 경계는 `SOURCE_LEDGER.md`, 학생 문구 검토는 `HUMANIZER_QA.md`,
현재 빌드·브라우저 증거는 `REPORT.md`에서 확인할 수 있습니다.

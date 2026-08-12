# 소셜몬 환경 두 모습 찾기

4학년 2학기 사회 3단원 11번 게임이다. 1~2차시의 자연환경과 인문환경을 바탕으로, 교과서 사진과 같은 지역의 두 사진에서 자연 그대로 생겨난 모습과 사람들이 만든 모습을 나누어 본다.

## 실행

```bash
node scripts/build-social-quiz.mjs socialmon-4-2-u3-g11-two-environments
python3 -m http.server 4175
```

브라우저에서 `http://127.0.0.1:4175/_social_lessons/socialmon-4-2-u3-g11-two-environments/`를 연다.

## 제품 기준

- `socialmon-quiz-lite-profile-v2`와 `socialmon-quiz-lite-contract-v3`를 사용한다.
- 화면은 `cover → tutorial → play → result` 네 개이며, 정답 확인·흔적 공개는 `play` 안의 흐름 상태다.
- 6문제는 고르기 계열 4개(자료 고르기 2개, 고르기 1개, 상황 고르기 1개)와 나누어 보기 1개, 이어 보기 1개다.
- 첫 자료 문항은 교과서 사진 묶음에서 자연환경을 찾고, 두 번째 자료 문항은 세종의 2008년·2022년 사진을 견주어 달라진 점을 찾는다.
- 사실 자료는 지도서 PDF에서 자른 두 이미지뿐이고, 생성형 이미지는 표지 문구와 선택지 장식으로만 쓴다.
- 지역의 변화를 좋다·나쁘다로 판정하지 않고 사진에서 확인되는 사실만 묻는다.

## 검증

```bash
node scripts/check-social-quiz.mjs socialmon-4-2-u3-g11-two-environments
node scripts/check-socialmon-interaction-policy.mjs
node scripts/test-social-quiz-contract.mjs
node scripts/check-socialmon-pack.mjs
node scripts/check-stage-ratio.mjs
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u3-g11-two-environments
```

PDF 11~13쪽의 시각·텍스트 대조 기록은 `SOURCE_LEDGER.md`에, 학생 문구 검토 기록은 `HUMANIZER_QA.md`에, 현재 실행본 증거는 `REPORT.md`에 남겼다.

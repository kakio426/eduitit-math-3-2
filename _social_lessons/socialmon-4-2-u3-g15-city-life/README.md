# 소셜몬 도시 생활 살펴보기

4학년 2학기 사회 3단원 15번 게임이다. 12~13차시의 도시 생활 모습을 바탕으로, 도시의 편리한 점과 문제점을 함께 살피고 생활 속 해결 방법을 고른다.

## 실행

```bash
node scripts/build-social-quiz.mjs socialmon-4-2-u3-g15-city-life
python3 -m http.server 4175
```

브라우저에서 `http://127.0.0.1:4175/_social_lessons/socialmon-4-2-u3-g15-city-life/`를 연다.

## 제품 기준

- `socialmon-quiz-lite-profile-v2`와 `socialmon-quiz-lite-contract-v3`를 사용한다.
- 화면은 `cover → tutorial → play → result` 네 개이며, 정답 확인·흔적 공개는 `play` 안의 흐름 상태다.
- 6문제는 고르기(source-choice 2개, situation-choice 1개), 분류 2개, 이어 보기 1개로 구성했다.
- 첫 자료 문항은 도시 생활 모습을 찾고, 두 자료 문항은 도시 문제와 해결 노력을 자료에서 판단한다.
- 교과서·지도서 PDF의 사실 자료만 정답 근거로 쓰며 생성형 이미지는 표지와 선택지 장식으로만 쓴다.
- 도시를 촌락보다 낫다고 단정하지 않고, 편리한 점과 살펴볼 문제 및 해결 행동을 함께 제시한다.

## 검증

```bash
node scripts/check-social-quiz.mjs socialmon-4-2-u3-g15-city-life
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u3-g15-city-life
node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u3-g15-city-life
```

PDF 69~86쪽의 시각·텍스트 대조 기록은 `SOURCE_LEDGER.md`에, 학생 문구 검토 기록은 `HUMANIZER_QA.md`에 남겼다.

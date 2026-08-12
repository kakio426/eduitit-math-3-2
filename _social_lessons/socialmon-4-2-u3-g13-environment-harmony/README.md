# 소셜몬 사람과 환경의 약속

4학년 2학기 사회 3단원 13번 게임이다. 환경을 이용하거나 개발한 뒤 달라진 모습을 자료에서 살펴보고, 사람의 생활과 자연을 함께 생각한 방법을 고른다.

## 실행

```bash
node scripts/build-social-quiz.mjs socialmon-4-2-u3-g13-environment-harmony
python3 -m http.server 4175
```

브라우저에서 `http://127.0.0.1:4175/_social_lessons/socialmon-4-2-u3-g13-environment-harmony/`를 연다.

## 제품 기준

- `socialmon-quiz-lite-profile-v2`와 `socialmon-quiz-lite-contract-v3`를 사용한다.
- 화면은 `cover → tutorial → play → result` 네 개이며, 정답 확인과 흔적 공개는 `play` 안의 흐름 상태다.
- 6문제는 고르기(source-choice 2개, choice 1개, situation-choice 1개), 분류 1개, 이어 보기 1개로 구성했다.
- 첫 자료 문항은 평택시 두 시기 교통 지도, 두 번째 자료 문항은 시화 갯벌 간척 전후 사진에서 답을 찾는다.
- 교과서·지도서 PDF의 사실 자료만 정답 근거로 쓰며 생성형 이미지는 표지와 선택지 장식으로만 쓴다.

## 검증

```bash
node scripts/build-social-quiz.mjs socialmon-4-2-u3-g13-environment-harmony
node scripts/check-social-quiz.mjs socialmon-4-2-u3-g13-environment-harmony
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u3-g13-environment-harmony
SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-4-2-u3-g13-environment-harmony/quiz.json"]' node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u3-g13-environment-harmony
```

PDF 37~41쪽의 텍스트·렌더 대조와 crop 범위는 `SOURCE_LEDGER.md`에, 학생 문구 검토는 `HUMANIZER_QA.md`에 남겼다.

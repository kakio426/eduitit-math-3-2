# 소셜몬 온대·냉대 기후 생활

6학년 2학기 사회 1단원 10차시를 위한 5~7분 퀴즈다. 학생은 온대 지역의 계절과 농업, 냉대 지역의 긴 겨울과 침엽수림이 생활에 미친 영향을 비교한다.

공용 `socialmon-quiz-lite-v1` 엔진, `socialmon-quiz-lite-profile-v2`, `socialmon-quiz-lite-contract-v3`을 사용한다. 정확히 6문제이며 `source-choice` 2개, `choice` 1개, `match` 2개, `classify` 1개다. 고르기·이어 보기·나누어 보기 세 조작만 사용하며 지도 위치 버튼은 없다.

## 실행

```bash
node scripts/build-social-quiz.mjs _social_lessons/socialmon-6-2-u1-g19-temperate-cold-climate-life
```

출처는 `SOURCE_LEDGER.md`, 학생 문구 점검은 `HUMANIZER_QA.md`, 최종 브라우저 기록은 `REPORT.md`에서 확인한다.

# 소셜몬 세계 기후 지도

6학년 2학기 사회 1단원 8차시를 바탕으로 한 5~7분 퀴즈다. 학생은 세계 기후 지도에서 열대 기후와 냉대 기후가 나타나는 곳을 직접 누르고, 위도·기온·강수량과 기후의 관계를 살펴본다.

공용 `socialmon-quiz-lite-v1` 엔진, `socialmon-quiz-lite-profile-v2`, `socialmon-quiz-lite-contract-v3`을 사용한다. 6문제는 고르기와 나누어 보기 두 가지 조작으로 구성되며 q1과 q4에만 `map-hotspots` 표시 방식을 쓴다.

## 실행

```bash
node scripts/build-social-quiz.mjs _social_lessons/socialmon-6-2-u1-g04-world-climate-map
```

지도 crop과 출처는 `SOURCE_LEDGER.md`, 학생 문구 점검은 `HUMANIZER_QA.md`, 최종 브라우저 기록은 `REPORT.md`에서 확인한다.

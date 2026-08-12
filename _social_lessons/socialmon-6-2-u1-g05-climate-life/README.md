# 소셜몬 열대·건조 기후 생활

6학년 2학기 사회 1단원 9차시를 위한 5~7분 퀴즈다. 학생은 열대·건조 기후의 기온과 비를 살펴보고, 그 환경에 맞게 달라진 집·옷·농사·일을 찾는다.

공용 `socialmon-quiz-lite-v1` 엔진, `socialmon-quiz-lite-profile-v2`, `socialmon-quiz-lite-contract-v3`을 사용한다. 정확히 6문제이며 `source-choice` 3개, `choice` 1개, `match` 2개다. 학생 조작은 고르기와 이어 보기 두 종류이고 지도 위치 버튼은 없다.

## 실행

```bash
node scripts/build-social-quiz.mjs _social_lessons/socialmon-6-2-u1-g05-climate-life
```

출처는 `SOURCE_LEDGER.md`, 학생 문구 점검은 `HUMANIZER_QA.md`, 최종 브라우저 기록은 `REPORT.md`에서 확인한다.

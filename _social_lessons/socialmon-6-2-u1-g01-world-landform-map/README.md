# 소셜몬 세계 지형 한눈에

6학년 2학기 사회 1단원 1~2차시를 묶은 5~7분 소셜몬 퀴즈다. 학생은 세계 지도에서 사하라 사막과 황허강의 위치를 누르고, 사진과 글을 통해 여러 지형의 생김새와 생활의 관계를 살펴본다.

공용 `socialmon-quiz-lite-v1` 엔진, `socialmon-quiz-lite-profile-v2`, `socialmon-quiz-lite-contract-v3`을 사용한다. 문항은 6개이며 학생 조작은 고르기·나누어 보기·이어 보기 세 가지다. q1과 q5에만 `map-hotspots` 표시 방식을 사용한다.

## 실행

루트에서 다음 명령으로 배포본을 만든다.

```bash
node scripts/build-social-quiz.mjs _social_lessons/socialmon-6-2-u1-g01-world-landform-map
```

지도서 자료와 PDF 해시는 `SOURCE_LEDGER.md`, 학생 문구 점검은 `HUMANIZER_QA.md`, 최종 브라우저 기록은 `REPORT.md`에서 확인한다.

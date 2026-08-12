# 소셜몬 지역 알림 자료 만들기

4학년 2학기 2단원 10~13차시를 잇는 6문제 사회 퀴즈다. 학생은 보령 누리집과 통영 소식지를 직접 살펴보고, 지역 자랑거리와 소개 자료를 연결한 뒤 믿을 수 있는 소개 글을 고른다.

## 제품 구성

- 프로필: `socialmon-quiz-lite-profile-v2`
- 계약: `socialmon-quiz-lite-contract-v3`
- 조작: 고르기·이어 보기·순서 놓기 3종
- 문항: `source-choice` 2개, `match` 2개, `sequence` 1개, `situation-choice` 1개
- 화면: `cover`·`tutorial`·`play`·`result` 4개
- 보상: 기존 승인 소셜몬 1종과 흔적 6개

## 근거와 이미지

`SOURCE_LEDGER.md`에 지도서 PDF 쪽수, 인쇄 쪽수, 교과서 쪽수, 이미지 범위와 대체 텍스트를 기록했다. `assets/source-*.webp`는 PDF 원본을 읽기 좋은 범위로 잘라 만든 사실 자료다. `assets/option-*.webp` 8장은 생성형 장식 그림으로 선택지의 뜻만 돕고 정답 근거로 쓰지 않는다.

표지 문구는 생성형 투명 래스터 `assets/cover-copy-v1-generated.webp`를 사용하고, 생성 원본 `assets/cover-copy-v1-source.png`를 함께 보관한다.

## 실행·검증

```sh
node scripts/build-social-quiz.mjs socialmon-4-2-u2-g09-local-introduction
node scripts/check-social-quiz.mjs socialmon-4-2-u2-g09-local-introduction
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u2-g09-local-introduction
SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-4-2-u2-g09-local-introduction/quiz.json"]' node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u2-g09-local-introduction
```

최신 결과와 지문은 `REPORT.md`, 브라우저 증거는 `screenshots/qa-report.json`과 같은 폴더의 PNG에서 확인한다.

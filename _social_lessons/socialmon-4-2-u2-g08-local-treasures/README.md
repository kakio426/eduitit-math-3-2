# 소셜몬 우리 지역 보물 찾기

4학년 2학기 2단원 8~9차시를 잇는 6문제 사회 퀴즈다. 학생은 지도서의 생산물과 축제 자료를 살펴보고, 지역의 자랑거리를 종류별로 나눈 뒤 사진과 글을 알맞게 잇는다.

## 제품 구성

- 프로필: `socialmon-quiz-lite-profile-v2`
- 계약: `socialmon-quiz-lite-contract-v3`
- 조작: 고르기·나누어 보기·이어 보기 3종
- 문항: `source-choice` 2개, `choice` 1개, `classify` 1개, `match` 1개, `situation-choice` 1개
- 화면: `cover`·`tutorial`·`play`·`result` 4개
- 보상: 승인된 discovery pack의 소셜몬 1종과 흔적 6개

## 근거와 이미지

`SOURCE_LEDGER.md`에 PDF 쪽수, 지도서 인쇄 쪽수, 교과서 쪽수, crop 범위와 대체 텍스트를 기록했다. `assets/source-*.webp`는 출판사 PDF에서 자른 사실 자료다. 두 자료형 문항의 `option-*.webp`는 생성형 장식 그림으로, 선택지 글의 뜻을 돕지만 정답 근거가 아니다.

표지에는 생성형 투명 래스터 `assets/cover-copy-v1-generated.webp`를 쓰고 생성 원본 `assets/cover-copy-v1-source.png`도 함께 보관한다. 공용 화면·배경과 승인된 소셜몬은 기존 경로를 그대로 참조한다.

## 실행·검증

```sh
node scripts/build-social-quiz.mjs socialmon-4-2-u2-g08-local-treasures
node scripts/check-social-quiz.mjs socialmon-4-2-u2-g08-local-treasures
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u2-g08-local-treasures
SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-4-2-u2-g08-local-treasures/quiz.json"]' node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u2-g08-local-treasures
```

최신 결과는 `REPORT.md`에서, 브라우저 증거는 `screenshots/qa-report.json`과 같은 폴더의 PNG 캡처에서 확인한다.

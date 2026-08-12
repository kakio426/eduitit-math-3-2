# 소셜몬 문제 해결 길 잇기

4학년 2학기 2단원 4~7차시를 잇는 6문제 사회 퀴즈다. 학생은 주차 자료와 쓰레기 해결 방안 평가표를 살펴보고, 지역문제의 원인을 찾은 뒤 해결 방안과 실천 순서를 이어 본다.

## 제품 구성

- 프로필: `socialmon-quiz-lite-profile-v2`
- 계약: `socialmon-quiz-lite-contract-v3`
- 조작: 고르기·이어 보기·순서 놓기 3종
- 문항: `source-choice` 2개, `match` 1개, `sequence` 2개, `situation-choice` 1개
- 화면: `cover`·`tutorial`·`play`·`result` 4개
- 보상: 기존 승인 discovery pack의 소셜몬 1종과 흔적 6개

## 근거와 이미지

`SOURCE_LEDGER.md`에 지도서 PDF 쪽수, 인쇄 쪽수, 교과서 쪽수, 이미지 범위와 대체 텍스트를 기록했다. `assets/source-*.webp`는 PDF 원본을 읽기 좋은 범위로 자르고 WebP로 변환한 사실 자료다. 두 자료형 문항의 `option-*.webp`는 생성형 장식 그림으로, 선택지의 뜻을 돕지만 정답 근거가 아니다.

표지 문구는 생성형 투명 래스터 `assets/cover-copy-v1-generated.webp`를 사용하고, 생성 원본 `assets/cover-copy-v1-source.png`를 함께 보관한다.

## 실행·검증

```sh
node scripts/build-social-quiz.mjs socialmon-4-2-u2-g07-problem-solving-path
node scripts/check-social-quiz.mjs socialmon-4-2-u2-g07-problem-solving-path
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u2-g07-problem-solving-path
node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u2-g07-problem-solving-path
```

최신 실행 결과와 현재 지문은 `REPORT.md`, 브라우저 증거는 `screenshots/qa-report.json`과 같은 폴더의 PNG 캡처에서 확인한다.

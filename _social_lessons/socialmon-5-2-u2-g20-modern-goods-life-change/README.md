# 소셜몬 새 문물과 생활 변화 찾기

5학년 2학기 사회 2단원 원천 11~14차시를 바탕으로, 개항 뒤 새 문물이 들어오며
생활이 달라진 모습을 사진과 기록에서 찾는 6문제 퀴즈다.

## 실행 구성

- 학생 흐름: `cover → tutorial → play → result`
- 기준 Stage: `1280×800`, `16:10`
- 문항 틀: `source-choice` 2, `match` 2, `choice` 1, `sequence` 1
- 실제 학생 조작: 고르기·이어 보기·순서 놓기
- 보상: `socialmon-trace-reveal-v1` (문항마다 흔적 1개, 2·4문제 뒤 힌트, 마지막 소셜몬 공개)
- 정답 수는 따로 세며 점수·감점·등급·서버 전송은 없다.

## 근거 자료

원자료는 `~/Downloads/5_2_사회_2_지도서.pdf`다. SHA-256은
`cfa9afd5c46c9b871aafdf771615580946d16e3f5730b4b3ed03f204135777d9`이며, PDF
75~96쪽(인쇄 230~251쪽)을 모두 렌더링해 확인했다. 문항별 사실·학생 판단과 이미지
범위는 [`SOURCE_LEDGER.md`](SOURCE_LEDGER.md)에 기록했다.

## 이미지 자산

- `source-western-life-v1-source.png/.webp`: PDF 76쪽 생활 사진 crop. q1 자료.
- `source-newspaper-ad-v1-source.png/.webp`: PDF 78쪽 독립신문 광고 crop. q3 자료.
- q1·q3의 네 선택지는 지도서 crop과 alt를 사용한다.
- `cover-copy-v1-source.png`·`cover-copy-v1-generated.webp`: imagegen 생성 원본과 실행본. 표지 제목·목표에만 쓰며 정답 근거가 아니다.

공용 방법 포스터, 문제 배경, 브랜드 마크, 시작 버튼, 결과 소셜몬은 profile-v2와
기존 `socialmon-5-2-late-joseon-modern-v1` 팩의 승인 자산을 참조한다.

## 빌드 및 QA

```bash
node scripts/build-social-quiz.mjs socialmon-5-2-u2-g20-modern-goods-life-change
node scripts/check-social-quiz.mjs socialmon-5-2-u2-g20-modern-goods-life-change
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u2-g20-modern-goods-life-change
```

정적 빌드·검사는 통과시킨다. 전체 흐름 브라우저 QA와 `REPORT.md`는 공용 동결 뒤
현재 지문으로 새로 만든다. 이 작업에서는 커밋하지 않는다.

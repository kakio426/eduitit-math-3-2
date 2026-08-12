# 소셜몬 세종과 조선의 변화 잇기

5학년 2학기 사회 2단원 6차시를 바탕으로, 농사직설·과학 기구·훈민정음이 생활에
준 도움을 이어 보는 6문제 퀴즈다.

## 실행 구성

- 학생 흐름: `cover → tutorial → play → result`
- 기준 Stage: `1280×800`, `16:10`
- 문항 틀: `source-choice` 2, `match` 2, `choice` 1, `sequence` 1
- 실제 학생 조작: 고르기·이어 보기·순서 놓기
- 보상: `socialmon-trace-reveal-v1` (문항마다 흔적 1개, 2·4문제 뒤 힌트, 마지막 소셜몬 공개)
- 정답 수는 따로 세며 점수·감점·등급·서버 전송은 없다.

## 근거 자료

원자료는 `~/Downloads/5_2_사회_2_지도서.pdf`다. SHA-256은
`cfa9afd5c46c9b871aafdf771615580946d16e3f5730b4b3ed03f204135777d9`이며, PDF 34~40쪽을
텍스트와 렌더링으로 대조했다. 문항별 사실·추론 구분과 이미지 범위는
[`SOURCE_LEDGER.md`](SOURCE_LEDGER.md)에 기록했다.

## 이미지 자산

- `source-nongsajikseol-v1-source.png/.webp`: PDF 34쪽 농사직설 자료 crop. q1 자료.
- `source-hunminjeongeum-v1-source.png/.webp`: PDF 36쪽 훈민정음 자료 crop. q3 자료.
- q1·q3의 네 선택지는 지도서 자료 crop을 사용하고, 각 선택지에 alt를 둔다.
- `cover-copy-v1-source.png`·`cover-copy-v1-generated.webp`: 표지 제목 생성 원본과 투명 실행본. 사실 근거가 아니다.

공용 방법 포스터, 문제 배경, 브랜드 마크, 시작 버튼, 결과 소셜몬은 profile-v2가
지정한 승인 자산을 참조한다.

## 빌드 및 QA

```bash
node scripts/build-social-quiz.mjs socialmon-5-2-u2-g09-sejong-joseon-change
node scripts/check-social-quiz.mjs socialmon-5-2-u2-g09-sejong-joseon-change
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u2-g09-sejong-joseon-change
```

최신 실행 증거는 [`screenshots/qa-report.json`](screenshots/qa-report.json)과
[`REPORT.md`](REPORT.md)에 기록한다. 이 작업에서는 커밋하지 않는다.

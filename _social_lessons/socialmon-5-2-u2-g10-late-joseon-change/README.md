# 소셜몬 조선 후기 변화 찾기

5학년 2학기 사회 2단원 8~9차시를 바탕으로, 농업·상업·신분·새 문물의 단서를
살펴보는 6문제 퀴즈다.

## 실행 구성

- 학생 흐름: `cover → tutorial → play → result`
- 기준 Stage: `1280×800`, `16:10`
- 문항 틀: `source-choice` 2, `match` 2, `classify` 1, `choice` 1
- 실제 학생 조작: 고르기·이어 보기·나누어 보기
- 보상: `socialmon-trace-reveal-v1` (문항마다 흔적 1개, 2·4문제 뒤 힌트, 마지막 소셜몬 공개)
- 정답 수는 따로 세며 점수·감점·등급·서버 전송은 없다.

## 근거 자료

원자료는 `~/Downloads/5_2_사회_2_지도서.pdf`다. 파일 SHA-256은
`cfa9afd5c46c9b871aafdf771615580946d16e3f5730b4b3ed03f204135777d9`이며,
PDF 54·55·60·61쪽을 텍스트와 300 dpi 렌더링으로 대조했다. 문항별 사실·추론
구분, 직접 확인한 문장, 이미지 crop 범위는 [`SOURCE_LEDGER.md`](SOURCE_LEDGER.md)에
기록했다.

## 이미지 자산

- `source-monaegi-v1-source.png/.webp`: PDF 54쪽 모내기 그림. q1 자료.
- `source-sangpyeongtongbo-v1-source.png/.webp`: PDF 55쪽 상평통보 자료. 경제 변화 선택지에 사용.
- `source-western-goods-v1.webp`: PDF 61쪽 자명종·천리경 자료. q4 자료.
- `option-*-v1-source.png/.webp`: PDF 54·55·61쪽에서 자른 4개 선택지 세트. q1·q4의 모든 선택지에 이미지·대체 텍스트·출처를 둔다. `option-telescope-v1`은 PDF 61쪽에서 다시 잘라 검은 세로 띠를 없앴다.
- `cover-copy-v1-source.png`·`cover-copy-v1-generated.png/.webp`: 시리즈명·제목·목표를 한 덩어리로 담은 생성형 표지 원본과 투명 실행본. 사실 근거가 아니다.

## 빌드 및 QA

```bash
node scripts/build-social-quiz.mjs socialmon-5-2-u2-g10-late-joseon-change
node scripts/check-social-quiz.mjs socialmon-5-2-u2-g10-late-joseon-change
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u2-g10-late-joseon-change
```

현재 빌드 뒤 전체 브라우저 증거와 [`REPORT.md`](REPORT.md)는 배정된 후속 작업에서
새 지문으로 다시 만든다. 마지막에는 시리즈와 차시를 함께 지정한 소셜몬 전달
게이트를 실행한다.

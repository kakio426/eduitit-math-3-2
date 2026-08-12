# 소셜몬 선사 생활 단서 찾기

5학년 2학기 사회 1단원 2~3차시를 바탕으로, 유물과 생활 그림에서 확인한 단서와
그 단서로 짐작한 생활 모습을 구분하는 6문제 퀴즈다.

## 실행 구성

- 학생 흐름: `cover → tutorial → play → result`
- 기준 Stage: `1280×800`, `16:10`
- 문항 틀: `source-choice` 2, `classify` 2, `choice` 1, `sequence` 1
- 실제 학생 조작: 고르기·나누어 보기·순서 놓기
- 보상: `socialmon-trace-reveal-v1` (문항마다 흔적 1개, 2·4문제 뒤 힌트, 마지막 소셜몬 공개)
- 정답 수는 따로 세며 점수·감점·등급·도감·서버 전송은 없다.

## 근거 자료

원자료는 `~/Downloads/5_2_사회_1_지도서.pdf`다. 파일 SHA-256은
`36937a3bbdca94bd47f2f6b02c934759f1933077a3b9ad3d8c7a99fa9f0d4fcb`이며, PDF 16·22·25·26쪽을 텍스트와 렌더링으로 대조했다. PDF 쪽과 인쇄 쪽 대응은
`인쇄 쪽 = PDF 쪽 + 15`다. 문항별 사실·추론 구분과 이미지 사용 범위는
[`SOURCE_LEDGER.md`](SOURCE_LEDGER.md)에 기록했다.

## 이미지 자산

- `source-paleolithic-life-v1-source.png/.webp`: PDF 16쪽 구석기 생활 그림. q1 자료.
- `source-neolithic-fishing-tools-v1-source.png/.webp`: PDF 25쪽 물고기잡이 도구 활동지. q3 자료.
- `option-*-v1-source.png/.webp`: 위 지도서 그림에서 자른 4개 선택지 이미지 세트. q1·q3의 선택지 모두 이미지와 대체 텍스트를 갖는다.
- `cover-copy-v1-source.png/.webp`: 표지 문구 생성 원본과 투명 실행본. 분위기·제목에만 쓰며 역사적 사실 근거가 아니다.

공용 방법 포스터, 문제 배경, 브랜드 마크, 시작 버튼, 결과 소셜몬은 profile-v2가
지정한 승인 자산을 그대로 참조한다.

## 빌드 및 QA

```bash
node scripts/build-social-quiz.mjs socialmon-5-2-u1-g01-prehistory-clues
node scripts/check-social-quiz.mjs socialmon-5-2-u1-g01-prehistory-clues
python3 -m http.server 4173
node scripts/qa-social-quiz.mjs socialmon-5-2-u1-g01-prehistory-clues
```

최신 실행 증거는 [`screenshots/qa-report.json`](screenshots/qa-report.json)과
[`REPORT.md`](REPORT.md)에 기록한다. 커밋하지 않는 작업이며, 마지막에는 시리즈와
차시를 함께 지정한 소셜몬 전달 게이트를 실행한다.

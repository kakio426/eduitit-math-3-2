# 소셜몬 광복과 새 나라의 시작

5학년 2학기 사회 3단원 8~9차시를 바탕으로, 광복 뒤 달라진 학교와 생활 모습,
5·10 총선거와 대한민국 정부 수립 과정을 살펴보는 6문제 퀴즈다.

## 실행 구성

- 학생 흐름: `cover → tutorial → play → result`
- 기준 Stage: `1280×800`, `16:10`
- 문항 틀: `source-choice` 2, `match` 2, `classify` 1, `choice` 1
- 실제 학생 조작: 고르기·이어 보기·나누어 보기
- 보상: `socialmon-trace-reveal-v1`
- 테마팩: 기존 `socialmon-5-2-liberation-war-v1`

피란·천막 학교·밀면·전쟁 피해·이산가족·평화 내용은 g21로 옮겼다. 이 차시의
학생 화면과 문항 근거에는 광복·정부 수립 내용만 남는다.

## 사실 자료와 표지

q1·q3의 자료와 네 선택지 이미지는 `5_2_사회_3_지도서.pdf` PDF 59·61·62·63쪽
(인쇄 310·312·313·314쪽)의 300 dpi 렌더링에서 잘랐다. 생성 이미지는 표지
제목·목표에만 쓰며 사실 근거로 쓰지 않는다. 자산별 크롭과 판단 근거는
[`SOURCE_LEDGER.md`](SOURCE_LEDGER.md)에 기록했다.

표지는 imagegen built-in 생성 원본 `title-poster-source.png`와 녹색을 제거한
`title-poster-alpha.png`, 실행 WebP `title-poster-generated.webp`를 보관한다.

## 빌드와 후속 QA

```bash
node scripts/build-social-quiz.mjs socialmon-5-2-u3-g16-liberation-war-life
node scripts/check-social-quiz.mjs socialmon-5-2-u3-g16-liberation-war-life
```

기존 screenshots·REPORT는 분리 전 지문이므로 증거로 재사용하지 않는다. 배정된
후속 작업에서 전체 흐름을 다시 캡처하고 REPORT를 갱신한다.

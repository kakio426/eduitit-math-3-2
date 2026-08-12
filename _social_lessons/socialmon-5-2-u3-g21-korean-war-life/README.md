# 소셜몬 전쟁 속 생활과 평화

5학년 2학기 사회 3단원 10~14차시를 바탕으로, 6·25 전쟁의 흐름과 전쟁
중·뒤에 달라진 생활을 사진과 기록으로 살펴보는 6문제 퀴즈다.

## 실행 구성

- 학생 흐름: `cover → tutorial → play → result`
- 기준 Stage: `1280×800`, `16:10`
- 문항 틀: `source-choice` 2, `match` 2, `classify` 1, `choice` 1
- 실제 학생 조작: 고르기·이어 보기·나누어 보기
- 보상: `socialmon-trace-reveal-v1`
- 테마팩: 기존 `socialmon-5-2-liberation-war-v1`

전쟁은 캐릭터 승부나 점수로 다루지 않는다. 정답 수와 소셜몬 발견만 보여 주며,
감점·등급·희귀 대박·문제별 상자는 없다.

## 근거와 이미지

원자료는 `~/Downloads/5_2_사회_3_지도서.pdf`이며 SHA-256은
`bffc72e13f62212554b35ab0299edd78c48e1957db99acf6bd83cc4ccd3cfa78`이다.
PDF 69~96쪽(인쇄 320~347쪽, 원천 10~14차시)을 확인했고, q1·q4의 자료와
네 선택지 모두 실제 지도서 crop·대체 텍스트·출처를 갖는다. 자세한 사실·추론
구분은 [`SOURCE_LEDGER.md`](SOURCE_LEDGER.md)에 기록했다.

- `source-refugees-v1-*`: q1 피란길 자료
- `source-milmyun-v1-*`: q4 밀면 자료
- `source-temporary-school-v1-*`, `source-family-reunion-v1-*`: 천막 학교·이산가족 자료
- `option-*-v1-*`: q1·q4의 지도서 선택지 그림
- `title-poster-source.png`: imagegen built-in 생성 원본
- `title-poster-alpha.png`, `title-poster-generated.webp`: 녹색 제거 투명 실행본

## 빌드와 QA

```bash
node scripts/build-social-quiz.mjs socialmon-5-2-u3-g21-korean-war-life
node scripts/check-social-quiz.mjs socialmon-5-2-u3-g21-korean-war-life
```

현재 빌드로 전체 브라우저 QA를 다시 실행했다. PC·태블릿을 포함한 4 viewport,
120개 상태 감사와 120개 스크린샷에서 넘침·Stage 이탈·겹침·작은 조작부·브라우저
오류가 모두 0건이었다. 현재 영수증은 `screenshots/qa-report.json`, 빌드·정책·
하네스 지문과 결과는 `REPORT.md`에 기록했다.

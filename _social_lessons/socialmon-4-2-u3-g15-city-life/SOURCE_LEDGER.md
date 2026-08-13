# SOURCE LEDGER — socialmon-4-2-u3-g15-city-life

## 원자료

| 자료 | 확인 방법 | 이 게임에서 사용한 근거 |
| --- | --- | --- |
| `/Users/yubyeongju/Downloads/4_2_사회_3_지도서.pdf` | `pdfinfo` 확인: 92쪽, 637.795×822.047pt | 69~84쪽 렌더링(`pdftoppm -r 120`, 69~84)과 텍스트 추출(`pdftotext -layout`)을 함께 대조 |
| `_social_sources/4-2/source-catalog.json` | 지도서 SHA-256 `a3178feb73d5d7386053b0983408f75ed9e7f5bffce2228984d74067ef1e364c` | PDF 파일 식별용 기록 |

## 페이지 대조

| PDF 쪽 | 인쇄 쪽/교과서 쪽 | 대조한 내용 | 사용 문항 |
| ---: | ---: | --- | --- |
| 69~70 | 258~259 / 136~137 | 도시의 아파트·주택, 도로·지하철, 회사·공장, 공원·문화 시설과 도시 생활 모습 | q1, q3 |
| 71~80 | 260~269 | 도시의 인구·교통·산업 특징과 단원 학습 흐름 | 문항 배열·목표 확인 |
| 81 | 270 / 140 | 빠르고 편리한 교통, 다양한 일자리, 학교·문화 시설 같은 도시 생활의 좋은 점 | q2, q5 |
| 82 | 271 / 141 | 비싼 주택·좁고 오래된 집, 쓰레기 증가, 교통 혼잡·주차 부족, 공기·물·토양 오염 등 문제 | q2, q5 |
| 83 | 272 / 142 | 바람길 숲으로 공기 오염을 줄이는 기사, 생활 쓰레기 줄이기와 재활용 활동 기사 | q4 |
| 84 | 273 | 걷거나 뛰면서 쓰레기를 줍는 활동을 도시 환경을 지키는 생활 속 실천으로 소개 | q6 |

## 사실 자료 자산

- `assets/source-city-life-v1-source.png` → `source-city-life-v1.webp`: PDF 69쪽 오른쪽 교과서 자료를 1080×1260으로 crop했다. q1의 factual source image이며 생성형 이미지가 아니다.
- `assets/source-city-solutions-v1-source.png` → `source-city-solutions-v1.webp`: PDF 83쪽 오른쪽 교과서 자료를 1080×1405로 crop했다. q4의 factual source image이며 생성형 이미지가 아니다.
- crop 원본은 WebP와 같은 내용을 보존한다. 실제 실행본은 WebP를 사용하고, PNG는 재현·검수용 원본이다.

## 생성형 자산 경계

- `cover-copy-v1-source.png` / `cover-copy-v1-generated.webp`: GPT Image로 만든 투명 표지 문구 아트. 정답·사실 근거가 아니다.
- q1·q4의 선택지 8장(`option-*-v1-source.png` + `option-*.webp`): GPT Image로 만든 1254×1254 장식 그림. 모든 선택지의 텍스트가 정답 근거이며 그림은 장식·빠른 인식을 돕는 용도뿐이다.
- 자료 제목·본문은 정답 선택지 문장을 그대로 말하지 않도록 작성했으며, 자료 출처는 카드 밖의 고대비 크레딧 한 번으로 표시한다.

## 원고와 교과서 대조 메모

`_social_lessons/series/4-2/drafts/g15-city-life/PLAN.md`, `QUESTION_DRAFT.md`, `SOURCE_LEDGER.md`의 6문제 구성을 실행 원고로 삼되, q1의 자료·선택지 표현과 q4의 기사 자료 설명은 위 PDF crop을 직접 확인해 확정했다. 도시 생활의 편리함만 강조하지 않고 q2에서 좋은 점과 문제점을 나누고, q5에서 집을 고를 때 두 면을 함께 살피며, q4·q6에서 해결 노력을 판단하도록 했다.

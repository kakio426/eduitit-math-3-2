# 출처 원장 - 소셜몬 세계 인구 지도

## 원자료

- 파일: `/Users/yubyeongju/Downloads/6_2_사회_3_지도서.pdf`
- SHA-256: `ff9e47406a829468cefe527d5ca535bb490b457719b9424ec5197041ef5cc8ba`
- 사용 범위: PDF 14~17쪽(인쇄 273~276쪽), 보충 확인 PDF 20~21쪽(인쇄 279~280쪽)
- 출처 정책: 출판사 지도서에서 렌더링한 자료 crop만 사실 판단에 사용한다. 생성 이미지는 표지 문구와 보기 장식에만 사용한다.

## 문항 근거

| 문항 | PDF / 인쇄 / 교과서 | 근거 요약 | 실행 자료 |
|---|---|---|---|
| q1 | 14 / 273 / 118 | 비옥한 평야, 충분한 강수량과 물, 산업·교통이 인구 분포에 영향을 줌 | `assets/source-g14-climate-v1.webp` |
| q2 | 15 / 274 / 119 | 점이 많이 모인 남부 아시아의 위치를 지도에서 확인 | `assets/source-population-map-board-v2.webp` |
| q3 | 14 / 273 / 118 | 기온·강수량·지형은 자연환경, 산업·교통은 인문환경 | 텍스트 문항 |
| q4 | 15 / 274 / 119 | 건조한 사하라가 있는 북부 아프리카의 위치와 희박한 인구 확인 | `assets/source-population-map-board-v2.webp` |
| q5 | 16 / 275 / 120 | 남부 아시아의 농업, 서부 유럽의 산업·교통, 극지방의 낮은 기온 | 텍스트 문항 |
| q6 | 17 / 276 / 121 | 1950년과 2023년 대륙별 인구 비율 비교에서 아프리카 증가 | `assets/source-g14-population-v1.webp` |

q2와 q4는 승인된 `socialmon-source-choice-map-hotspots-v1` 문항이다. 출판사 PDF 15쪽을 800dpi로 렌더링한 뒤 지도 영역을 정확한 `150:62` 비율로 잘라 3000×1240 보드를 만들었다. q2·q4는 같은 지도와 네 위치 버튼을 사용하며, 좌표는 남부 아시아 `(57, 79)`, 북부 아프리카 `(25.5, 80)`, 서부 유럽 `(24.5, 54)`, 동아시아 `(71.5, 64)`이다. 정답을 알려 주는 결론은 자료 제목·본문에 넣지 않았다.

## 자산 기록

- `source-*-source.png`: PDF 300dpi 렌더링 crop 원본
- `source-*.webp`: 실행용 WebP 변환본
- `population-map-board-v2-source.png`: PDF 15쪽 800dpi 렌더에서 자른 3000×1240 원본, SHA-256 `266c1459178ecbe444fb8cb7d86572306e35d4fee9ca656c491e8c141b6dc492`
- `source-population-map-board-v2.webp`: 3000×1240 실행 지도, SHA-256 `dabce05dca14a4099c27b19dbc51954b703ca4aa442556d8eb04c51ebbca05b2`
- `cover-copy-v1-source.png` / `cover-copy-v1-generated.webp`: imagegen으로 만든 투명 표지 문구 원본·실행본. 사실 근거 아님.
- q6의 대륙 선택지는 `assets/option-continent-*-v1.webp` 네 장으로 구분하며, 생성 그림은 대륙 이름을 찾기 위한 장식이다.

<!-- AUTO OPTION SOURCES START -->

## 선택지 그림·지도 버튼 근거

아래 경로는 `quiz.json`과 배포 HTML이 실제로 읽는 실행 자산이다. 파일명이 `-source`로 끝나는 제작 원본은 공개 실행 경로에 쓰지 않는다.

| 문항·선택지 | 실행 자산 | 출처 PDF / 인쇄 | 그림과 문장의 관계 |
|---|---|---|---|
| q1 · coast-harbor | `../../_shared/socialmon/theme-packs/6-2/u1/options/choice-coast-v1.webp` | 6_2_사회_1_지도서.pdf 35/50쪽 | 선택지 그림과 문장은 '해안에 배와 등대가 있어요.'라는 같은 모습을 함께 보여 준다. |
| q1 · polar-cold | `../../_shared/socialmon/theme-packs/6-2/u1/options/choice-polar-v1.webp` | 6_2_사회_1_지도서.pdf 80/95쪽 | 선택지 그림과 문장은 '눈과 얼음이 펼쳐져요.'라는 같은 모습을 함께 보여 준다. |
| q1 · plain-water | `../../_shared/socialmon/theme-packs/6-2/u1/options/choice-mountain-v1.webp` | 6_2_사회_1_지도서.pdf 20/35쪽 | 선택지 그림과 문장은 '강과 논을 이용해 농사지어요.'라는 같은 모습을 함께 보여 준다. |
| q1 · rainforest-dense | `../../_shared/socialmon/theme-packs/6-2/u1/options/choice-tropical-v1.webp` | 6_2_사회_1_지도서.pdf 66/81쪽 | 선택지 그림과 문장은 '비 내리는 숲과 높은 집이에요.'라는 같은 모습을 함께 보여 준다. |
| q2 · south-asia | 지도 버튼(자료: `assets/source-population-map-board-v2.webp`) | 6_2_사회_3_지도서.pdf 15/274쪽 | 지도에는 남부 아시아의 위치를 고를 수 있는 표시가 있다. |
| q2 · north-africa | 지도 버튼(자료: `assets/source-population-map-board-v2.webp`) | 6_2_사회_3_지도서.pdf 15/274쪽 | 지도에는 북부 아프리카의 위치를 고를 수 있는 표시가 있다. |
| q2 · west-europe | 지도 버튼(자료: `assets/source-population-map-board-v2.webp`) | 6_2_사회_3_지도서.pdf 15/274쪽 | 지도에는 서부 유럽의 위치를 고를 수 있는 표시가 있다. |
| q2 · east-asia | 지도 버튼(자료: `assets/source-population-map-board-v2.webp`) | 6_2_사회_3_지도서.pdf 15/274쪽 | 지도에는 동아시아의 위치를 고를 수 있는 표시가 있다. |
| q4 · south-asia | 지도 버튼(자료: `assets/source-population-map-board-v2.webp`) | 6_2_사회_3_지도서.pdf 15/274쪽 | 지도에는 남부 아시아의 위치를 고를 수 있는 표시가 있다. |
| q4 · north-africa | 지도 버튼(자료: `assets/source-population-map-board-v2.webp`) | 6_2_사회_3_지도서.pdf 15/274쪽 | 지도에는 북부 아프리카의 위치를 고를 수 있는 표시가 있다. |
| q4 · west-europe | 지도 버튼(자료: `assets/source-population-map-board-v2.webp`) | 6_2_사회_3_지도서.pdf 15/274쪽 | 지도에는 서부 유럽의 위치를 고를 수 있는 표시가 있다. |
| q4 · east-asia | 지도 버튼(자료: `assets/source-population-map-board-v2.webp`) | 6_2_사회_3_지도서.pdf 15/274쪽 | 지도에는 동아시아의 위치를 고를 수 있는 표시가 있다. |
| q6 · africa | `assets/option-continent-africa-v1.webp` | 6_2_사회_3_지도서.pdf 17/276쪽 | 선택지 그림과 문장은 '아프리카'라는 같은 모습을 함께 보여 준다. |
| q6 · europe | `assets/option-continent-europe-v1.webp` | 6_2_사회_3_지도서.pdf 17/276쪽 | 선택지 그림과 문장은 '유럽'라는 같은 모습을 함께 보여 준다. |
| q6 · north-america | `assets/option-continent-north-america-v1.webp` | 6_2_사회_3_지도서.pdf 17/276쪽 | 선택지 그림과 문장은 '북아메리카'라는 같은 모습을 함께 보여 준다. |
| q6 · asia | `assets/option-continent-asia-v1.webp` | 6_2_사회_3_지도서.pdf 17/276쪽 | 선택지 그림과 문장은 '아시아'라는 같은 모습을 함께 보여 준다. |

<!-- AUTO OPTION SOURCES END -->

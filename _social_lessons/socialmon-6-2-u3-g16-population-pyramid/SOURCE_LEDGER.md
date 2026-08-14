# 출처 원장 - 소셜몬 인구 피라미드

## 원자료

- 파일: `/Users/yubyeongju/Downloads/6_2_사회_3_지도서.pdf`
- SHA-256: `ff9e47406a829468cefe527d5ca535bb490b457719b9424ec5197041ef5cc8ba`
- 사용 범위: PDF 36~40쪽(인쇄 295~299쪽), 교과서 135~139쪽에 해당하는 활동 자료
- 출처 정책: 출판사 지도서에서 렌더링한 자료 crop만 사실 판단에 사용한다. 생성 이미지는 표지 문구와 보기 장식에만 사용한다.

## 문항 근거

| 문항 | PDF / 인쇄 / 교과서 | 근거 요약 | 실행 자료 |
|---|---|---|---|
| q1 | 36 / 295 / 135 | 1960~2020년 유소년층 감소와 노년층 증가 | `assets/source-g16-age-graph-v1.webp` |
| q2 | 36 / 295 / 135 | 인구 구조는 연령·성별을 기준으로 한 인구 구성 | 텍스트 문항 |
| q3 | 37 / 296 / 136 | 나이지리아의 유소년층 비율이 높고 일본의 노년층 비율이 높음 | `assets/source-g16-pyramid-v1.webp` |
| q4 | 37 / 296 / 136 | 두 나라의 출생률·사망률·평균 수명 차이 | 텍스트 분류 |
| q5 | 38 / 297 / 137 | 인도네시아 0~14세 25%, 15~64세 68%, 65세 이상 7% | `assets/source-g16-indonesia-v1.webp` |
| q6 | 37 / 296 / 136 | 인구 피라미드로 연령별·성별 인구 구성을 비교 | 텍스트 문항 |

숫자와 나라 이름은 지도서 자료에 있는 값을 그대로 옮겼다. source title/text는 자료에서 관찰할 수 있는 형식만 설명해 정답 선택지를 먼저 말하지 않도록 했다.

## 자산 기록

- `source-*-source.png`: PDF 300dpi 렌더링 crop 원본
- `source-*.webp`: 실행용 WebP 변환본
- `cover-copy-v1-source.png` / `cover-copy-v1-generated.webp`: imagegen으로 만든 투명 표지 문구 원본·실행본. 사실 근거 아님.
- q1·q3·q5의 선택지는 `assets/option-age-*-v1.webp`로 구분한다. 생성 막대 카드는 문장의 연령 구조를 시각화하는 장식이며, 비율 판단의 근거는 출판사 그래프다. `map-hotspots`는 사용하지 않는다.

<!-- AUTO OPTION SOURCES START -->

## 선택지 그림·지도 버튼 근거

아래 경로는 `quiz.json`과 배포 HTML이 실제로 읽는 실행 자산이다. 파일명이 `-source`로 끝나는 제작 원본은 공개 실행 경로에 쓰지 않는다.

| 문항·선택지 | 실행 자산 | 출처 PDF / 인쇄 | 그림과 문장의 관계 |
|---|---|---|---|
| q1 · youth-down-old-up | `assets/option-age-aging-v1.webp` | 6_2_사회_3_지도서.pdf 36/295쪽 | 선택지 그림과 문장은 '유소년층은 줄고 노년층은 늘었어요.'라는 같은 모습을 함께 보여 준다. |
| q1 · youth-up-old-down | `assets/option-age-youth-v1.webp` | 6_2_사회_3_지도서.pdf 36/295쪽 | 선택지 그림과 문장은 '유소년층은 늘고 노년층은 줄었어요.'라는 같은 모습을 함께 보여 준다. |
| q1 · both-up | `assets/option-age-working-v1.webp` | 6_2_사회_3_지도서.pdf 36/295쪽 | 선택지 그림과 문장은 '15~64세 층만 크게 늘었어요.'라는 같은 모습을 함께 보여 준다. |
| q1 · both-down | `assets/option-age-balanced-v1.webp` | 6_2_사회_3_지도서.pdf 36/295쪽 | 선택지 그림과 문장은 '세 연령층의 비율이 비슷해졌어요.'라는 같은 모습을 함께 보여 준다. |
| q3 · nigeria | `assets/option-age-youth-v1.webp` | 6_2_사회_3_지도서.pdf 37/296쪽 | 선택지 그림과 문장은 '나이지리아'라는 같은 모습을 함께 보여 준다. |
| q3 · japan | `assets/option-age-aging-v1.webp` | 6_2_사회_3_지도서.pdf 37/296쪽 | 선택지 그림과 문장은 '일본'라는 같은 모습을 함께 보여 준다. |
| q3 · same | `assets/option-age-balanced-v1.webp` | 6_2_사회_3_지도서.pdf 37/296쪽 | 선택지 그림과 문장은 '두 나라가 같아요.'라는 같은 모습을 함께 보여 준다. |
| q3 · unknown | `assets/option-age-unknown-v1.webp` | 6_2_사회_3_지도서.pdf 37/296쪽 | 선택지 그림과 문장은 '자료만으로 알 수 없어요.'라는 같은 모습을 함께 보여 준다. |
| q5 · young | `assets/option-age-youth-v1.webp` | 6_2_사회_3_지도서.pdf 38/297쪽 | 선택지 그림과 문장은 '0~14세'라는 같은 모습을 함께 보여 준다. |
| q5 · older | `assets/option-age-aging-v1.webp` | 6_2_사회_3_지도서.pdf 38/297쪽 | 선택지 그림과 문장은 '65세 이상'라는 같은 모습을 함께 보여 준다. |
| q5 · no-age | `assets/option-age-balanced-v1.webp` | 6_2_사회_3_지도서.pdf 38/297쪽 | 선택지 그림과 문장은 '세 연령층의 비율이 모두 같아요.'라는 같은 모습을 함께 보여 준다. |
| q5 · working | `assets/option-age-working-v1.webp` | 6_2_사회_3_지도서.pdf 38/297쪽 | 선택지 그림과 문장은 '15~64세'라는 같은 모습을 함께 보여 준다. |

<!-- AUTO OPTION SOURCES END -->

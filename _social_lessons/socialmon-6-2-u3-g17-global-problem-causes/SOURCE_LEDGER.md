# 출처 원장 - 소셜몬 지구촌 문제 원인 찾기

## 원자료

- 파일: `/Users/yubyeongju/Downloads/6_2_사회_3_지도서.pdf`
- SHA-256: `ff9e47406a829468cefe527d5ca535bb490b457719b9424ec5197041ef5cc8ba`
- 사용 범위: PDF 54~64쪽(인쇄 313~323쪽), 교과서 140~147쪽
- 출처 정책: 출판사 지도서에서 렌더링한 자료 crop만 사실 판단에 사용한다. 생성 이미지는 표지 문구와 보기 장식에만 사용한다.

## 문항 근거

| 문항 | PDF / 인쇄 / 교과서 | 근거 요약 | 실행 자료 |
|---|---|---|---|
| q1 | 54 / 313 / 140 | 열대 우림 파괴의 원인은 농사·에너지 사용·가축 사육·산업 등 인간 활동 | `assets/source-g17-rainforest-v1.webp` |
| q2 | 54·64 / 313·323 / 140·147 | 열대 우림 파괴·기후변화·산호초 파괴와 원인 연결 | 텍스트 연결 |
| q3 | 60 / 319 / 143 | 오랜 가뭄으로 물 부족과 먼 거리 물 긷기 | `assets/source-g17-drought-letter-v1.webp` |
| q4 | 55 / 314 / 141 | 지구촌 문제는 서로 영향을 줄 수 있음 | 텍스트 문항 |
| q5 | 55 / 314 / 141 | 자원 고갈·생태계 파괴·난민 문제와 원인 연결 | 텍스트 연결 |
| q6 | 64 / 323 / 147 | 온실가스가 지나치게 많으면 지구 밖으로 빠져나가는 에너지가 줄어 평균 기온이 높아짐 | `assets/source-g17-climate-effects-v1.webp` |

열대 우림, 아프리카 가뭄, 온실 효과 자료는 원문 사실을 훼손하지 않는 범위에서 crop했다. q6은 crop에 직접 보이는 두 그림의 에너지 방출 차이만 묻는다. `map-hotspots`는 사용하지 않는다.

## 자산 기록

- `source-*-source.png`: PDF 300dpi 렌더링 crop 원본
- `source-*.webp`: 실행용 WebP 변환본
- `cover-copy-v1-source.png` / `cover-copy-v1-generated.webp`: imagegen으로 만든 투명 표지 문구 원본·실행본. 사실 근거 아님.
- q3은 `assets/option-problem-*-v1.webp`, q6은 `assets/option-energy-*-v1.webp` 네 장씩을 쓴다. 생성 카드는 선택지 문장의 뜻을 돕는 장식이며, 사실 판단은 출판사 편지와 온실 효과 자료를 따른다.

<!-- AUTO OPTION SOURCES START -->

## 선택지 그림·지도 버튼 근거

아래 경로는 `quiz.json`과 배포 HTML이 실제로 읽는 실행 자산이다. 파일명이 `-source`로 끝나는 제작 원본은 공개 실행 경로에 쓰지 않는다.

| 문항·선택지 | 실행 자산 | 출처 PDF / 인쇄 | 그림과 문장의 관계 |
|---|---|---|---|
| q1 · polar-clothing | `../../_shared/socialmon/theme-packs/6-2/u1/options/choice-polar-v1.webp` | 6_2_사회_1_지도서.pdf 80/95쪽 | 선택지 그림과 문장은 '눈과 얼음 속에서 두꺼운 옷을 입어요.'라는 같은 모습을 함께 보여 준다. |
| q1 · deforestation-industry | `assets/option-deforestation-industry-v1.webp` | 6_2_사회_3_지도서.pdf 54/313쪽 | 선택지 그림과 문장은 '나무를 베고 공장을 세우는 모습이에요.'라는 같은 모습을 함께 보여 준다. |
| q1 · coastal-village | `../../_shared/socialmon/theme-packs/6-2/u1/options/choice-coast-v1.webp` | 6_2_사회_1_지도서.pdf 35/50쪽 | 선택지 그림과 문장은 '해변과 어선, 등대가 있는 마을이에요.'라는 같은 모습을 함께 보여 준다. |
| q1 · terrace-village | `../../_shared/socialmon/theme-packs/6-2/u1/options/choice-mountain-v1.webp` | 6_2_사회_1_지도서.pdf 20/35쪽 | 선택지 그림과 문장은 '산과 하천 사이에 계단식 논이 있어요.'라는 같은 모습을 함께 보여 준다. |
| q3 · water-shortage | `assets/option-problem-water-v1.webp` | 6_2_사회_3_지도서.pdf 60/319쪽 | 선택지 그림과 문장은 '사용할 물이 부족해요.'라는 같은 모습을 함께 보여 준다. |
| q3 · flood | `assets/option-problem-flood-v1.webp` | 6_2_사회_3_지도서.pdf 60/319쪽 | 선택지 그림과 문장은 '큰비로 집과 길이 물에 잠겨요.'라는 같은 모습을 함께 보여 준다. |
| q3 · conflict | `assets/option-problem-conflict-v1.webp` | 6_2_사회_3_지도서.pdf 60/319쪽 | 선택지 그림과 문장은 '분쟁으로 살던 곳을 떠나야 해요.'라는 같은 모습을 함께 보여 준다. |
| q3 · job-shortage | `assets/option-problem-jobs-v1.webp` | 6_2_사회_3_지도서.pdf 60/319쪽 | 선택지 그림과 문장은 '일자리가 부족해 다른 곳으로 이동해요.'라는 같은 모습을 함께 보여 준다. |
| q6 · more-escape | `assets/option-energy-more-v1.webp` | 6_2_사회_3_지도서.pdf 64/323쪽 | 선택지 그림과 문장은 '빠져나가는 에너지가 더 많아져요.'라는 같은 모습을 함께 보여 준다. |
| q6 · less-escape | `assets/option-energy-less-v1.webp` | 6_2_사회_3_지도서.pdf 64/323쪽 | 선택지 그림과 문장은 '빠져나가는 에너지가 줄어요.'라는 같은 모습을 함께 보여 준다. |
| q6 · same-escape | `assets/option-energy-same-v1.webp` | 6_2_사회_3_지도서.pdf 64/323쪽 | 선택지 그림과 문장은 '빠져나가는 양이 그대로예요.'라는 같은 모습을 함께 보여 준다. |
| q6 · no-sun | `assets/option-energy-none-v1.webp` | 6_2_사회_3_지도서.pdf 64/323쪽 | 선택지 그림과 문장은 '태양 에너지가 지구에 오지 않아요.'라는 같은 모습을 함께 보여 준다. |

<!-- AUTO OPTION SOURCES END -->

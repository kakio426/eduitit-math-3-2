# 출처 원장 - 소셜몬 시장 가격 탐정

## 원자료

- 파일: `/Users/yubyeongju/Downloads/6_2_사회_2_지도서.pdf`
- SHA-256: `61f3217ce221de1ba4682981d019f99febedd767da9abb384c58e883d76e039a`
- manifest 범위: PDF 1~21쪽(인쇄 120~140쪽)
- 출처 정책: 사실 판단에는 출판사 지도서 자료와 그 crop만 사용한다. 생성 이미지는 표지와 선택지 장식에만 사용한다.

## 문항 근거

| 문항 | PDF / 인쇄 | 근거 요약 | 실행 자료 |
|---|---|---|---|
| q1 | 15 / 134 | 사과 한 개의 가격이 3,000원에서 일주일 뒤 2,000원으로 바뀜 | `assets/source-market-price.webp` |
| q2 | 17 / 136 | 구직·구매·판매량·품질을 둘러싼 네 경쟁 장면 | `assets/source-market-competition.webp` |
| q3 | 16 / 135 | 필요한 상품의 양과 제공되는 상품의 양에 따라 가격이 정해짐 | 텍스트 문항 |
| q4 | 16 / 135 | 수요와 공급의 관계에 따른 가격 변화 | 텍스트 문항 |
| q5 | 21 / 140 | 시장 경쟁이 더 많은 판매와 더 좋은 상품으로 이어짐 | 텍스트 문항 |
| q6 | 21 / 140 | 가계와 기업이 시장에서 선택하고 경쟁함 | 텍스트 문항 |

## 시각 근거 점검

- `market-price-source.png` / `source-market-price.webp`: 가격표 두 개와 일주일 뒤 장면이 실제로 보이는 영역만 잘랐다.
- `market-competition-source.png` / `source-market-competition.webp`: 네 경쟁 장면과 설명이 함께 보이는 영역만 잘랐다.
- 자료 설명과 `alt`에는 crop에서 직접 확인되는 인물·가격표·장면만 적었다.
- 공유 선택지 그림은 장식으로만 쓰며, 각 `alt`는 실제 자산 모습과 일치시켰다.

<!-- AUTO OPTION SOURCES START -->

## 선택지 그림·지도 버튼 근거

아래 경로는 `quiz.json`과 배포 HTML이 실제로 읽는 실행 자산이다. 파일명이 `-source`로 끝나는 제작 원본은 공개 실행 경로에 쓰지 않는다.

| 문항·선택지 | 실행 자산 | 출처 PDF / 인쇄 | 그림과 문장의 관계 |
|---|---|---|---|
| q1 · price-same | `assets/option-price-same-v1.webp` | 6_2_사회_2_지도서.pdf 15/134쪽 | 선택지 그림과 문장은 '3,000원으로 그대로였어요.'라는 같은 모습을 함께 보여 준다. |
| q1 · price-zero | `assets/option-price-zero-v1.webp` | 6_2_사회_2_지도서.pdf 15/134쪽 | 선택지 그림과 문장은 '0원이 되었어요.'라는 같은 모습을 함께 보여 준다. |
| q1 · price-up | `assets/option-price-up-v1.webp` | 6_2_사회_2_지도서.pdf 15/134쪽 | 선택지 그림과 문장은 '2,000원에서 3,000원으로 올라갔어요.'라는 같은 모습을 함께 보여 준다. |
| q1 · price-down | `assets/option-price-down-v1.webp` | 6_2_사회_2_지도서.pdf 15/134쪽 | 선택지 그림과 문장은 '3,000원에서 2,000원으로 내려갔어요.'라는 같은 모습을 함께 보여 준다. |
| q2 · one-choice | `../../_shared/socialmon/theme-packs/6-2/u2/options/factory-v1.webp` | 6_2_사회_2_지도서.pdf 71/190쪽 | 선택지 그림과 문장은 '공장에서 물건을 만들어요.'라는 같은 모습을 함께 보여 준다. |
| q2 · free-compete | `../../_shared/socialmon/theme-packs/6-2/u2/options/market-stall-v1.webp` | 6_2_사회_2_지도서.pdf 15/134쪽 | 선택지 그림과 문장은 '시장에서 사과를 골라요.'라는 같은 모습을 함께 보여 준다. |
| q2 · no-choice | `../../_shared/socialmon/theme-packs/6-2/u2/options/worker-shield-v1.webp` | 6_2_사회_2_지도서.pdf 32/151쪽 | 선택지 그림과 문장은 '안전모로 일하는 사람을 지켜요.'라는 같은 모습을 함께 보여 준다. |
| q2 · same-product | `../../_shared/socialmon/theme-packs/6-2/u2/options/coins-v1.webp` | 6_2_사회_2_지도서.pdf 15/134쪽 | 선택지 그림과 문장은 '동전과 가격표가 있어요.'라는 같은 모습을 함께 보여 준다. |

<!-- AUTO OPTION SOURCES END -->

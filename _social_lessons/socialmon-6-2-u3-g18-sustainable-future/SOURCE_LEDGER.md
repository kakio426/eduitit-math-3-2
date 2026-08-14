# 출처 원장 - 소셜몬 지속 가능한 미래

## 원자료

- 파일: `/Users/yubyeongju/Downloads/6_2_사회_3_지도서.pdf`
- SHA-256: `ff9e47406a829468cefe527d5ca535bb490b457719b9424ec5197041ef5cc8ba`
- 사용 범위: PDF 67~90쪽(인쇄 326~349쪽), 교과서 148~161쪽
- 출처 정책: 출판사 지도서에서 렌더링한 자료 crop만 사실 판단에 사용한다. 생성 이미지는 표지 문구와 보기 장식에만 사용한다.

## 문항 근거

| 문항 | PDF / 인쇄 / 교과서 | 근거 요약 | 실행 자료 |
|---|---|---|---|
| q1 | 67 / 326 / 148 | 개인의 분리배출·재활용·녹색 제품·일회용품 줄이기 | `assets/source-g18-personal-efforts-v1.webp` |
| q2 | 67 / 326 / 148 | 지속 가능한 미래는 미래 세대까지 생각하며 환경을 지키는 노력 | 텍스트 문항 |
| q3 | 68 / 327 / 149 | 기업의 자원 절약 제품·친환경 소재 제품 개발 | `assets/source-g18-business-state-v1.webp` |
| q4 | 68 / 327 / 149 | 개인·기업·국가의 주체별 노력 | 텍스트 연결 |
| q5 | 69 / 328 / 150 | 국제 연합 난민 기구의 난민 보호와 물품·의료·교육 지원 | `assets/source-g18-organizations-v1.webp` |
| q6 | 79 / 338 / 158 | 다회용품 사용, 일회용품 줄이기, 에너지 절약 실천 | 텍스트 상황 |

개인·기업·국제기구 자료는 지도서에서 확인 가능한 사진과 설명을 함께 crop했다. `map-hotspots`는 사용하지 않는다.

## 자산 기록

- `source-*-source.png`: PDF 300dpi 렌더링 crop 원본
- `source-*.webp`: 실행용 WebP 변환본
- `cover-copy-v1-source.png` / `cover-copy-v1-generated.webp`: imagegen으로 만든 투명 표지 문구 원본·실행본. 사실 근거 아님.
- `assets/option-personal-*.webp`, `assets/option-business-*.webp`, `assets/option-organization-*.webp`는 선택지 뜻을 돕는 생성 장식 카드다. 모든 `alt`는 실제 그림만 설명하며 정답 근거로 쓰지 않는다.

<!-- AUTO OPTION SOURCES START -->

## 선택지 그림·지도 버튼 근거

아래 경로는 `quiz.json`과 배포 HTML이 실제로 읽는 실행 자산이다. 파일명이 `-source`로 끝나는 제작 원본은 공개 실행 경로에 쓰지 않는다.

| 문항·선택지 | 실행 자산 | 출처 PDF / 인쇄 | 그림과 문장의 관계 |
|---|---|---|---|
| q1 · use-more-disposable | `assets/option-personal-disposable-v1.webp` | 6_2_사회_3_지도서.pdf 67/326쪽 | 일회용 컵과 더하기 표시는 일회용품을 더 많이 쓴다는 선택지 뜻을 보여 준다. |
| q1 · leave-lights | `assets/option-personal-lights-v1.webp` | 6_2_사회_3_지도서.pdf 67/326쪽 | 켜진 전구 그림과 문장은 전구를 계속 켜 둔 같은 모습을 보여 준다. |
| q1 · sort-waste | `../../_shared/socialmon/theme-packs/6-2/u2/options/clean-city-v1.webp` | 6_2_사회_3_지도서.pdf 67/326쪽 | 분리배출함 그림과 문장은 쓰레기를 종류별로 나누어 버리는 같은 모습을 보여 준다. |
| q1 · waste-water | `assets/option-personal-water-v1.webp` | 6_2_사회_3_지도서.pdf 67/326쪽 | 수도꼭지와 물방울은 물을 계속 틀어 놓는다는 선택지 뜻을 보여 준다. |
| q3 · use-more-resource | `assets/option-business-more-resource-v1.webp` | 6_2_사회_3_지도서.pdf 68/327쪽 | 공장과 더하기 표시는 자원을 더 많이 써서 물건을 만든다는 선택지 뜻을 보여 준다. |
| q3 · hide-impact | `assets/option-business-hide-impact-v1.webp` | 6_2_사회_3_지도서.pdf 68/327쪽 | 가려진 눈 그림은 제품의 환경 영향을 숨긴다는 선택지 뜻을 보여 준다. |
| q3 · recycled-material | `assets/option-recycled-product-v1.webp` | 6_2_사회_3_지도서.pdf 68/327쪽 | 상자와 재활용 화살표는 다시 쓸 재료로 새 물건을 만드는 모습을 보여 준다. |
| q3 · discard-quickly | `assets/option-business-discard-v1.webp` | 6_2_사회_3_지도서.pdf 68/327쪽 | 쓰레기통 그림은 빨리 버리는 일회용 제품이라는 선택지 뜻을 보여 준다. |
| q5 · sell-products | `../../_shared/socialmon/theme-packs/6-2/u2/options/market-stall-v1.webp` | 6_2_사회_3_지도서.pdf 69/328쪽 | 시장 가판대 그림은 구호 대신 물건을 판다는 선택지 뜻을 보여 준다. |
| q5 · refugee-support | `assets/option-refugee-support-v1.webp` | 6_2_사회_3_지도서.pdf 69/328쪽 | 의료 십자와 방패 그림은 피난 온 사람에게 물품과 치료를 돕는 모습을 보여 준다. |
| q5 · build-roads | `assets/option-organization-road-v1.webp` | 6_2_사회_3_지도서.pdf 69/328쪽 | 넓은 도로 그림과 문장은 도로를 넓히는 같은 모습을 보여 준다. |
| q5 · run-school-only | `assets/option-organization-school-v1.webp` | 6_2_사회_3_지도서.pdf 69/328쪽 | 학교 건물 그림과 문장은 학교 건물을 세우는 같은 모습을 보여 준다. |

<!-- AUTO OPTION SOURCES END -->

# 출처 원장 - 소셜몬 인구 밀도 비교

## 원자료

- 파일: `/Users/yubyeongju/Downloads/6_2_사회_3_지도서.pdf`
- SHA-256: `ff9e47406a829468cefe527d5ca535bb490b457719b9424ec5197041ef5cc8ba`
- 사용 범위: PDF 23~30쪽(인쇄 282~289쪽), 보충 확인 PDF 35쪽(인쇄 294쪽)
- 출처 정책: 출판사 지도서에서 렌더링한 자료 crop만 사실 판단에 사용한다. 생성 이미지는 표지 문구와 보기 장식에만 사용한다.

## 문항 근거

| 문항 | PDF / 인쇄 / 교과서 | 근거 요약 | 실행 자료 |
|---|---|---|---|
| q1 | 23 / 282 / 129 | 인도 약 14억 3,807만 명, 미국 약 3억 4,348만 명, 투발루 9,816명, 리비아 약 731만 명을 비교 | `assets/source-g15-countries-v1.webp` |
| q2 | 23 / 282 / 129 | 인구수는 한 나라에 사는 사람의 수 | 텍스트 문항 |
| q3 | 23 / 282 / 129 | 인도·미국·투발루·리비아 사례와 자연환경·인구수 차이 | `assets/source-g15-countries-v1.webp` |
| q4 | 23 / 282 / 129 | 인도·미국·투발루의 나라별 인구 특징 | 텍스트 문항 |
| q5 | 29 / 288 / 133 | 활동 지도에서 분홍색 빗금으로 표시된 인도를 확인 | `assets/source-g15-density-v1.webp` |
| q6 | 24 / 283 / 130 | 출생·사망·인구 이동·환경 변화가 인구를 바꿈 | 텍스트 문항 |

문항은 인구수와 인구 밀도를 섞지 않도록 q2에서 개념을 확인하고 q5에서 활동 지도의 표시를 읽게 했다. q1은 네 나라의 실제 인구수를 비교하고, q5는 자료에 보이는 분홍색 빗금만 묻는다. `map-hotspots`는 사용하지 않는다.

## 자산 기록

- `source-*-source.png`: PDF 300dpi 렌더링 crop 원본
- `source-*.webp`: 실행용 WebP 변환본
- `cover-copy-v1-source.png` / `cover-copy-v1-generated.webp`: imagegen으로 만든 투명 표지 문구 원본·실행본. 사실 근거 아님.
- q1·q3·q5의 나라 선택지는 `assets/option-country-*-v1.webp`로 구분한다. 생성 지구본 카드는 나라 이름을 찾기 위한 장식이며, 수치와 판단의 근거는 출판사 지도다.

<!-- AUTO OPTION SOURCES START -->

## 선택지 그림·지도 버튼 근거

아래 경로는 `quiz.json`과 배포 HTML이 실제로 읽는 실행 자산이다. 파일명이 `-source`로 끝나는 제작 원본은 공개 실행 경로에 쓰지 않는다.

| 문항·선택지 | 실행 자산 | 출처 PDF / 인쇄 | 그림과 문장의 관계 |
|---|---|---|---|
| q1 · united-states | `assets/option-country-united-states-v1.webp` | 6_2_사회_3_지도서.pdf 23/282쪽 | 선택지 그림과 문장은 '미국'라는 같은 모습을 함께 보여 준다. |
| q1 · tuvalu | `assets/option-country-tuvalu-v1.webp` | 6_2_사회_3_지도서.pdf 23/282쪽 | 선택지 그림과 문장은 '투발루'라는 같은 모습을 함께 보여 준다. |
| q1 · libya | `assets/option-country-libya-v1.webp` | 6_2_사회_3_지도서.pdf 23/282쪽 | 선택지 그림과 문장은 '리비아'라는 같은 모습을 함께 보여 준다. |
| q1 · india | `assets/option-country-india-v1.webp` | 6_2_사회_3_지도서.pdf 23/282쪽 | 선택지 그림과 문장은 '인도'라는 같은 모습을 함께 보여 준다. |
| q3 · india | `assets/option-country-india-v1.webp` | 6_2_사회_3_지도서.pdf 23/282쪽 | 선택지 그림과 문장은 '인도'라는 같은 모습을 함께 보여 준다. |
| q3 · united-states | `assets/option-country-united-states-v1.webp` | 6_2_사회_3_지도서.pdf 23/282쪽 | 선택지 그림과 문장은 '미국'라는 같은 모습을 함께 보여 준다. |
| q3 · tuvalu | `assets/option-country-tuvalu-v1.webp` | 6_2_사회_3_지도서.pdf 23/282쪽 | 선택지 그림과 문장은 '투발루'라는 같은 모습을 함께 보여 준다. |
| q3 · libya | `assets/option-country-libya-v1.webp` | 6_2_사회_3_지도서.pdf 23/282쪽 | 선택지 그림과 문장은 '리비아'라는 같은 모습을 함께 보여 준다. |
| q5 · canada | `assets/option-country-canada-v1.webp` | 6_2_사회_3_지도서.pdf 29/288쪽 | 선택지 그림과 문장은 '캐나다'라는 같은 모습을 함께 보여 준다. |
| q5 · brazil | `assets/option-country-brazil-v1.webp` | 6_2_사회_3_지도서.pdf 29/288쪽 | 선택지 그림과 문장은 '브라질'라는 같은 모습을 함께 보여 준다. |
| q5 · india | `assets/option-country-india-v1.webp` | 6_2_사회_3_지도서.pdf 29/288쪽 | 선택지 그림과 문장은 '인도'라는 같은 모습을 함께 보여 준다. |
| q5 · australia | `assets/option-country-australia-v1.webp` | 6_2_사회_3_지도서.pdf 29/288쪽 | 선택지 그림과 문장은 '오스트레일리아'라는 같은 모습을 함께 보여 준다. |

<!-- AUTO OPTION SOURCES END -->

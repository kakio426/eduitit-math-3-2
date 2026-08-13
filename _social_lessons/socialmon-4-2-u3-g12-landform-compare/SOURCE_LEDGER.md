# SOURCE LEDGER — socialmon-4-2-u3-g12-landform-compare

기준 자료는 `/Users/yubyeongju/Downloads/4_2_사회_3_지도서.pdf`다. SHA-256은 `a3178feb73d5d7386053b0983408f75ed9e7f5bffce2228984d74067ef1e364c`, PDF 92쪽이며 인쇄 쪽은 PDF 쪽에 189를 더한다.

## 실행 사실 자료

- `source-mountain-region-v1-source.png` → `.webp`: PDF 17쪽을 300dpi로 렌더한 뒤 산·숲·계곡·산비탈 밭·목장·풍력 발전기가 보이는 교과서 그림 영역을 `x=1465, y=810, W=1260, H=1090`으로 잘랐다.
- `source-coast-region-v1-source.png` → `.webp`: PDF 30쪽을 300dpi로 렌더한 뒤 모래사장·항구·등대·배와 바닷가 생활이 보이는 교과서 그림 영역을 `x=170, y=900, W=1410, H=1080`으로 잘랐다.

두 자료는 출판사 PDF crop이며 생성 이미지가 아니다. `option-*.webp` 8장은 문장 뜻을 돕는 장식이고 정답 근거로 쓰지 않는다.

## 문항별 근거

| 문항 | PDF / 인쇄 쪽 | 근거 |
| ---: | --- | --- |
| 1 | 17 / 206 | 산지의 숲·계곡·산비탈 밭·목장 |
| 2 | 17 / 206 | 산지·평야·해안의 자연환경 특징 비교 |
| 3 | 30 / 219 | 모래사장·항구·등대·배 |
| 4 | 18~30 / 207~219 | 산지·평야·해안과 생활 모습 연결 |
| 5 | 31 / 220 | 갯벌·모래사장과 공업 단지·큰 항구를 자연환경과 사람이 만든 모습으로 구분 |
| 6 | 31 / 220 | 공업 단지와 큰 항구가 생기면서 물건을 만들고 배로 옮기는 생활 모습 |

q3의 네 선택지는 같은 장식 그림을 반복하지 않는다. 실행본은 `option-coast-work-v1.webp`,
`option-mountain-life-v1.webp`, `option-farming-life-v1.webp`,
`option-city-commute-v1.webp`이며, 모두 선택지 문장의 뜻만 돕고 사실 판단은 출판사
자료에 둔다.

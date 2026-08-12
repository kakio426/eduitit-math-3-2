# 소셜몬 우리 지역 자치 찾기 · 출처 근거표

## 원자료 확인

| 항목 | 기록 |
| --- | --- |
| 파일 | `/Users/yubyeongju/Downloads/4_2_사회_1_지도서.pdf` |
| SHA-256 | `416f72fcc3496d4ceea0403cf3a28761c508153855cd4c0c5ff7faa8d244e28b` |
| 전체 쪽수 | 90쪽 |
| 직접 대조 범위 | PDF 68~84쪽(17쪽) |
| 텍스트 확인 | `pdftotext -f 68 -l 84 -layout` |
| 화면 확인 | 68~84쪽 전부 PNG 렌더, 74쪽은 사실 crop용 300dpi 재렌더 |
| 확인일 | 2026-08-12 |

PDF 쪽은 파일 첫 장부터 센 값이고 인쇄 쪽은 지도서 지면 아래 번호다. PDF 68쪽은
인쇄 83쪽, PDF 74쪽은 인쇄 89쪽, PDF 81~84쪽은 인쇄 96~99쪽에 대응한다.

## 문항 근거

| 문항 | 형식 | PDF 쪽 / 인쇄 쪽 | 교과서 쪽 | 사용 근거 |
| ---: | --- | ---: | ---: | --- |
| 1 | `source-choice` | 74 / 89 | 43 | 주민 자치회와 행정 복지 센터가 주민과 깨끗한 상가 만들기 캠페인을 펼친 사례 |
| 2 | `match` | 68 / 83 | 39 | 인터넷·지역 신문·주민 인터뷰·지역 게시판을 활용하는 조사 방법 |
| 3 | `source-choice` | 74 / 89 | 42 | 좁은 도로의 주차 문제를 주민 합의로 한쪽 주차제로 바꾼 사례 |
| 4 | `match` | 74 / 89 | 43 | 주민이 문제를 찾고 주민 자치회가 계획하며 행정 복지 센터가 함께 돕는 협력 |
| 5 | `match` | 81 / 96 | 44 | 통학로·벽·빈터가 주민 참여 뒤 안전한 길·벽화·쉼터로 달라진 모습 |
| 6 | `situation-choice` | 82 / 97 | 45 | 필요한 일을 찾고 의견을 모아 참여 방법을 계획한 뒤 함께 실천하는 순서 |

모든 문항의 `quiz.json > evidence`에는 `sourceFile`, `pdfPage`, `printedPage`,
`textbookPage`, `basis`를 기록했다. 다른 지역의 사례를 학생이 사는 지역의 사실처럼
바꾸어 말하지 않았다.

## 사실 자료 자산

| 문항 | 원본 PNG | 실행 WebP | 크기 | 화면 출처 |
| ---: | --- | --- | ---: | --- |
| 1 | `assets/clean-shopping-campaign-v1-source.png` | `assets/source-clean-shopping-campaign-v1.webp` | 1080×600 | `자료: 4_2_사회_1_지도서.pdf PDF 74쪽, 지도서 89쪽` |
| 3 | `assets/one-side-parking-v1-source.png` | `assets/source-one-side-parking-v1.webp` | 1080×560 | `자료: 4_2_사회_1_지도서.pdf PDF 74쪽, 지도서 89쪽` |

두 원본 PNG는 PDF 74쪽 300dpi 렌더에서 출판사 사진·설명 범위를 직접 잘랐고,
같은 내용을 WebP로 변환했다. 사람 수, 펼침막, 표지판, 장소 모습을 새로 만들거나
바꾸지 않았다. q1 자료 원본 SHA-256은
`f3cb89ad6f02feefee146fe82fa3b7d9de6c79f5eea68d510d8d06ae9b10b7cf`,
q3 자료 원본 SHA-256은
`91603ecf5496891823a362c6c40c72813c971821b1fef846bbaab1080209476b`다.
생성형 이미지는 이 두 자료를 대신하지 않는다.

## 생성형 선택지 장식

두 2×2 원본 시트를 GPT Image로 만들고, 각 칸을 768×512 PNG 원본과 같은 크기의
실행 WebP로 분리했다. 생성 지시에는 글자·숫자·로고를 넣지 않고, 네 장면의 카메라와
화풍을 통일하며, 그림이 정답 근거가 아니라 선택지 뜻을 돕는 장식임을 명시했다.

- q1 시트 `options-clean-shopping-sheet-v1-source.png`
  (SHA-256 `3d418c67972e9c25e8d48037862034efd6840aa7fe33dcd076a9044764d17c59`)
  - `option-clean-shopping-v1`: 주민들이 상가 골목을 쓸고 캠페인 물품을 나누는 장면
  - `option-identical-houses-v1`: 모양이 같은 새 집들이 줄지어 선 장면
  - `option-move-shops-v1`: 일꾼들이 가게 천막과 상자를 이삿짐 차에 싣는 장면
  - `option-empty-new-town-v1`: 사람이 보이지 않는 새 상가 거리 장면
- q3 시트 `options-parking-sheet-v1-source.png`
  (SHA-256 `be10be83498632756327cc189a778c90b87c3b660521976b0f981ffde62381a3`)
  - `option-one-side-parking-v1`: 주민들이 의논하고 차를 길 한쪽에 세운 장면
  - `option-block-whole-road-v1`: 한 사람이 좁은 길 전체를 가림막으로 막은 장면
  - `option-leave-congestion-v1`: 차들이 좁은 길 양쪽을 가득 막고 있는 장면
  - `option-amusement-without-residents-v1`: 주민 없이 놀이공원을 짓는 장면

각 항목은 `*-source.png`와 `*.webp`를 모두 보존하며 자연폭은 768px다. `quiz.json`에
각 이미지, 대체 텍스트, `생성형 장식 그림 · 정답 근거 아님` 출처를 기록했다.

## 생성형 표지 문구

`assets/cover-copy-v1-source.png`는 GPT Image 생성 원본이고,
`cover-copy-v1-generated.png`와 `cover-copy-v1-generated.webp`는 배경을 제거한
1536×1024 투명 실행 자산이다. 보이는 문구는 `소셜몬 발견 퀴즈`,
`소셜몬 우리 지역 자치 찾기`, `우리 지역의 주민 자치 사례와 참여 계획을 살펴봐요.`다.
표지 문구는 분위기·제목 자산이며 사실 근거로 사용하지 않는다.

## 실행 원고 대조

`_social_lessons/series/4-2/drafts/g04-local-autonomy/PLAN.md`, 실제 원고 파일인
`QUESTION_DRAFT.md`, `SOURCE_LEDGER.md`를 출발점으로 삼았다. 정식 실행본에서는
PDF 74쪽의 한쪽 주차제와 깨끗한 상가 만들기 사진을 각각 하나의 관찰 자료로 좁혀,
자료 제목·본문이 정답 문장을 먼저 말하지 않도록 다시 썼다.

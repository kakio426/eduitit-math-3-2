# 소셜몬 학교 문제 함께 풀기 · 출처 근거표

기준 자료: `4_2_사회_1_지도서.pdf`
로컬 원본: `/Users/yubyeongju/Downloads/4_2_사회_1_지도서.pdf`
원본 SHA-256: `416f72fcc3496d4ceea0403cf3a28761c508153855cd4c0c5ff7faa8d244e28b`

인쇄 쪽은 지도서 아래에 적힌 쪽수다. 출처 카탈로그의 `printedPageOffset=15`에 따라
PDF 26~44쪽은 인쇄 41~59쪽과 대응한다.

## 직접 대조

`pdftotext -layout -f 26 -l 44`로 본문을 뽑고, 같은 19쪽을
`pdftoppm -png -r 150 -f 26 -l 44`로 렌더해 한 쪽씩 눈으로 확인했다.

- PDF 26~28쪽: 학생·교사·학부모가 의견을 모아 학교 일을 정하고 실천하는 모습,
  학생 참여 예산제와 우산 빗물 제거기 사례
- PDF 33~36쪽: 오래된 놀이터에서 문제를 찾고 방법을 정해 실천하며 결과를 살피는 사례
- PDF 39~42쪽: 문제 찾기, 방법 살피기, 민주적으로 정하기, 실천하기, 결과 확인하기의 흐름
- PDF 43~44쪽: 모두가 평등한 자리에서 함께 만드는 민주주의와 학생 자치회 활동 정리

## 문항 근거

| 문항 | 형식 | PDF / 인쇄 쪽 | 교과서 쪽 | 근거 |
|---:|---|---:|---:|---|
| 1 | `source-choice` | 28 / 43 | 21 | 학생 제안과 예산 지원으로 우산 빗물 제거기를 설치한 학생 참여 예산제 |
| 2 | `choice` | 27 / 42 | 20 | 학교 구성원이 의견을 모아 학교 일을 정하고 실천하는 까닭 |
| 3 | `sequence` | 39 / 54 | 25 | 학교 문제 찾기부터 해결 방법 결정·실천까지의 흐름 |
| 4 | `source-choice` | 33 / 48 | 22 | 오래된 놀이 기구와 움푹 파인 모래밭을 발견한 학생들의 관찰 |
| 5 | `match` | 35 / 50 | 해결 방법 정하기·실천 계획 세우기·달라진 점 살피기와 알맞은 행동의 관계 |
| 6 | `situation-choice` | 43 / 58 | 27 | 모두가 평등한 자리에서 의견을 내고 함께 정하는 민주주의 |

## 사실 근거 이미지

| 문항 | 원본 PNG | 실행 WebP | 크기 | 화면 출처 |
|---:|---|---|---:|---|
| 1 | `assets/source-student-budget-v1-source.png` | `assets/source-student-budget-v1.webp` | `1500×1100` | `자료: 4학년 2학기 사회 1 지도서 43쪽` |
| 4 | `assets/source-playground-safety-v1-source.png` | `assets/source-playground-safety-v1.webp` | `1693×2112` | `자료: 4학년 2학기 사회 1 지도서 48쪽` |

두 원본은 해당 PDF 지면을 400dpi로 렌더하면서 필요한 범위만 자른 PNG다. 문항 1은 기사
제목·학생 참여 예산제 설명·우산 빗물 제거기 설치 사례와 사진을 함께 보존했다. 문항 4는
교과서 22쪽의 놀이터 사진과 네 학생의 말을 함께 보존했다. WebP는 같은 픽셀 크기로
변환했고 생성형 이미지로 사실 장면을 대신하지 않았다.

초안 문항 4에는 `돌과 유리 조각`, `드러난 못`이 적혀 있었지만 PDF 33쪽의 그림과
말풍선에서는 확인되지 않았다. 직접 보이는 `오래된 놀이 기구`와 `움푹 파인 모래밭`으로
문항·정답·설명을 고쳐 출판사 지면과 맞췄다.

## 선택지 장식 그림

문항 1은 다음 네 쌍을 쓴다.

- `option-rainwater-remover-v1-source.png` / `.webp`
- `option-new-playground-v1-source.png` / `.webp`
- `option-lunch-menu-v1-source.png` / `.webp`
- `option-school-sign-v1-source.png` / `.webp`

문항 4는 다음 네 쌍을 쓴다.

- `option-worn-playground-v1-source.png` / `.webp`
- `option-safe-new-playground-v1-source.png` / `.webp`
- `option-empty-yard-v1-source.png` / `.webp`
- `option-reading-benches-v1-source.png` / `.webp`

각 그림은 별도 imagegen 호출로 만든 원본 PNG와 자연폭 `1254px` 실행 WebP를 가진다.
모든 그림은 `quiz.json`에 대체 텍스트와 `생성형 장식 그림 · 사실 근거 아님`을 적었다.
그림은 선택지 문장을 쉽게 알아보게 할 뿐이며 정답 판정은 출판사 자료와 글에 둔다.

## 표지 문구

- 원본: `assets/cover-copy-v1-source.png`
- 투명 실행 PNG: `assets/cover-copy-v1-generated.png`
- 투명 실행 WebP: `assets/cover-copy-v1-generated.webp`
- 크기: `1536×1024`

imagegen으로 `소셜몬 발견 퀴즈`, `소셜몬 학교 문제 함께 풀기`, `학교 문제를 함께 정하고
해결하는 순서를 찾아봐요.`를 한 덩어리의 투명 타이포그래피로 만들었다. 표지 분위기와
문구에만 쓰며 문항의 사실 근거가 아니다.

## 내용 안전

- 학교 민주주의를 투표 한 번이나 다수결 하나로 줄이지 않았다.
- 문제 찾기, 의견 듣기, 함께 정하기, 실천하기, 달라진 점 살피기를 이어 다룬다.
- 생성 이미지는 표지와 선택지 장식에만 썼다.
- 대표본 g01·g07·g15는 폴더 구조와 검사 절차만 참고했고 사실·문항·이미지를 가져오지 않았다.

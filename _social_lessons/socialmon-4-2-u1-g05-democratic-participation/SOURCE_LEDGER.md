# 소셜몬 민주 참여 약속 · 출처 근거표

기준 자료: `/Users/yubyeongju/Downloads/4_2_사회_1_지도서.pdf`
PDF SHA-256: `416f72fcc3496d4ceea0403cf3a28761c508153855cd4c0c5ff7faa8d244e28b`

인쇄 쪽은 지도서 아래에 적힌 쪽수이며, PDF 쪽과의 대응은 출처 카탈로그의
`printedPageOffset=15`를 따른다. PDF 85~88쪽을 `pdftotext -layout`로 읽고 150 dpi
렌더 이미지와 직접 대조했다.

## 문항 근거

| 문항 | 형식 | PDF 쪽 / 인쇄 쪽 | 교과서 쪽 | 근거 |
|---:|---|---:|---:|---|
| 1 | `source-choice` | 85 / 100 | 47~48 | 주민 참여로 지역을 바꾸자는 포스터 세 장 |
| 2 | `choice` | 86 / 101 | 49 | 주민이 지역의 주인으로서 지역 일에 참여하고 문제를 함께 해결하는 주민 자치 |
| 3 | `match` | 87 / 102 | 50~51 | 공공 기관 누리집·주민 회의·지역 자원봉사와 각 방법으로 할 수 있는 일 |
| 4 | `source-choice` | 85 / 100 | 47~48 | 어린이가 함께 활동할 공간이 부족해 새 공간을 만들자는 제안서 |
| 5 | `match` | 87 / 102 | 50~51 | 학생 자치회·학교 구성원 회의·주민 자치의 참여 모습 |
| 6 | `situation-choice` | 88 / 103 | 52~53 | 공원의 불편을 확인하고 주민과 함께 공공 기관에 알리는 참여 방법 되짚기 |

## 사실 근거 이미지

| 문항 | 실행 자산 | 보존 원본 | 크기 | 화면 출처 |
|---:|---|---|---:|---|
| 1 | `assets/source-resident-posters-v1.webp` | `assets/source-resident-posters-v1-source.png` | 1400×1450 | `자료: 4학년 2학기 사회 1 지도서 100쪽` |
| 4 | `assets/source-child-space-proposal-v1.webp` | `assets/source-child-space-proposal-v1-source.png` | 900×270 | `자료: 4학년 2학기 사회 1 지도서 100쪽` |

q1은 PDF 85쪽 위쪽의 주민 참여 포스터 세 장과 맥락 문구를 잘랐다. q4는 같은 쪽
아래쪽 `어린이를 위한 공간 만들기` 제안서에서 활동 이름과 제안한 까닭 두 행을 가까이
잘라 태블릿에서도 근거 문장을 읽을 수 있게 했다. 원본 PNG와 실행 WebP를 눈으로
대조했고, 자르기와 WebP 변환 외에 정답 근거를 바꾸는 편집은 하지 않았다.

## 생성형 선택지 장식

| 문항 | 선택지 뜻 | 원본 PNG / 실행 WebP | 실행 크기 | 역할 |
|---:|---|---|---:|---|
| 1 | 주민이 포스터를 함께 만들기 | `option-residents-make-poster-v1-source.png` / `.webp` | 600×600 | 장식 |
| 1 | 한 사람만 지시하기 | `option-one-person-directs-v1-source.png` / `.webp` | 600×600 | 장식 |
| 1 | 지역 안내판을 모른 척하기 | `option-ignore-community-board-v1-source.png` / `.webp` | 600×600 | 장식 |
| 1 | 교실 안에서만 활동하기 | `option-classroom-only-v1-source.png` / `.webp` | 600×600 | 장식 |
| 4 | 어린이가 함께 활동할 공간 | `option-children-shared-space-v1-source.png` / `.webp` | 600×600 | 장식 |
| 4 | 안내문이 가득한 게시판 | `option-overfull-noticeboard-v1-source.png` / `.webp` | 600×600 | 장식 |
| 4 | 학교 의견 상자 | `option-school-suggestion-box-v1-source.png` / `.webp` | 600×600 | 장식 |
| 4 | 지나치게 넓은 길 | `option-overwide-road-v1-source.png` / `.webp` | 600×600 | 장식 |

선택지 그림은 밝은 2D 스티커풍의 한 장면으로 생성했다. 글자·숫자·기호를 넣지 않았고,
각 `quiz.json` 항목에 그림의 장면만 말하는 대체 텍스트와
`생성형 장식 그림 · 사실 근거 아님` 출처를 기록했다. 정답 판단은 출판사 crop과 선택지
글에 둔다.

## 생성형 표지 문구

- 보존 원본: `assets/cover-copy-v1-source.png`
- 투명 실행본: `assets/cover-copy-v1-generated.png`, `assets/cover-copy-v1-generated.webp`
- 실제 문구: `소셜몬 발견 퀴즈` / `소셜몬 민주 참여 약속` /
  `다른 의견을 듣고 함께 참여하는 행동을 찾아봐요.`
- 원본은 단색 크로마 배경으로 생성한 뒤 배경만 투명하게 제거했다. 표지 장면·사실
  자료·정답 근거에는 생성 이미지를 쓰지 않았다.

## 내용 안전

- 주민 참여를 찬반 하나나 다수결 하나로 줄이지 않았다.
- 누리집에 의견 남기기, 주민 회의, 지역 자원봉사처럼 지역 일에 참여하는 방법을 함께 다뤘다.
- 공원 시설을 어린이끼리 고치게 하지 않고, 상태를 기록해 주민과 공공 기관에 알리도록 했다.
- 특정 학교나 지역의 실제 절차를 유일한 방법으로 단정하지 않았다.
- 사진·문서 사실은 출판사 지도서 crop만 근거로 사용했다.

---
name: eduitit-mathmon-assets
description: "Use whenever creating, replacing, selecting, organizing, auditing, or integrating 매스몬 character assets, Mathmon packs, result cards, catalog.json, STYLE_GUIDE.md, or lesson Mathmon image references in the ai mart workspace."
---

# Eduitit 매스몬 자산 관리자

이 스킬은 매스몬 캐릭터 자산을 만들거나 바꾸거나 차시에 연결할 때 쓴다. 차시 전체를 만드는 공정은 `eduitit-mathmon-lesson`이고, 매스몬 이미지·팩·카탈로그·카드 자산은 이 스킬이 우선한다.

## 시작 규칙

매스몬 관련 작업이면 구현 전에 아래 파일을 먼저 읽는다.

1. `_shared/mathmon/MATHMON_ASSET_CONTRACT.md`
2. `_shared/mathmon/catalog.json`
3. `_shared/mathmon/STYLE_GUIDE.md`
4. 사용할 팩의 `manifest.json`
5. 사용할 팩의 `contact-sheets/*-contact-sheet.png`

읽지 않고 이미지 생성, HTML 참조 교체, 팩 추가, 차시 폴더 복사를 시작하지 않는다.

## 현재 기준

- 활성 스타일은 `mathmon-v1-anime-sticker`다.
- 1차시 `매스몬 상자런` 기본 10종이 원본 표준이다. 이 10종은 없애는 대상이 아니라 뒤에 만든 매스몬을 맞추는 기준이다.
- `base-pack`은 기준 팩이고, `base-pack`과 `zero-factory-animal-pack`만 승인된 활성 팩이다.
- 일관성은 같은 화풍·외곽선·카메라 거리·파일 규격을 뜻한다. 캐릭터 성격은 귀여움, 사랑스러움, 멋짐, 강함, 살짝 포악한 야생성, 신비감까지 넓게 가져간다.
- 10마리 팩이 같은 큰 눈, 같은 미소, 같은 둥근 몸, 같은 소품으로 반복되면 기준 실패다.
- `circle-pack`, `fraction-pack`, `explorer-pack`, `weight-pack`처럼 기존 실행 화면 보존을 위해 남긴 팩은 `style-review-runtime`으로 보고 새 차시 복제 기준으로 쓰지 않는다.
- `zero-factory-pack`, `core-pack-v2`, `zero-factory-pack-v2`는 보존 팩이며 새 차시와 리마스터의 기본값으로 쓰지 않는다.
- 새 차시와 리마스터는 1차시 `매스몬 상자런`의 밝은 2D 애니/스티커형 매스몬 톤을 기본으로 쓴다.
- 차시별 전용 매스몬도 본체는 동물/판타지 생물이어야 하며, 차시 테마는 소품·의상·배지·포즈로만 표현한다.
- 원본은 `_shared/mathmon/`에만 둔다.
- 차시 폴더에는 실행용 WebP만 복사한다.
- 첫 화면에 매스몬이 필요하면 커버 배경 생성 단계에서 `cover-generated.webp` 장면 안에 함께 포함한다. 팩 WebP를 `.cover-mathmon` 같은 별도 `<img>`로 커버 위에 붙이는 방식은 새 차시와 리마스터 기준이 아니다.

## 작업 절차

1. **현황 확인**: `catalog.json`, active/legacy 팩, contact sheet를 확인한다.
2. **재사용 판단**: 기존 active 팩으로 충분하면 새 이미지를 만들지 않는다.
3. **팩 추가**: 새 팩이 필요하면 `_shared/mathmon/<pack-id>/`에 `manifest.json`, `raw-chromakey/`, `png/`, `webp/`, `contact-sheets/`를 만든다.
4. **이미지 생성**: `STYLE_GUIDE.md`의 V1 프롬프트 기준으로 flat chroma-key 원본을 만들고 `raw-chromakey/`에 저장한다.
5. **후처리**: chroma-key 제거 → 투명 `768x768` PNG → WebP quality 82~86 → contact sheet 생성.
6. **등록**: 팩 `manifest.json`과 `_shared/mathmon/catalog.json`을 갱신한다.
7. **차시 연결**: 차시 폴더에는 필요한 WebP만 복사하고 `index.html`의 매스몬 참조를 그 경로로 바꾼다. 단, 첫 화면 커버 동행용으로 기존 매스몬 WebP를 얹지 않는다. 커버에 매스몬이 필요하면 `cover-generated.webp` 자체를 매스몬 포함 장면으로 다시 생성한다.
8. **검증**: JSON 파싱, 파일 개수, alpha, 레거시 실행 참조 제거, 로컬 200, 브라우저 이미지 로드를 확인한다.

## 금지

- 차시 폴더에만 새 매스몬을 생성하거나 저장하지 않는다.
- 원본 PNG, raw chroma-key, contact sheet를 차시 폴더에 복사하지 않는다.
- V2 팩을 새 차시에 기본값으로 쓰지 않는다.
- 톱니바퀴, 자석, 상자, 컨베이어 같은 사물 자체를 매스몬 몸으로 만들지 않는다.
- 매스몬을 별도 도감/점수/수집 시스템으로 전면화하지 않는다.
- 첫 화면 커버에서 기존 매스몬 PNG/WebP를 `.cover-mathmon` 같은 별도 `<img>`로 올려 배경과 한 장면처럼 보이게 하지 않는다. 새 차시와 리마스터는 매스몬을 커버 프롬프트에 포함해 처음부터 한 장면으로 생성한다.
- 로컬 폰트, Pillow, canvas, SVG, CSS 캡처, 기존 PNG/WebP 겹치기 등으로 매스몬·배경·버튼·문구를 조합해 생성형 이미지처럼 보이게 만드는 로컬 합성은 금지한다.
- 로컬 합성은 사용자가 먼저 명시적으로 허락한 경우에만 예외로 쓴다. 허락 없이 로컬 합성 결과물을 매스몬 장면, 보상 모달, 결과 화면, 타이틀 아트의 최종 생성 이미지로 연결하면 실패다.
- 결과 화면에서 섬 이름, 도착 라벨, 칭찬 문구, 다시하기 버튼처럼 매 판 똑같은 요소는 생성 이미지 안에 포함하는 것을 기본값으로 한다. 정답 수·점수처럼 매 판 달라지는 값만 HTML/CSS 오버레이로 남긴다.
- 허용되는 후처리는 생성형 원본의 의미를 바꾸지 않는 배경 제거, 크롭, 리사이즈, WebP 변환, 용량 최적화까지다.
- 기존 contact sheet를 보지 않고 비슷한 실루엣을 새로 만들지 않는다.

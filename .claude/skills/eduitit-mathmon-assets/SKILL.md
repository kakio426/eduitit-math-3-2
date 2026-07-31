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
- `base-pack`은 기준 팩이고, `base-pack`, `zero-factory-animal-pack`, `diversity-reward-pack`은 승인된 활성 팩이다. `diversity-reward-pack`의 호랑몬은 3-2-4-4의 기존 장면과 결과 자산에서 계속 사용한다.
- 일관성은 같은 화풍·외곽선·카메라 거리·파일 규격을 뜻한다. 캐릭터 성격은 귀여움, 사랑스러움, 멋짐, 강함, 살짝 포악한 야생성, 신비감까지 넓게 가져간다.
- 10마리 팩이 같은 큰 눈, 같은 미소, 같은 둥근 몸, 같은 소품으로 반복되면 기준 실패다.
- `circle-pack`, `fraction-pack`, `explorer-pack`, `weight-pack`처럼 기존 실행 화면 보존을 위해 남긴 팩은 `style-review-runtime`으로 보고 새 차시 복제 기준으로 쓰지 않는다.
- `zero-factory-pack`, `core-pack-v2`, `zero-factory-pack-v2`는 보존 팩이며 새 차시와 리마스터의 기본값으로 쓰지 않는다.
- 새 차시와 리마스터는 1차시 `매스몬 상자런`의 밝은 2D 애니/스티커형 매스몬 톤을 기본으로 쓴다.
- 차시별 전용 매스몬도 본체는 동물/판타지 생물이어야 하며, 차시 테마는 소품·의상·배지·포즈로만 표현한다.
- 원본은 `_shared/mathmon/`에만 둔다.
- 첫 화면 시작 버튼은 공용 `mathmon-cover-start-button-v1`(`_shared/mathmon/cover-start-button/`)만 쓴다. 새 차시마다 버튼을 새로 생성·복제·색 변경·재가공하지 않고, 실행 HTML은 `../_shared/mathmon/cover-start-button/start-button-generated.webp`를 직접 참조한다.
- 차시 폴더에는 실행용 WebP만 복사한다.
- 첫 화면에 매스몬이 필요하면 커버 배경 생성 단계에서 `cover-generated.webp` 장면 안에 함께 포함한다. 팩 WebP를 `.cover-mathmon` 같은 별도 `<img>`로 커버 위에 붙이는 방식은 새 차시와 리마스터 기준이 아니다.
- 결과 화면 정답 수 `0/10`~`10/10`은 공용 생성형 숫자 자산 `_shared/result-count/result-correct-*-generated.webp`를 기본으로 쓴다. 원본은 `_shared/result-count/result-correct-count-source.png`, 배경 제거 시트는 `_shared/result-count/result-correct-count-transparent-sheet.png`에 보관한다. 차시별로 같은 숫자를 새로 만들거나 로컬 폰트/Pillow/canvas/SVG로 재생성하지 않는다.

## 상태 이미지 세트 QA

한 UI 슬롯에서 여러 생성 이미지가 상태별로 바뀌는 경우는 매스몬 팩이 아니어도 이 스킬의 QA 대상이다. 예: 결과 등급 이미지 6장, 로봇 목표 지도 6장, 보상 점수 이미지 8장, 정답 수 이미지 11장.

- 작업 시작 전에 세트 계약을 적는다. 최소 항목은 `개수`, `파일명 패턴`, `승인된 캔버스 크기`, `runtime 표시 슬롯`, `각 장에 반드시 보여야 하는 대상 개수`, `현재 상태와 비활성 상태의 표현 차이`다.
- 사용자가 지정한 캔버스나 배너 높이를 임의로 바꾸지 않는다. 크기 변경이 필요하다고 판단되면 먼저 이유를 말하고, 마지막으로 승인받은 크기로 계약을 갱신한 뒤 생성한다.
- 모든 상태 이미지는 같은 캔버스 크기, 같은 기준선, 같은 슬롯 수, 같은 여백 체계를 가져야 한다. 한 장만 좌우로 줄거나 위아래가 잘리거나 주인공 위치가 튀면 실패다.
- 문제 화면의 현재 보상·진행 장면은 최종 결과 이미지를 CSS 크롭으로 재사용하지 않는다. 플레이 상태와 최종 결과는 용도가 다른 별도 생성 이미지 세트이며 단계별로 1:1 대응해야 한다. 플레이 세트는 같은 카메라·주인공 크기·기준선을 유지하고, 화살 명중 위치·완성물·조명·캐릭터 반응처럼 누적 단계의 차이가 즉시 보여야 한다. 주인공 전신과 핵심 보상물 잘림 0건, `object-fit: contain`, 컨택시트 전수 확인을 통과하지 못하면 연결하지 않는다.
- 6단계 결과를 쓰는 왼쪽 진행 보상은 `stage-left-play-progress-v1`로 기록하고 이미지도 정확히 6장만 쓴다. `layoutContract.mathmonPlacement`에 매스몬 중심 X/Y, 발 기준선 Y, 허용 오차, 동일 크기 여부를 기록한다. 여섯 장 모두 같은 위치·크기·카메라에서 매스몬 전신이 보여야 하며, 컨택시트에서 한 장이라도 빠지거나 위치가 튀면 세트 전체를 다시 만든다.
- 단계 상승 연출에 쓰는 세트는 인접 단계끼리 실제 장면 변화가 한눈에 보여야 한다. 런타임은 모달이 열린 동안 이전 `src`를 유지하고, 모달이 닫힌 뒤 새 `src`로 바꾸며 효과를 시작한다. 하네스에는 임계값을 넘는 고정 fixture를 두고 전후 파일명·단계 ID·전용 효과 클래스가 함께 바뀌는지 검사한다.
- 최종 결과 단계 세트는 각 장에 `visualRank: 0..N-1`을 부여하고 단계마다 서로 다른 1280×800 완성 장면을 통째로 생성한다. 배경·캐릭터·보상물·마법 효과·환경 조명·고정 제목·빈 동적 판·버튼 표면은 같은 생성 이미지 안에 있어야 한다. 기존 배경에 별도 효과 자산을 얹거나 opacity·brightness·hue로 단계처럼 보이게 하는 방식은 실패다.
- 단계가 오를 때는 효과 크기·입자 밀도·문양 복잡도·색 계열·캐릭터 반응·배경 조명 중 두 가지 이상이 분명히 달라져야 한다. 최상위 단계는 금빛·무지개처럼 범주가 바뀌는 색 변화가 있어야 하며, 이름 없는 컨택시트만 보아도 순서가 읽혀야 한다.
- 결과 단계 자산 계약에는 `stateCount`, `expectedStates`, `expectedRanks`, `canvas`, `runtimeSlot`, `objectFit`, `nativeScenePerState`, `forbidEffectOverlay`, `forbidBlendMode`, `forbidTierCssFilter`, `colorFamily`를 기록한다. 별도 `impactImage`, 효과 `<img>`, blend mode, 등급별 CSS filter가 있으면 하네스에서 실패시킨다. 자산 컨택시트와 실제 브라우저 결과 컨택시트를 모두 만들어 데스크톱·태블릿 가로에서 전 장을 확인한다.
- 빈 동적 결과판이 포함된 완성 장면은 각 이미지의 판 중심도 상태 계약에 기록한다. 브라우저가 실제 실행 이미지 픽셀에서 판의 연속 경계를 검출하고 상태별 선언 축·글리프·막대·정답 이미지 중심과 비교해야 하며, JSON 슬롯끼리만 맞는 검사는 인정하지 않는다. 이미지별 판 위치가 다르면 상태별 축을 쓰고 원본 Stage 기준 중심 오차를 `3px` 이내로 제한한다.
- 생성 후 파일 치수만 확인하지 않는다. 실제 표시 비율로 전체 컨택시트를 만들고, 각 행/칸에 파일명·상태명·크기를 표시한다.
- 세트 필수 개수는 전수 검사한다. 예를 들어 6단계 로봇 목표판이면 6장 모두 로봇 슬롯 6개가 보여야 하며, 1장이라도 5개만 보이면 세트 전체를 실패로 보고 다시 만든다.
- runtime 연결 뒤에는 브라우저에서 `naturalWidth/naturalHeight`, 렌더된 `getBoundingClientRect()`, `object-fit`, `aspect-ratio`, 캐시 버전이 의도와 같은지 확인한다. 파일은 맞는데 브라우저에서 잘리거나 눌리면 실패다.
- 세로가 부족하면 이미지를 좌우로 줄이거나 `object-fit: fill`로 찌그러뜨리지 않는다. 슬롯 높이와 주변 레이아웃을 다시 나누고, 위 검정 빈칸·아래 흰 줄·회색 여백 같은 가장자리 결함이 보이면 실패다.
- `README.md`/`REPORT.md`에는 현재 기준 크기, 세트 개수, 컨택시트 경로, 브라우저 QA 화면 크기를 남긴다. 실패했던 이전 크기와 현재 runtime 크기를 같은 문장에 섞어 쓰지 않는다.

## 작업 절차

1. **현황 확인**: `catalog.json`, active/legacy 팩, contact sheet를 확인한다.
2. **재사용 판단**: 기존 active 팩으로 충분하면 새 이미지를 만들지 않는다.
3. **팩 추가**: 새 팩이 필요하면 `_shared/mathmon/<pack-id>/`에 `manifest.json`, `raw-chromakey/`, `png/`, `webp/`, `contact-sheets/`를 만든다.
4. **이미지 생성**: `STYLE_GUIDE.md`의 V1 프롬프트 기준으로 flat chroma-key 원본을 만들고 `raw-chromakey/`에 저장한다.
5. **후처리**: chroma-key 제거 → 투명 `768x768` PNG → WebP quality 82~86 → contact sheet 생성.
6. **등록**: 팩 `manifest.json`과 `_shared/mathmon/catalog.json`을 갱신한다.
7. **차시 연결**: 차시 폴더에는 필요한 WebP만 복사하고 `index.html`의 매스몬 참조를 그 경로로 바꾼다. 단, 첫 화면 커버 동행용으로 기존 매스몬 WebP를 얹지 않는다. 커버에 매스몬이 필요하면 `cover-generated.webp` 자체를 매스몬 포함 장면으로 다시 생성한다. 결과 정답 수는 차시 폴더로 복사하지 말고 `../_shared/result-count/result-correct-N-generated.webp`를 직접 참조한다.
   - 시작 버튼은 예외로 차시 폴더에 복사하지 않고 공용 `../_shared/mathmon/cover-start-button/start-button-generated.webp`를 직접 참조한다.
8. **상태 세트 검증**: 상태별 이미지 세트라면 컨택시트에서 전 장의 개수·기준선·잘림·찌그러짐을 먼저 확인하고, 브라우저에서 실제 렌더 크기까지 확인한다.
9. **검증**: JSON 파싱, 파일 개수, alpha, 레거시 실행 참조 제거, 로컬 200, 브라우저 이미지 로드를 확인한다.

## 금지

- 차시 폴더에만 새 매스몬을 생성하거나 저장하지 않는다.
- 새 차시나 큰 커버 수정에서 시작 버튼을 생성하지 않는다. 공용 버튼을 바꿀 수 있는 경우는 사용자가 명시적으로 승인한 브랜드 변경뿐이다.
- 원본 PNG, raw chroma-key, contact sheet를 차시 폴더에 복사하지 않는다.
- V2 팩을 새 차시에 기본값으로 쓰지 않는다.
- 톱니바퀴, 자석, 상자, 컨베이어 같은 사물 자체를 매스몬 몸으로 만들지 않는다.
- 매스몬을 별도 도감/점수/수집 시스템으로 전면화하지 않는다.
- 첫 화면 커버에서 기존 매스몬 PNG/WebP를 `.cover-mathmon` 같은 별도 `<img>`로 올려 배경과 한 장면처럼 보이게 하지 않는다. 새 차시와 리마스터는 매스몬을 커버 프롬프트에 포함해 처음부터 한 장면으로 생성한다.
- 로컬 폰트, Pillow, canvas, SVG, CSS 캡처, 기존 PNG/WebP 겹치기 등으로 매스몬·배경·버튼·문구를 조합해 생성형 이미지처럼 보이게 만드는 로컬 합성은 금지한다.
- 로컬 합성은 사용자가 먼저 명시적으로 허락한 경우에만 예외로 쓴다. 허락 없이 로컬 합성 결과물을 매스몬 장면, 보상 모달, 결과 화면, 타이틀 아트의 최종 생성 이미지로 연결하면 실패다.
- 결과 화면에서 섬 이름, 도착 라벨, 칭찬 문구, 다시하기 버튼처럼 매 판 똑같은 요소는 생성 이미지 안에 포함하는 것을 기본값으로 한다. 정답 수는 공용 생성형 숫자 이미지 세트를 쓰고, 점수처럼 범위가 넓은 값만 HTML/CSS/SVG 오버레이로 남긴다.
- 허용되는 후처리는 생성형 원본의 의미를 바꾸지 않는 배경 제거, 크롭, 리사이즈, WebP 변환, 용량 최적화까지다.
- 기존 contact sheet를 보지 않고 비슷한 실루엣을 새로 만들지 않는다.

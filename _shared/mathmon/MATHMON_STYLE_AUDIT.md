# 매스몬 스타일 감사

작성일: 2026-07-04

## 결론

현재 문서에는 `mathmon-v1-anime-sticker`가 활성 기준으로 적혀 있지만, 실제 contact sheet를 보면 같은 styleId 안에서도 그림체 차이가 큽니다. 앞으로는 `styleId`가 아니라 1단원 기본 10종과의 실제 시각 일치 여부로 실행 기준을 나눕니다. 1단원 기본 10종은 없애지 않고 원본 표준으로 고정합니다.

## 기준

기준 이미지는 아래 두 파일입니다.

- `_shared/mathmon/base-pack/contact-sheets/base-pack-contact-sheet.png`
- `3-2-1-1-mathmon-box-run/screenshots/10-mathmon-collection.png`

승인 기준:

- 둥근 동물/판타지 생물 본체
- 따뜻한 짙은 외곽선
- 고광택 2D 게임 스티커 채색
- 성격에 맞게 달라지는 눈·입·표정
- 카드형 아이콘에서 잘 읽히는 머리·몸·팔다리 비율
- 768×768 중앙 전신 배치와 70~82% 정도의 카드 점유감
- 테마는 작은 소품·의상·배지로만 표현
- 한 팩 안에 귀여움, 사랑스러움, 멋짐, 강함, 살짝 포악한 야생성, 신비감 중 여러 축이 함께 있음

탈락 기준:

- 수채화, 회화풍, 3D 장난감, 점토, 봉제 인형, 일러스트북처럼 보임
- 소품이 캐릭터보다 먼저 보임
- 캐릭터마다 선 두께, 카메라 거리, 여백, 얼굴 비율이 다름
- 기존 10종보다 훨씬 길쭉하거나 성숙한 비율
- 모든 캐릭터가 같은 큰 눈, 같은 미소, 같은 둥근 몸, 같은 소품으로 반복됨

## 2026-07-04 50마리 후보 처리

아래 Codex 생성 이미지 폴더의 5개 10마리 시트는 기준 확정 과정에서 만든 후보입니다.

`/Users/yubyeongju/.codex/generated_images/019f2c66-1a96-7221-8f5c-e685fc026ea0/`

판정: `draft-style-review`

전체 50마리는 실행 팩으로 바로 쓰지 않습니다. 일부 캐릭터가 쓸 만해 보여도 기준 통과 없이 자르거나 후처리해 쓰지 않습니다. 실행 연결은 개별 캐릭터를 자르고, 배경을 제거하고, 1단원 기본 10종 옆에서 비교 승인한 경우에만 허용합니다.

## 2026-07-04 다양성 스펙트럼 후보팩

사용자가 새로 정리한 기준에 따라 `diversity-spectrum-draft` 후보팩을 만들었습니다.

- 위치: `_shared/mathmon/diversity-spectrum-draft/`
- 상태: `draft-style-review`
- 구성: 10마리 contact sheet 5장, 총 50마리 후보
- 방향: 1단원 기본 10종은 그대로 두고, 새 후보에서는 귀여움·사랑스러움·멋짐·강함·살짝 포악한 야생성·신비감을 크게 섞습니다.
- 주의: 이 후보팩은 아직 실행 자산이 아닙니다. 개별 캐릭터를 자르고, 배경을 제거하고, 1단원 기본 10종 옆에서 비교 승인한 뒤에만 차시에 연결합니다.

## 2026-07-04 다양성 보상 승인팩

`diversity-spectrum-draft`에서 1-1 보상용 10종을 선별해 `diversity-reward-pack`으로 승격했습니다.

- 위치: `_shared/mathmon/diversity-reward-pack/`
- 상태: `active-approved`
- 사용처: `3-2-1-1-mathmon-box-run`
- 구성: 낮은 점수의 작고 귀여운 매스몬에서 높은 점수의 멋짐·야생성·신비감·전설급 매스몬으로 올라가는 10단계 보상 라인업
- 보존: 1단원 기본 10종 PNG와 `base-pack`은 삭제하지 않고 기준 원본으로 남깁니다.

## 팩별 상태

| 팩 | 현재 상태 | 판단 |
| --- | --- | --- |
| `base-pack` | `active-baseline` | 1단원 기본 10종 기준 팩입니다. 새 차시와 리마스터의 원본 표준입니다. |
| `zero-factory-animal-pack` | `active-approved` | base-pack과 가장 가까운 동물형 2D 스티커 톤입니다. 0 공장 소품만 붙어 있어 유지합니다. |
| `diversity-reward-pack` | `active-approved` | 1-1 상자런 점수 보상 전용 승인 팩입니다. 낮은 단계는 귀엽게, 높은 단계는 강하고 전설적으로 보이게 배열했습니다. |
| `diversity-spectrum-draft` | `draft-style-review` | 50마리 후보 contact sheet입니다. 개별 승인 전까지 실행 화면에 직접 연결하지 않습니다. |
| `circle-pack` | `style-review-runtime` | 기존 3단원 실행 보존용입니다. 카드형 contact sheet와 개별 캐릭터의 선·명암·비율이 base-pack보다 세밀해 새 차시 기준으로 쓰지 않습니다. |
| `fraction-pack` | `style-review-runtime` | 기존 4단원 실행 보존용입니다. 일부 캐릭터는 base-pack과 가까우나 팩 전체 크기감과 소품 밀도가 달라 재승인이 필요합니다. |
| `fraction-friends-pack` | `draft-style-review` | 준비 팩입니다. 기존 4단원 화면에 직접 연결하기 전 base-pack 기준으로 재검수하거나 재생성합니다. |
| `explorer-pack` | `style-review-runtime` | 2단원 일부 실행 사용처가 있으나 수채화·회화풍 느낌과 비율 차이가 커서 새 차시에 쓰지 않습니다. |
| `weight-pack` | `style-review-runtime` | 5-4 실행 보존용입니다. base-pack 여우와 같은 계열이지만 단일 캐릭터라 단원 팩 기준으로는 부족합니다. 5단원 1~3차시에는 바로 확장하지 않습니다. |
| `robot-fusion-action-pack` | `exception-runtime` | 1-4 문제 화면 로봇 상태 스프라이트입니다. 매스몬 공용 보상팩이 아니라 차시 전용 예외 자산입니다. |
| `zero-factory-pack` | `preserved` | 사물형·기계형 본체가 많아 실행 기준에서 제외합니다. |
| `core-pack-v2` | `preserved` | 3D 장난감/클레이풍이라 V1 기준과 다릅니다. |
| `zero-factory-pack-v2` | `preserved` | 3D 장난감/사물형이라 V1 기준과 다릅니다. |

## 새 작업 원칙

1. 5단원 1~3차시는 전용 매스몬 팩을 새로 섞지 않습니다. 우선 base-pack 또는 승인된 zero-factory-animal-pack만 씁니다.
2. 새 단원 전용 팩이 필요하면 한 번에 4종 또는 10종을 같은 프롬프트와 같은 후처리로 만들고, contact sheet를 먼저 승인합니다.
3. `style-review-runtime` 팩은 기존 차시 실행을 보존하기 위한 임시 상태입니다. 새 차시 구현이나 리마스터 복제 기준으로 쓰지 않습니다.
4. 커버와 결과 장면 안에 이미 baked-in 된 매스몬은 팩 교체만으로 통일되지 않습니다. 장면 이미지 자체를 캐릭터 없는 배경 또는 승인 매스몬 포함 장면으로 다시 생성해야 합니다.

## 리마스터 우선순위

1. 2단원: `UNIT2_COMPANION_REGEN_GUIDE.md` 기준으로 baked-in generic 캐릭터를 제거하고 base-pack 동행으로 통일합니다.
2. 3단원: `circle-pack`을 계속 쓸지, base-pack 재사용으로 갈지 먼저 결정한 뒤 커버/결과 장면을 다시 맞춥니다.
3. 4단원: `fraction-pack`과 `fraction-friends-pack` 중 하나를 승인하거나 base-pack 재사용으로 돌아갑니다. 선택 전까지 새 분수 매스몬을 화면에 더 연결하지 않습니다.
4. 5단원: 1~3차시는 base-pack으로 시작하고, 5단원 전용 팩은 별도 승인 루프 뒤에만 만듭니다.

## 실행 화면 분류

- 직접 컷아웃 교체형: `3-2-1-1`, `3-2-1-2`, `3-2-1-3`, `3-2-2-*`, `3-2-4-*`, `3-2-5-4`의 `assets/mathmon/*` 또는 루트 매스몬 WebP/PNG 참조입니다. 승인 팩 WebP로 경로를 바꾸고, 차시 문서에 팩 id를 남깁니다.
- baked-in 장면 재생성형: 3단원 커버/결과처럼 생성 이미지 안에 매스몬이 이미 들어간 화면입니다. 파일 경로만 바꾸면 일관성이 맞지 않으므로 커버·결과 장면을 승인 매스몬 포함 장면으로 다시 생성합니다.
- 예외 보존형: `3-2-1-4`의 `robot-fusion-action-pack`은 로봇 합체 상태 스프라이트입니다. 매스몬 공용 보상팩이나 새 차시 기준으로 쓰지 않고, 해당 차시 전용 예외로만 보존합니다.

# 매스몬 스타일 감사

작성일: 2026-07-04

## 결론

현재 문서에는 `mathmon-v1-anime-sticker`가 활성 기준으로 적혀 있지만, 실제 contact sheet를 보면 같은 styleId 안에서도 그림체 차이가 큽니다. 앞으로는 `styleId`가 아니라 `base-pack` contact sheet와의 실제 시각 일치 여부로 실행 기준을 나눕니다.

## 기준

기준 이미지는 `_shared/mathmon/base-pack/contact-sheets/base-pack-contact-sheet.png`입니다.

승인 기준:

- 둥근 동물/판타지 생물 본체
- 선명한 컬러 외곽선
- 밝은 2D 애니/스티커 채색
- 큰 눈, 짧은 입, 부드러운 볼터치
- 768×768 중앙 전신 배치
- 테마는 작은 소품·의상·배지로만 표현

## 팩별 상태

| 팩 | 현재 상태 | 판단 |
| --- | --- | --- |
| `base-pack` | `active-baseline` | 기준 팩입니다. 새 차시와 리마스터의 기본 비교 대상입니다. |
| `zero-factory-animal-pack` | `active-approved` | base-pack과 가장 가까운 동물형 2D 스티커 톤입니다. 0 공장 소품만 붙어 있어 유지합니다. |
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

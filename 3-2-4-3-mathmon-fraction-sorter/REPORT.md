# 매스몬 분수 분류 컨베이어 제작 보고

## 이번 개편

- 어두운 컨베이어 패널과 드래그 통을 밝은 이미지형 분류 작업대로 교체했습니다.
- 한 화면 한 행동을 `분수 이름 하나 고르기`로 고정했습니다.
- 숫자 분수와 같은 양의 막대 모형을 한 덩어리로 보여 줍니다. 가분수는 한 전체를 넘는 막대, 대분수는 자연수만큼 찬 막대와 남은 진분수 막대로 보입니다.
- 선택지에는 이름뿐 아니라 분류 근거도 함께 적었습니다. 학생은 색이 아니라 `분자 < 분모`, `분자 ≥ 분모`, `자연수 + 진분수` 관계로 판단할 수 있습니다.
- 10문제는 진분수 4개, 가분수 3개, 대분수 3개를 항상 포함합니다. `6/6`처럼 분자와 분모가 같은 가분수도 넣었습니다.
- 정답·오답 뒤 고른 이름을 모형 옆에 붙여 판단 결과를 바로 확인합니다.

## 생성형 이미지 자산

- 문제 무대 계약: 1280×800, 왼쪽 마법 컨베이어와 분류 장치, 오른쪽 넓은 민트색 작업 공간, 글자·숫자·UI·분수 도형 없음
- 원본: `problem-stage-source.png`
- 배포 PNG: `problem-stage-generated.png`
- 런타임 WebP: `problem-stage-generated.webp`

## 2026-07-12 시각 흐름 리마스터

- 승인된 `zero-factory-animal-pack` 판다몬을 커버·설명·보상·결과까지 같은 주인공으로 유지했습니다.
- 설명 1은 진분수·가분수·대분수의 수 관계와 막대 모형을 세 칸으로 나란히 비교합니다.
- 설명 2는 `10문제 → 컨베이어 빛 변화 → 마지막 라인 이름`만 보여 줍니다.
- 랜덤 보상 6종과 결과 6단계를 각각 다른 이미지로 만들었습니다.
- 결과 6장은 1280×800이며 고정 등급명·`다시` 버튼과 빈 동적 정보판의 위치를 통일했습니다.
- 결과 컨택시트: `result-tiers-v2-contact-sheet.png`
- 표지 왼쪽 위는 실제 `eduitit-logo-mark.png`를 공용 상단 슬롯에 표시합니다.
- 닫힌 보상과 열린 보상은 각각 `07-reward-closed.png`, `07b-reward-open.png`로 검수했습니다.

## 검증

- `node scripts/qa-engine-unit4-sorter-source.mjs` 통과
- lesson engine build, lesson contract, Stage ratio 검사 통과
- `node scripts/check-lesson-visual-contract.mjs` 통과
- `node scripts/qa-lesson-flow.mjs 3-2-4-3-mathmon-fraction-sorter` 통과

브라우저 QA는 1280×800과 1024×768에서 첫 화면, 설정, 설명 2장, 문제, 오답, 정답 확인, 보상, 결과를 확인했습니다. 스크린샷은 `screenshots/engine-flow-desktop-*`와 `screenshots/engine-flow-tablet-landscape-*`에 있습니다.

## 텍스트 넘침·요소 겹침 QA

- 확인 크기: 1280×800, 1024×768
- 결과: 글자 넘침 0건, 요소 겹침 0건, Stage 밖 이탈 0건, 이미지 로드 실패 0건

## Humanizer 학생 문구 QA

설명과 문제 문구는 `분자와 분모의 크기를 봐요.`, `자연수와 진분수가 함께 있어요.`처럼 짧게 정리했습니다. 화면에서 바로 확인할 수 없는 제작자 용어는 사용하지 않았습니다.

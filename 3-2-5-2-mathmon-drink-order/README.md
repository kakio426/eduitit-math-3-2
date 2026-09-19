# 매스몬 음료 제조 주문

3학년 2학기 5단원 2차시 실행 패키지입니다. 친숙한 용기의 그림과 비교 문장을 보고 들이를 어림하고, 직접 잰 값과 비교해 어림이 알맞은지 판단한 뒤 `L`, `mL` 계산으로 이어집니다.

- 학생 목표: `기준으로 어림하고 들이를 계산해요.`
- 문제: 10문제
- 핵심: 기준 어림, 어림값의 적절성 판단, 들이의 덧셈·뺄셈, 받아올림·받아내림
- 실행: `index.html`

## 구현

- 공용 엔진: `_engine/v1/`
- 공용 Unit 5 모델·뷰·스타일: `_lessons/_shared/unit5-measurement/`
- 차시 설정: `_lessons/3-2-5-2-mathmon-drink-order/lesson.json`
- 빌드: `node scripts/build-lesson.mjs 3-2-5-2-mathmon-drink-order`

첫 어림 문제는 `1L 우유갑`과 `물뿌리개`를 함께 보여 주고, 두 용기에 담을 수 있는 양을 비교한 뒤 알맞은 어림값을 고르게 합니다. 이어서 직접 잰 값을 보고 어림값을 고른 뒤 두 값이 가까운지 확인하게 합니다. 계산 문제는 L 자리와 mL 자리를 나눈 세로 계산판으로 보여 줍니다. 받아내림 때 빌린 `1 L`는 계산 중 `1000 mL`로 풀어 표시합니다.

3번과 4번의 어림 확인 문제는 직접 잰 값 `900mL` 또는 `600mL`를 먼저 보여 줍니다. 학생은 `약 1L` 또는 `약 500mL`를 고른 다음, 두 값이 가까워 어림이 알맞다는 근거를 고릅니다. 따라서 이 단계는 두 수의 차이만 계산하는 문제가 아니라 어림값의 적절성을 판단하는 문제입니다.

## 흐름과 보상

```text
표지 → 방법 1 → 방법 2 → 10문제 → 보상 모달 → 결과
```

`mathmon-unified-reward-v2`의 `modal-art` 보상 방식을 씁니다. 문제 화면을 유지한 채 보상 모달에서 닫힌 주문 컵을 열고, 주문 점수를 확인한 뒤 다음 문제로 이어집니다. 기존 주문 6단계 진행·결과 장면은 유지합니다.

## 새 생성 자산

- `tutorial-page-1-v4-source.png` / `tutorial-page-1-v4-generated.webp`
- `tutorial-page-2-v2-source.png` / `tutorial-page-2-v2-generated.webp`
- `estimate-watering-can-milk-carton-v1-source.png` / `estimate-watering-can-milk-carton-v1-generated.webp`
- `estimate-water-bottle-v1-source.png` / `estimate-water-bottle-v1-generated.webp`
- `estimate-paper-cup-v1-source.png` / `estimate-paper-cup-v1-generated.webp`
- `estimate-pot-bottle-v1-source.png` / `estimate-pot-bottle-v1-generated.webp`

1쪽은 `기준을 찾아요 → 비슷한 용기를 찾아요 → 약 1L로 어림해요`의 한 예시를 보여 줍니다. 화면 설명은 `양을 알고 있는 용기와 비교해서 어림해요.`로 안내합니다. 생성 그림은 어림 상황만 돕고 정답의 유일한 근거가 되지 않습니다.

1~4번 기준 어림 문제는 각각 `우유갑–물뿌리개`, `500mL 생수병–물병`, `200mL 컵–종이컵`, `2L 생수병–냄비` 비교 그림을 보여 줍니다. 화면에는 비교 그림과 `두 용기에 담을 수 있는 양이 비슷해요.`라는 관계 문장을 함께 보여 주며, 정답은 문제 데이터가 판정합니다. 이 보강은 비교 근거를 모든 같은 유형 문항에 일관되게 제공하는 것이고, 차시 전체의 성취기준 적합성 판정과는 별개입니다.

기존 보상 주인공은 `zero-factory-animal-pack`의 냥냥몬을 유지하며, 결과 6단계는 `result-tiers-v5-contact-sheet.png`에서 함께 확인합니다.

문제 화면 진행 장면은 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-2/play-progress-v1/source`, `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-2/play-progress-v1/contact-sheets/play-drink-progress-v1-contact-sheet.png`, `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-2/play-progress-v1/contact-sheets/play-drink-progress-v1-anchor-audit.png`를 기준으로 유지합니다.

## 검증

```sh
node scripts/build-lesson.mjs 3-2-5-2-mathmon-drink-order
node scripts/qa-lesson-flow.mjs 3-2-5-2-mathmon-drink-order
node scripts/verify-mathmon-delivery.mjs --lesson=3-2-5-2-mathmon-drink-order
```

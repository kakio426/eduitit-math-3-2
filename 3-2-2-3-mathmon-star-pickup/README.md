# 매스몬 별 줍기

3학년 2학기 2단원 3차시, 나머지가 있는 나눗셈 게임입니다.

동행 매스몬 팩은 `base-pack`, 주인공은 유니콘몬입니다.

## 학습 조작

1. 몫 주변의 세 보기에서 처음 수를 넘지 않는 가장 큰 묶음 수를 고릅니다.
2. 너무 작게 고르면 한 묶음을 더 만들 수 있는 별이 보이고, 너무 크게 고르면 모자란 별이 빨간 칸으로 보입니다.
3. 묶고 남은 밝은 별 수를 한 번에 고릅니다.
4. `나누는 수 × 몫 + 나머지 = 처음 수` 완성식을 확인한 뒤 별병을 엽니다.

## 이미지 계약

- 설명 2장: 가장 많이 묶기와 남은 별 세기 / 10문제·별병 열기·결과
- 설명 1 원본: `tutorial-page-1-v4-source.png`, 실행 자산: `tutorial-page-1-generated.webp`(1280×800)
- 문제 장면 3장: 대기 / 묶는 중 / 별병 점등, 각 1280×800
- 유니콘몬 반응 3장: 정답 / 오답 / 보상
- 보상: 닫힌 별병 1장 + 사건 6종
- 결과: UI 없는 은하 장면 + 등급명 이미지 6장 + 정답 수 + 별빛 + 생성형 다시 버튼
- 컨택시트: `problem-state-contact-sheet.png`, `result-title-contact-sheet.png`, `_shared/mathmon/base-pack/contact-sheets/reactions-unit2/unicornmon-reactions-contact-sheet.png`

## 검증

```bash
node scripts/build-lesson.mjs 3-2-2-3-mathmon-star-pickup
node scripts/qa-lesson-model.mjs 3-2-2-3-mathmon-star-pickup
node scripts/qa-lesson-flow.mjs 3-2-2-3-mathmon-star-pickup
node scripts/check-stage-ratio.mjs
node scripts/check-lesson-contract.mjs
node scripts/check-lesson-visual-contract.mjs
```

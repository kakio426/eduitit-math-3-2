# 매스몬 나누기 농장

3학년 2학기 2단원 1차시, 내림 없는 두 자리 수 나눗셈 게임입니다.

동행 매스몬 팩은 `base-pack`, 주인공은 여우몬입니다.

## 학습 조작

문제 화면은 `한 화면 한 결정`과 점진적 공개 방식으로 구성했습니다. 현재 계산 하나와 선택지 네 개만 보입니다.

1. 10개 묶음의 몫을 고릅니다.
2. 낱개의 몫을 고릅니다.
3. 두 숫자로 전체 몫을 만듭니다.

숫자를 고르면 선택지는 사라지고 방금 완성한 계산만 잠깐 보입니다. 다음 계산은 `soft step transition`으로 부드럽게 나타나며, `prefers-reduced-motion`에서는 이동 없이 바뀝니다.

## 이미지 계약

- 표지: 글자 없는 `cover-generated.webp` + 생성형 제목·시작 버튼
- 설명: 실제 조작과 10문제·직접 여는 보상을 보여 주는 2장, 각 1280×800
- 문제 장면: `대기 / 진행 / 완료` 3장, 각 1280×800
- 매스몬 반응: 여우몬 `정답 / 오답 / 보상` 3장, 각 512×640
- 보상: 닫힌 바구니 1장 + 사건 6종
- 결과: UI 없는 농장 장면 + 등급명 이미지 6장 + 공용 정답 수 이미지 + 수확 값 + 생성형 `다시` 버튼
- 컨택시트: `problem-state-contact-sheet.png`, `result-title-contact-sheet.png`, `_shared/mathmon/base-pack/contact-sheets/reactions-unit2/foxmon-reactions-contact-sheet.png`

## 실행과 검증

```bash
node scripts/build-lesson.mjs 3-2-2-1-mathmon-divide-farm
node scripts/qa-lesson-model.mjs 3-2-2-1-mathmon-divide-farm
node scripts/qa-lesson-flow.mjs 3-2-2-1-mathmon-divide-farm
node scripts/check-stage-ratio.mjs
node scripts/check-lesson-contract.mjs
node scripts/check-lesson-visual-contract.mjs
```

소스는 `_lessons/3-2-2-1-mathmon-divide-farm/`, 독립 실행 배포본은 이 폴더의 `index.html`입니다.

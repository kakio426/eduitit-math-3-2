# 매스몬 저울 균형

3학년 2학기 5단원 3차시 실행 패키지입니다. 실제로 들어 보고 저울로 확인한 뒤, 같은 무게추와 `g`, `kg`, `t` 관계로 무게를 나타냅니다.

- 학생 목표: `같은 기준으로 무게를 재고 나타내요.`
- 문제: 10문제
- 핵심: 무게 비교 방법, 저울 읽기, 같은 무게추, `1 kg = 1000 g`, `1 t = 1000 kg`
- 실행: `index.html`

## 구현

- 공용 엔진: `_engine/v1/`
- 공용 Unit 5 모델·뷰·스타일: `_lessons/_shared/unit5-measurement/`
- 차시 설정: `_lessons/3-2-5-3-mathmon-scale-balance/lesson.json`
- 빌드: `node scripts/build-lesson.mjs 3-2-5-3-mathmon-scale-balance`

생성형 저울 받침 장면 위에 구조화된 빔과 접시를 올립니다. 모델의 무게 관계에 따라 무거운 접시가 내려가며, 물건 이름을 직접 표시해 왼쪽/오른쪽 반복을 줄였습니다.

## 흐름과 보상

```text
표지 → 방법 1 → 방법 2 → 10문제 → 단계 보상 → 결과
```

기존 수정부엉몬 6단계 진행·결과 장면과 결과 기준을 유지합니다.

## 새 생성 자산

- `tutorial-page-1-v2-source.png` / `tutorial-page-1-v2-generated.webp`
- `tutorial-page-2-v2-source.png` / `tutorial-page-2-v2-generated.webp`
- `balance-frame-v1-source.png` / `balance-frame-v1-generated.webp`

생성 그림은 맥락만 제공하고 저울 관계·수치·정답은 HTML과 모델 데이터로 검증합니다.

기존 보상 주인공은 `diversity-reward-pack`의 수정부엉몬을 유지합니다. 결과 6단계는 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-3/result-fullscene-v1/contact-sheets/result-tiers-v6-contact-sheet.png`에서 함께 확인합니다.

문제 화면 진행 장면은 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-3/play-progress-v1/source`, `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-3/play-progress-v1/contact-sheets/play-scale-progress-v1-contact-sheet.png`, `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-3/play-progress-v1/contact-sheets/play-scale-progress-v1-anchor-audit.png`를 기준으로 유지합니다.

## 검증

```sh
node scripts/build-lesson.mjs 3-2-5-3-mathmon-scale-balance
node scripts/qa-lesson-flow.mjs 3-2-5-3-mathmon-scale-balance
node scripts/verify-mathmon-delivery.mjs --lesson=3-2-5-3-mathmon-scale-balance
```

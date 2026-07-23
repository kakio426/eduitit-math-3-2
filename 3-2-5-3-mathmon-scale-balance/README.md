# 매스몬 저울 균형

3학년 2학기 5단원 3차시 단일 HTML 게임입니다. 학생은 kg·g·t를 비교하고, 저울을 수평으로 만들 무게추를 고릅니다.

## 실행과 소스

- 실행 파일: `index.html`
- 차시 설정: `_lessons/3-2-5-3-mathmon-scale-balance/lesson.json`
- 공유 모델·화면·스타일: `_lessons/3-2-5-1-mathmon-water-fill/`
- 빌드: `node scripts/build-lesson.mjs 3-2-5-3-mathmon-scale-balance`
- 시작 버튼: `_shared/mathmon/cover-start-button/start-button-generated.webp`

## 학습 흐름

```text
첫 화면 → 설명 1·2 → 무게 비교/균형 문제 → 저울 변화 확인 → 저울 보기 → 결과
```

- 비교 문제: 선택 전 저울은 항상 수평
- 선택 뒤: 실제 무게 차이에 맞춰 저울이 기울어짐
- 균형 문제: 학생이 고른 무게추를 실제 왼쪽 접시에 표시
- 피드백: `100g 부족해요.`, `오른쪽이 100g 더 무거워요.`
- 선택지: 더 무거운 쪽·같음 또는 실제 무게추만 사용
- 정답 경로 수학 입력: 최소·중앙·평균·최대 모두 `1`

## 보상과 결과

보상 화면에는 변화 문구 한 덩어리만 보입니다. 결과 컨택시트는 `result-states-contact-sheet.png`입니다.

사용 팩은 승인된 `diversity-reward-pack`, 매스몬은 `mathmon-drv-05-crystalowl`입니다.

## 브라우저 증거

`screenshots/qa5-<viewport>-<state>.png`에서 `1280×800`, `1024×768`, `1280×720 / DPR 2`의 대기·오답·정답·보상·결과를 확인할 수 있습니다. 텍스트 넘침·요소 겹침 0건, 터치 영역 42×42px 이상을 통과했습니다.

세로 스마트폰은 지원 범위가 아닙니다.

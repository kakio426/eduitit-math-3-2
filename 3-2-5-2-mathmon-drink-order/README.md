# 매스몬 음료 제조 주문

3학년 2학기 5단원 2차시 단일 HTML 게임입니다. 학생은 L와 mL의 자리를 맞춰 더하고 빼며, 만든 양을 주문량과 비교합니다.

## 실행과 소스

- 실행 파일: `index.html`
- 차시 설정: `_lessons/3-2-5-2-mathmon-drink-order/lesson.json`
- 공유 모델·화면·스타일: `_lessons/3-2-5-1-mathmon-water-fill/`
- 빌드: `node scripts/build-lesson.mjs 3-2-5-2-mathmon-drink-order`
- 시작 버튼: `_shared/mathmon/cover-start-button/start-button-generated.webp`

## 학습 흐름

```text
첫 화면 → 설명 1·2 → 들이 계산 → 단계별 확인 → 주문 보기 → 결과
```

- 더하기: mL 합 → `1000mL = 1L`로 바꾸기 → L까지 더하기
- 빼기: `1L = 1000mL`로 바꾸기 → mL 빼기 → L까지 빼기
- 주문 비교: 만든 양과 주문량을 같은 축에서 비교
- 다음 단계: 정답 전까지 `?` 잠금
- 오답: 학생이 고른 값을 계산판에 넣고 현재 오개념만 한 줄로 표시
- 정답 경로 수학 입력: 최소 `1`, 중앙값 `3`, 평균 `2.4`, 최대 `3`

## 보상과 결과

보상 화면에는 변화 문구 한 덩어리만 보입니다. 기존 결과 4단계와 보상 확률은 유지합니다.

결과 컨택시트는 `result-states-contact-sheet.png`입니다. 사용 팩은 `zero-factory-animal-pack`, 매스몬은 `zfa-04-nyangnyangmon`입니다.

## 브라우저 증거

`screenshots/qa5-<viewport>-<state>.png`에서 `1280×800`, `1024×768`, `1280×720 / DPR 2`의 표지부터 결과까지 확인할 수 있습니다. 세 화면에서 텍스트 넘침·요소 겹침 0건, 터치 영역 42×42px 이상, 완료 중심축 차이 1px 이하를 통과했습니다.

세로 스마트폰은 지원 범위가 아닙니다.

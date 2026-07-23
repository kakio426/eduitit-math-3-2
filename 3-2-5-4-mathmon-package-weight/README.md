# 매스몬 택배 무게 맞추기

3학년 2학기 5단원 4차시 단일 HTML 게임입니다. 학생은 kg와 g의 자리를 맞춰 더하고 빼며, 택배 무게가 한도에 맞는지 판단합니다.

## 실행과 소스

- 실행 파일: `index.html`
- 공통 엔진: `_engine/v1/`
- 차시 설정: `_lessons/3-2-5-4-mathmon-package-weight/lesson.json`
- 차시 모델·뷰·스타일: 같은 소스 폴더의 `model.js`, `view.js`, `lesson.css`
- 빌드: `node scripts/build-lesson.mjs 3-2-5-4-mathmon-package-weight`
- 시작 버튼: `_shared/mathmon/cover-start-button/start-button-generated.webp`

기존 단독 HTML 런타임은 `mathmon-engine-v1` 소스 구조로 전환했습니다. 이전 브라우저 증거는 `_archive/pre-engine-screenshots/`, 이전 클릭 가드는 `scripts/_archive/unit5-pre-engine/`에 보존합니다.

## 학습 흐름

```text
첫 화면 → 설명 1·2 → 무게 계산/한도 판단 → 완성 계산판 → 트럭 보기
→ 닫힌 상자와 현재 트럭 → 상자 열기 → 이전·다음 트럭 → 결과
```

- 더하기: g 합 → `1000g = 1kg`로 바꾸기 → kg까지 더하기
- 빼기: `1kg = 1000g`으로 바꾸기 → g 빼기 → kg까지 빼기
- 한도: 택배 무게 계산 → 택배와 한도를 같은 축에서 비교
- 단계 수: 더하기 3, 빼기 3, 한도 2
- 오답: 학생이 고른 값을 kg/g 열에 보존
- 피드백: `100g 적어요.`, `1000g을 아직 바꾸지 않았어요.`, `한도보다 90g 무거워요.`
- 정답 경로 수학 입력: 최소 `2`, 중앙값 `3`, 평균 `2.7`, 최대 `3`

## 보상과 결과

`stage-reveal` 보상은 기존 트럭 자산을 공통 엔진의 `onRewardPrepare`, `onRewardReveal` 훅으로 연결합니다. `formatLessonRewardTarget` 훅이 트럭 목표 문구를 만들며 농장 문구는 노출하지 않습니다.

| 결과 | 조건 |
| --- | --- |
| 평범 트럭 | 기본 |
| 살짝 멋진 트럭 | 힘 30, 바로 맞힌 문제 3개 |
| 번쩍 멋진 트럭 | 힘 70, 바로 맞힌 문제 7개 |
| 슈퍼 트럭 | 힘 100, 10문제 바로 정답, 슈퍼 부품 |

기존 보상 확률은 그대로 유지합니다. 결과 컨택시트는 `result-states-contact-sheet.png`, 트럭 변화 컨택시트는 `truck-evolution-contact-sheet.png`입니다. 사용 팩은 `base-pack`, 매스몬은 `base-02-foxmon`입니다.

## 브라우저 증거

`screenshots/qa5-<viewport>-<state>.png`에서 `1280×800`, `1024×768`, `1280×720 / DPR 2`를 확인할 수 있습니다. 짧은 DPR 2 화면에서도 보상 버튼과 Stage 아래 경계 사이의 여백은 16px 이상입니다.

세로 스마트폰은 지원 범위가 아닙니다.

# 매스몬 물통 채우기 시합

3학년 2학기 5단원 1차시 단일 HTML 게임입니다. 학생은 실제 눈금판을 보고 `mL`, `L와 mL`, 두 물통의 들이를 판단합니다.

## 실행과 소스

- 실행 파일: `index.html`
- 공통 엔진: `_engine/v1/`
- 차시 설정: `_lessons/3-2-5-1-mathmon-water-fill/lesson.json`
- 공유 모델·화면: `_lessons/3-2-5-1-mathmon-water-fill/model.js`, `view.js`
- 빌드: `node scripts/build-lesson.mjs 3-2-5-1-mathmon-water-fill`

첫 화면은 `generated-title-overlay`, `shared-canonical-v1`, `modal-controls` 계약을 사용합니다. 시작 버튼 그림은 차시 복제본이 아니라 `_shared/mathmon/cover-start-button/start-button-generated.webp`를 직접 참조합니다.

## 학습 흐름

```text
첫 화면 → 설명 1·2 → 눈금/비교 문제 → 정답 확인 → 물통 보기 → 결과
```

- `0~1000mL`: 100mL 간격 눈금
- `0~3L`: 1L 큰 눈금과 100mL 작은 눈금
- 오답: 학생이 고른 눈금과 실제 물높이를 함께 표시
- 피드백: `100mL 적어요.`, `200mL 많아요.`처럼 차이를 한 줄로 표시
- 정답 경로 수학 입력: 최소·중앙·평균·최대 모두 `1`

## 보상과 결과

보상 화면에는 변화 문구 한 덩어리만 보입니다. 기존 확률과 결과 조건은 유지합니다.

| 결과 | 조건 |
| --- | --- |
| 작은 물통 | 기본 |
| 반짝 물통 | 힘 30, 바로 맞힌 문제 3개 |
| 가득 물통 | 힘 70, 바로 맞힌 문제 7개 |
| 무지개 물탑 | 힘 100, 10문제 바로 정답, 특별 보상 |

결과 4상태 컨택시트는 `result-states-contact-sheet.png`입니다. 사용 팩은 `zero-factory-animal-pack`, 매스몬은 `zfa-06-penguinmon`입니다.

## 브라우저 증거

현재 캡처는 `screenshots/qa5-<viewport>-<state>.png`에 있습니다.

- 화면: `1280×800`, `1024×768`, `1280×720 / DPR 2`
- 상태: 표지, 설정, 설명 1·2, 대기, 작은/큰 오답, 정답 확인, 완성, 보상, 낮음/중간/최고 결과
- 검사: 텍스트 넘침 0, 영역 겹침 0, 42px 미만 터치 영역 0, 완료 중심축 차이 1px 이하

세로 스마트폰은 지원 범위가 아닙니다.

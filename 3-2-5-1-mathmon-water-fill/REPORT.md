# 매스몬 물통 채우기 시합 구현 보고서

## 구현 결과

정답이 문제 제목에 노출되던 문제를 없애고, 실제 100mL 눈금판과 오답 위치 표시를 넣었습니다. 선택지는 모두 `{ id, label, value, numericValue, misconceptionId, feedback, relation }` 구조를 사용합니다.

- 문제 제목: `물통 눈금 읽기`, `큰 물통 눈금 읽기`
- 작은 눈금판: `0~1000mL`, 100mL 간격
- 큰 눈금판: `0~3L`, 1L 큰 눈금과 100mL 작은 눈금
- 비교 선택지: `왼쪽 물통`, `오른쪽 물통`, `같아요`
- 비수학 선택지: 0건
- 대표 오답: 한 눈금 적음·많음, L 눈금 이동, 물높이 비교 반대

## 정답 확인과 Humanizer QA

오답을 고르면 빨간 선으로 학생의 눈금을 남기고 실제 물높이와 비교합니다. 정답 뒤에는 고른 값이 답 칸에 들어간 상태를 먼저 보여 준 다음 `물통 보기`로 이동합니다.

학생 문구는 한 문장 한 행동으로 점검했습니다.

- `물높이에 맞는 들이를 골라요.`
- `100mL 적어요.`
- `두 물통은 300mL 차이 나요.`

학생 화면의 제작자 용어와 번역투 표현은 0건입니다.

## 자산과 엔진

- 엔진: `mathmon-engine-v1`
- 소스 manifest: `_lessons/3-2-5-1-mathmon-water-fill/lesson.json`
- 시작 버튼: 공용 `shared-canonical-v1`
- 기존 커버·설명·보상·결과 이미지는 유지
- 결과 컨택시트: `result-states-contact-sheet.png`
- 매스몬 팩: `zero-factory-animal-pack`

## 텍스트 넘침·요소 겹침 QA

`node scripts/qa-lesson5-flow.mjs`에서 아래 상태를 각각 검사하고 캡처했습니다.

- `1280×800`
- `1024×768`
- `1280×720 / DPR 2`
- 표지, 설정, 설명 1·2, 문제 대기, 작은 답 오답, 큰 답 오답, 정답 확인, 완성값, 보상, 낮음·중간·최고 결과

현재 결과는 텍스트 넘침 0건, 문제·계산판·선택지 교차 0px, 터치 영역 42×42px 이상, 완료 전후 중심축 차이 1px 이하입니다. 대표 증거는 `screenshots/qa5-desktop-05-play-waiting.png`, `screenshots/qa5-desktop-06-wrong-low.png`, `screenshots/qa5-short-dpr2-10-complete.png`입니다.

## 화면 재점검 보완

두 번째 화면 점검에서 맨 위·아래 눈금 숫자가 물통 테두리에 걸리던 상태를 고쳤습니다. 가장 최근에 고른 오답만 빨간색으로 남고, 정답 뒤에는 이전 오답 색이 사라집니다. 완성 화면은 계산판의 완성값과 가운데 `물통 보기`만 남겨 같은 식을 반복하지 않습니다. 보상 화면의 빈 사각형은 현재 힘을 보여 주는 눈금과 방향 기호로 바꿨습니다.

전용 브라우저 QA는 `readMl`, `readLiterMl`, `compareBottle`을 세 viewport에서 각각 검사합니다. 글자 크기, 핵심 조작판 면적, Stage 밖 이탈, 물통 끝 눈금 경계, 문제 안쪽 라벨 교차도 종료 조건에 포함했습니다.

## 검증

- `node scripts/qa-lesson5-water-fill-model.mjs --runs 10000`
- `node scripts/simulate-lesson5-water-fill.mjs --runs 10000`
- `node scripts/qa-lesson5-flow.mjs`
- 루트 공통 하네스 검사는 5단원 1~4차시 보고서와 같은 최종 실행 묶음으로 확인합니다.

정답 경로 수학 입력은 최소 `1`, 중앙값 `1`, 평균 `1.0`, 최대 `1`입니다.

# 매스몬 택배 무게 맞추기

3학년 2학기 5단원 4차시 단일 HTML 게임입니다.

- 배움주제: kg와 g로 나타낸 무게의 덧셈·뺄셈과 어림
- 학생 행동: 택배 한도에 맞는 무게를 고르기
- 실행: `index.html`
- 지원 화면: 컴퓨터, 태블릿 가로

## 흐름

```text
표지 → 방법 1 → 방법 2 → 문제·정답 확인 → 닫힌 부품 상자 → 사건 공개 → 왼쪽 트럭 변화 → 결과
```

문제는 10개입니다. 정답을 고르면 선택값이 계산판에 먼저 들어가고 확인 문구를 읽은 뒤 다음 단계로 갑니다. 마지막에는 완성식을 본 뒤 학생이 `트럭 보기`를 눌러 보상을 엽니다.

## 화면 계약

- `<main class="game">`: `data-stage-ratio="16:10"`, `data-stage-size="1280x800"`
- 표지: `generated-title-overlay`, `shared-canonical-v1` 시작 버튼
- 설정: `modal-controls`, Stage 안 톱니 버튼
- 보상: `unit5-package-modal-art-v2`, 카드 560×480, 생성 그림 250×250
- 보상 전환: `modal-dismiss-world-impact-v2`, 모달 닫힘 뒤 320ms 여백 → 왼쪽 장면 교체와 강한 빛 1560ms → 다음 문제
- 문제 왼쪽 진행 보상: `stage-left-play-progress-v1`, 768×1536 전용 장면 6장, `object-fit: contain`
- 결과: 서로 다른 6개 생성 완성 장면 + 공용 생성 정답 수 + SVG 동적 힘/다음 목표
- 랭킹: 비활성
- 매스몬: 승인 활성 팩 `base-pack`의 여우몬 `base-02-foxmon`을 커버·결과 생성 장면 안에서 사용
- 소스 계약: `_lessons/3-2-5-4-mathmon-package-weight/lesson.json`의 `standalone-html-v1` 메타데이터로 공통 계약·시각 계약·브라우저 흐름 검사에 포함

## 보상

통합 사건 분포는 `64%/+6~10`, `15%/-5~-2`, `12%/+14~22`, `5%/+30`, `3.8%/0`, `0.2%/100`입니다. 오답은 문제당 처음 한 번만 `-6~-3`이며, 정답의 숨은 기본 가산값은 없습니다.

마지막 계산판을 그대로 둔 채 보상 카드가 모달로 열립니다. 학생이 `상자 열기`를 눌러야 사건 그림과 실제 변화량이 보입니다. 6개 사건은 각각 다른 생성 그림을 사용합니다.

`다음`을 누르면 보상 카드부터 닫힙니다. 320ms 뒤에 왼쪽 트럭 장면과 단계 효과가 나타나고, 그 효과를 1560ms 동안 보여 준 뒤에만 다음 문제로 넘어갑니다.

- 자산 전수표: `reward-events-v1-contact-sheet.png`
- 브라우저 증거: `screenshots/reward-event-*-open-*.png`

## 결과

결과는 `평범 트럭 → 살짝 멋진 트럭 → 파란 번개 트럭 → 번쩍 멋진 트럭 → 황금 축제 트럭 → 무지개 하늘 트럭` 6단계입니다. 단계마다 마을·창고·파란 도시·설산 기지·황금 축제·무지개 하늘 도시로 배경, 트럭 크기, 빛, 여우몬 반응이 함께 달라집니다. 제목과 다시 버튼 표면은 각 1280×800 완성 장면 안에 있고, 현재 힘·진행 막대·정답 수·다음 목표만 동적으로 표시합니다.

- 자산 전수표: `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/result-fullscene-v1/contact-sheets/result-tiers-v5-contact-sheet.png`
- 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/result-fullscene-v1/source/result-truck-*-v5-source.png`
- 브라우저 증거: `screenshots/result-tier-*-*.png`

문제 화면 왼쪽에는 최종 6단계와 1:1로 대응하는 전용 세로 장면을 둡니다. 최종 결과 이미지를 자르지 않았으며, 여우몬 전신과 트럭을 같은 카메라·발 기준선으로 보여 줍니다.

- 진행 장면 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/play-progress-v1/source`
- 진행 장면 전수표: `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/play-progress-v1/contact-sheets/play-truck-progress-v1-contact-sheet.png`
- 여우몬 중심·발 기준선 검수표: `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/play-progress-v1/contact-sheets/play-truck-progress-v1-anchor-audit.png`
- 브라우저 증거: `screenshots/play-progress-*-*.png`

## Humanizer QA

학생 문구는 한 문장에 행동 하나만 남겼습니다. 예: `다 더한 무게를 골라요.`, `다 뺀 뒤의 무게를 골라요.`, `한도에 맞는 말을 골라요.`, `1kg을 빌린 위 무게를 다시 써요.` 설명 그림도 같은 기준으로 고쳐 `1000g은 1kg으로 바꿔요.`, `한도와 비교해요.`로 표시합니다. 한도와 무게가 같은 문제도 정답이 될 수 있으므로 `한도보다 가벼워야 해요.`라는 잘못된 문구는 보이는 그림과 숨은 설명 데이터에서 모두 제거했습니다.

## 검증

```sh
node scripts/check-stage-ratio.mjs
node scripts/check-lesson-contract.mjs 3-2-5-4-mathmon-package-weight
node scripts/check-lesson-visual-contract.mjs 3-2-5-4-mathmon-package-weight
node scripts/qa-lesson-flow.mjs 3-2-5-4-mathmon-package-weight
node scripts/qa-lesson5-package-weight-model.mjs
node scripts/simulate-lesson5-package-weight.mjs
node scripts/qa-lesson5-package-weight-click-guards.mjs
```

공통 브라우저 명령은 `lesson.json`에 선언한 위임형 하네스를 실행합니다. 전용 브라우저 하네스는 1280×800, 1024×768, 1280×720, 994×632, 1082×987에서 닫힌/열린 보상 7상태, 사건 6종, 결과 6단계, 왼쪽 진행 6단계, 모달 이후 장면 변화 시간, 텍스트 넘침, 요소 교차, 연속 클릭 이월을 전수 검사합니다.

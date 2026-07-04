# 매스몬 별 줍기

에듀잇티 수학 게임 시리즈 3학년 2학기 2단원 3차시 패키지입니다.

- 대상: 3학년 2학기 수학
- 학습: 나머지가 있는 나눗셈에서 몫과 나머지를 구하고, 나머지가 나누는 수보다 작다는 뜻을 익힙니다.
- 문제: `(몇십몇) ÷ (몇) = 몫 ... 나머지`, 나머지 0 제외, 한 판 10문제
- 보상: 정답 문제는 별빛이 무작위로 변하고, 정답으로 확인한 나머지 별은 결과에서 보너스 별빛으로 더해집니다.
- 실행: `index.html`을 브라우저에서 열기

## 화면

```text
첫 화면 -> 설명 화면 -> 문제 풀이 -> 보상 -> 결과
```

- 첫 화면: 큰 별과 유니콘몬이 밤하늘 장면 안에 함께 포함된 `cover-generated.webp` 위에 `title-logo-generated.webp` 제목 래스터, 한 줄 목표, 생성형 `start-button-generated.webp` 시작 버튼을 얹습니다. 실제 제목은 접근성용 숨김 텍스트로 남깁니다.
- 설명 화면: 2쪽으로 나누어 몫·나머지·검산 흐름을 짧게 보여 줍니다.
- 문제 화면: `board-night.webp` 배경 위에서 몫 선택, 나머지 선택, 검산 자동 확인을 진행합니다. 마지막 검산 뒤에는 `별빛 열기`를 눌러 보상으로 넘어갑니다.
- 보상 화면: `star.webp`를 중심 보상으로 사용하며 유성우, 구름, 깜깜, 별똥별, 무지개 별 이벤트를 HTML/CSS로 표시합니다. 보이는 텍스트는 별빛 변화량 한 덩어리로 줄였습니다.
- 결과 화면: `result-stage.webp`와 등급별 `result-star-*.webp`를 사용하고, SVG 오버레이가 등급명·정답 수·별빛 미터·다시하기 버튼 외형을 표시합니다. 플레이 중에는 최종 숫자 별빛을 공개하지 않습니다.

## 파일 구성

- `index.html`: 학생용 단일 HTML 게임
- `PLAN.md`: 차시 제작 계획
- `REPORT.md`: 설계 및 검증 보고서
- `screenshots/`: 화면별 스크린샷
- `cover-generated-source.png`, `cover-generated.png/webp`, `tutorial-generated.png/webp`, `board-night.png/webp`, `result-stage.png/webp`: RasterStage 배경
- `title-logo-chromakey.png`, `title-logo-generated.png/webp`: GPT Image/imagegen 제목 로고 원본과 배포본
- `start-button-source.png`, `start-button-generated.png/webp`: 생성형 시작 버튼 원본과 배포본
- `star.png/webp`, `result-star-*.png/webp`: 보상 및 결과 등급 이미지
- `eduitit-logo-mark.png`, `assets/mathmon/base-pack/mathmon-8-unicornmon.webp`: 공용 로고와 보존된 base-pack 유니콘몬 배포본
- `scripts/qa-lesson2-star-pickup.mjs`: 커버·설정·설명·문제·최종 확인·보상·결과 화면 QA 스크립트

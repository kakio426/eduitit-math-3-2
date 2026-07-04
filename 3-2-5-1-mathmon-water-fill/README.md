# 매스몬 물통 채우기 시합

에듀잇티 수학 게임 시리즈 3학년 2학기 5단원 1차시 단일 HTML 패키지입니다.

- 대상: 초등학교 3학년 2학기
- 배움주제: 들이 비교와 L, mL
- 학생 행동: 눈금에 맞는 들이를 골라요.
- 문제: 10문제, readMl, readLiterMl, compareBottle
- 보상: 물통 변화
- 실행: `index.html`을 브라우저에서 열기

## 화면 흐름

```text
첫 화면 -> 설명 -> 문제 -> 보상 -> 결과
```

문제 화면은 큰 문제, 현재 계산판, 한 줄 지시, 선택지만 기본으로 보여 줍니다. 정답을 고르면 값이 칸에 들어간 뒤 다음 단계나 보상으로 넘어갑니다.

## 생성 이미지 자산

`index.html`은 `generated-title-overlay`, `generated-button-art`, `modal-controls`, `generated-assets` 기준을 선언합니다.

| 파일명 | 용도 |
| --- | --- |
| `cover-source.png` / `cover-generated.webp` | 글자 없는 첫 화면 배경 |
| `title-logo-chromakey.png` / `title-logo-generated.png` / `title-logo-generated.webp` | 생성형 제목 아트 |
| `start-button-source.png` / `start-button-generated.png` / `start-button-generated.webp` | 생성형 시작 버튼 아트 |
| `reward-scene-source.png` / `reward-scene-generated.webp` | 보상 장면 배경 |
| `result-tank-*-source.png` / `result-tank-*-generated.webp` | 결과 장면 |
| `result-title-*-source.png` / `result-title-*-generated.webp` | 결과 이름 타이틀 아트 |
| `result-retry-button-source.png` / `result-retry-button-generated.webp` | 결과 화면 다시 버튼 아트 |

## 매스몬 기준

현재 실행 장면의 매스몬 기준은 `zero-factory-animal-pack`의 펭귄몬(`zfa-06-penguinmon`)입니다. 첫 화면, 보상, 결과 장면 안에 함께 생성하며 런타임 WebP를 별도 오버레이로 얹지 않습니다.

## 보상 구조

정답을 처음에 맞히면 기본 보상값이 붙고, 랜덤 보상이 한 번 더해집니다. 오답 뒤에 맞히면 작은 회복 보상만 붙습니다. 낮은 결과도 빈손처럼 보이지 않게 물통 변화로 보여 줍니다.

| 결과 | 조건 |
| --- | --- |
| 작은 물통 | 0 이상, 바로 맞힌 문제 0개 이상 |
| 반짝 물통 | 30 이상, 바로 맞힌 문제 3개 이상 |
| 가득 물통 | 70 이상, 바로 맞힌 문제 7개 이상 |
| 무지개 물탑 | 100 이상, 바로 맞힌 문제 10개 이상, 특별 보상 필요 |

## Humanizer QA

학생에게 보이는 문구는 짧은 행동 말로 점검합니다.

- 첫 화면 목표: `눈금에 맞는 들이를 골라요.`
- 문제 지시: 현재 단계에서 하나만 고르게 함
- 피드백: `다시 골라요.`, `...이 들어갔어요.`
- 버튼: `시작`, `문제 시작`, `물통 보기`, `다음`, `보기`, `다시`

## 스크린샷

스크린샷은 `screenshots/`에 저장합니다.

- `cover.png`
- `tutorial-1.png`
- `tutorial-2.png`
- `play-step1.png`
- `play-confirm.png`
- `wrong-hint.png`
- `reward.png`
- `result-*.png`
- `tablet-cover.png`
- `tablet-tutorial-1.png`
- `tablet-tutorial-2.png`
- `tablet-play-step1.png`
- `tablet-play-confirm.png`
- `tablet-reward.png`
- `tablet-result-*.png`

세로 휴대폰은 기본 지원 대상이 아닙니다.

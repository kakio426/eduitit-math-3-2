# 매스몬 음료 제조 주문 구현 보고서

## 1. 구현 요약

3학년 2학기 5단원 2차시 `들이의 덧셈·뺄셈과 어림`을 단일 HTML 게임으로 구현했습니다. 학생은 10문제 동안 주문에 맞는 들이를 골라요. 정답을 고르면 값이 계산판에 먼저 들어가고, 마지막 단계에서는 완성값을 본 뒤 `주문 보기`를 눌러 보상으로 넘어갑니다.

## 2. 등록

- lesson id: `3-2-5-2`
- folder: `3-2-5-2-mathmon-drink-order`
- title: `매스몬 음료 제조 주문`
- learningGoal: 들이의 덧셈·뺄셈과 어림

## 3. 화면 흐름

```text
첫 화면 -> 설명 -> 문제 -> 보상 -> 결과
```

- 첫 화면: 생성형 배경, 생성형 제목 아트, HTML 목표 문장, 생성형 시작 버튼 아트
- 설명: 3개의 짧은 카드
- 문제: 큰 문제, 현재 계산판, 한 줄 지시, 선택지만 기본 노출
- 보상: 주문 변화 하나만 표시
- 결과: 결과 단계 생성 이미지, 생성형 결과 타이틀, 생성형 `다시` 버튼 아트

## 4. 생성 이미지 자산

| 파일명 | 역할 |
| --- | --- |
| `cover-source.png` / `cover-generated.webp` | 글자 없는 첫 화면 배경 |
| `title-logo-chromakey.png` / `title-logo-generated.png` / `title-logo-generated.webp` | 생성형 제목 아트 |
| `start-button-source.png` / `start-button-generated.png` / `start-button-generated.webp` | 생성형 시작 버튼 아트 |
| `reward-scene-source.png` / `reward-scene-generated.webp` | 보상 배경 |
| `result-order-*-source.png` / `result-order-*-generated.webp` | 결과 배경 |
| `result-title-*-source.png` / `result-title-*-generated.webp` | 결과 이름 타이틀 아트 |
| `result-retry-button-source.png` / `result-retry-button-generated.webp` | 생성형 다시 버튼 아트 |

## 5. 매스몬 기준

사용 팩은 `zero-factory-animal-pack`이고 기준 매스몬은 냥냥몬(`zfa-04-nyangnyangmon`)입니다. 차시 폴더에는 매스몬 원본을 복사하지 않고, 커버/보상/결과 장면 생성 단계에서 함께 넣는 방식으로 처리합니다.

## 6. 보상과 확률

정답을 처음에 맞히면 내부 보상값 +5가 붙고, 랜덤 보상 1회가 더해집니다. 오답 뒤에 맞히면 회복 보상 +1~+2만 붙습니다. 최고 결과는 100점, 10문제 바로 정답, 특별 보상 조건이 필요합니다.

| 결과 | 조건 |
| --- | --- |
| 작은 컵 주문 | 0 이상, 바로 맞힌 문제 0개 이상 |
| 맛있는 주문 | 30 이상, 바로 맞힌 문제 3개 이상 |
| 인기 가게 주문 | 70 이상, 바로 맞힌 문제 7개 이상 |
| 무지개 음료 주문 | 100 이상, 바로 맞힌 문제 10개 이상, 특별 보상 필요 |

## 7. Humanizer QA

학생 문구는 짧은 행동 말 중심으로 구성했습니다.

- 첫 화면 목표: `주문에 맞는 들이를 골라요.`
- 설명 카드: `mL끼리 먼저 봐요.`, `부족하면 1L를 빌려요.`, `주문과 맞는지 봐요.`
- 오답 피드백: `다시 골라요.`
- 보상/결과: `작은 컵 주문`, `맛있는 주문`, `인기 가게 주문`, `무지개 음료 주문`

학생 화면에는 내부 작업실 이름이나 제작자용 말을 보이지 않게 합니다.

## 8. 텍스트 넘침·요소 겹침 QA

브라우저 QA에서 desktop `1280x800`과 tablet landscape `1024x768`을 확인합니다.

확인 대상:

- 첫 화면
- 설명
- 문제 1단계
- 정답 확인 상태
- 오답 상태
- 보상
- 결과 단계별 화면

확인 결과는 최종 QA 후 갱신합니다.

## 9. 검증 명령

- `node scripts/check-rule-consistency.mjs`
- `node scripts/check-stage-ratio.mjs`
- `node scripts/qa-lesson5-drink-order-model.mjs --runs 10000`
- `node scripts/simulate-lesson5-drink-order.mjs --runs 10000`
- Browser QA: Chrome CDP 자동 캡처로 데스크톱과 태블릿 가로 화면 확인

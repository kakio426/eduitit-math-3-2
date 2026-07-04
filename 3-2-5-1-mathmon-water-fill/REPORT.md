# 매스몬 물통 채우기 시합 구현 보고서

## 1. 구현 요약

3학년 2학기 5단원 1차시 `들이 비교와 L, mL`을 단일 HTML 게임으로 구현했습니다. 학생은 10문제 동안 눈금에 맞는 들이를 골라요. 정답을 고르면 값이 계산판에 먼저 들어가고, 마지막 단계에서는 완성값을 본 뒤 `물통 보기`를 눌러 보상으로 넘어갑니다.

## 2. 등록

- lesson id: `3-2-5-1`
- folder: `3-2-5-1-mathmon-water-fill`
- title: `매스몬 물통 채우기 시합`
- learningGoal: 들이 비교와 L, mL

## 3. 화면 흐름

```text
첫 화면 -> 설명 -> 문제 -> 보상 -> 결과
```

- 첫 화면: 생성형 배경, 생성형 제목 아트, HTML 목표 문장, 생성형 시작 버튼 아트
- 설명: 3개의 짧은 카드
- 문제: 큰 문제, 현재 계산판, 한 줄 지시, 선택지만 기본 노출
- 보상: 물통 변화 하나만 표시
- 결과: 결과 단계 생성 이미지, 생성형 결과 타이틀, 생성형 `다시` 버튼 아트

## 4. 생성 이미지 자산

| 파일명 | 역할 |
| --- | --- |
| `cover-source.png` / `cover-generated.webp` | 글자 없는 첫 화면 배경 |
| `title-logo-chromakey.png` / `title-logo-generated.png` / `title-logo-generated.webp` | 생성형 제목 아트 |
| `start-button-source.png` / `start-button-generated.png` / `start-button-generated.webp` | 생성형 시작 버튼 아트 |
| `reward-scene-source.png` / `reward-scene-generated.webp` | 보상 배경 |
| `result-tank-*-source.png` / `result-tank-*-generated.webp` | 결과 배경 |
| `result-title-*-source.png` / `result-title-*-generated.webp` | 결과 이름 타이틀 아트 |
| `result-retry-button-source.png` / `result-retry-button-generated.webp` | 생성형 다시 버튼 아트 |

## 5. 매스몬 기준

사용 팩은 `zero-factory-animal-pack`이고 기준 매스몬은 펭귄몬(`zfa-06-penguinmon`)입니다. 차시 폴더에는 매스몬 원본을 복사하지 않고, 커버/보상/결과 장면 생성 단계에서 함께 넣는 방식으로 처리합니다.

## 6. 보상과 확률

정답을 처음에 맞히면 내부 보상값 +5가 붙고, 랜덤 보상 1회가 더해집니다. 오답 뒤에 맞히면 회복 보상 +1~+2만 붙습니다. 최고 결과는 100점, 10문제 바로 정답, 특별 보상 조건이 필요합니다.

| 결과 | 조건 |
| --- | --- |
| 작은 물통 | 0 이상, 바로 맞힌 문제 0개 이상 |
| 반짝 물통 | 30 이상, 바로 맞힌 문제 3개 이상 |
| 가득 물통 | 70 이상, 바로 맞힌 문제 7개 이상 |
| 무지개 물탑 | 100 이상, 바로 맞힌 문제 10개 이상, 특별 보상 필요 |

## 7. Humanizer QA

학생 문구는 짧은 행동 말 중심으로 구성했습니다.

- 첫 화면 목표: `눈금에 맞는 들이를 골라요.`
- 설명 카드: `눈금을 봐요.`, `1L는 1000mL예요.`, `더 많이 든 쪽을 골라요.`
- 오답 피드백: `다시 골라요.`
- 보상/결과: `작은 물통`, `반짝 물통`, `가득 물통`, `무지개 물탑`

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
- `node scripts/qa-lesson5-water-fill-model.mjs --runs 10000`
- `node scripts/simulate-lesson5-water-fill.mjs --runs 10000`
- Browser QA: Chrome CDP 자동 캡처로 데스크톱과 태블릿 가로 화면 확인

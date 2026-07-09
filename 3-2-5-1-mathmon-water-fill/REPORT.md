# 매스몬 물통 채우기 시합 구현 보고서

## 1. 구현 요약

3학년 2학기 5단원 1차시 `들이 비교와 L, mL`을 단일 HTML 게임으로 구현했습니다. 학생은 10문제 동안 눈금에 맞는 들이를 골라요. 정답을 고르면 값이 계산판에 먼저 들어가고, 마지막 단계에서는 완성값을 본 뒤 `물통 보기`를 눌러 보상으로 넘어갑니다.

## 1-1. 엔진화 파일럿

2026-07-09 기준 이 차시는 `mathmon-engine-v1` 파일럿으로 전환했습니다.

- 공용 엔진 소스: `_engine/v1/`
- 차시 소스: `_lessons/3-2-5-1-mathmon-water-fill/`
- 빌드 산출물: `3-2-5-1-mathmon-water-fill/index.html`
- 빌드 명령: `node scripts/build-lesson.mjs 3-2-5-1-mathmon-water-fill`

학생용 배포 표면은 기존과 같습니다. `index.html` 안에 CSS/JS가 인라인으로 들어가며, 이미지 자산은 기존 차시 폴더와 `_shared/result-count/`를 참조합니다.

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

브라우저 QA에서 desktop `1280x800`과 tablet landscape `1024x768`을 확인했습니다.

확인 대상:

- 첫 화면
- 설명 1
- 설명 2
- 문제 1단계
- 정답 확인 상태
- 오답 상태
- 보상
- 결과 단계별 화면

확인 결과: 텍스트 넘침 0건, 요소 겹침 0건, Stage 밖 이탈 0건입니다. 결과 화면은 `작은 물통`, `반짝 물통`, `가득 물통`, `무지개 물탑` 4단계를 실제 문제 풀이 흐름으로 도달해 캡처했습니다.

## 9. 검증 명령

엔진화 파일럿 검증:

- `node scripts/build-lesson.mjs 3-2-5-1-mathmon-water-fill` 통과
- `node scripts/check-lesson-contract.mjs` 통과
- `node scripts/qa-lesson5-water-fill-model.mjs --runs 1000` 통과
- `node scripts/simulate-lesson5-water-fill.mjs --runs 1000` 통과

루트 Stage 검사:

- `node scripts/check-stage-ratio.mjs`는 현재 작업실의 별도 변경 중인 `3-2-1-4-mathmon-fusion`에서 실패합니다. 이번 엔진화 대상인 `3-2-5-1-mathmon-water-fill` 항목은 실패 목록에 없습니다.

Browser QA:

- `node scripts/qa-engine-water-fill-flow.mjs` 통과
- desktop `1280x800`과 tablet landscape `1024x768`에서 첫 화면, 설정 모달, 설명 1·2, 문제 1단계, 정답 확인, 보상, 결과 흐름을 확인했습니다.
- 캡처: `screenshots/engine-desktop-*.png`, `screenshots/engine-tablet-*.png`

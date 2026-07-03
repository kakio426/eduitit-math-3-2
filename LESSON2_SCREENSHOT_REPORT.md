# 2단원 1-4차시 화면 스크린샷 보고서

작성일: 2026-07-03
대상: `3-2-2-1`부터 `3-2-2-4`까지 4개 차시
검토 기준: 16:10 Stage, 데스크톱 1280x800, 태블릿 가로 QA 캡처

## 종합 판정

| 차시 | 첫 화면 | 설명 화면 | 보상 화면 | 문제/확인 흐름 | 결과 화면 | 판정 |
| --- | --- | --- | --- | --- | --- | --- |
| 3-2-2-1 나누기 농장 | 생성형 시작 버튼 적용 | 생성 이미지 2장 | 변화량 1개만 표시 | 완성 몫 확인 후 `수확 보기` | SVG 동적 오버레이 | 통과 |
| 3-2-2-2 엘리베이터 | 생성형 시작 버튼 적용 | 생성 이미지 2장 | 변화량 1개만 표시 | 최종 답 확인 후 버튼 진입 | SVG 동적 오버레이 | 통과 |
| 3-2-2-3 별 줍기 | 생성형 시작 버튼 적용 | 생성 이미지 2장 | 변화량 1개만 표시 | 검산 확인 후 `별빛 열기` | SVG 동적 오버레이 | 통과 |
| 3-2-2-4 검산 자물쇠 | 생성형 시작 버튼 적용 | 생성 이미지 2장 | 변화량 1개만 표시 | 검산 확인 후 `힘 받기` | SVG 동적 오버레이 | 통과 |

## 실행한 검증

```bash
node scripts/qa-lesson2-divide-farm.mjs
node scripts/qa-lesson2-elevator.mjs
node scripts/qa-lesson2-star-pickup.mjs
node scripts/qa-lesson2-check-lock.mjs
node scripts/check-stage-ratio.mjs
```

결과: 네 차시 QA 모두 `PASS`, Stage 비율 계약 `OK`.

설명 화면 재검수: 네 차시 모두 `data-tutorial-standard="generated-image-text"`를 사용합니다. 보이는 설명 문구와 `다음`/`이전`/`계속하기` 버튼 표면은 `tutorial-page-*-generated.webp` 생성 이미지가 맡고, HTML은 접근성 텍스트와 투명 hitbox만 남겼습니다.

![설명 화면 8장 컨택시트](</Users/yubyeongju/ai mart/LESSON2_TUTORIAL_SCREENSHOT_CONTACT.png>)

## 3-2-2-1 매스몬 나누기 농장

판정: 첫 화면, 설정, 생성 이미지 설명 2장, 문제 2단계, 최종 확인, 보상, 결과, 태블릿 대표 화면 모두 캡처됨. 보상 모달은 보이는 텍스트를 `수확 n` 변화량 1개로 줄이고, 제목/설명은 접근성 텍스트로 이동함.

### 데스크톱 화면

![2-1 첫 화면](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/01-cover.png>)

![2-1 설정 모달](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/01b-settings.png>)

![2-1 설명 1장](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/02-tutorial.png>)

![2-1 설명 2장](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/02b-tutorial-page2.png>)

![2-1 문제 1단계](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/03-problem-step1.png>)

![2-1 문제 2단계](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/04-problem-step2.png>)

![2-1 최종 확인](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/05-final-confirm.png>)

![2-1 보상](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/06-reward.png>)

![2-1 결과 측정 중](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/07-result-measuring.png>)

![2-1 결과](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/08-result.png>)

### 태블릿 가로 대표 화면

![2-1 태블릿 첫 화면](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/tablet-01-cover.png>)

![2-1 태블릿 설명 1장](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/tablet-02-tutorial.png>)

![2-1 태블릿 문제 1단계](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/tablet-03-problem-step1.png>)

![2-1 태블릿 보상](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/tablet-06-reward.png>)

![2-1 태블릿 결과](</Users/yubyeongju/ai mart/3-2-2-1-mathmon-divide-farm/screenshots/tablet-08-result.png>)

## 3-2-2-2 매스몬 엘리베이터

판정: 첫 화면과 설명 화면은 생성 이미지 표준으로 맞춰졌고, 결과 화면은 CSS 카드 없이 SVG 오버레이와 hitbox 중심으로 정리됨. QA 종료 hang 방지 수정도 적용되어 PASS 후 정상 종료됨.

### 데스크톱 화면

![2-2 첫 화면](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/01-cover.png>)

![2-2 설정 모달](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/01b-settings.png>)

![2-2 설명 1장](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/02-tutorial.png>)

![2-2 설명 2장](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/02b-tutorial-page2.png>)

![2-2 문제 1단계](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/03-problem.png>)

![2-2 문제 2단계](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/03-problem-step2.png>)

![2-2 힌트](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/03-problem-hint.png>)

![2-2 최종 확인](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/03-final-confirm.png>)

![2-2 보상](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/04-reward.png>)

![2-2 성공 결과](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/05-result-success.png>)

![2-2 다시 도전 결과](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/06-result-retry.png>)

![2-2 무지개 결과](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/08-result-rainbow.png>)

### 태블릿 가로 대표 화면

![2-2 태블릿 첫 화면](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/07-tablet-cover.png>)

![2-2 태블릿 설명 1장](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/09-tablet-tutorial.png>)

![2-2 태블릿 설명 2장](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/09b-tablet-tutorial-page2.png>)

![2-2 태블릿 문제](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/10-tablet-problem.png>)

![2-2 태블릿 최종 확인](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/11-tablet-final-confirm.png>)

![2-2 태블릿 결과](</Users/yubyeongju/ai mart/3-2-2-2-mathmon-elevator/screenshots/12-tablet-result.png>)

## 3-2-2-3 매스몬 별 줍기

판정: 설명 화면은 생성 이미지 2장으로 교체됨. 문제 화면 보조 패널을 줄이고, 마지막 검산 완료 뒤 `별빛 열기` 버튼으로 보상에 들어가도록 정리됨. 보상 모달은 변화량 1개만 보이며, 결과는 생성 장면과 제한된 SVG 동적 오버레이로 구성됨.

### 데스크톱 화면

![2-3 첫 화면](</Users/yubyeongju/ai mart/3-2-2-3-mathmon-star-pickup/screenshots/01-cover.png>)

![2-3 설정 모달](</Users/yubyeongju/ai mart/3-2-2-3-mathmon-star-pickup/screenshots/01b-settings.png>)

![2-3 설명 1장](</Users/yubyeongju/ai mart/3-2-2-3-mathmon-star-pickup/screenshots/02-tutorial.png>)

![2-3 설명 2장](</Users/yubyeongju/ai mart/3-2-2-3-mathmon-star-pickup/screenshots/02b-tutorial-page2.png>)

![2-3 문제](</Users/yubyeongju/ai mart/3-2-2-3-mathmon-star-pickup/screenshots/03-problem.png>)

![2-3 최종 확인](</Users/yubyeongju/ai mart/3-2-2-3-mathmon-star-pickup/screenshots/03-final-confirm.png>)

![2-3 보상](</Users/yubyeongju/ai mart/3-2-2-3-mathmon-star-pickup/screenshots/04-reward.png>)

![2-3 결과](</Users/yubyeongju/ai mart/3-2-2-3-mathmon-star-pickup/screenshots/08-result.png>)

### 태블릿 가로 대표 화면

![2-3 태블릿 첫 화면](</Users/yubyeongju/ai mart/3-2-2-3-mathmon-star-pickup/screenshots/tablet-01-cover.png>)

![2-3 태블릿 결과](</Users/yubyeongju/ai mart/3-2-2-3-mathmon-star-pickup/screenshots/tablet-08-result.png>)

## 3-2-2-4 매스몬 검산 자물쇠

판정: 설명 화면은 생성 이미지 2장으로 교체됨. 마지막 검산 확인 뒤 `힘 받기` 버튼으로 보상에 들어가며, 보상 모달은 `+n%`, `-n%`, `마스터키`, `무지개` 같은 변화량 1개만 보임. 결과 화면의 CSS 카드형 구성은 제거되고 SVG 동적 오버레이와 hitbox로 정리됨.

### 데스크톱 화면

![2-4 첫 화면](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/01-cover.png>)

![2-4 설정 모달](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/01b-settings.png>)

![2-4 설명 1장](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/02-tutorial.png>)

![2-4 설명 2장](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/02b-tutorial-page2.png>)

![2-4 문제](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/03-problem.png>)

![2-4 최종 확인](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/03-final-confirm.png>)

![2-4 보상](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/04-reward.png>)

![2-4 오류 보상](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/08-error-reward.png>)

![2-4 성공 결과](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/05-result-success.png>)

![2-4 다시 도전 결과](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/06-result-retry.png>)

![2-4 최종 결과](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/08-result.png>)

### 태블릿 가로 대표 화면

![2-4 태블릿 첫 화면](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/tablet-01-cover.png>)

![2-4 태블릿 문제](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/09-tablet-problem.png>)

![2-4 태블릿 결과](</Users/yubyeongju/ai mart/3-2-2-4-mathmon-check-lock/screenshots/tablet-08-result.png>)

## 확인 메모

- 첫 화면: 네 차시 모두 `generated-title-overlay`와 `generated-button-art` 기준을 사용함.
- 설명 화면: 네 차시 모두 `1/2`, `2/2` 흐름이고, 보이는 설명 문구는 생성 이미지 안에 있음. HTML은 숨김 접근성 텍스트와 투명 hitbox만 담당함.
- 보상 화면: 네 차시 모두 버튼을 제외한 보이는 텍스트가 변화량 1개 중심임.
- 설정 버튼: 네 차시 모두 Stage 안 오른쪽 위 톱니바퀴 버튼과 설정 모달 기준을 사용함.
- 결과 화면: 네 차시 모두 `generated-assets`와 `hybrid-generated-dynamic` 기준을 사용하며, 레거시 CSS 결과 카드 패턴은 없음.
- QA 결과: 자동 overflow/clipping 검사와 브라우저 흐름 QA가 모두 PASS.

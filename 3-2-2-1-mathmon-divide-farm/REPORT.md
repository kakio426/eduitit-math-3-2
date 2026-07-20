# 매스몬 나누기 농장 구현 보고서

- 갱신일: 2026-07-20
- 대상: 초등학교 3학년 2학기 나눗셈
- 문제 수: 문제 은행 30개 중 매 판 10개 무작위 출제
- 화면 기준: 16:10 Stage, 기준 제작 크기 1280×800
- 보상 구조: 점수에 따라 농장이 6단계로 성장

## 전체 화면 스크린샷

아래 이미지는 모두 현재 실행본을 `1280×800` 데스크톱 화면에서 다시 촬영한 **전체 Stage 화면**입니다. 화면 일부를 잘라 쓰거나 두 장을 한 칸에 축소하지 않았습니다. 실제 학생 흐름에서 꺼져 있는 순위 화면은 포함하지 않았습니다.

### 1. 시작 화면

![매스몬 나누기 농장 시작 전체 화면](screenshots/engine-flow-desktop-01-cover.png)

### 2. 설정 화면

![설정 모달 전체 화면](screenshots/engine-flow-desktop-02-settings.png)

### 3. 방법 보기 첫째 화면

![묶음과 낱개로 나누는 방법 전체 화면](screenshots/engine-flow-desktop-03-tutorial-1.png)

### 4. 방법 보기 둘째 화면

![10문제와 농장 성장 안내 전체 화면](screenshots/engine-flow-desktop-04-tutorial-2.png)

### 5. 묶음 나누기

![10개 묶음을 바구니에 나누는 전체 화면](screenshots/engine-flow-desktop-05-play-step1.png)

### 6. 묶음 나누기 오답

![묶음을 똑같이 나누지 못한 전체 화면](screenshots/engine-flow-desktop-05b-play-wrong.png)

### 7. 묶음 나누기 정답 확인

![묶음 나누기 정답 확인 전체 화면](screenshots/engine-flow-desktop-05c-play-tens-confirm.png)

### 8. 낱개 나누기

![낱개 당근을 바구니에 나누는 전체 화면](screenshots/engine-flow-desktop-05c-play-step2.png)

### 9. 낱개 나누기 정답 확인

![낱개 나누기 정답 확인 전체 화면](screenshots/engine-flow-desktop-05d-play-ones-confirm.png)

### 10. 나눈 값 더하기

![두 단계에서 구한 값을 더하는 전체 화면](screenshots/engine-flow-desktop-05e-play-final-sum.png)

### 11. 마지막 덧셈 오답

![마지막 덧셈을 고쳐 보는 전체 화면](screenshots/engine-flow-desktop-05f-play-final-sum-wrong.png)

### 12. 한 문제 완성

![두 나눗셈과 마지막 답이 완성된 전체 화면](screenshots/engine-flow-desktop-05d-play-one-basket-complete.png)

### 13. 수확 보기 전 확인

![완성한 답을 확인하고 수확을 보는 전체 화면](screenshots/engine-flow-desktop-06-confirm.png)

### 14. 보상 바구니 닫힘

![보상 바구니를 열기 전 전체 화면](screenshots/engine-flow-desktop-07-reward-closed.png)

### 15. 보상 바구니 열림

![보상 결과와 현재 점수가 보이는 전체 화면](screenshots/engine-flow-desktop-07b-reward-open.png)

### 16. 보상 증가

![점수가 늘어난 보상 전체 화면](screenshots/engine-flow-desktop-07c-reward-increase.png)

### 17. 보상 감소

![점수가 줄어든 보상 전체 화면](screenshots/engine-flow-desktop-07c-reward-decrease.png)

### 18. 보상 변화 없음

![점수가 그대로인 보상 전체 화면](screenshots/engine-flow-desktop-07c-reward-zero.png)

### 19. 정답 수 조건 보상

![정답 수 조건이 적용된 보상 전체 화면](screenshots/engine-flow-desktop-07c-reward-correct-gate.png)

### 20. 황금밭 특별 보상

![황금밭을 발견한 특별 보상 전체 화면](screenshots/engine-flow-desktop-07c-reward-golden-field.png)

### 21. 열 번째 문제의 마지막 보상 바구니

![마지막 보상 바구니를 열기 전 전체 화면](screenshots/engine-flow-desktop-07d-final-reward-closed.png)

### 22. 열 번째 문제의 마지막 보상 확인

![마지막 보상을 확인하는 전체 화면](screenshots/engine-flow-desktop-07e-final-reward-open.png)

### 23. 실제 결과 화면

![한 판을 마친 실제 결과 전체 화면](screenshots/engine-flow-desktop-08-result.png)

### 24. 씨앗 결과

![씨앗 결과 전체 화면](screenshots/engine-flow-desktop-08a-result-seed.png)

### 25. 새싹 결과

![새싹 결과 전체 화면](screenshots/engine-flow-desktop-08a-result-sprout.png)

### 26. 텃밭 결과

![텃밭 결과 전체 화면](screenshots/engine-flow-desktop-08a-result-garden.png)

### 27. 농장 결과

![농장 결과 전체 화면](screenshots/engine-flow-desktop-08a-result-farm.png)

### 28. 대농장 결과

![대농장 결과 전체 화면](screenshots/engine-flow-desktop-08a-result-bigfarm.png)

### 29. 황금밭 결과

![황금밭 결과 전체 화면](screenshots/engine-flow-desktop-08a-result-rainbow.png)

## 한눈에 보는 현재 구조

이 게임의 목적은 두 자리 수를 십의 자리와 일의 자리로 나누어 생각하고, 각각의 몫을 더해 한 바구니에 들어갈 수를 구하는 것입니다.

한 문제는 다음 세 번의 수학적 판단으로 끝납니다.

1. 10개 묶음을 바구니에 똑같이 나눕니다.
2. 낱개 당근을 바구니에 똑같이 나눕니다.
3. 두 단계에서 구한 값을 더해 마지막 답을 씁니다.

학생이 이미 구한 답을 다시 입력하거나 검산하게 하지 않습니다. 각 단계에서는 지금 판단해야 하는 당근과 바구니만 크게 보여 주고, 다음 계산은 앞 단계가 끝난 뒤에 공개합니다.

## 학생 화면 흐름

### 1. 시작과 방법 보기

첫 화면에는 게임 제목, 한 줄 목표, 시작 버튼만 둡니다. 방법 보기에서는 묶음과 낱개를 따로 나누고 마지막에 두 값을 더한다는 흐름을 두 장으로 보여 줍니다.

| 시작 화면 | 방법 보기 1 |
|---|---|
| ![시작 화면](screenshots/engine-flow-desktop-01-cover.png) | ![묶음과 낱개로 나누는 방법](screenshots/engine-flow-desktop-03-tutorial-1.png) |

| 방법 보기 2 | 첫 문제 |
|---|---|
| ![농장을 키우는 방법](screenshots/engine-flow-desktop-04-tutorial-2.png) | ![첫 문제 화면](screenshots/engine-flow-desktop-05-play-step1.png) |

### 2. 묶음 나누기

왼쪽에는 전체 나눗셈식, 오른쪽에는 지금 풀 계산과 질문을 둡니다. 학생은 위쪽의 10개 묶음을 아래 바구니로 직접 끌어 똑같이 나눕니다. 묶음은 `6개 그림 +2`처럼 생략하지 않고 모두 보여 줍니다.

![10개 묶음을 바구니에 나누는 화면](screenshots/engine-flow-desktop-05-play-step1.png)

똑같이 나누지 못했을 때는 학생이 만든 상태를 그대로 두고 부족하거나 넘치는 양을 알려 줍니다. 정답이면 각 바구니의 묶음 수와 계산 결과를 먼저 확인한 뒤 다음 단계로 넘어갑니다.

| 고쳐 보는 화면 | 묶음 확인 화면 |
|---|---|
| ![묶음을 고쳐 나누는 화면](screenshots/engine-flow-desktop-05b-play-wrong.png) | ![묶음 나누기 확인 화면](screenshots/engine-flow-desktop-05c-play-tens-confirm.png) |

### 3. 낱개 나누기

묶음 확인이 끝나면 낱개 당근만 보여 줍니다. 학생은 같은 방식으로 낱개를 바구니에 똑같이 나누고, 결과를 확인합니다.

| 낱개 나누기 | 낱개 확인 |
|---|---|
| ![낱개 당근을 나누는 화면](screenshots/engine-flow-desktop-05c-play-step2.png) | ![낱개 나누기 확인 화면](screenshots/engine-flow-desktop-05d-play-ones-confirm.png) |

### 4. 나눈 값 더하기

앞에서 구한 두 몫을 왼쪽 상자에 다시 보여 줍니다. `1단계`와 `2단계`의 등호는 같은 열에 맞추고, 두 식이 마지막 덧셈으로 이어지는 순서를 분명히 했습니다. 오른쪽 상자는 정답을 맞힌 뒤 한 바구니의 최종 모습을 보여 주는 영역입니다.

학생이 답을 쓰기 전에는 전체 나눗셈의 몫과 `한 바구니에 몇 개씩`인지 공개하지 않습니다.

| 마지막 덧셈 | 덧셈을 고쳐 보는 화면 |
|---|---|
| ![두 몫을 더하는 화면](screenshots/engine-flow-desktop-05e-play-final-sum.png) | ![덧셈 답을 고쳐 쓰는 화면](screenshots/engine-flow-desktop-05f-play-final-sum-wrong.png) |

정답을 맞히면 왼쪽에는 두 단계와 덧셈 결과를, 오른쪽에는 완성된 바구니와 `한 바구니에 13개씩` 같은 최종 결과를 보여 줍니다. `나눈 값을 더해요`는 왼쪽 상자 위쪽 중앙에 놓고, 마지막 덧셈은 남은 아래 공간의 중앙에 배치했습니다.

![한 문제의 최종 완성 화면](screenshots/engine-flow-desktop-05d-play-one-basket-complete.png)

## 보상 화면

문제를 풀면 별도 보상 화면으로 이동합니다. 닫힌 바구니를 연 뒤 사건 이미지와 점수 변화를 보여 줍니다. 현재 점수를 알 수 있도록 `이번에 +8점 → 지금 18점`처럼 변화량과 누적 점수를 함께 표시합니다.

| 바구니를 열기 전 | 바구니를 연 뒤 |
|---|---|
| ![닫힌 보상 바구니](screenshots/engine-flow-desktop-07-reward-closed.png) | ![점수가 표시된 보상 화면](screenshots/engine-flow-desktop-07b-reward-open.png) |

보상 사건은 다음과 같습니다.

| 사건 | 가중치 | 점수 변화 |
|---|---:|---:|
| 일반 수확 | 6400 | `+6~+10점` |
| 벌레 | 1500 | `-5~-2점` |
| 대풍작 | 1200 | `+14~+22점` |
| 황금 당근 | 500 | `+30점` |
| 빈 바구니 | 380 | `0점` |
| 황금밭 | 20 | 특별 결과로 이동 |
| 문제에서 실수 | 별도 | `-8~-4점` |

농장은 `씨앗 → 새싹 → 텃밭 → 농장 → 대농장 → 황금밭` 순서로 자랍니다. 10문제가 끝나면 마지막 보상을 확인한 뒤 결과 화면으로 이동합니다.

| 마지막 보상 전 | 마지막 보상 확인 |
|---|---|
| ![마지막 닫힌 보상 화면](screenshots/engine-flow-desktop-07d-final-reward-closed.png) | ![마지막 보상 확인 화면](screenshots/engine-flow-desktop-07e-final-reward-open.png) |

## 결과 화면 6종

결과 화면은 3-2-1-4의 결속 구조를 기준으로 맞췄습니다. 농장 장면은 왼쪽, 결과 정보는 오른쪽 결과판에 고정합니다. 농장 이름, 다음 목표, 정답 수, 다시 버튼은 하나의 세로 축을 공유하며 화면 위에 따로 떠 있는 요소가 없도록 구성했습니다.

| 씨앗 | 새싹 |
|---|---|
| ![씨앗 결과 화면](screenshots/engine-flow-desktop-08a-result-seed.png) | ![새싹 결과 화면](screenshots/engine-flow-desktop-08a-result-sprout.png) |

| 텃밭 | 농장 |
|---|---|
| ![텃밭 결과 화면](screenshots/engine-flow-desktop-08a-result-garden.png) | ![농장 결과 화면](screenshots/engine-flow-desktop-08a-result-farm.png) |

| 대농장 | 황금밭 |
|---|---|
| ![대농장 결과 화면](screenshots/engine-flow-desktop-08a-result-bigfarm.png) | ![황금밭 결과 화면](screenshots/engine-flow-desktop-08a-result-rainbow.png) |

- 농장 이름 이미지는 생성된 원본 비율을 유지하고 `object-fit: contain`으로 표시합니다.
- 정답 수는 공용 생성 이미지 세트 `0/10`부터 `10/10`까지 사용합니다.
- 다시 버튼은 공용 생성 이미지 자산을 모든 결과 화면에서 같은 크기와 위치로 사용합니다.
- 학생 흐름에는 전국 순위 문구, 순위 버튼, 점수 전송 기능을 노출하지 않습니다.

## 문제와 입력 수

- 유효한 나눗셈식 30개에서 한 판에 10개를 무작위로 뽑습니다.
- 첫 문제도 고정하지 않으며 한 판 안에서 같은 문제를 반복하지 않습니다.
- 문제당 수학적 판단은 묶음 나누기, 낱개 나누기, 마지막 덧셈의 3번입니다.
- 직접 드래그, 단계 이동, 두 자리 답 입력을 포함한 완료 입력 수는 최소 9회, 중앙값 17회, 평균 15.87회, 최대 23회입니다.
- 숫자가 커져도 같은 뜻의 버튼을 여러 번 누르게 하지 않고, 당근을 직접 나눈 뒤 한 번 확인하게 합니다.

## 생성 이미지 세트

| 세트 | 현재 계약 | 컨택시트 |
|---|---|---|
| 당근 묶음 바구니 | 4장, 투명 1536×1024, 1·2·3·4묶음 | `farm-basket-bundle-states-contact-sheet.png` |
| 문제 배경 | 4장, 1280×800 | `problem-backgrounds-v2-contact-sheet.png` |
| 농장 성장 | 6장, 투명 512×512 | `farm-growth-stages-v2-contact-sheet.png` |
| 보상 사건 | 6장과 닫힌 바구니 1장, 투명 512×512 | `reward-events-v2-contact-sheet.png` |
| 결과 농장 | 6장, 1280×800 | `result-scenes-v3-contact-sheet.png` |
| 결과 농장명 | 6장, 투명 390×137 | `result-title-contact-sheet.png` |
| 다음 목표 | 6장, 768×384 | `result-next-titles-v2-contact-sheet.png` |

이미지 세트는 모두 현재 실행본에서 파일 크기, 원본 비율, 실제 표시 크기, 투명 배경, 상태별 연결을 확인했습니다. CSS로 이미지를 눌러 맞추지 않습니다.

## 학생 문구 점검

Humanizer 기준으로 현재 화면의 문구를 다시 읽었습니다.

- `묶음과 낱개로 나눠요`
- `한 바구니에 몇 묶음씩?`
- `한 바구니에 몇 개씩?`
- `2묶음이 남아요.` / `2묶음이 넘쳐요.`
- `모든 바구니에 똑같이 들어갔어요.`
- `묶음 나누기` / `낱개 나누기`
- `나눈 값을 더해요`
- `다시 더해 봐요.`
- `수확 보기`

한 문장에는 행동 하나만 남겼습니다. `게이트`, `이벤트`, `보상 구조` 같은 제작자 용어는 학생 화면에 쓰지 않았고, 같은 뜻의 안내를 한 화면에서 반복하지 않았습니다.

## 텍스트 넘침·요소 겹침 QA

현재 실행본의 전체 흐름을 아래 다섯 화면 크기에서 다시 캡처했습니다.

| 이름 | 브라우저 크기 | 확인한 Stage 크기 |
|---|---:|---:|
| desktop | 1280×800 | 1203.19×751.98 |
| tablet-landscape | 1024×768 | 983.06×614.41 |
| reported-compact | 918×897 | 881.28×550.80 |
| reported-carrot-fox | 934×987 | 896.66×560.41 |
| reported-complete-step-gap | 926×688 | 888.97×555.59 |

각 화면 크기에서 시작, 설정, 방법 보기 2장, 묶음 대기·오답·확인, 낱개 대기·확인, 마지막 덧셈 대기·오답, 최종 완성, 보상 닫힘·열림, 마지막 보상, 결과 6종을 확인했습니다.

- 텍스트가 상자 밖으로 나간 곳: 0건
- 문제 요소와 버튼이 겹친 곳: 0건
- Stage 밖으로 나간 조작부: 0건
- 깨지거나 누락된 이미지: 0건
- 당근과 바구니의 최소 터치 영역: 42×42px 이상
- 문제 핵심 패널: Stage 폭의 65% 이상
- 설정 버튼: Stage 안쪽 오른쪽 위 예약 공간에 고정

사용자가 발견했던 `934×987`의 여우와 바구니 겹침, 낱개 당근 잘림, `926×688`의 완료 단계 간격을 이름 있는 회귀 화면으로 계속 검사합니다.

## 현재 검증 결과

- `node scripts/qa-lesson2-divide-farm.mjs` → 배포본 생성, 문제 모델, 다섯 화면 크기의 전체 흐름 QA 통과
- `QA_LESSON_MODEL: PASS`
- `QA_LESSON_FLOW: PASS`
- `QA_LESSON2_DIVIDE_FARM: PASS`

이 보고서의 화면은 2026-07-20 현재 실행본에서 다시 만든 `screenshots/engine-flow-*` 파일입니다. 이전 구조의 문구와 화면 설명은 제거했습니다.

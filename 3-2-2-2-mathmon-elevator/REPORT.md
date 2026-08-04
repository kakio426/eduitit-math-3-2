# 매스몬 엘리베이터 업체 전달용 최신 구현 보고서

- 기준 실행본: 2026-07-22
- 차시: 3학년 2학기 2단원 2차시
- 배움 주제: 내림이 있는 두 자리 수 ÷ 한 자리 수
- 실행 파일: `3-2-2-2-mathmon-elevator/index.html`
- 화면 기준: 16:10 Stage, 1280×800
- 동행 캐릭터: `base-pack` 독수리몬

## 1. 게임 개요

`매스몬 엘리베이터`는 내림이 있는 두 자리 수 나눗셈을 교과서식 세로셈 순서로 연습하는 에듀잇티 수학 게임입니다. 학생은 십의 자리 값부터 나누고, 남은 수와 일의 자리 수를 합친 뒤, 내려온 수를 다시 나누어 답을 완성합니다.

한 문제를 풀 때마다 엘리베이터 문을 열어 무작위 점수 변화를 확인합니다. 10문제를 마치면 첫 시도 정답 수와 누적 점수를 함께 반영해 여섯 도착 장소 중 하나가 최종 보상으로 나타납니다.

핵심 목표는 학생이 `답 13`만 고르는 것이 아니라 다음 세 관계를 반복해서 판단하게 하는 것입니다.

1. 십의 자리 값에서 몫과 남은 수를 찾습니다.
2. 남은 수와 일의 자리 수를 합쳐 내려올 수를 만듭니다.
3. 내려온 수를 나누어 일의 자리 몫을 찾습니다.

## 2. 이 게임의 주요 특징

### 교과서식 나눗셈 과정

- `65 ÷ 5`를 풀 때 `6 ÷ 5`라고 말하지 않고, 실제 값인 `60 ÷ 5`에서 시작합니다.
- 십의 자리 몫 칸에는 자리 숫자 `1`이 들어가지만, 선택지와 확인 문구에는 실제 값인 `몫 10`을 보여 줍니다.
- 몫, 곱한 값, 빼는 선, 남은 수, 내려오는 수를 학교 세로셈의 자리 열에 맞춰 배치합니다.
- 문제식과 세로셈판을 위아래 별도 상자로 나눠 현재 문제와 풀이 과정을 구분합니다.

### 한 화면에서 한 가지 판단

문제 화면은 왼쪽의 큰 계산판과 오른쪽의 한 줄 지시문·선택지로 나뉩니다. 현재 단계에서 필요한 선택지만 보이고, 전체 풀이 해설이나 다음 단계 정보는 한꺼번에 펼치지 않습니다.

### 정답 확인 뒤 단계 이동

학생이 정답을 고르면 선택지 색만 바뀌지 않습니다. 선택한 값이 계산판의 몫 칸, 남은 수 칸, 내려오는 수에 실제로 들어간 모습을 먼저 보여 준 뒤 다음 단계로 이동합니다. 마지막 단계에서는 완성된 세로셈과 완성식이 보인 뒤 학생이 `문 열기`를 눌러 보상을 확인합니다.

### 오답 이유가 보이는 선택지

- 십의 자리 몫을 너무 크게 잡은 경우
- 십의 자리 몫을 너무 작게 잡은 경우
- 남은 수를 빼고 일의 자리만 내려온 경우
- 일의 자리 수를 빼고 남은 수만 내려온 경우
- 내려온 수의 몫을 너무 크게 또는 작게 잡은 경우

각 오답은 현재 문제의 실제 수를 사용한 짧은 피드백으로 설명합니다. 학생은 단순히 `틀렸어요`가 아니라 어느 수를 다시 봐야 하는지 확인할 수 있습니다.

### 문제 은행과 매 판 무작위 출제

- 문제 은행: 조건을 만족하는 58개 문제
- 한 판: 중복 없이 10문제 추출
- 출제 조건: 두 자리 수 ÷ 한 자리 수, 몫은 두 자리 수, 십의 자리에서 남은 수가 생기며 최종 나눗셈은 나누어떨어짐
- 새로 시작하거나 `다시`를 누를 때 현재 시각을 기준으로 새 문제 세트를 섞음
- `?seed=61` 같은 시드 주소는 QA 재현용이며, 일반 실행에서는 매번 다른 10문제가 나옴

### 정답은 유리하지만 보상은 무작위

첫 시도에 맞히면 점수가 오를 가능성이 높습니다. 오답 뒤 다시 맞혀도 보상을 받을 수 있지만 점수가 줄거나 0이 될 가능성이 더 높습니다. 따라서 틀렸다고 무조건 감점하지 않으면서도 첫 시도 정답이 분명히 유리합니다.

### 여섯 단계 최종 보상

최종 결과는 `정답 수 → 점수 → 다시`를 하나의 결과판 안에서 같은 중앙축으로 보여 줍니다. 도착 장소, 독수리몬의 반응, 주변 배경이 단계마다 달라져 다음 판에는 더 높은 층을 노릴 이유를 만듭니다.

## 3. 학습 및 게임 규칙

| 항목 | 현재 규칙 |
| --- | --- |
| 문제 수 | 한 판 10문제 |
| 문제 은행 | 58개 후보에서 무작위 10개 |
| 문제당 수학 판단 | 3회 |
| 선택 방식 | 단계별 4지선다 |
| 정답 확인 | 선택값을 계산판에 반영한 뒤 1.6~1.8초 확인 |
| 마지막 행동 | 완성된 세로셈 확인 후 `문 열기` |
| 점수 범위 | 0~100 |
| 최종 결과 조건 | 첫 시도 정답 수와 점수 동시 반영 |
| 최고 특별 결과 | 무지개 사건을 얻으면 `무지개 최고층` |
| 전국 순위 | 현재 제품 정책에 따라 비활성화 |

## 4. 게임 흐름

```text
첫 화면
→ 설명 1: 나눗셈을 푸는 방법
→ 설명 2: 문을 열고 점수를 얻는 방법
→ 십의 자리 몫과 남은 수 선택
→ 남은 수와 일의 자리 수를 합쳐 내리기
→ 내려온 수의 몫 선택
→ 완성 세로셈 확인
→ 문 열기
→ 무작위 점수 보상
→ 다음 문제
→ 10문제 뒤 최종 도착 장소
```

## 5. 화면별 최신 스크린샷

아래 이미지는 현재 `index.html`과 현재 실행 WebP를 사용해 2026-07-22에 다시 캡처한 1280×800 데스크톱 전체 흐름입니다.

### 5-1. 첫 화면

첫 화면은 글자 없는 생성 배경, 생성형 제목 아트, 한 줄 목표, 공용 생성형 시작 버튼으로 구성됩니다.

![첫 화면](screenshots/engine-flow-desktop-01-cover.png)

### 5-2. 설정 화면

배경 소리와 효과 소리를 따로 조절하고, 방법 다시 보기와 처음부터 시작을 선택할 수 있습니다.

![설정 화면](screenshots/engine-flow-desktop-02-settings.png)

### 5-3. 설명 1 — 푸는 방법

`70 ÷ 2 → 70 = 2 × 30 + 10 → 10 + 6 = 16 → 16 ÷ 2 = 8 → 30 + 8 = 38`의 실제 값 흐름을 한 장의 생성 이미지로 보여 줍니다.

![설명 1](screenshots/engine-flow-desktop-03-tutorial-1.png)

### 5-4. 설명 2 — 게임 목표

나눗셈을 풀고, 문을 열어 점수를 확인하고, 10문제 뒤 도착한 층을 본다는 전체 흐름을 안내합니다.

![설명 2](screenshots/engine-flow-desktop-04-tutorial-2.png)

### 5-5. 문제 1단계 — 십의 자리 몫과 남은 수

학생은 십의 자리 값에서 실제 몫과 남은 수의 짝을 고릅니다.

![문제 1단계](screenshots/engine-flow-desktop-05-play-step1.png)

### 5-6. 문제 1단계 오답 — 몫이 너무 큰 경우

선택한 몫으로 곱한 값이 현재 십의 자리 값보다 커지는 이유를 보여 줍니다.

![십의 자리 몫 과대 오답](screenshots/engine-flow-desktop-05b-play-wrong.png)

### 5-7. 문제 1단계 오답 — 몫이 너무 작은 경우

남은 수를 한 번 더 나눌 수 있다는 관계를 보여 줍니다.

![십의 자리 몫 과소 오답](screenshots/engine-flow-desktop-05b2-play-quotient-too-low.png)

### 5-8. 문제 1단계 정답 확인

고른 몫과 남은 수가 계산판의 해당 칸에 들어간 상태를 확인합니다.

![문제 1단계 정답 확인](screenshots/engine-flow-desktop-05c-play-step1-confirm.png)

### 5-9. 문제 2단계 — 수 내려오기

남은 수와 일의 자리 수를 합쳐 내려올 수를 고릅니다.

![문제 2단계](screenshots/engine-flow-desktop-05d-play-step2.png)

### 5-10. 문제 2단계 오답

남은 수 또는 일의 자리 수를 빠뜨린 경우 현재 계산판의 두 수를 다시 보게 합니다.

![문제 2단계 오답](screenshots/engine-flow-desktop-05d2-play-down-wrong.png)

### 5-11. 문제 3단계 — 내려온 수 나누기

내려온 수를 나누어 일의 자리 몫을 고릅니다.

![문제 3단계](screenshots/engine-flow-desktop-05e-play-step3.png)

### 5-12. 문제 3단계 오답 — 몫이 너무 큰 경우

몫과 나누는 수를 곱한 값이 내려온 수보다 커지는 이유를 보여 줍니다.

![일의 자리 몫 과대 오답](screenshots/engine-flow-desktop-05e2-play-ones-too-high.png)

### 5-13. 문제 3단계 오답 — 몫이 너무 작은 경우

남은 수를 한 번 더 나눌 수 있다는 관계를 보여 줍니다.

![일의 자리 몫 과소 오답](screenshots/engine-flow-desktop-05e3-play-ones-too-low.png)

### 5-14. 완성 세로셈 확인

세 단계에서 고른 값이 하나의 교과서식 세로셈과 완성식으로 이어집니다. 보상은 이 상태를 확인한 뒤에만 열 수 있습니다.

![완성 세로셈 확인](screenshots/engine-flow-desktop-06-confirm.png)

### 5-15. 닫힌 보상 화면

문을 열기 전에는 어떤 점수 변화가 나올지 알 수 없습니다.

![닫힌 보상 화면](screenshots/engine-flow-desktop-07-reward-closed.png)

### 5-16. 열린 보상 화면

생성 이미지와 짧은 변화량으로 이번 점수 사건을 보여 줍니다.

![열린 보상 화면](screenshots/engine-flow-desktop-07b-reward-open.png)

### 5-17. 0/10 최저 결과

첫 시도 정답이 0개여도 결과 화면이 사라지지 않고 `지하 비밀기지`에 도착합니다.

![0/10 최저 결과](screenshots/engine-flow-desktop-08-result-low-0-of-10.png)

### 5-18. 지하 비밀기지

![지하 비밀기지](screenshots/engine-flow-desktop-08a-result-basement.png)

### 5-19. 햇살 로비

![햇살 로비](screenshots/engine-flow-desktop-08a-result-first.png)

### 5-20. 구름 쉼터

![구름 쉼터](screenshots/engine-flow-desktop-08a-result-middle.png)

### 5-21. 하늘 전망대

![하늘 전망대](screenshots/engine-flow-desktop-08a-result-view.png)

### 5-22. 꽃빛 옥상정원

![꽃빛 옥상정원](screenshots/engine-flow-desktop-08a-result-roof.png)

### 5-23. 무지개 최고층

![무지개 최고층](screenshots/engine-flow-desktop-08a-result-rainbow.png)

## 6. 점수 보상 규칙

### 첫 시도 정답

| 사건 | 변화 | 확률 |
| --- | ---: | ---: |
| 일반 상승 | +5~+9 | 76.45% |
| 점수 감소 | -10~-5 | 12.00% |
| 큰 상승 | +13~+22 | 9.00% |
| 급행 | +50 | 0.50% |
| 점수 0 | 누적 점수를 0으로 변경 | 2.00% |
| 무지개 | 점수 100과 특별 결과 | 0.05% |

점수가 오르는 사건은 86%, 불리한 사건은 14%입니다.

### 오답 뒤 재시도 정답

| 사건 | 변화 | 확률 |
| --- | ---: | ---: |
| 일반 상승 | +5~+9 | 33.00% |
| 점수 감소 | -10~-5 | 55.00% |
| 큰 상승 | +13~+22 | 6.00% |
| 급행 | +50 | 0.90% |
| 점수 0 | 누적 점수를 0으로 변경 | 5.00% |
| 무지개 | 점수 100과 특별 결과 | 0.10% |

점수가 오르는 사건은 40%, 불리한 사건은 60%입니다. 오답은 불리하지만 무조건 감점되지는 않습니다.

## 7. 최종 도착 장소

| 단계 | 도착 장소 | 최소 점수 | 최소 첫 시도 정답 수 | 비고 |
| --- | --- | ---: | ---: | --- |
| 1 | 지하 비밀기지 | 0 | 0 | 최저 결과도 빈 화면이 아님 |
| 2 | 햇살 로비 | 19 | 3 |  |
| 3 | 구름 쉼터 | 39 | 5 |  |
| 4 | 하늘 전망대 | 59 | 7 |  |
| 5 | 꽃빛 옥상정원 | 79 | 9 | 일반 최고 단계 |
| 특별 | 무지개 최고층 | 무지개 사건 | 제한 없음 | 일반 점수보다 우선 |

결과 이미지는 6장 모두 1280×800입니다. 현재 실행 파일은 브라우저의 예전 생성 이미지 캐시와 섞이지 않도록 다음 버전 URL을 사용합니다.

- `result-basement-v4-generated.webp`
- `result-first-v3-generated.webp`
- `result-middle-v3-generated.webp`
- `result-view-v4-generated.webp`
- `result-roof-v5-generated.webp`
- `result-rainbow-v6-generated.webp`

결과 세트 컨택시트는 `result-tiers-v4-contact-sheet.png`입니다.

## 8. 화면 및 자산 구현 방식

- 첫 화면과 결과 화면은 생성 이미지 기반 RasterStage입니다.
- 설명 두 장도 1280×800 생성 이미지이며 CSS로 풀이 포스터를 다시 그리지 않습니다.
- 문제 화면은 실제 값과 상태가 바뀌므로 HTML/SVG 계산판을 사용합니다.
- 정답 수 `0/10`~`10/10`은 `_shared/result-count/`의 공용 생성 이미지 세트를 사용합니다.
- 점수는 0~100의 동적 값이므로 결과판 안 SVG 텍스트가 표시합니다.
- 보이는 `다시` 버튼은 각 결과 장면 안에 포함되어 있고, 실제 클릭은 같은 경계의 투명 HTML hitbox가 맡습니다.
- 전역 설정 버튼은 Stage 오른쪽 위의 고정 슬롯을 사용합니다.
- 전국 순위 UI와 네트워크 요청은 현재 정책에 따라 비활성화되어 있습니다.

## 9. 공개 패키지와 업체 인계

이 게임은 별도 빌드 없이 정적 웹 서버에서 바로 실행할 수 있는 단일 HTML 패키지입니다.

필수 구성:

- `index.html`
- `cover-generated.webp`
- `title-logo-generated.webp`
- `tutorial-page-1-v7-generated.webp`
- `tutorial-page-2-v4-generated.webp`
- 문제 장면 WebP 3장
- 보상 장면 WebP
- 독수리몬 반응 WebP 3장
- 결과 PNG/WebP 6세트
- `assets/audio/*.wav`
- `screenshots/*.png`
- `README.md`
- `REPORT.md`

운영 시에는 `3-2-2-2-mathmon-elevator/` 폴더 구조를 유지한 채 정적 서버에 올리면 됩니다. 공용 자산을 `../_shared/`에서 참조하므로 배포 패키지에는 저장소의 `_shared/` 폴더도 함께 포함해야 합니다.

로컬 확인 주소:

```text
http://127.0.0.1:4173/3-2-2-2-mathmon-elevator/index.html
```

이 게임은 점수 제출, 학생 정보 저장, 전국 순위 API를 사용하지 않습니다. 별도 데이터베이스나 백엔드 배포가 필요하지 않습니다.

## 10. 최신 화면 QA

전체 흐름은 아래 일곱 화면 조건에서 각각 10문제를 완주하고 모든 상태를 다시 캡처했습니다.

| QA 이름 | 브라우저 크기 | DPR | 확인 내용 |
| --- | ---: | ---: | --- |
| desktop | 1280×800 | 1 | 전체 흐름과 결과 6단계 |
| tablet-landscape | 1024×768 | 1 | 태블릿 가로 전체 흐름 |
| codex-browser | 931×897 | 1 | Codex 브라우저 전체 흐름 |
| reported-instruction-wrap | 1082×897 | 2 | 지시문 줄바꿈 회귀 |
| reported-divisor-left | 1022×774 | 1 | 나누는 수 위치 회귀 |
| reported-svg-overlap | 934×987 | 1 | 계산판·선택지·독수리몬 겹침 회귀 |
| reported-result-overlap | 1039×651 | 2 | 결과판·점수·다시 버튼·캐시 회귀 |

현재 실행본의 화면 크기별 전체 흐름은 `screenshots/report-flow-desktop-contact-sheet.png`, `screenshots/report-flow-tablet-landscape-contact-sheet.png`, `screenshots/report-flow-codex-browser-contact-sheet.png`, `screenshots/report-flow-reported-instruction-wrap-1082x897-contact-sheet.png`, `screenshots/report-flow-reported-divisor-left-1022x774-contact-sheet.png`, `screenshots/report-flow-reported-svg-overlap-934x987-contact-sheet.png`, `screenshots/report-flow-reported-result-overlap-1039x651-contact-sheet.png`에 모았습니다. 실행본 해시와 개별 캡처 목록은 `screenshots/report-evidence-manifest.json`에 기록했습니다.

확인한 상태:

- 첫 화면
- 설정 모달
- 설명 1·2
- 문제 대기
- 십의 자리 몫 과대·과소 오답
- 십의 자리 정답 확인
- 내림 단계와 대표 오답
- 일의 자리 몫 과대·과소 오답
- 마지막 완성 세로셈
- 닫힌 보상과 열린 보상
- 0/10 최저 결과
- 최종 결과 6단계

최신 실행 결과:

```text
QA_LESSON_MODEL: PASS
QA_LESSON_FLOW: PASS
LESSON2_ELEVATOR_QA: PASS
CHECK_LESSON_CONTRACT: PASS
LESSON_VISUAL_CONTRACT: PASS
Stage ratio contract: PASS
git diff --check: PASS
```

모든 QA 화면에서 텍스트 넘침, 요소 겹침, 깨진 이미지, 결과 버튼과 클릭 영역 불일치가 0건입니다.

## 11. 검증 명령

```bash
node scripts/build-lesson.mjs 3-2-2-2-mathmon-elevator
node scripts/qa-lesson-model.mjs 3-2-2-2-mathmon-elevator
node scripts/qa-lesson-flow.mjs 3-2-2-2-mathmon-elevator 61
node scripts/qa-lesson2-elevator.mjs
node scripts/check-stage-ratio.mjs
node scripts/check-lesson-contract.mjs 3-2-2-2-mathmon-elevator
node scripts/check-lesson-visual-contract.mjs 3-2-2-2-mathmon-elevator
git diff --check
```

<!-- REPORT-EVIDENCE-ALL:START -->

## 2026-08-04 최신 원본 스크린샷 전수

- 실행본 SHA-256: `a86b7b6c730e8d3494c60ea9dbd58e3248a34ddf511bda57f673f73dc6a4be1e`
- 생성 시각: `2026-08-04T15:32:06.972Z`
- 등록 화면 크기: `7개`
- 아래에 직접 삽입한 원본 캡처: `175장`
- 컨택시트만으로 대신하지 않고 manifest에 기록된 원본 캡처를 한 장씩 모두 연결했습니다.

### desktop · 1280×800 · DPR 1 · 28장

![desktop 전체 상태 컨택시트](screenshots/report-flow-desktop-contact-sheet.png)

#### 시작 화면 · `engine-flow-desktop-01-cover.png`

![desktop 시작 화면](screenshots/engine-flow-desktop-01-cover.png)

- 학생이 보는 것: 매스몬 엘리베이터 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-desktop-02-settings.png`

![desktop 설정 화면](screenshots/engine-flow-desktop-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-desktop-03-tutorial-1.png`

![desktop 설명 1 · 풀이 방법](screenshots/engine-flow-desktop-03-tutorial-1.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-desktop-04-tutorial-2.png`

![desktop 설명 2 · 보상과 목표](screenshots/engine-flow-desktop-04-tutorial-2.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-desktop-05-play-step1.png`

![desktop 문제 상태 · 05-play-step1](screenshots/engine-flow-desktop-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b2-play-quotient-too-low · `engine-flow-desktop-05b2-play-quotient-too-low.png`

![desktop 오답 확인 · 05b2-play-quotient-too-low](screenshots/engine-flow-desktop-05b2-play-quotient-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 정답 확인 · 05c-play-step1-confirm · `engine-flow-desktop-05c-play-step1-confirm.png`

![desktop 정답 확인 · 05c-play-step1-confirm](screenshots/engine-flow-desktop-05c-play-step1-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05d-play-step2 · `engine-flow-desktop-05d-play-step2.png`

![desktop 문제 상태 · 05d-play-step2](screenshots/engine-flow-desktop-05d-play-step2.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05d2-play-down-wrong · `engine-flow-desktop-05d2-play-down-wrong.png`

![desktop 오답 확인 · 05d2-play-down-wrong](screenshots/engine-flow-desktop-05d2-play-down-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 문제 상태 · 05e-play-step3 · `engine-flow-desktop-05e-play-step3.png`

![desktop 문제 상태 · 05e-play-step3](screenshots/engine-flow-desktop-05e-play-step3.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05e2-play-ones-too-high · `engine-flow-desktop-05e2-play-ones-too-high.png`

![desktop 오답 확인 · 05e2-play-ones-too-high](screenshots/engine-flow-desktop-05e2-play-ones-too-high.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05e3-play-ones-too-low · `engine-flow-desktop-05e3-play-ones-too-low.png`

![desktop 오답 확인 · 05e3-play-ones-too-low](screenshots/engine-flow-desktop-05e3-play-ones-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-desktop-05b-play-wrong.png`

![desktop 오답 확인 · 05b-play-wrong](screenshots/engine-flow-desktop-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-desktop-06-confirm.png`

![desktop 마지막 확인 · 06-confirm](screenshots/engine-flow-desktop-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-desktop-07-reward-closed.png`

![desktop 닫힌 보상](screenshots/engine-flow-desktop-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 보상 상태 · 07-reward · `engine-flow-desktop-07-reward.png`

![desktop 보상 상태 · 07-reward](screenshots/engine-flow-desktop-07-reward.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 열린 보상 · `engine-flow-desktop-07b-reward-open.png`

![desktop 열린 보상](screenshots/engine-flow-desktop-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-desktop-08-result.png`

![desktop 실제 결과](screenshots/engine-flow-desktop-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08-result-low-0-of-10 · `engine-flow-desktop-08-result-low-0-of-10.png`

![desktop 결과 상태 · 08-result-low-0-of-10](screenshots/engine-flow-desktop-08-result-low-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · basement · `engine-flow-desktop-08a-result-basement.png`

![desktop 결과 단계 · basement](screenshots/engine-flow-desktop-08a-result-basement.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · first · `engine-flow-desktop-08a-result-first.png`

![desktop 결과 단계 · first](screenshots/engine-flow-desktop-08a-result-first.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · middle · `engine-flow-desktop-08a-result-middle.png`

![desktop 결과 단계 · middle](screenshots/engine-flow-desktop-08a-result-middle.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-desktop-08a-result-rainbow.png`

![desktop 결과 단계 · rainbow](screenshots/engine-flow-desktop-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · roof · `engine-flow-desktop-08a-result-roof.png`

![desktop 결과 단계 · roof](screenshots/engine-flow-desktop-08a-result-roof.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · view · `engine-flow-desktop-08a-result-view.png`

![desktop 결과 단계 · view](screenshots/engine-flow-desktop-08a-result-view.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 09-scoreboard-offline · `engine-flow-desktop-09-scoreboard-offline.png`

![desktop 09-scoreboard-offline](screenshots/engine-flow-desktop-09-scoreboard-offline.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09b-scoreboard-10rows-start · `engine-flow-desktop-09b-scoreboard-10rows-start.png`

![desktop 09b-scoreboard-10rows-start](screenshots/engine-flow-desktop-09b-scoreboard-10rows-start.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09c-scoreboard-10rows-end · `engine-flow-desktop-09c-scoreboard-10rows-end.png`

![desktop 09c-scoreboard-10rows-end](screenshots/engine-flow-desktop-09c-scoreboard-10rows-end.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

### tablet-landscape · 1024×768 · DPR 1 · 28장

![tablet-landscape 전체 상태 컨택시트](screenshots/report-flow-tablet-landscape-contact-sheet.png)

#### 시작 화면 · `engine-flow-tablet-landscape-01-cover.png`

![tablet-landscape 시작 화면](screenshots/engine-flow-tablet-landscape-01-cover.png)

- 학생이 보는 것: 매스몬 엘리베이터 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-tablet-landscape-02-settings.png`

![tablet-landscape 설정 화면](screenshots/engine-flow-tablet-landscape-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-tablet-landscape-03-tutorial-1.png`

![tablet-landscape 설명 1 · 풀이 방법](screenshots/engine-flow-tablet-landscape-03-tutorial-1.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-tablet-landscape-04-tutorial-2.png`

![tablet-landscape 설명 2 · 보상과 목표](screenshots/engine-flow-tablet-landscape-04-tutorial-2.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-tablet-landscape-05-play-step1.png`

![tablet-landscape 문제 상태 · 05-play-step1](screenshots/engine-flow-tablet-landscape-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b2-play-quotient-too-low · `engine-flow-tablet-landscape-05b2-play-quotient-too-low.png`

![tablet-landscape 오답 확인 · 05b2-play-quotient-too-low](screenshots/engine-flow-tablet-landscape-05b2-play-quotient-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 정답 확인 · 05c-play-step1-confirm · `engine-flow-tablet-landscape-05c-play-step1-confirm.png`

![tablet-landscape 정답 확인 · 05c-play-step1-confirm](screenshots/engine-flow-tablet-landscape-05c-play-step1-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05d-play-step2 · `engine-flow-tablet-landscape-05d-play-step2.png`

![tablet-landscape 문제 상태 · 05d-play-step2](screenshots/engine-flow-tablet-landscape-05d-play-step2.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05d2-play-down-wrong · `engine-flow-tablet-landscape-05d2-play-down-wrong.png`

![tablet-landscape 오답 확인 · 05d2-play-down-wrong](screenshots/engine-flow-tablet-landscape-05d2-play-down-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 문제 상태 · 05e-play-step3 · `engine-flow-tablet-landscape-05e-play-step3.png`

![tablet-landscape 문제 상태 · 05e-play-step3](screenshots/engine-flow-tablet-landscape-05e-play-step3.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05e2-play-ones-too-high · `engine-flow-tablet-landscape-05e2-play-ones-too-high.png`

![tablet-landscape 오답 확인 · 05e2-play-ones-too-high](screenshots/engine-flow-tablet-landscape-05e2-play-ones-too-high.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05e3-play-ones-too-low · `engine-flow-tablet-landscape-05e3-play-ones-too-low.png`

![tablet-landscape 오답 확인 · 05e3-play-ones-too-low](screenshots/engine-flow-tablet-landscape-05e3-play-ones-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-tablet-landscape-05b-play-wrong.png`

![tablet-landscape 오답 확인 · 05b-play-wrong](screenshots/engine-flow-tablet-landscape-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-tablet-landscape-06-confirm.png`

![tablet-landscape 마지막 확인 · 06-confirm](screenshots/engine-flow-tablet-landscape-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-tablet-landscape-07-reward-closed.png`

![tablet-landscape 닫힌 보상](screenshots/engine-flow-tablet-landscape-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 보상 상태 · 07-reward · `engine-flow-tablet-landscape-07-reward.png`

![tablet-landscape 보상 상태 · 07-reward](screenshots/engine-flow-tablet-landscape-07-reward.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 열린 보상 · `engine-flow-tablet-landscape-07b-reward-open.png`

![tablet-landscape 열린 보상](screenshots/engine-flow-tablet-landscape-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-tablet-landscape-08-result.png`

![tablet-landscape 실제 결과](screenshots/engine-flow-tablet-landscape-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08-result-low-0-of-10 · `engine-flow-tablet-landscape-08-result-low-0-of-10.png`

![tablet-landscape 결과 상태 · 08-result-low-0-of-10](screenshots/engine-flow-tablet-landscape-08-result-low-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · basement · `engine-flow-tablet-landscape-08a-result-basement.png`

![tablet-landscape 결과 단계 · basement](screenshots/engine-flow-tablet-landscape-08a-result-basement.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · first · `engine-flow-tablet-landscape-08a-result-first.png`

![tablet-landscape 결과 단계 · first](screenshots/engine-flow-tablet-landscape-08a-result-first.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · middle · `engine-flow-tablet-landscape-08a-result-middle.png`

![tablet-landscape 결과 단계 · middle](screenshots/engine-flow-tablet-landscape-08a-result-middle.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-tablet-landscape-08a-result-rainbow.png`

![tablet-landscape 결과 단계 · rainbow](screenshots/engine-flow-tablet-landscape-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · roof · `engine-flow-tablet-landscape-08a-result-roof.png`

![tablet-landscape 결과 단계 · roof](screenshots/engine-flow-tablet-landscape-08a-result-roof.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · view · `engine-flow-tablet-landscape-08a-result-view.png`

![tablet-landscape 결과 단계 · view](screenshots/engine-flow-tablet-landscape-08a-result-view.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 09-scoreboard-offline · `engine-flow-tablet-landscape-09-scoreboard-offline.png`

![tablet-landscape 09-scoreboard-offline](screenshots/engine-flow-tablet-landscape-09-scoreboard-offline.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09b-scoreboard-10rows-start · `engine-flow-tablet-landscape-09b-scoreboard-10rows-start.png`

![tablet-landscape 09b-scoreboard-10rows-start](screenshots/engine-flow-tablet-landscape-09b-scoreboard-10rows-start.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09c-scoreboard-10rows-end · `engine-flow-tablet-landscape-09c-scoreboard-10rows-end.png`

![tablet-landscape 09c-scoreboard-10rows-end](screenshots/engine-flow-tablet-landscape-09c-scoreboard-10rows-end.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

### codex-browser · 931×897 · DPR 1 · 27장

![codex-browser 전체 상태 컨택시트](screenshots/report-flow-codex-browser-contact-sheet.png)

#### 시작 화면 · `engine-flow-codex-browser-01-cover.png`

![codex-browser 시작 화면](screenshots/engine-flow-codex-browser-01-cover.png)

- 학생이 보는 것: 매스몬 엘리베이터 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-codex-browser-02-settings.png`

![codex-browser 설정 화면](screenshots/engine-flow-codex-browser-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-codex-browser-03-tutorial-1.png`

![codex-browser 설명 1 · 풀이 방법](screenshots/engine-flow-codex-browser-03-tutorial-1.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-codex-browser-04-tutorial-2.png`

![codex-browser 설명 2 · 보상과 목표](screenshots/engine-flow-codex-browser-04-tutorial-2.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-codex-browser-05-play-step1.png`

![codex-browser 문제 상태 · 05-play-step1](screenshots/engine-flow-codex-browser-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b2-play-quotient-too-low · `engine-flow-codex-browser-05b2-play-quotient-too-low.png`

![codex-browser 오답 확인 · 05b2-play-quotient-too-low](screenshots/engine-flow-codex-browser-05b2-play-quotient-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 정답 확인 · 05c-play-step1-confirm · `engine-flow-codex-browser-05c-play-step1-confirm.png`

![codex-browser 정답 확인 · 05c-play-step1-confirm](screenshots/engine-flow-codex-browser-05c-play-step1-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05d-play-step2 · `engine-flow-codex-browser-05d-play-step2.png`

![codex-browser 문제 상태 · 05d-play-step2](screenshots/engine-flow-codex-browser-05d-play-step2.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05d2-play-down-wrong · `engine-flow-codex-browser-05d2-play-down-wrong.png`

![codex-browser 오답 확인 · 05d2-play-down-wrong](screenshots/engine-flow-codex-browser-05d2-play-down-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 문제 상태 · 05e-play-step3 · `engine-flow-codex-browser-05e-play-step3.png`

![codex-browser 문제 상태 · 05e-play-step3](screenshots/engine-flow-codex-browser-05e-play-step3.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05e2-play-ones-too-high · `engine-flow-codex-browser-05e2-play-ones-too-high.png`

![codex-browser 오답 확인 · 05e2-play-ones-too-high](screenshots/engine-flow-codex-browser-05e2-play-ones-too-high.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05e3-play-ones-too-low · `engine-flow-codex-browser-05e3-play-ones-too-low.png`

![codex-browser 오답 확인 · 05e3-play-ones-too-low](screenshots/engine-flow-codex-browser-05e3-play-ones-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-codex-browser-05b-play-wrong.png`

![codex-browser 오답 확인 · 05b-play-wrong](screenshots/engine-flow-codex-browser-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-codex-browser-06-confirm.png`

![codex-browser 마지막 확인 · 06-confirm](screenshots/engine-flow-codex-browser-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-codex-browser-07-reward-closed.png`

![codex-browser 닫힌 보상](screenshots/engine-flow-codex-browser-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-codex-browser-07b-reward-open.png`

![codex-browser 열린 보상](screenshots/engine-flow-codex-browser-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-codex-browser-08-result.png`

![codex-browser 실제 결과](screenshots/engine-flow-codex-browser-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08-result-low-0-of-10 · `engine-flow-codex-browser-08-result-low-0-of-10.png`

![codex-browser 결과 상태 · 08-result-low-0-of-10](screenshots/engine-flow-codex-browser-08-result-low-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · basement · `engine-flow-codex-browser-08a-result-basement.png`

![codex-browser 결과 단계 · basement](screenshots/engine-flow-codex-browser-08a-result-basement.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · first · `engine-flow-codex-browser-08a-result-first.png`

![codex-browser 결과 단계 · first](screenshots/engine-flow-codex-browser-08a-result-first.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · middle · `engine-flow-codex-browser-08a-result-middle.png`

![codex-browser 결과 단계 · middle](screenshots/engine-flow-codex-browser-08a-result-middle.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-codex-browser-08a-result-rainbow.png`

![codex-browser 결과 단계 · rainbow](screenshots/engine-flow-codex-browser-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · roof · `engine-flow-codex-browser-08a-result-roof.png`

![codex-browser 결과 단계 · roof](screenshots/engine-flow-codex-browser-08a-result-roof.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · view · `engine-flow-codex-browser-08a-result-view.png`

![codex-browser 결과 단계 · view](screenshots/engine-flow-codex-browser-08a-result-view.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 09-scoreboard-offline · `engine-flow-codex-browser-09-scoreboard-offline.png`

![codex-browser 09-scoreboard-offline](screenshots/engine-flow-codex-browser-09-scoreboard-offline.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09b-scoreboard-10rows-start · `engine-flow-codex-browser-09b-scoreboard-10rows-start.png`

![codex-browser 09b-scoreboard-10rows-start](screenshots/engine-flow-codex-browser-09b-scoreboard-10rows-start.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09c-scoreboard-10rows-end · `engine-flow-codex-browser-09c-scoreboard-10rows-end.png`

![codex-browser 09c-scoreboard-10rows-end](screenshots/engine-flow-codex-browser-09c-scoreboard-10rows-end.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

### reported-instruction-wrap-1082x897 · 1082×897 · DPR 2 · 23장

![reported-instruction-wrap-1082x897 전체 상태 컨택시트](screenshots/report-flow-reported-instruction-wrap-1082x897-contact-sheet.png)

#### 시작 화면 · `engine-flow-reported-instruction-wrap-1082x897-01-cover.png`

![reported-instruction-wrap-1082x897 시작 화면](screenshots/engine-flow-reported-instruction-wrap-1082x897-01-cover.png)

- 학생이 보는 것: 매스몬 엘리베이터 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-reported-instruction-wrap-1082x897-02-settings.png`

![reported-instruction-wrap-1082x897 설정 화면](screenshots/engine-flow-reported-instruction-wrap-1082x897-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-reported-instruction-wrap-1082x897-03-tutorial-1.png`

![reported-instruction-wrap-1082x897 설명 1 · 풀이 방법](screenshots/engine-flow-reported-instruction-wrap-1082x897-03-tutorial-1.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-reported-instruction-wrap-1082x897-04-tutorial-2.png`

![reported-instruction-wrap-1082x897 설명 2 · 보상과 목표](screenshots/engine-flow-reported-instruction-wrap-1082x897-04-tutorial-2.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-reported-instruction-wrap-1082x897-05-play-step1.png`

![reported-instruction-wrap-1082x897 문제 상태 · 05-play-step1](screenshots/engine-flow-reported-instruction-wrap-1082x897-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b2-play-quotient-too-low · `engine-flow-reported-instruction-wrap-1082x897-05b2-play-quotient-too-low.png`

![reported-instruction-wrap-1082x897 오답 확인 · 05b2-play-quotient-too-low](screenshots/engine-flow-reported-instruction-wrap-1082x897-05b2-play-quotient-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 정답 확인 · 05c-play-step1-confirm · `engine-flow-reported-instruction-wrap-1082x897-05c-play-step1-confirm.png`

![reported-instruction-wrap-1082x897 정답 확인 · 05c-play-step1-confirm](screenshots/engine-flow-reported-instruction-wrap-1082x897-05c-play-step1-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05d-play-step2 · `engine-flow-reported-instruction-wrap-1082x897-05d-play-step2.png`

![reported-instruction-wrap-1082x897 문제 상태 · 05d-play-step2](screenshots/engine-flow-reported-instruction-wrap-1082x897-05d-play-step2.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05d2-play-down-wrong · `engine-flow-reported-instruction-wrap-1082x897-05d2-play-down-wrong.png`

![reported-instruction-wrap-1082x897 오답 확인 · 05d2-play-down-wrong](screenshots/engine-flow-reported-instruction-wrap-1082x897-05d2-play-down-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 문제 상태 · 05e-play-step3 · `engine-flow-reported-instruction-wrap-1082x897-05e-play-step3.png`

![reported-instruction-wrap-1082x897 문제 상태 · 05e-play-step3](screenshots/engine-flow-reported-instruction-wrap-1082x897-05e-play-step3.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05e2-play-ones-too-high · `engine-flow-reported-instruction-wrap-1082x897-05e2-play-ones-too-high.png`

![reported-instruction-wrap-1082x897 오답 확인 · 05e2-play-ones-too-high](screenshots/engine-flow-reported-instruction-wrap-1082x897-05e2-play-ones-too-high.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05e3-play-ones-too-low · `engine-flow-reported-instruction-wrap-1082x897-05e3-play-ones-too-low.png`

![reported-instruction-wrap-1082x897 오답 확인 · 05e3-play-ones-too-low](screenshots/engine-flow-reported-instruction-wrap-1082x897-05e3-play-ones-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-reported-instruction-wrap-1082x897-05b-play-wrong.png`

![reported-instruction-wrap-1082x897 오답 확인 · 05b-play-wrong](screenshots/engine-flow-reported-instruction-wrap-1082x897-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-reported-instruction-wrap-1082x897-06-confirm.png`

![reported-instruction-wrap-1082x897 마지막 확인 · 06-confirm](screenshots/engine-flow-reported-instruction-wrap-1082x897-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-reported-instruction-wrap-1082x897-07-reward-closed.png`

![reported-instruction-wrap-1082x897 닫힌 보상](screenshots/engine-flow-reported-instruction-wrap-1082x897-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-reported-instruction-wrap-1082x897-07b-reward-open.png`

![reported-instruction-wrap-1082x897 열린 보상](screenshots/engine-flow-reported-instruction-wrap-1082x897-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 결과 상태 · 08-result-low-0-of-10 · `engine-flow-reported-instruction-wrap-1082x897-08-result-low-0-of-10.png`

![reported-instruction-wrap-1082x897 결과 상태 · 08-result-low-0-of-10](screenshots/engine-flow-reported-instruction-wrap-1082x897-08-result-low-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · basement · `engine-flow-reported-instruction-wrap-1082x897-08a-result-basement.png`

![reported-instruction-wrap-1082x897 결과 단계 · basement](screenshots/engine-flow-reported-instruction-wrap-1082x897-08a-result-basement.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · first · `engine-flow-reported-instruction-wrap-1082x897-08a-result-first.png`

![reported-instruction-wrap-1082x897 결과 단계 · first](screenshots/engine-flow-reported-instruction-wrap-1082x897-08a-result-first.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · middle · `engine-flow-reported-instruction-wrap-1082x897-08a-result-middle.png`

![reported-instruction-wrap-1082x897 결과 단계 · middle](screenshots/engine-flow-reported-instruction-wrap-1082x897-08a-result-middle.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-reported-instruction-wrap-1082x897-08a-result-rainbow.png`

![reported-instruction-wrap-1082x897 결과 단계 · rainbow](screenshots/engine-flow-reported-instruction-wrap-1082x897-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · roof · `engine-flow-reported-instruction-wrap-1082x897-08a-result-roof.png`

![reported-instruction-wrap-1082x897 결과 단계 · roof](screenshots/engine-flow-reported-instruction-wrap-1082x897-08a-result-roof.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · view · `engine-flow-reported-instruction-wrap-1082x897-08a-result-view.png`

![reported-instruction-wrap-1082x897 결과 단계 · view](screenshots/engine-flow-reported-instruction-wrap-1082x897-08a-result-view.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### reported-divisor-left-1022x774 · 1022×774 · DPR 1 · 23장

![reported-divisor-left-1022x774 전체 상태 컨택시트](screenshots/report-flow-reported-divisor-left-1022x774-contact-sheet.png)

#### 시작 화면 · `engine-flow-reported-divisor-left-1022x774-01-cover.png`

![reported-divisor-left-1022x774 시작 화면](screenshots/engine-flow-reported-divisor-left-1022x774-01-cover.png)

- 학생이 보는 것: 매스몬 엘리베이터 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-reported-divisor-left-1022x774-02-settings.png`

![reported-divisor-left-1022x774 설정 화면](screenshots/engine-flow-reported-divisor-left-1022x774-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-reported-divisor-left-1022x774-03-tutorial-1.png`

![reported-divisor-left-1022x774 설명 1 · 풀이 방법](screenshots/engine-flow-reported-divisor-left-1022x774-03-tutorial-1.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-reported-divisor-left-1022x774-04-tutorial-2.png`

![reported-divisor-left-1022x774 설명 2 · 보상과 목표](screenshots/engine-flow-reported-divisor-left-1022x774-04-tutorial-2.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-reported-divisor-left-1022x774-05-play-step1.png`

![reported-divisor-left-1022x774 문제 상태 · 05-play-step1](screenshots/engine-flow-reported-divisor-left-1022x774-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b2-play-quotient-too-low · `engine-flow-reported-divisor-left-1022x774-05b2-play-quotient-too-low.png`

![reported-divisor-left-1022x774 오답 확인 · 05b2-play-quotient-too-low](screenshots/engine-flow-reported-divisor-left-1022x774-05b2-play-quotient-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 정답 확인 · 05c-play-step1-confirm · `engine-flow-reported-divisor-left-1022x774-05c-play-step1-confirm.png`

![reported-divisor-left-1022x774 정답 확인 · 05c-play-step1-confirm](screenshots/engine-flow-reported-divisor-left-1022x774-05c-play-step1-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05d-play-step2 · `engine-flow-reported-divisor-left-1022x774-05d-play-step2.png`

![reported-divisor-left-1022x774 문제 상태 · 05d-play-step2](screenshots/engine-flow-reported-divisor-left-1022x774-05d-play-step2.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05d2-play-down-wrong · `engine-flow-reported-divisor-left-1022x774-05d2-play-down-wrong.png`

![reported-divisor-left-1022x774 오답 확인 · 05d2-play-down-wrong](screenshots/engine-flow-reported-divisor-left-1022x774-05d2-play-down-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 문제 상태 · 05e-play-step3 · `engine-flow-reported-divisor-left-1022x774-05e-play-step3.png`

![reported-divisor-left-1022x774 문제 상태 · 05e-play-step3](screenshots/engine-flow-reported-divisor-left-1022x774-05e-play-step3.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05e2-play-ones-too-high · `engine-flow-reported-divisor-left-1022x774-05e2-play-ones-too-high.png`

![reported-divisor-left-1022x774 오답 확인 · 05e2-play-ones-too-high](screenshots/engine-flow-reported-divisor-left-1022x774-05e2-play-ones-too-high.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05e3-play-ones-too-low · `engine-flow-reported-divisor-left-1022x774-05e3-play-ones-too-low.png`

![reported-divisor-left-1022x774 오답 확인 · 05e3-play-ones-too-low](screenshots/engine-flow-reported-divisor-left-1022x774-05e3-play-ones-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-reported-divisor-left-1022x774-05b-play-wrong.png`

![reported-divisor-left-1022x774 오답 확인 · 05b-play-wrong](screenshots/engine-flow-reported-divisor-left-1022x774-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-reported-divisor-left-1022x774-06-confirm.png`

![reported-divisor-left-1022x774 마지막 확인 · 06-confirm](screenshots/engine-flow-reported-divisor-left-1022x774-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-reported-divisor-left-1022x774-07-reward-closed.png`

![reported-divisor-left-1022x774 닫힌 보상](screenshots/engine-flow-reported-divisor-left-1022x774-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-reported-divisor-left-1022x774-07b-reward-open.png`

![reported-divisor-left-1022x774 열린 보상](screenshots/engine-flow-reported-divisor-left-1022x774-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 결과 상태 · 08-result-low-0-of-10 · `engine-flow-reported-divisor-left-1022x774-08-result-low-0-of-10.png`

![reported-divisor-left-1022x774 결과 상태 · 08-result-low-0-of-10](screenshots/engine-flow-reported-divisor-left-1022x774-08-result-low-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · basement · `engine-flow-reported-divisor-left-1022x774-08a-result-basement.png`

![reported-divisor-left-1022x774 결과 단계 · basement](screenshots/engine-flow-reported-divisor-left-1022x774-08a-result-basement.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · first · `engine-flow-reported-divisor-left-1022x774-08a-result-first.png`

![reported-divisor-left-1022x774 결과 단계 · first](screenshots/engine-flow-reported-divisor-left-1022x774-08a-result-first.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · middle · `engine-flow-reported-divisor-left-1022x774-08a-result-middle.png`

![reported-divisor-left-1022x774 결과 단계 · middle](screenshots/engine-flow-reported-divisor-left-1022x774-08a-result-middle.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-reported-divisor-left-1022x774-08a-result-rainbow.png`

![reported-divisor-left-1022x774 결과 단계 · rainbow](screenshots/engine-flow-reported-divisor-left-1022x774-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · roof · `engine-flow-reported-divisor-left-1022x774-08a-result-roof.png`

![reported-divisor-left-1022x774 결과 단계 · roof](screenshots/engine-flow-reported-divisor-left-1022x774-08a-result-roof.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · view · `engine-flow-reported-divisor-left-1022x774-08a-result-view.png`

![reported-divisor-left-1022x774 결과 단계 · view](screenshots/engine-flow-reported-divisor-left-1022x774-08a-result-view.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### reported-svg-overlap-934x987 · 934×987 · DPR 1 · 23장

![reported-svg-overlap-934x987 전체 상태 컨택시트](screenshots/report-flow-reported-svg-overlap-934x987-contact-sheet.png)

#### 시작 화면 · `engine-flow-reported-svg-overlap-934x987-01-cover.png`

![reported-svg-overlap-934x987 시작 화면](screenshots/engine-flow-reported-svg-overlap-934x987-01-cover.png)

- 학생이 보는 것: 매스몬 엘리베이터 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-reported-svg-overlap-934x987-02-settings.png`

![reported-svg-overlap-934x987 설정 화면](screenshots/engine-flow-reported-svg-overlap-934x987-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-reported-svg-overlap-934x987-03-tutorial-1.png`

![reported-svg-overlap-934x987 설명 1 · 풀이 방법](screenshots/engine-flow-reported-svg-overlap-934x987-03-tutorial-1.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-reported-svg-overlap-934x987-04-tutorial-2.png`

![reported-svg-overlap-934x987 설명 2 · 보상과 목표](screenshots/engine-flow-reported-svg-overlap-934x987-04-tutorial-2.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-reported-svg-overlap-934x987-05-play-step1.png`

![reported-svg-overlap-934x987 문제 상태 · 05-play-step1](screenshots/engine-flow-reported-svg-overlap-934x987-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b2-play-quotient-too-low · `engine-flow-reported-svg-overlap-934x987-05b2-play-quotient-too-low.png`

![reported-svg-overlap-934x987 오답 확인 · 05b2-play-quotient-too-low](screenshots/engine-flow-reported-svg-overlap-934x987-05b2-play-quotient-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 정답 확인 · 05c-play-step1-confirm · `engine-flow-reported-svg-overlap-934x987-05c-play-step1-confirm.png`

![reported-svg-overlap-934x987 정답 확인 · 05c-play-step1-confirm](screenshots/engine-flow-reported-svg-overlap-934x987-05c-play-step1-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05d-play-step2 · `engine-flow-reported-svg-overlap-934x987-05d-play-step2.png`

![reported-svg-overlap-934x987 문제 상태 · 05d-play-step2](screenshots/engine-flow-reported-svg-overlap-934x987-05d-play-step2.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05d2-play-down-wrong · `engine-flow-reported-svg-overlap-934x987-05d2-play-down-wrong.png`

![reported-svg-overlap-934x987 오답 확인 · 05d2-play-down-wrong](screenshots/engine-flow-reported-svg-overlap-934x987-05d2-play-down-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 문제 상태 · 05e-play-step3 · `engine-flow-reported-svg-overlap-934x987-05e-play-step3.png`

![reported-svg-overlap-934x987 문제 상태 · 05e-play-step3](screenshots/engine-flow-reported-svg-overlap-934x987-05e-play-step3.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05e2-play-ones-too-high · `engine-flow-reported-svg-overlap-934x987-05e2-play-ones-too-high.png`

![reported-svg-overlap-934x987 오답 확인 · 05e2-play-ones-too-high](screenshots/engine-flow-reported-svg-overlap-934x987-05e2-play-ones-too-high.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05e3-play-ones-too-low · `engine-flow-reported-svg-overlap-934x987-05e3-play-ones-too-low.png`

![reported-svg-overlap-934x987 오답 확인 · 05e3-play-ones-too-low](screenshots/engine-flow-reported-svg-overlap-934x987-05e3-play-ones-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-reported-svg-overlap-934x987-05b-play-wrong.png`

![reported-svg-overlap-934x987 오답 확인 · 05b-play-wrong](screenshots/engine-flow-reported-svg-overlap-934x987-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-reported-svg-overlap-934x987-06-confirm.png`

![reported-svg-overlap-934x987 마지막 확인 · 06-confirm](screenshots/engine-flow-reported-svg-overlap-934x987-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-reported-svg-overlap-934x987-07-reward-closed.png`

![reported-svg-overlap-934x987 닫힌 보상](screenshots/engine-flow-reported-svg-overlap-934x987-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-reported-svg-overlap-934x987-07b-reward-open.png`

![reported-svg-overlap-934x987 열린 보상](screenshots/engine-flow-reported-svg-overlap-934x987-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 결과 상태 · 08-result-low-0-of-10 · `engine-flow-reported-svg-overlap-934x987-08-result-low-0-of-10.png`

![reported-svg-overlap-934x987 결과 상태 · 08-result-low-0-of-10](screenshots/engine-flow-reported-svg-overlap-934x987-08-result-low-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · basement · `engine-flow-reported-svg-overlap-934x987-08a-result-basement.png`

![reported-svg-overlap-934x987 결과 단계 · basement](screenshots/engine-flow-reported-svg-overlap-934x987-08a-result-basement.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · first · `engine-flow-reported-svg-overlap-934x987-08a-result-first.png`

![reported-svg-overlap-934x987 결과 단계 · first](screenshots/engine-flow-reported-svg-overlap-934x987-08a-result-first.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · middle · `engine-flow-reported-svg-overlap-934x987-08a-result-middle.png`

![reported-svg-overlap-934x987 결과 단계 · middle](screenshots/engine-flow-reported-svg-overlap-934x987-08a-result-middle.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-reported-svg-overlap-934x987-08a-result-rainbow.png`

![reported-svg-overlap-934x987 결과 단계 · rainbow](screenshots/engine-flow-reported-svg-overlap-934x987-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · roof · `engine-flow-reported-svg-overlap-934x987-08a-result-roof.png`

![reported-svg-overlap-934x987 결과 단계 · roof](screenshots/engine-flow-reported-svg-overlap-934x987-08a-result-roof.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · view · `engine-flow-reported-svg-overlap-934x987-08a-result-view.png`

![reported-svg-overlap-934x987 결과 단계 · view](screenshots/engine-flow-reported-svg-overlap-934x987-08a-result-view.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### reported-result-overlap-1039x651 · 1039×651 · DPR 2 · 23장

![reported-result-overlap-1039x651 전체 상태 컨택시트](screenshots/report-flow-reported-result-overlap-1039x651-contact-sheet.png)

#### 시작 화면 · `engine-flow-reported-result-overlap-1039x651-01-cover.png`

![reported-result-overlap-1039x651 시작 화면](screenshots/engine-flow-reported-result-overlap-1039x651-01-cover.png)

- 학생이 보는 것: 매스몬 엘리베이터 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-reported-result-overlap-1039x651-02-settings.png`

![reported-result-overlap-1039x651 설정 화면](screenshots/engine-flow-reported-result-overlap-1039x651-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-reported-result-overlap-1039x651-03-tutorial-1.png`

![reported-result-overlap-1039x651 설명 1 · 풀이 방법](screenshots/engine-flow-reported-result-overlap-1039x651-03-tutorial-1.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-reported-result-overlap-1039x651-04-tutorial-2.png`

![reported-result-overlap-1039x651 설명 2 · 보상과 목표](screenshots/engine-flow-reported-result-overlap-1039x651-04-tutorial-2.png)

- 학생이 보는 것: 내림 있는 두 자리 수 나눗셈 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-reported-result-overlap-1039x651-05-play-step1.png`

![reported-result-overlap-1039x651 문제 상태 · 05-play-step1](screenshots/engine-flow-reported-result-overlap-1039x651-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b2-play-quotient-too-low · `engine-flow-reported-result-overlap-1039x651-05b2-play-quotient-too-low.png`

![reported-result-overlap-1039x651 오답 확인 · 05b2-play-quotient-too-low](screenshots/engine-flow-reported-result-overlap-1039x651-05b2-play-quotient-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 정답 확인 · 05c-play-step1-confirm · `engine-flow-reported-result-overlap-1039x651-05c-play-step1-confirm.png`

![reported-result-overlap-1039x651 정답 확인 · 05c-play-step1-confirm](screenshots/engine-flow-reported-result-overlap-1039x651-05c-play-step1-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05d-play-step2 · `engine-flow-reported-result-overlap-1039x651-05d-play-step2.png`

![reported-result-overlap-1039x651 문제 상태 · 05d-play-step2](screenshots/engine-flow-reported-result-overlap-1039x651-05d-play-step2.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05d2-play-down-wrong · `engine-flow-reported-result-overlap-1039x651-05d2-play-down-wrong.png`

![reported-result-overlap-1039x651 오답 확인 · 05d2-play-down-wrong](screenshots/engine-flow-reported-result-overlap-1039x651-05d2-play-down-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 문제 상태 · 05e-play-step3 · `engine-flow-reported-result-overlap-1039x651-05e-play-step3.png`

![reported-result-overlap-1039x651 문제 상태 · 05e-play-step3](screenshots/engine-flow-reported-result-overlap-1039x651-05e-play-step3.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05e2-play-ones-too-high · `engine-flow-reported-result-overlap-1039x651-05e2-play-ones-too-high.png`

![reported-result-overlap-1039x651 오답 확인 · 05e2-play-ones-too-high](screenshots/engine-flow-reported-result-overlap-1039x651-05e2-play-ones-too-high.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05e3-play-ones-too-low · `engine-flow-reported-result-overlap-1039x651-05e3-play-ones-too-low.png`

![reported-result-overlap-1039x651 오답 확인 · 05e3-play-ones-too-low](screenshots/engine-flow-reported-result-overlap-1039x651-05e3-play-ones-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-reported-result-overlap-1039x651-05b-play-wrong.png`

![reported-result-overlap-1039x651 오답 확인 · 05b-play-wrong](screenshots/engine-flow-reported-result-overlap-1039x651-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-reported-result-overlap-1039x651-06-confirm.png`

![reported-result-overlap-1039x651 마지막 확인 · 06-confirm](screenshots/engine-flow-reported-result-overlap-1039x651-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 내림 있는 두 자리 수 나눗셈의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-reported-result-overlap-1039x651-07-reward-closed.png`

![reported-result-overlap-1039x651 닫힌 보상](screenshots/engine-flow-reported-result-overlap-1039x651-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-reported-result-overlap-1039x651-07b-reward-open.png`

![reported-result-overlap-1039x651 열린 보상](screenshots/engine-flow-reported-result-overlap-1039x651-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 결과 상태 · 08-result-low-0-of-10 · `engine-flow-reported-result-overlap-1039x651-08-result-low-0-of-10.png`

![reported-result-overlap-1039x651 결과 상태 · 08-result-low-0-of-10](screenshots/engine-flow-reported-result-overlap-1039x651-08-result-low-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · basement · `engine-flow-reported-result-overlap-1039x651-08a-result-basement.png`

![reported-result-overlap-1039x651 결과 단계 · basement](screenshots/engine-flow-reported-result-overlap-1039x651-08a-result-basement.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · first · `engine-flow-reported-result-overlap-1039x651-08a-result-first.png`

![reported-result-overlap-1039x651 결과 단계 · first](screenshots/engine-flow-reported-result-overlap-1039x651-08a-result-first.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · middle · `engine-flow-reported-result-overlap-1039x651-08a-result-middle.png`

![reported-result-overlap-1039x651 결과 단계 · middle](screenshots/engine-flow-reported-result-overlap-1039x651-08a-result-middle.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-reported-result-overlap-1039x651-08a-result-rainbow.png`

![reported-result-overlap-1039x651 결과 단계 · rainbow](screenshots/engine-flow-reported-result-overlap-1039x651-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · roof · `engine-flow-reported-result-overlap-1039x651-08a-result-roof.png`

![reported-result-overlap-1039x651 결과 단계 · roof](screenshots/engine-flow-reported-result-overlap-1039x651-08a-result-roof.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · view · `engine-flow-reported-result-overlap-1039x651-08a-result-view.png`

![reported-result-overlap-1039x651 결과 단계 · view](screenshots/engine-flow-reported-result-overlap-1039x651-08a-result-view.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

<!-- REPORT-EVIDENCE-ALL:END -->

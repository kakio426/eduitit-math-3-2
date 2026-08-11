# 매스몬 검산 자물쇠 제작·인수인계 보고서

- 최종 갱신일: 2026-07-28
- 대상: 초등학교 3학년 2학기 2단원 나눗셈 4차시
- 게임 공개 주소: [GitHub Pages에서 실행하기](https://kakio426.github.io/eduitit-math-3-2/3-2-2-4-mathmon-check-lock/)
- 보고서 공개 주소: [GitHub에서 REPORT.md 보기](https://github.com/kakio426/eduitit-math-3-2/blob/main/3-2-2-4-mathmon-check-lock/REPORT.md)
- 배포 폴더: `3-2-2-4-mathmon-check-lock/`
- 실행 파일: `3-2-2-4-mathmon-check-lock/index.html`
- 기준 화면: 16:10 Stage, 1280×800
- 권장 기기: 컴퓨터 및 태블릿 가로 화면
- 한 판 구성: 10문제
- 동행 매스몬: `base-pack`의 킹드래곤몬
- 보상 표준: `mathmon-unified-reward-v1`
- 전국 순위: 비활성화

## 1. 전달 요약

이 게임은 나눗셈의 몫과 나머지를 단순히 다시 계산하는 게임이 아닙니다. 학생이 먼저 `나누는 수×몫`을 고르고, 그다음 `나머지`를 더해 처음 수와 같은지 확인하면서 검산 관계를 익히는 게임입니다.

문제 화면은 한 번에 한 가지 판단만 크게 보여 줍니다. 왼쪽에는 킹드래곤몬과 현재 금고·다음 금고가 이어지는 보상 장면을 두고, 오른쪽에는 큰 문제·현재 검산판·한 줄 안내·선택지만 배치했습니다. 학생이 값을 고르면 검산판에서 선택 결과를 먼저 확인한 뒤 다음 단계로 넘어갑니다.

게임은 별도 서버 없이 GitHub Pages에서 정적 실행됩니다. 현재 제품 정책에 따라 랭킹 화면과 점수 제출·조회 요청은 모두 꺼져 있습니다. 배포 작업은 `main` 푸시 뒤 GitHub Actions의 Pages 워크플로가 자동으로 수행합니다.

## 2. 학습 목표와 수학 계약

### 학습 목표

`나누는 수×몫+나머지=처음 수`의 관계를 이용해 나눗셈 결과가 맞는지 확인합니다.

### 학생이 하는 판단

1. 네 개의 관계 보기에서 `나누는 수×몫`을 고릅니다.
2. 시스템이 곱을 계산해 보여 주면, 더할 수로 `나머지`를 고릅니다.
3. 계산판이 처음 수와 같은지 `=` 또는 `≠`로 자동 비교합니다.
4. 틀린 식에서만 몫과 나머지 중 어느 수가 다른지 고릅니다.

### 문제 생성 규칙

- 한 판에 맞는 식 6문제와 틀린 식 4문제가 섞여 나옵니다.
- 틀린 식은 몫 또는 나머지 중 한 곳만 다릅니다.
- 몫이 다른 문제와 나머지가 다른 문제가 번갈아 포함됩니다.
- 나누는 수는 2~9, 처음 수는 20~99 범위에서 생성됩니다.
- 같은 `처음 수:나누는 수:제시 몫:제시 나머지` 조합은 한 판 안에서 중복되지 않습니다.
- 맞는 식은 2번, 틀린 식은 3번의 수학적 판단으로 끝납니다.
- 곱과 합은 선택한 관계로 이미 정해지므로 학생에게 같은 값을 다시 입력시키지 않습니다.

### 오답 피드백

- `처음 수×나누는 수`를 고르면 `처음 수는 마지막에 비교해요.`라고 알려 줍니다.
- `몫×나머지`를 고르면 `몫은 나누는 수와 곱해요.`라고 알려 줍니다.
- `나누는 수×나머지`를 고르면 `나머지는 곱하지 않아요.`라고 알려 줍니다.
- 더할 수를 잘못 고르면 `몫 말고 나머지를 더해요.`처럼 지금 고쳐야 할 한 가지 행동만 말합니다.
- 오답 관계도 검산판에 먼저 들어가므로 학생이 무엇을 잘못 연결했는지 화면에서 확인할 수 있습니다.

## 3. 학생 진행 흐름

1. **시작 화면**
   제목, 한 줄 목표, 시작 버튼을 먼저 봅니다.
2. **방법 보기 1**
   나누는 수와 몫을 곱하고 나머지를 더하는 순서를 봅니다.
3. **방법 보기 2**
   10문제를 풀고 금고를 여는 보상 흐름을 봅니다.
4. **곱할 두 수 고르기**
   역할 이름과 식을 함께 읽고 `나누는 수×몫`을 고릅니다.
5. **더할 수 고르기**
   곱한 값에 더할 `나머지`를 고릅니다.
6. **같고 다름 확인**
   계산판이 완성식과 `=` 또는 `≠`를 보여 줍니다.
7. **다른 곳 찾기**
   틀린 식에서만 몫과 나머지 중 다른 곳을 고릅니다.
8. **자물쇠 열기**
   완성된 검산식을 충분히 본 뒤 학생이 보상을 엽니다.
9. **보상 확인**
   닫힌 금고를 열면 이번 열쇠 사건과 변화량이 공개됩니다.
10. **최종 결과**
    정답 수와 도달한 금고를 보여 주고 다음 금고 목표를 안내합니다.

## 4. 화면 설계

### 문제 화면

- 왼쪽 보상 장면: Stage 폭 약 23.44%, 높이 82%
- 오른쪽 학습 열: Stage 폭 약 70%
- 핵심 검산판: 기준 화면에서 Stage 폭 약 70%
- 선택지: 네 장을 한 줄에 배치하고 역할 이름과 실제 식을 함께 표시
- 검산판: 바깥 사각 표면 1개와 자물쇠 다이얼·핀만 사용
- 상단: 브랜드, 문제 수, 단원 배지, 설정 버튼을 같은 기준선에 배치

왼쪽 장면은 작은 카드 여러 개가 아니라 킹드래곤몬·현재 금고·빛나는 자물쇠 길이 이어지는 하나의 세로 장면입니다. `지금`, 현재 금고 이름, `열쇠 빛`, 다음 금고 이름을 장면 위에 겹치되 학습 영역을 침범하지 않게 고정했습니다.

### 설정 화면

설정 버튼은 Stage 오른쪽 위에 있고 다음 기능을 제공합니다.

- 배경 소리 켜기/끄기
- 효과 소리 켜기/끄기
- 방법 다시 보기
- 처음부터 다시 시작
- 설정 닫기

### 결과 화면

- 결과 장면 6종은 각각 1280×800입니다.
- 현재 금고 장면, 킹드래곤몬, 결과 분위기, 다시 하기 버튼 장식을 래스터 장면으로 통일했습니다.
- 정답 수는 동적 오버레이로 표시합니다.
- 다음 목표는 `다음은` 생성형 타이포와 투명 배경 금고 제목 PNG를 이어서 보여 줍니다.
- 최고 단계에서는 다음 금고 대신 `최고 단계예요!`를 표시합니다.
- 결과 제목 PNG 6종은 투명 모서리와 잘림을 전수 확인했습니다.
- 중간 단계가 색만 바뀌어 보이지 않도록 형태와 사건을 나눴습니다. `비밀 금고`는 높은 받침대 위에 닫힌 수정 봉인 금고, `보물 금고`는 문이 완전히 열리고 금화와 보석이 바닥까지 쏟아지는 금고, `무지개 금고`는 무지개빛이 더해진 최고 단계입니다.

## 5. 보상 체계

열쇠 빛은 0~100 범위에서 누적됩니다.

| 사건 | 확률 | 변화 |
|---|---:|---:|
| 열쇠 빛이 늘었어요 | 64% | +6~10 |
| 열쇠 빛이 줄었어요 | 15% | -5~-2 |
| 열쇠 빛이 크게 늘었어요 | 12% | +14~22 |
| 황금 열쇠 | 5% | +30 |
| 열쇠 빛 그대로 | 3.8% | 0 |
| 무지개 열쇠 | 0.2% | 100 및 특별 결과 |

- 오답이 있었던 문제는 최초 1회만 `-6~-3`이 적용됩니다.
- `열쇠 빛 그대로`는 지금까지 모은 값을 지우지 않습니다.
- 일반 결과는 열쇠 빛과 최소 정답 수를 함께 만족해야 올라갑니다.
- 특별 무지개 사건은 정답 1개 이상일 때 무지개 금고를 엽니다.

| 결과 | 최소 열쇠 빛 | 최소 정답 수 |
|---|---:|---:|
| 작은 자물쇠 | 0 | 0 |
| 튼튼한 금고 | 15 | 2 |
| 커다란 금고 | 35 | 4 |
| 비밀 금고 | 55 | 6 |
| 보물 금고 | 78 | 8 |
| 무지개 금고 | 특별 사건 100 | 1 |

## 6. 최신 전체 화면 스크린샷

아래 이미지는 모두 현재 코드로 다시 빌드한 뒤 `20260728-vendor-handoff` QA에서 촬영한 전체 Stage 화면입니다. 화면 일부를 잘라 쓰지 않았습니다.

### 6.1 시작과 방법 보기

#### 1) 시작 화면

![매스몬 검산 자물쇠 시작 화면](screenshots/engine-flow-desktop-01-cover.png)

#### 2) 설정 화면

![설정 모달 화면](screenshots/engine-flow-desktop-02-settings.png)

#### 3) 검산 방법 보기

![나누는 수와 몫을 곱하고 나머지를 더하는 방법](screenshots/engine-flow-desktop-03-tutorial-1.png)

#### 4) 보상 흐름 보기

![10문제와 금고 보상 안내](screenshots/engine-flow-desktop-04-tutorial-2.png)

### 6.2 틀린 식을 검산하는 흐름

#### 5) 첫 단계

![곱할 두 수를 고르는 첫 화면](screenshots/engine-flow-desktop-05-play-step1.png)

#### 6) 대표 오답: 처음 수×나누는 수

![처음 수와 나누는 수를 잘못 곱한 화면](screenshots/engine-flow-desktop-05b-play-dividend-times-divisor.png)

#### 7) 대표 오답: 나누는 수×나머지

![나누는 수와 나머지를 잘못 곱한 화면](screenshots/engine-flow-desktop-05b2-play-divisor-times-remainder.png)

#### 8) 곱하기 정답 확인

![나누는 수와 몫을 고른 뒤 검산판 확인 화면](screenshots/engine-flow-desktop-05-lock-1-multiply-confirm.png)

#### 9) 더할 수 고르기

![곱한 값에 더할 수를 고르는 화면](screenshots/engine-flow-desktop-05-lock-2-add-waiting.png)

#### 10) 더하기 정답 확인

![나머지를 더한 뒤 검산판 확인 화면](screenshots/engine-flow-desktop-05-lock-2-add-confirm.png)

#### 11) 다른 곳 찾기

![몫과 나머지 중 다른 곳을 찾는 화면](screenshots/engine-flow-desktop-05-lock-3-locate-waiting.png)

#### 12) 다른 곳 확인

![다른 몫 또는 나머지를 확인한 화면](screenshots/engine-flow-desktop-05-lock-3-locate-confirm.png)

#### 13) 한 문제 완성

![틀린 식의 검산을 마치고 자물쇠를 여는 화면](screenshots/engine-flow-desktop-06-confirm.png)

### 6.3 맞는 식을 검산하는 흐름

#### 14) 곱할 두 수 고르기

![맞는 식에서 곱할 두 수를 고르는 화면](screenshots/engine-flow-desktop-05-match-lock-1-multiply-waiting.png)

#### 15) 곱하기 확인

![맞는 식의 곱하기 확인 화면](screenshots/engine-flow-desktop-05-match-lock-1-multiply-confirm.png)

#### 16) 더할 수 고르기

![맞는 식에서 더할 수를 고르는 화면](screenshots/engine-flow-desktop-05-match-lock-2-add-waiting.png)

#### 17) 더하기 확인

![맞는 식의 더하기 확인 화면](screenshots/engine-flow-desktop-05-match-lock-2-add-confirm.png)

#### 18) 처음 수와 같음 자동 확인

![검산값과 처음 수가 같음을 자동으로 보여 주는 화면](screenshots/engine-flow-desktop-06b-match-auto-confirm.png)

### 6.4 보상

#### 19) 닫힌 보상

![학생이 열기 전 닫힌 금고 화면](screenshots/engine-flow-desktop-07-reward-closed.png)

#### 20) 열린 보상

![열쇠 사건과 변화량이 공개된 화면](screenshots/engine-flow-desktop-07b-reward-open.png)

### 6.5 실제 결과와 결과 6단계

![작은 자물쇠부터 무지개 금고까지 6단계 비교](result-tiers-v3-contact-sheet.png)

6단계는 같은 1280×800 슬롯과 같은 오른쪽 정보판 구조를 유지합니다. 금고의 크기, 문이 열리는 사건, 보물의 양, 빛의 색을 차례로 키워 점수가 올라갈수록 무엇이 달라졌는지 한눈에 보이게 했습니다.

#### 21) 한 판을 마친 실제 결과

![10문제를 마친 실제 결과 화면](screenshots/engine-flow-desktop-08-result.png)

#### 22) 작은 자물쇠

![작은 자물쇠 결과 화면](screenshots/engine-flow-desktop-08a-result-lock.png)

#### 23) 튼튼한 금고

![튼튼한 금고 결과 화면](screenshots/engine-flow-desktop-08a-result-safe.png)

#### 24) 커다란 금고

![커다란 금고 결과 화면](screenshots/engine-flow-desktop-08a-result-largeSafe.png)

#### 25) 비밀 금고

![비밀 금고 결과 화면](screenshots/engine-flow-desktop-08a-result-secretSafe.png)

문은 닫혀 있지만 금고가 더 높아지고 수정 봉인과 보랏빛 빛이 더해져 `커다란 금고`보다 한 단계 높은 금고임을 보여 줍니다.

#### 26) 보물 금고

![보물 금고 결과 화면](screenshots/engine-flow-desktop-08a-result-treasure.png)

문이 완전히 열리고 금화와 큰 보석이 바닥까지 넘쳐 `비밀 금고`와 즉시 구분됩니다. 무지개 효과는 마지막 단계에만 남겨 두었습니다.

#### 27) 무지개 금고

![무지개 금고 결과 화면](screenshots/engine-flow-desktop-08a-result-rainbow.png)

## 7. 화면 크기 회귀 증거

같은 전체 흐름과 결과 6단계를 아래 6개 조건에서 각각 다시 촬영했습니다.

| 이름 | 브라우저 크기 | DPR | 확인 목적 |
|---|---:|---:|---|
| desktop | 1280×800 | 1 | 기준 제작 화면 |
| tablet-landscape | 1024×768 | 1 | 태블릿 가로 |
| user-reported-overload | 1024×640 | 2 | 정보 과밀 제보 회귀 |
| codex-browser-regression | 1280×720 | 2 | 높이 축소 시 겹침 회귀 |
| codex-live-panel-regression | 931×897 | 2 | 좁은 작업 패널 회귀 |
| user-reported-missing-reward-panel | 1082×897 | 2 | 왼쪽 보상 장면 누락 회귀 |

현재 실행본의 화면 크기별 전체 흐름은 `screenshots/report-flow-desktop-contact-sheet.png`, `screenshots/report-flow-tablet-landscape-contact-sheet.png`, `screenshots/report-flow-user-reported-overload-contact-sheet.png`, `screenshots/report-flow-codex-browser-regression-contact-sheet.png`, `screenshots/report-flow-codex-live-panel-regression-contact-sheet.png`, `screenshots/report-flow-user-reported-missing-reward-panel-contact-sheet.png`에 모았습니다. 실행본 해시와 개별 캡처 목록은 `screenshots/report-evidence-manifest.json`에 기록했습니다.

### 태블릿 문제 화면

![태블릿 가로 문제 화면](screenshots/engine-flow-tablet-landscape-05-play-step1.png)

### 정보 과밀 제보 크기의 문제 화면

![정보 과밀 제보 크기 문제 화면](screenshots/engine-flow-user-reported-overload-05-play-step1.png)

### 기존 브라우저 겹침 제보 크기의 열린 보상

![브라우저 회귀 크기의 열린 보상 화면](screenshots/engine-flow-codex-browser-regression-07b-reward-open.png)

### 좁은 Codex 패널의 결과 화면

![좁은 Codex 패널 결과 화면](screenshots/engine-flow-codex-live-panel-regression-08-result.png)

### 왼쪽 보상 장면 누락 제보 크기

![왼쪽 보상 장면 누락 제보 크기의 문제 화면](screenshots/engine-flow-user-reported-missing-reward-panel-05-play-step1.png)

각 화면 크기의 나머지 최신 캡처도 같은 `screenshots/engine-flow-<화면 이름>-*.png` 규칙으로 보관했습니다. 각 폴더 세트에는 시작, 설정, 설명 2장, 대표 오답 2종, 단계별 대기·정답 확인, 마지막 확인, 닫힌·열린 보상, 실제 결과, 결과 6단계가 포함됩니다.

## 8. 이미지 자산 계약

| 구분 | 구성 | 실행 규격 |
|---|---|---|
| 시작 화면 | 글자 없는 대표 장면 + 제목 아트 + 공용 시작 버튼 | 1280×800 Stage |
| 설명 | 검산 방법 1장 + 보상 안내 1장 | 각 1280×800 |
| 문제 장면 | 대기·진행·완료 | 각 1280×800 |
| 왼쪽 금고 세계 | 금고 6단계 | 각 600×1312 |
| 보상 | 닫힌 금고 1장 + 사건 6종 | 모달 아트 |
| 결과 | 금고·킹드래곤몬 장면 6종 | 각 1280×800 |
| 결과 제목 | 금고 이름 투명 PNG 6종 | 알파 PNG |

주요 컨택시트:

- `problem-state-contact-sheet.png`
- `play-vault-world-contact-sheet.png`
- `result-tiers-v3-contact-sheet.png`
- `result-title-transparent-v2-contact-sheet.png`

결과 제목 실행 자산:

- `result-title-lock-transparent-v2.png`
- `result-title-safe-transparent-v2.png`
- `result-title-largeSafe-transparent-v2.png`
- `result-title-secretSafe-transparent-v2.png`
- `result-title-treasure-transparent-v2.png`
- `result-title-rainbow-transparent-v2.png`

## 9. 접근성·학생 문구

- 모든 실제 버튼은 키보드 포커스와 `aria-label`을 가집니다.
- 터치 영역은 최소 42×42px 이상입니다.
- 정답 수와 문제 수 숫자는 자리 폭이 흔들리지 않게 표시합니다.
- 배경 소리와 효과 소리 설정은 브라우저에 저장됩니다.
- 학생에게 보이는 문구는 한 문장에 행동 하나만 담았습니다.
- `먼저 무엇과 무엇을 곱할까요?`, `그다음 무엇을 더할까요?`, `어느 수가 다를까요?`처럼 지금 할 행동만 안내합니다.
- 제작자 용어, 번역투, 어려운 한자어를 학생 화면에서 쓰지 않았습니다.

Humanizer 학생 문구 QA 결과는 자연도 A이며 의미·수치·부정 표현 검증을 통과했습니다.

## 10. 자동 검증 결과

최종 실행 명령:

```bash
node scripts/qa-lesson-model.mjs 3-2-2-4-mathmon-check-lock
node scripts/qa-lesson2-check-lock.mjs 20260728-result-progression
node scripts/build-check-lock-result-sheet.cjs
node scripts/check-stage-ratio.mjs
```

최종 결과:

- `QA_LESSON_MODEL: PASS`
- `QA_LESSON_FLOW: PASS`
- `QA_LESSON2_CHECK_LOCK: PASS`
- 6개 화면 크기 전체 흐름 통과
- 결과 6단계 전수 렌더 통과
- 깨진 이미지 0건
- 텍스트 넘침 0건
- 의도하지 않은 요소 겹침 0건
- Stage 밖 이탈 0건
- 랭킹 관련 네트워크 요청 0건

기준 화면 실제 측정:

| 영역 | width×height | Stage 폭 비율 | 판정 |
|---|---:|---:|---|
| 왼쪽 보상 장면 | 281.98×616.63 | 23.44% | 현재·다음 금고와 열쇠 빛 표시 |
| 오른쪽 학습 열 | 846.56×620.41 | 70.36% | 한 화면 한 행동 유지 |
| 핵심 검산 표면 | 842.71×332.85 | 70.04% | 가장 큰 단일 학습 영역 |
| 선택지 | 846.56×108 | 70.36% | 네 장 한 줄, 최소 높이 102px |

## 11. 업체 인수인계 안내

### 실행 방법

배포본은 공개 주소로 바로 실행합니다.

`https://kakio426.github.io/eduitit-math-3-2/3-2-2-4-mathmon-check-lock/`

로컬 확인이 필요하면 저장소 루트에서 정적 서버를 연 뒤 같은 폴더의 `index.html`을 엽니다. 파일을 Finder에서 직접 더블클릭하는 `file://` 방식보다 HTTP 정적 서버 사용을 권장합니다.

### 수정 정본

- 수업 설정: `_lessons/3-2-2-4-mathmon-check-lock/lesson.json`
- 문제 생성·채점: `_lessons/3-2-2-4-mathmon-check-lock/model.js`
- 화면 렌더: `_lessons/3-2-2-4-mathmon-check-lock/view.js`
- 화면 스타일: `_lessons/3-2-2-4-mathmon-check-lock/lesson.css`
- 배포 HTML: `3-2-2-4-mathmon-check-lock/index.html`
- 전용 회귀 검사: `scripts/qa-lesson2-check-lock.mjs`

정본을 수정한 뒤에는 `node scripts/build-lesson.mjs 3-2-2-4-mathmon-check-lock`을 실행해 배포 HTML을 다시 만듭니다.

### 외부 연동

- 필수 백엔드: 없음
- 사용자 로그인: 없음
- 점수 제출 API: 사용하지 않음
- 전국 순위 API: 비활성화
- 외부 CDN 의존: 없음
- 오디오 설정 저장 키: `mathmon-audio-bgm-enabled`, `mathmon-audio-sfx-enabled`

### 배포

`main` 브랜치에 게임 실행 파일이 포함된 커밋이 올라가면 `.github/workflows/pages.yml`이 정적 산출물을 검사하고 GitHub Pages에 배포합니다. 문서와 스크린샷은 저장소 인수인계 자료이며, Pages 산출물에서는 실행에 필요하지 않은 원본·보고서·QA 캡처가 제외될 수 있습니다.

## 12. 최종 판정

수학 관계 선택, 정답 확인, 왼쪽 보상 장면, 통일 보상, 결과 6단계, 화면 크기 회귀, 학생 문구, 정적 배포 조건을 모두 확인했습니다. 업체가 공개 Page 주소로 실행하고 이 REPORT와 정본 파일 경로를 기준으로 유지보수할 수 있는 상태입니다.

<!-- REPORT-EVIDENCE-ALL:START -->

## 2026-08-04 최신 원본 스크린샷 전수

- 실행본 SHA-256: `558ee25a77d887e3bdc83d46f971368e22770052a6392f5a07adde1a97ea8c90`
- 생성 시각: `2026-08-04T15:32:15.074Z`
- 등록 화면 크기: `6개`
- 아래에 직접 삽입한 원본 캡처: `190장`
- 컨택시트만으로 대신하지 않고 manifest에 기록된 원본 캡처를 한 장씩 모두 연결했습니다.

### desktop · 1280×800 · DPR 1 · 33장

![desktop 전체 상태 컨택시트](screenshots/report-flow-desktop-contact-sheet.png)

#### 시작 화면 · `engine-flow-desktop-01-cover.png`

![desktop 시작 화면](screenshots/engine-flow-desktop-01-cover.png)

- 학생이 보는 것: 매스몬 검산 자물쇠 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-desktop-02-settings.png`

![desktop 설정 화면](screenshots/engine-flow-desktop-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-desktop-03-tutorial-1.png`

![desktop 설명 1 · 풀이 방법](screenshots/engine-flow-desktop-03-tutorial-1.png)

- 학생이 보는 것: 곱셈으로 나눗셈 검산하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-desktop-04-tutorial-2.png`

![desktop 설명 2 · 보상과 목표](screenshots/engine-flow-desktop-04-tutorial-2.png)

- 학생이 보는 것: 곱셈으로 나눗셈 검산하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 정답 확인 · 05-lock-1-multiply-confirm · `engine-flow-desktop-05-lock-1-multiply-confirm.png`

![desktop 정답 확인 · 05-lock-1-multiply-confirm](screenshots/engine-flow-desktop-05-lock-1-multiply-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-1-multiply-waiting · `engine-flow-desktop-05-lock-1-multiply-waiting.png`

![desktop 문제 상태 · 05-lock-1-multiply-waiting](screenshots/engine-flow-desktop-05-lock-1-multiply-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-lock-2-add-confirm · `engine-flow-desktop-05-lock-2-add-confirm.png`

![desktop 정답 확인 · 05-lock-2-add-confirm](screenshots/engine-flow-desktop-05-lock-2-add-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-2-add-waiting · `engine-flow-desktop-05-lock-2-add-waiting.png`

![desktop 문제 상태 · 05-lock-2-add-waiting](screenshots/engine-flow-desktop-05-lock-2-add-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-lock-3-locate-confirm · `engine-flow-desktop-05-lock-3-locate-confirm.png`

![desktop 정답 확인 · 05-lock-3-locate-confirm](screenshots/engine-flow-desktop-05-lock-3-locate-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-3-locate-waiting · `engine-flow-desktop-05-lock-3-locate-waiting.png`

![desktop 문제 상태 · 05-lock-3-locate-waiting](screenshots/engine-flow-desktop-05-lock-3-locate-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-match-lock-1-multiply-confirm · `engine-flow-desktop-05-match-lock-1-multiply-confirm.png`

![desktop 정답 확인 · 05-match-lock-1-multiply-confirm](screenshots/engine-flow-desktop-05-match-lock-1-multiply-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-match-lock-1-multiply-waiting · `engine-flow-desktop-05-match-lock-1-multiply-waiting.png`

![desktop 문제 상태 · 05-match-lock-1-multiply-waiting](screenshots/engine-flow-desktop-05-match-lock-1-multiply-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-match-lock-2-add-confirm · `engine-flow-desktop-05-match-lock-2-add-confirm.png`

![desktop 정답 확인 · 05-match-lock-2-add-confirm](screenshots/engine-flow-desktop-05-match-lock-2-add-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-match-lock-2-add-waiting · `engine-flow-desktop-05-match-lock-2-add-waiting.png`

![desktop 문제 상태 · 05-match-lock-2-add-waiting](screenshots/engine-flow-desktop-05-match-lock-2-add-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-desktop-05-play-step1.png`

![desktop 문제 상태 · 05-play-step1](screenshots/engine-flow-desktop-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05b2-play-divisor-times-remainder · `engine-flow-desktop-05b2-play-divisor-times-remainder.png`

![desktop 문제 상태 · 05b2-play-divisor-times-remainder](screenshots/engine-flow-desktop-05b2-play-divisor-times-remainder.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b2-play-product-too-low · `engine-flow-desktop-05b2-play-product-too-low.png`

![desktop 오답 확인 · 05b2-play-product-too-low](screenshots/engine-flow-desktop-05b2-play-product-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 문제 상태 · 05b-play-dividend-times-divisor · `engine-flow-desktop-05b-play-dividend-times-divisor.png`

![desktop 문제 상태 · 05b-play-dividend-times-divisor](screenshots/engine-flow-desktop-05b-play-dividend-times-divisor.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b-play-product-too-high · `engine-flow-desktop-05b-play-product-too-high.png`

![desktop 오답 확인 · 05b-play-product-too-high](screenshots/engine-flow-desktop-05b-play-product-too-high.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-desktop-06-confirm.png`

![desktop 마지막 확인 · 06-confirm](screenshots/engine-flow-desktop-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 마지막 확인 · 06b-match-auto-confirm · `engine-flow-desktop-06b-match-auto-confirm.png`

![desktop 마지막 확인 · 06b-match-auto-confirm](screenshots/engine-flow-desktop-06b-match-auto-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-desktop-07-reward-closed.png`

![desktop 닫힌 보상](screenshots/engine-flow-desktop-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 열쇠 빛 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-desktop-07b-reward-open.png`

![desktop 열린 보상](screenshots/engine-flow-desktop-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 열쇠 빛 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-desktop-08-result.png`

![desktop 실제 결과](screenshots/engine-flow-desktop-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · largeSafe · `engine-flow-desktop-08a-result-largeSafe.png`

![desktop 결과 단계 · largeSafe](screenshots/engine-flow-desktop-08a-result-largeSafe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · lock · `engine-flow-desktop-08a-result-lock.png`

![desktop 결과 단계 · lock](screenshots/engine-flow-desktop-08a-result-lock.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-desktop-08a-result-rainbow.png`

![desktop 결과 단계 · rainbow](screenshots/engine-flow-desktop-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · safe · `engine-flow-desktop-08a-result-safe.png`

![desktop 결과 단계 · safe](screenshots/engine-flow-desktop-08a-result-safe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · secretSafe · `engine-flow-desktop-08a-result-secretSafe.png`

![desktop 결과 단계 · secretSafe](screenshots/engine-flow-desktop-08a-result-secretSafe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · treasure · `engine-flow-desktop-08a-result-treasure.png`

![desktop 결과 단계 · treasure](screenshots/engine-flow-desktop-08a-result-treasure.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 09-scoreboard-offline · `engine-flow-desktop-09-scoreboard-offline.png`

![desktop 09-scoreboard-offline](screenshots/engine-flow-desktop-09-scoreboard-offline.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09b-scoreboard-10rows-start · `engine-flow-desktop-09b-scoreboard-10rows-start.png`

![desktop 09b-scoreboard-10rows-start](screenshots/engine-flow-desktop-09b-scoreboard-10rows-start.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09c-scoreboard-10rows-end · `engine-flow-desktop-09c-scoreboard-10rows-end.png`

![desktop 09c-scoreboard-10rows-end](screenshots/engine-flow-desktop-09c-scoreboard-10rows-end.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

### tablet-landscape · 1024×768 · DPR 1 · 33장

![tablet-landscape 전체 상태 컨택시트](screenshots/report-flow-tablet-landscape-contact-sheet.png)

#### 시작 화면 · `engine-flow-tablet-landscape-01-cover.png`

![tablet-landscape 시작 화면](screenshots/engine-flow-tablet-landscape-01-cover.png)

- 학생이 보는 것: 매스몬 검산 자물쇠 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-tablet-landscape-02-settings.png`

![tablet-landscape 설정 화면](screenshots/engine-flow-tablet-landscape-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-tablet-landscape-03-tutorial-1.png`

![tablet-landscape 설명 1 · 풀이 방법](screenshots/engine-flow-tablet-landscape-03-tutorial-1.png)

- 학생이 보는 것: 곱셈으로 나눗셈 검산하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-tablet-landscape-04-tutorial-2.png`

![tablet-landscape 설명 2 · 보상과 목표](screenshots/engine-flow-tablet-landscape-04-tutorial-2.png)

- 학생이 보는 것: 곱셈으로 나눗셈 검산하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 정답 확인 · 05-lock-1-multiply-confirm · `engine-flow-tablet-landscape-05-lock-1-multiply-confirm.png`

![tablet-landscape 정답 확인 · 05-lock-1-multiply-confirm](screenshots/engine-flow-tablet-landscape-05-lock-1-multiply-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-1-multiply-waiting · `engine-flow-tablet-landscape-05-lock-1-multiply-waiting.png`

![tablet-landscape 문제 상태 · 05-lock-1-multiply-waiting](screenshots/engine-flow-tablet-landscape-05-lock-1-multiply-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-lock-2-add-confirm · `engine-flow-tablet-landscape-05-lock-2-add-confirm.png`

![tablet-landscape 정답 확인 · 05-lock-2-add-confirm](screenshots/engine-flow-tablet-landscape-05-lock-2-add-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-2-add-waiting · `engine-flow-tablet-landscape-05-lock-2-add-waiting.png`

![tablet-landscape 문제 상태 · 05-lock-2-add-waiting](screenshots/engine-flow-tablet-landscape-05-lock-2-add-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-lock-3-locate-confirm · `engine-flow-tablet-landscape-05-lock-3-locate-confirm.png`

![tablet-landscape 정답 확인 · 05-lock-3-locate-confirm](screenshots/engine-flow-tablet-landscape-05-lock-3-locate-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-3-locate-waiting · `engine-flow-tablet-landscape-05-lock-3-locate-waiting.png`

![tablet-landscape 문제 상태 · 05-lock-3-locate-waiting](screenshots/engine-flow-tablet-landscape-05-lock-3-locate-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-match-lock-1-multiply-confirm · `engine-flow-tablet-landscape-05-match-lock-1-multiply-confirm.png`

![tablet-landscape 정답 확인 · 05-match-lock-1-multiply-confirm](screenshots/engine-flow-tablet-landscape-05-match-lock-1-multiply-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-match-lock-1-multiply-waiting · `engine-flow-tablet-landscape-05-match-lock-1-multiply-waiting.png`

![tablet-landscape 문제 상태 · 05-match-lock-1-multiply-waiting](screenshots/engine-flow-tablet-landscape-05-match-lock-1-multiply-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-match-lock-2-add-confirm · `engine-flow-tablet-landscape-05-match-lock-2-add-confirm.png`

![tablet-landscape 정답 확인 · 05-match-lock-2-add-confirm](screenshots/engine-flow-tablet-landscape-05-match-lock-2-add-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-match-lock-2-add-waiting · `engine-flow-tablet-landscape-05-match-lock-2-add-waiting.png`

![tablet-landscape 문제 상태 · 05-match-lock-2-add-waiting](screenshots/engine-flow-tablet-landscape-05-match-lock-2-add-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-tablet-landscape-05-play-step1.png`

![tablet-landscape 문제 상태 · 05-play-step1](screenshots/engine-flow-tablet-landscape-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05b2-play-divisor-times-remainder · `engine-flow-tablet-landscape-05b2-play-divisor-times-remainder.png`

![tablet-landscape 문제 상태 · 05b2-play-divisor-times-remainder](screenshots/engine-flow-tablet-landscape-05b2-play-divisor-times-remainder.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b2-play-product-too-low · `engine-flow-tablet-landscape-05b2-play-product-too-low.png`

![tablet-landscape 오답 확인 · 05b2-play-product-too-low](screenshots/engine-flow-tablet-landscape-05b2-play-product-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 문제 상태 · 05b-play-dividend-times-divisor · `engine-flow-tablet-landscape-05b-play-dividend-times-divisor.png`

![tablet-landscape 문제 상태 · 05b-play-dividend-times-divisor](screenshots/engine-flow-tablet-landscape-05b-play-dividend-times-divisor.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b-play-product-too-high · `engine-flow-tablet-landscape-05b-play-product-too-high.png`

![tablet-landscape 오답 확인 · 05b-play-product-too-high](screenshots/engine-flow-tablet-landscape-05b-play-product-too-high.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-tablet-landscape-06-confirm.png`

![tablet-landscape 마지막 확인 · 06-confirm](screenshots/engine-flow-tablet-landscape-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 마지막 확인 · 06b-match-auto-confirm · `engine-flow-tablet-landscape-06b-match-auto-confirm.png`

![tablet-landscape 마지막 확인 · 06b-match-auto-confirm](screenshots/engine-flow-tablet-landscape-06b-match-auto-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-tablet-landscape-07-reward-closed.png`

![tablet-landscape 닫힌 보상](screenshots/engine-flow-tablet-landscape-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 열쇠 빛 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-tablet-landscape-07b-reward-open.png`

![tablet-landscape 열린 보상](screenshots/engine-flow-tablet-landscape-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 열쇠 빛 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-tablet-landscape-08-result.png`

![tablet-landscape 실제 결과](screenshots/engine-flow-tablet-landscape-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · largeSafe · `engine-flow-tablet-landscape-08a-result-largeSafe.png`

![tablet-landscape 결과 단계 · largeSafe](screenshots/engine-flow-tablet-landscape-08a-result-largeSafe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · lock · `engine-flow-tablet-landscape-08a-result-lock.png`

![tablet-landscape 결과 단계 · lock](screenshots/engine-flow-tablet-landscape-08a-result-lock.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-tablet-landscape-08a-result-rainbow.png`

![tablet-landscape 결과 단계 · rainbow](screenshots/engine-flow-tablet-landscape-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · safe · `engine-flow-tablet-landscape-08a-result-safe.png`

![tablet-landscape 결과 단계 · safe](screenshots/engine-flow-tablet-landscape-08a-result-safe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · secretSafe · `engine-flow-tablet-landscape-08a-result-secretSafe.png`

![tablet-landscape 결과 단계 · secretSafe](screenshots/engine-flow-tablet-landscape-08a-result-secretSafe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · treasure · `engine-flow-tablet-landscape-08a-result-treasure.png`

![tablet-landscape 결과 단계 · treasure](screenshots/engine-flow-tablet-landscape-08a-result-treasure.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 09-scoreboard-offline · `engine-flow-tablet-landscape-09-scoreboard-offline.png`

![tablet-landscape 09-scoreboard-offline](screenshots/engine-flow-tablet-landscape-09-scoreboard-offline.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09b-scoreboard-10rows-start · `engine-flow-tablet-landscape-09b-scoreboard-10rows-start.png`

![tablet-landscape 09b-scoreboard-10rows-start](screenshots/engine-flow-tablet-landscape-09b-scoreboard-10rows-start.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09c-scoreboard-10rows-end · `engine-flow-tablet-landscape-09c-scoreboard-10rows-end.png`

![tablet-landscape 09c-scoreboard-10rows-end](screenshots/engine-flow-tablet-landscape-09c-scoreboard-10rows-end.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

### user-reported-overload · 1024×640 · DPR 2 · 30장

![user-reported-overload 전체 상태 컨택시트](screenshots/report-flow-user-reported-overload-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-reported-overload-01-cover.png`

![user-reported-overload 시작 화면](screenshots/engine-flow-user-reported-overload-01-cover.png)

- 학생이 보는 것: 매스몬 검산 자물쇠 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-reported-overload-02-settings.png`

![user-reported-overload 설정 화면](screenshots/engine-flow-user-reported-overload-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-reported-overload-03-tutorial-1.png`

![user-reported-overload 설명 1 · 풀이 방법](screenshots/engine-flow-user-reported-overload-03-tutorial-1.png)

- 학생이 보는 것: 곱셈으로 나눗셈 검산하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-reported-overload-04-tutorial-2.png`

![user-reported-overload 설명 2 · 보상과 목표](screenshots/engine-flow-user-reported-overload-04-tutorial-2.png)

- 학생이 보는 것: 곱셈으로 나눗셈 검산하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 정답 확인 · 05-lock-1-multiply-confirm · `engine-flow-user-reported-overload-05-lock-1-multiply-confirm.png`

![user-reported-overload 정답 확인 · 05-lock-1-multiply-confirm](screenshots/engine-flow-user-reported-overload-05-lock-1-multiply-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-1-multiply-waiting · `engine-flow-user-reported-overload-05-lock-1-multiply-waiting.png`

![user-reported-overload 문제 상태 · 05-lock-1-multiply-waiting](screenshots/engine-flow-user-reported-overload-05-lock-1-multiply-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-lock-2-add-confirm · `engine-flow-user-reported-overload-05-lock-2-add-confirm.png`

![user-reported-overload 정답 확인 · 05-lock-2-add-confirm](screenshots/engine-flow-user-reported-overload-05-lock-2-add-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-2-add-waiting · `engine-flow-user-reported-overload-05-lock-2-add-waiting.png`

![user-reported-overload 문제 상태 · 05-lock-2-add-waiting](screenshots/engine-flow-user-reported-overload-05-lock-2-add-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-lock-3-locate-confirm · `engine-flow-user-reported-overload-05-lock-3-locate-confirm.png`

![user-reported-overload 정답 확인 · 05-lock-3-locate-confirm](screenshots/engine-flow-user-reported-overload-05-lock-3-locate-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-3-locate-waiting · `engine-flow-user-reported-overload-05-lock-3-locate-waiting.png`

![user-reported-overload 문제 상태 · 05-lock-3-locate-waiting](screenshots/engine-flow-user-reported-overload-05-lock-3-locate-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-match-lock-1-multiply-confirm · `engine-flow-user-reported-overload-05-match-lock-1-multiply-confirm.png`

![user-reported-overload 정답 확인 · 05-match-lock-1-multiply-confirm](screenshots/engine-flow-user-reported-overload-05-match-lock-1-multiply-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-match-lock-1-multiply-waiting · `engine-flow-user-reported-overload-05-match-lock-1-multiply-waiting.png`

![user-reported-overload 문제 상태 · 05-match-lock-1-multiply-waiting](screenshots/engine-flow-user-reported-overload-05-match-lock-1-multiply-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-match-lock-2-add-confirm · `engine-flow-user-reported-overload-05-match-lock-2-add-confirm.png`

![user-reported-overload 정답 확인 · 05-match-lock-2-add-confirm](screenshots/engine-flow-user-reported-overload-05-match-lock-2-add-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-match-lock-2-add-waiting · `engine-flow-user-reported-overload-05-match-lock-2-add-waiting.png`

![user-reported-overload 문제 상태 · 05-match-lock-2-add-waiting](screenshots/engine-flow-user-reported-overload-05-match-lock-2-add-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-reported-overload-05-play-step1.png`

![user-reported-overload 문제 상태 · 05-play-step1](screenshots/engine-flow-user-reported-overload-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05b2-play-divisor-times-remainder · `engine-flow-user-reported-overload-05b2-play-divisor-times-remainder.png`

![user-reported-overload 문제 상태 · 05b2-play-divisor-times-remainder](screenshots/engine-flow-user-reported-overload-05b2-play-divisor-times-remainder.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b2-play-product-too-low · `engine-flow-user-reported-overload-05b2-play-product-too-low.png`

![user-reported-overload 오답 확인 · 05b2-play-product-too-low](screenshots/engine-flow-user-reported-overload-05b2-play-product-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 문제 상태 · 05b-play-dividend-times-divisor · `engine-flow-user-reported-overload-05b-play-dividend-times-divisor.png`

![user-reported-overload 문제 상태 · 05b-play-dividend-times-divisor](screenshots/engine-flow-user-reported-overload-05b-play-dividend-times-divisor.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b-play-product-too-high · `engine-flow-user-reported-overload-05b-play-product-too-high.png`

![user-reported-overload 오답 확인 · 05b-play-product-too-high](screenshots/engine-flow-user-reported-overload-05b-play-product-too-high.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-reported-overload-06-confirm.png`

![user-reported-overload 마지막 확인 · 06-confirm](screenshots/engine-flow-user-reported-overload-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 마지막 확인 · 06b-match-auto-confirm · `engine-flow-user-reported-overload-06b-match-auto-confirm.png`

![user-reported-overload 마지막 확인 · 06b-match-auto-confirm](screenshots/engine-flow-user-reported-overload-06b-match-auto-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-reported-overload-07-reward-closed.png`

![user-reported-overload 닫힌 보상](screenshots/engine-flow-user-reported-overload-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 열쇠 빛 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-reported-overload-07b-reward-open.png`

![user-reported-overload 열린 보상](screenshots/engine-flow-user-reported-overload-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 열쇠 빛 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-reported-overload-08-result.png`

![user-reported-overload 실제 결과](screenshots/engine-flow-user-reported-overload-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · largeSafe · `engine-flow-user-reported-overload-08a-result-largeSafe.png`

![user-reported-overload 결과 단계 · largeSafe](screenshots/engine-flow-user-reported-overload-08a-result-largeSafe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · lock · `engine-flow-user-reported-overload-08a-result-lock.png`

![user-reported-overload 결과 단계 · lock](screenshots/engine-flow-user-reported-overload-08a-result-lock.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-user-reported-overload-08a-result-rainbow.png`

![user-reported-overload 결과 단계 · rainbow](screenshots/engine-flow-user-reported-overload-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · safe · `engine-flow-user-reported-overload-08a-result-safe.png`

![user-reported-overload 결과 단계 · safe](screenshots/engine-flow-user-reported-overload-08a-result-safe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · secretSafe · `engine-flow-user-reported-overload-08a-result-secretSafe.png`

![user-reported-overload 결과 단계 · secretSafe](screenshots/engine-flow-user-reported-overload-08a-result-secretSafe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · treasure · `engine-flow-user-reported-overload-08a-result-treasure.png`

![user-reported-overload 결과 단계 · treasure](screenshots/engine-flow-user-reported-overload-08a-result-treasure.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### codex-browser-regression · 1280×720 · DPR 2 · 33장

![codex-browser-regression 전체 상태 컨택시트](screenshots/report-flow-codex-browser-regression-contact-sheet.png)

#### 시작 화면 · `engine-flow-codex-browser-regression-01-cover.png`

![codex-browser-regression 시작 화면](screenshots/engine-flow-codex-browser-regression-01-cover.png)

- 학생이 보는 것: 매스몬 검산 자물쇠 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-codex-browser-regression-02-settings.png`

![codex-browser-regression 설정 화면](screenshots/engine-flow-codex-browser-regression-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-codex-browser-regression-03-tutorial-1.png`

![codex-browser-regression 설명 1 · 풀이 방법](screenshots/engine-flow-codex-browser-regression-03-tutorial-1.png)

- 학생이 보는 것: 곱셈으로 나눗셈 검산하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-codex-browser-regression-04-tutorial-2.png`

![codex-browser-regression 설명 2 · 보상과 목표](screenshots/engine-flow-codex-browser-regression-04-tutorial-2.png)

- 학생이 보는 것: 곱셈으로 나눗셈 검산하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 정답 확인 · 05-lock-1-multiply-confirm · `engine-flow-codex-browser-regression-05-lock-1-multiply-confirm.png`

![codex-browser-regression 정답 확인 · 05-lock-1-multiply-confirm](screenshots/engine-flow-codex-browser-regression-05-lock-1-multiply-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-1-multiply-waiting · `engine-flow-codex-browser-regression-05-lock-1-multiply-waiting.png`

![codex-browser-regression 문제 상태 · 05-lock-1-multiply-waiting](screenshots/engine-flow-codex-browser-regression-05-lock-1-multiply-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-lock-2-add-confirm · `engine-flow-codex-browser-regression-05-lock-2-add-confirm.png`

![codex-browser-regression 정답 확인 · 05-lock-2-add-confirm](screenshots/engine-flow-codex-browser-regression-05-lock-2-add-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-2-add-waiting · `engine-flow-codex-browser-regression-05-lock-2-add-waiting.png`

![codex-browser-regression 문제 상태 · 05-lock-2-add-waiting](screenshots/engine-flow-codex-browser-regression-05-lock-2-add-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-lock-3-locate-confirm · `engine-flow-codex-browser-regression-05-lock-3-locate-confirm.png`

![codex-browser-regression 정답 확인 · 05-lock-3-locate-confirm](screenshots/engine-flow-codex-browser-regression-05-lock-3-locate-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-3-locate-waiting · `engine-flow-codex-browser-regression-05-lock-3-locate-waiting.png`

![codex-browser-regression 문제 상태 · 05-lock-3-locate-waiting](screenshots/engine-flow-codex-browser-regression-05-lock-3-locate-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-match-lock-1-multiply-confirm · `engine-flow-codex-browser-regression-05-match-lock-1-multiply-confirm.png`

![codex-browser-regression 정답 확인 · 05-match-lock-1-multiply-confirm](screenshots/engine-flow-codex-browser-regression-05-match-lock-1-multiply-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-match-lock-1-multiply-waiting · `engine-flow-codex-browser-regression-05-match-lock-1-multiply-waiting.png`

![codex-browser-regression 문제 상태 · 05-match-lock-1-multiply-waiting](screenshots/engine-flow-codex-browser-regression-05-match-lock-1-multiply-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-match-lock-2-add-confirm · `engine-flow-codex-browser-regression-05-match-lock-2-add-confirm.png`

![codex-browser-regression 정답 확인 · 05-match-lock-2-add-confirm](screenshots/engine-flow-codex-browser-regression-05-match-lock-2-add-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-match-lock-2-add-waiting · `engine-flow-codex-browser-regression-05-match-lock-2-add-waiting.png`

![codex-browser-regression 문제 상태 · 05-match-lock-2-add-waiting](screenshots/engine-flow-codex-browser-regression-05-match-lock-2-add-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-codex-browser-regression-05-play-step1.png`

![codex-browser-regression 문제 상태 · 05-play-step1](screenshots/engine-flow-codex-browser-regression-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05b2-play-divisor-times-remainder · `engine-flow-codex-browser-regression-05b2-play-divisor-times-remainder.png`

![codex-browser-regression 문제 상태 · 05b2-play-divisor-times-remainder](screenshots/engine-flow-codex-browser-regression-05b2-play-divisor-times-remainder.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b2-play-product-too-low · `engine-flow-codex-browser-regression-05b2-play-product-too-low.png`

![codex-browser-regression 오답 확인 · 05b2-play-product-too-low](screenshots/engine-flow-codex-browser-regression-05b2-play-product-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 문제 상태 · 05b-play-dividend-times-divisor · `engine-flow-codex-browser-regression-05b-play-dividend-times-divisor.png`

![codex-browser-regression 문제 상태 · 05b-play-dividend-times-divisor](screenshots/engine-flow-codex-browser-regression-05b-play-dividend-times-divisor.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b-play-product-too-high · `engine-flow-codex-browser-regression-05b-play-product-too-high.png`

![codex-browser-regression 오답 확인 · 05b-play-product-too-high](screenshots/engine-flow-codex-browser-regression-05b-play-product-too-high.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-codex-browser-regression-06-confirm.png`

![codex-browser-regression 마지막 확인 · 06-confirm](screenshots/engine-flow-codex-browser-regression-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 마지막 확인 · 06b-match-auto-confirm · `engine-flow-codex-browser-regression-06b-match-auto-confirm.png`

![codex-browser-regression 마지막 확인 · 06b-match-auto-confirm](screenshots/engine-flow-codex-browser-regression-06b-match-auto-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-codex-browser-regression-07-reward-closed.png`

![codex-browser-regression 닫힌 보상](screenshots/engine-flow-codex-browser-regression-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 열쇠 빛 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-codex-browser-regression-07b-reward-open.png`

![codex-browser-regression 열린 보상](screenshots/engine-flow-codex-browser-regression-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 열쇠 빛 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-codex-browser-regression-08-result.png`

![codex-browser-regression 실제 결과](screenshots/engine-flow-codex-browser-regression-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · largeSafe · `engine-flow-codex-browser-regression-08a-result-largeSafe.png`

![codex-browser-regression 결과 단계 · largeSafe](screenshots/engine-flow-codex-browser-regression-08a-result-largeSafe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · lock · `engine-flow-codex-browser-regression-08a-result-lock.png`

![codex-browser-regression 결과 단계 · lock](screenshots/engine-flow-codex-browser-regression-08a-result-lock.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-codex-browser-regression-08a-result-rainbow.png`

![codex-browser-regression 결과 단계 · rainbow](screenshots/engine-flow-codex-browser-regression-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · safe · `engine-flow-codex-browser-regression-08a-result-safe.png`

![codex-browser-regression 결과 단계 · safe](screenshots/engine-flow-codex-browser-regression-08a-result-safe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · secretSafe · `engine-flow-codex-browser-regression-08a-result-secretSafe.png`

![codex-browser-regression 결과 단계 · secretSafe](screenshots/engine-flow-codex-browser-regression-08a-result-secretSafe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · treasure · `engine-flow-codex-browser-regression-08a-result-treasure.png`

![codex-browser-regression 결과 단계 · treasure](screenshots/engine-flow-codex-browser-regression-08a-result-treasure.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 09-scoreboard-offline · `engine-flow-codex-browser-regression-09-scoreboard-offline.png`

![codex-browser-regression 09-scoreboard-offline](screenshots/engine-flow-codex-browser-regression-09-scoreboard-offline.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09b-scoreboard-10rows-start · `engine-flow-codex-browser-regression-09b-scoreboard-10rows-start.png`

![codex-browser-regression 09b-scoreboard-10rows-start](screenshots/engine-flow-codex-browser-regression-09b-scoreboard-10rows-start.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09c-scoreboard-10rows-end · `engine-flow-codex-browser-regression-09c-scoreboard-10rows-end.png`

![codex-browser-regression 09c-scoreboard-10rows-end](screenshots/engine-flow-codex-browser-regression-09c-scoreboard-10rows-end.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

### codex-live-panel-regression · 931×897 · DPR 2 · 33장

![codex-live-panel-regression 전체 상태 컨택시트](screenshots/report-flow-codex-live-panel-regression-contact-sheet.png)

#### 시작 화면 · `engine-flow-codex-live-panel-regression-01-cover.png`

![codex-live-panel-regression 시작 화면](screenshots/engine-flow-codex-live-panel-regression-01-cover.png)

- 학생이 보는 것: 매스몬 검산 자물쇠 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-codex-live-panel-regression-02-settings.png`

![codex-live-panel-regression 설정 화면](screenshots/engine-flow-codex-live-panel-regression-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-codex-live-panel-regression-03-tutorial-1.png`

![codex-live-panel-regression 설명 1 · 풀이 방법](screenshots/engine-flow-codex-live-panel-regression-03-tutorial-1.png)

- 학생이 보는 것: 곱셈으로 나눗셈 검산하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-codex-live-panel-regression-04-tutorial-2.png`

![codex-live-panel-regression 설명 2 · 보상과 목표](screenshots/engine-flow-codex-live-panel-regression-04-tutorial-2.png)

- 학생이 보는 것: 곱셈으로 나눗셈 검산하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 정답 확인 · 05-lock-1-multiply-confirm · `engine-flow-codex-live-panel-regression-05-lock-1-multiply-confirm.png`

![codex-live-panel-regression 정답 확인 · 05-lock-1-multiply-confirm](screenshots/engine-flow-codex-live-panel-regression-05-lock-1-multiply-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-1-multiply-waiting · `engine-flow-codex-live-panel-regression-05-lock-1-multiply-waiting.png`

![codex-live-panel-regression 문제 상태 · 05-lock-1-multiply-waiting](screenshots/engine-flow-codex-live-panel-regression-05-lock-1-multiply-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-lock-2-add-confirm · `engine-flow-codex-live-panel-regression-05-lock-2-add-confirm.png`

![codex-live-panel-regression 정답 확인 · 05-lock-2-add-confirm](screenshots/engine-flow-codex-live-panel-regression-05-lock-2-add-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-2-add-waiting · `engine-flow-codex-live-panel-regression-05-lock-2-add-waiting.png`

![codex-live-panel-regression 문제 상태 · 05-lock-2-add-waiting](screenshots/engine-flow-codex-live-panel-regression-05-lock-2-add-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-lock-3-locate-confirm · `engine-flow-codex-live-panel-regression-05-lock-3-locate-confirm.png`

![codex-live-panel-regression 정답 확인 · 05-lock-3-locate-confirm](screenshots/engine-flow-codex-live-panel-regression-05-lock-3-locate-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-3-locate-waiting · `engine-flow-codex-live-panel-regression-05-lock-3-locate-waiting.png`

![codex-live-panel-regression 문제 상태 · 05-lock-3-locate-waiting](screenshots/engine-flow-codex-live-panel-regression-05-lock-3-locate-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-match-lock-1-multiply-confirm · `engine-flow-codex-live-panel-regression-05-match-lock-1-multiply-confirm.png`

![codex-live-panel-regression 정답 확인 · 05-match-lock-1-multiply-confirm](screenshots/engine-flow-codex-live-panel-regression-05-match-lock-1-multiply-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-match-lock-1-multiply-waiting · `engine-flow-codex-live-panel-regression-05-match-lock-1-multiply-waiting.png`

![codex-live-panel-regression 문제 상태 · 05-match-lock-1-multiply-waiting](screenshots/engine-flow-codex-live-panel-regression-05-match-lock-1-multiply-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-match-lock-2-add-confirm · `engine-flow-codex-live-panel-regression-05-match-lock-2-add-confirm.png`

![codex-live-panel-regression 정답 확인 · 05-match-lock-2-add-confirm](screenshots/engine-flow-codex-live-panel-regression-05-match-lock-2-add-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-match-lock-2-add-waiting · `engine-flow-codex-live-panel-regression-05-match-lock-2-add-waiting.png`

![codex-live-panel-regression 문제 상태 · 05-match-lock-2-add-waiting](screenshots/engine-flow-codex-live-panel-regression-05-match-lock-2-add-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-codex-live-panel-regression-05-play-step1.png`

![codex-live-panel-regression 문제 상태 · 05-play-step1](screenshots/engine-flow-codex-live-panel-regression-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05b2-play-divisor-times-remainder · `engine-flow-codex-live-panel-regression-05b2-play-divisor-times-remainder.png`

![codex-live-panel-regression 문제 상태 · 05b2-play-divisor-times-remainder](screenshots/engine-flow-codex-live-panel-regression-05b2-play-divisor-times-remainder.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b2-play-product-too-low · `engine-flow-codex-live-panel-regression-05b2-play-product-too-low.png`

![codex-live-panel-regression 오답 확인 · 05b2-play-product-too-low](screenshots/engine-flow-codex-live-panel-regression-05b2-play-product-too-low.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 문제 상태 · 05b-play-dividend-times-divisor · `engine-flow-codex-live-panel-regression-05b-play-dividend-times-divisor.png`

![codex-live-panel-regression 문제 상태 · 05b-play-dividend-times-divisor](screenshots/engine-flow-codex-live-panel-regression-05b-play-dividend-times-divisor.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오답 확인 · 05b-play-product-too-high · `engine-flow-codex-live-panel-regression-05b-play-product-too-high.png`

![codex-live-panel-regression 오답 확인 · 05b-play-product-too-high](screenshots/engine-flow-codex-live-panel-regression-05b-play-product-too-high.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-codex-live-panel-regression-06-confirm.png`

![codex-live-panel-regression 마지막 확인 · 06-confirm](screenshots/engine-flow-codex-live-panel-regression-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 마지막 확인 · 06b-match-auto-confirm · `engine-flow-codex-live-panel-regression-06b-match-auto-confirm.png`

![codex-live-panel-regression 마지막 확인 · 06b-match-auto-confirm](screenshots/engine-flow-codex-live-panel-regression-06b-match-auto-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-codex-live-panel-regression-07-reward-closed.png`

![codex-live-panel-regression 닫힌 보상](screenshots/engine-flow-codex-live-panel-regression-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 열쇠 빛 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-codex-live-panel-regression-07b-reward-open.png`

![codex-live-panel-regression 열린 보상](screenshots/engine-flow-codex-live-panel-regression-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 열쇠 빛 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-codex-live-panel-regression-08-result.png`

![codex-live-panel-regression 실제 결과](screenshots/engine-flow-codex-live-panel-regression-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · largeSafe · `engine-flow-codex-live-panel-regression-08a-result-largeSafe.png`

![codex-live-panel-regression 결과 단계 · largeSafe](screenshots/engine-flow-codex-live-panel-regression-08a-result-largeSafe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · lock · `engine-flow-codex-live-panel-regression-08a-result-lock.png`

![codex-live-panel-regression 결과 단계 · lock](screenshots/engine-flow-codex-live-panel-regression-08a-result-lock.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-codex-live-panel-regression-08a-result-rainbow.png`

![codex-live-panel-regression 결과 단계 · rainbow](screenshots/engine-flow-codex-live-panel-regression-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · safe · `engine-flow-codex-live-panel-regression-08a-result-safe.png`

![codex-live-panel-regression 결과 단계 · safe](screenshots/engine-flow-codex-live-panel-regression-08a-result-safe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · secretSafe · `engine-flow-codex-live-panel-regression-08a-result-secretSafe.png`

![codex-live-panel-regression 결과 단계 · secretSafe](screenshots/engine-flow-codex-live-panel-regression-08a-result-secretSafe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · treasure · `engine-flow-codex-live-panel-regression-08a-result-treasure.png`

![codex-live-panel-regression 결과 단계 · treasure](screenshots/engine-flow-codex-live-panel-regression-08a-result-treasure.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 09-scoreboard-offline · `engine-flow-codex-live-panel-regression-09-scoreboard-offline.png`

![codex-live-panel-regression 09-scoreboard-offline](screenshots/engine-flow-codex-live-panel-regression-09-scoreboard-offline.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09b-scoreboard-10rows-start · `engine-flow-codex-live-panel-regression-09b-scoreboard-10rows-start.png`

![codex-live-panel-regression 09b-scoreboard-10rows-start](screenshots/engine-flow-codex-live-panel-regression-09b-scoreboard-10rows-start.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

#### 09c-scoreboard-10rows-end · `engine-flow-codex-live-panel-regression-09c-scoreboard-10rows-end.png`

![codex-live-panel-regression 09c-scoreboard-10rows-end](screenshots/engine-flow-codex-live-panel-regression-09c-scoreboard-10rows-end.png)

- 학생이 보는 것: 현재 게임 상태의 모든 보이는 요소를 확인합니다.
- 판단하거나 누르는 것: 이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기이 현재 화면 상태에 맞게 유지되는지 확인합니다.
- 다음 상태로 넘어가는 이유: 정해진 게임 흐름의 다음 상태로 이동합니다.

### user-reported-missing-reward-panel · 1082×897 · DPR 2 · 28장

![user-reported-missing-reward-panel 전체 상태 컨택시트](screenshots/report-flow-user-reported-missing-reward-panel-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-reported-missing-reward-panel-01-cover.png`

![user-reported-missing-reward-panel 시작 화면](screenshots/engine-flow-user-reported-missing-reward-panel-01-cover.png)

- 학생이 보는 것: 매스몬 검산 자물쇠 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-reported-missing-reward-panel-02-settings.png`

![user-reported-missing-reward-panel 설정 화면](screenshots/engine-flow-user-reported-missing-reward-panel-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-reported-missing-reward-panel-03-tutorial-1.png`

![user-reported-missing-reward-panel 설명 1 · 풀이 방법](screenshots/engine-flow-user-reported-missing-reward-panel-03-tutorial-1.png)

- 학생이 보는 것: 곱셈으로 나눗셈 검산하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-reported-missing-reward-panel-04-tutorial-2.png`

![user-reported-missing-reward-panel 설명 2 · 보상과 목표](screenshots/engine-flow-user-reported-missing-reward-panel-04-tutorial-2.png)

- 학생이 보는 것: 곱셈으로 나눗셈 검산하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 정답 확인 · 05-lock-1-multiply-confirm · `engine-flow-user-reported-missing-reward-panel-05-lock-1-multiply-confirm.png`

![user-reported-missing-reward-panel 정답 확인 · 05-lock-1-multiply-confirm](screenshots/engine-flow-user-reported-missing-reward-panel-05-lock-1-multiply-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-1-multiply-waiting · `engine-flow-user-reported-missing-reward-panel-05-lock-1-multiply-waiting.png`

![user-reported-missing-reward-panel 문제 상태 · 05-lock-1-multiply-waiting](screenshots/engine-flow-user-reported-missing-reward-panel-05-lock-1-multiply-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-lock-2-add-confirm · `engine-flow-user-reported-missing-reward-panel-05-lock-2-add-confirm.png`

![user-reported-missing-reward-panel 정답 확인 · 05-lock-2-add-confirm](screenshots/engine-flow-user-reported-missing-reward-panel-05-lock-2-add-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-2-add-waiting · `engine-flow-user-reported-missing-reward-panel-05-lock-2-add-waiting.png`

![user-reported-missing-reward-panel 문제 상태 · 05-lock-2-add-waiting](screenshots/engine-flow-user-reported-missing-reward-panel-05-lock-2-add-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-lock-3-locate-confirm · `engine-flow-user-reported-missing-reward-panel-05-lock-3-locate-confirm.png`

![user-reported-missing-reward-panel 정답 확인 · 05-lock-3-locate-confirm](screenshots/engine-flow-user-reported-missing-reward-panel-05-lock-3-locate-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-lock-3-locate-waiting · `engine-flow-user-reported-missing-reward-panel-05-lock-3-locate-waiting.png`

![user-reported-missing-reward-panel 문제 상태 · 05-lock-3-locate-waiting](screenshots/engine-flow-user-reported-missing-reward-panel-05-lock-3-locate-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-match-lock-1-multiply-confirm · `engine-flow-user-reported-missing-reward-panel-05-match-lock-1-multiply-confirm.png`

![user-reported-missing-reward-panel 정답 확인 · 05-match-lock-1-multiply-confirm](screenshots/engine-flow-user-reported-missing-reward-panel-05-match-lock-1-multiply-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-match-lock-1-multiply-waiting · `engine-flow-user-reported-missing-reward-panel-05-match-lock-1-multiply-waiting.png`

![user-reported-missing-reward-panel 문제 상태 · 05-match-lock-1-multiply-waiting](screenshots/engine-flow-user-reported-missing-reward-panel-05-match-lock-1-multiply-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05-match-lock-2-add-confirm · `engine-flow-user-reported-missing-reward-panel-05-match-lock-2-add-confirm.png`

![user-reported-missing-reward-panel 정답 확인 · 05-match-lock-2-add-confirm](screenshots/engine-flow-user-reported-missing-reward-panel-05-match-lock-2-add-confirm.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05-match-lock-2-add-waiting · `engine-flow-user-reported-missing-reward-panel-05-match-lock-2-add-waiting.png`

![user-reported-missing-reward-panel 문제 상태 · 05-match-lock-2-add-waiting](screenshots/engine-flow-user-reported-missing-reward-panel-05-match-lock-2-add-waiting.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-reported-missing-reward-panel-05-play-step1.png`

![user-reported-missing-reward-panel 문제 상태 · 05-play-step1](screenshots/engine-flow-user-reported-missing-reward-panel-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05b2-play-divisor-times-remainder · `engine-flow-user-reported-missing-reward-panel-05b2-play-divisor-times-remainder.png`

![user-reported-missing-reward-panel 문제 상태 · 05b2-play-divisor-times-remainder](screenshots/engine-flow-user-reported-missing-reward-panel-05b2-play-divisor-times-remainder.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05b-play-dividend-times-divisor · `engine-flow-user-reported-missing-reward-panel-05b-play-dividend-times-divisor.png`

![user-reported-missing-reward-panel 문제 상태 · 05b-play-dividend-times-divisor](screenshots/engine-flow-user-reported-missing-reward-panel-05b-play-dividend-times-divisor.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-reported-missing-reward-panel-06-confirm.png`

![user-reported-missing-reward-panel 마지막 확인 · 06-confirm](screenshots/engine-flow-user-reported-missing-reward-panel-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 마지막 확인 · 06b-match-auto-confirm · `engine-flow-user-reported-missing-reward-panel-06b-match-auto-confirm.png`

![user-reported-missing-reward-panel 마지막 확인 · 06b-match-auto-confirm](screenshots/engine-flow-user-reported-missing-reward-panel-06b-match-auto-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 곱셈으로 나눗셈 검산하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-reported-missing-reward-panel-07-reward-closed.png`

![user-reported-missing-reward-panel 닫힌 보상](screenshots/engine-flow-user-reported-missing-reward-panel-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 열쇠 빛 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-reported-missing-reward-panel-07b-reward-open.png`

![user-reported-missing-reward-panel 열린 보상](screenshots/engine-flow-user-reported-missing-reward-panel-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 열쇠 빛 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-reported-missing-reward-panel-08-result.png`

![user-reported-missing-reward-panel 실제 결과](screenshots/engine-flow-user-reported-missing-reward-panel-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · largeSafe · `engine-flow-user-reported-missing-reward-panel-08a-result-largeSafe.png`

![user-reported-missing-reward-panel 결과 단계 · largeSafe](screenshots/engine-flow-user-reported-missing-reward-panel-08a-result-largeSafe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · lock · `engine-flow-user-reported-missing-reward-panel-08a-result-lock.png`

![user-reported-missing-reward-panel 결과 단계 · lock](screenshots/engine-flow-user-reported-missing-reward-panel-08a-result-lock.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-user-reported-missing-reward-panel-08a-result-rainbow.png`

![user-reported-missing-reward-panel 결과 단계 · rainbow](screenshots/engine-flow-user-reported-missing-reward-panel-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · safe · `engine-flow-user-reported-missing-reward-panel-08a-result-safe.png`

![user-reported-missing-reward-panel 결과 단계 · safe](screenshots/engine-flow-user-reported-missing-reward-panel-08a-result-safe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · secretSafe · `engine-flow-user-reported-missing-reward-panel-08a-result-secretSafe.png`

![user-reported-missing-reward-panel 결과 단계 · secretSafe](screenshots/engine-flow-user-reported-missing-reward-panel-08a-result-secretSafe.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · treasure · `engine-flow-user-reported-missing-reward-panel-08a-result-treasure.png`

![user-reported-missing-reward-panel 결과 단계 · treasure](screenshots/engine-flow-user-reported-missing-reward-panel-08a-result-treasure.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 열쇠 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

<!-- REPORT-EVIDENCE-ALL:END -->

# 매스몬 표적 맞히기 제작·인수인계 보고서

- 최종 갱신일: 2026-07-29
- 대상: 초등학교 3학년 2학기 3단원 원 1차시
- 게임 공개 주소: [GitHub Pages에서 실행하기](https://kakio426.github.io/eduitit-math-3-2/3-2-3-1-mathmon-target-hit/)
- 보고서 공개 주소: [GitHub에서 REPORT.md 보기](https://github.com/kakio426/eduitit-math-3-2/blob/main/3-2-3-1-mathmon-target-hit/REPORT.md)
- 배포 폴더: `3-2-3-1-mathmon-target-hit/`
- 실행 파일: `3-2-3-1-mathmon-target-hit/index.html`
- 기준 화면: 16:10 Stage, 1280×800
- 권장 기기: 컴퓨터 및 태블릿 가로 화면
- 한 판 구성: 중심 4문제, 반지름 3문제, 지름 3문제
- 동행 매스몬: `diversity-reward-pack`의 번개늑대몬
- 보상 표준: `mathmon-unified-reward-v1`
- 결과 자산 컨택시트: `result-tiers-v3-contact-sheet.png`
- 전국 순위: 비활성화

## 1. 전달 요약

이 게임은 원의 중심·반지름·지름을 말로 외우는 대신, 네 개의 원 그림에서 알맞은 점이나 선분을 직접 고르며 위치 관계를 익히는 게임입니다.

한 원에 후보 네 개를 겹쳐 놓지 않습니다. 학생은 독립된 원 그림 네 개를 비교하고, `한가운데 점`, `중심에서 원까지`, `중심을 지나 원의 양쪽 끝까지`라는 관계를 보고 답을 고릅니다. 오답을 고르면 현재 원에서 중심 위치나 선분 끝점이 왜 다른지 바로 보이고, 정답을 고르면 같은 자리에서 완성된 관계를 충분히 확인한 뒤 `점수 보기`로 보상에 들어갑니다.

왼쪽 보상 장면은 최종 결과 이미지를 잘라 쓰지 않습니다. `연습 표적 → 가장자리 → 명중 → 정중앙 → 표적왕 → 전설 명중`의 플레이 전용 세로 이미지 6장을 사용하며, 단계가 오를수록 화살 위치·충격광·표적 장식·번개늑대몬 반응이 커집니다.

게임은 별도 서버 없이 GitHub Pages에서 정적 실행됩니다. 현재 제품 정책에 따라 랭킹 화면과 점수 제출·조회 요청은 모두 꺼져 있습니다.

## 2. 학습 목표와 수학 계약

### 학습 목표

원의 중심·반지름·지름을 점과 선분의 위치 관계로 구별합니다.

### 학생이 하는 판단

- 중심 문제: 원의 한가운데에 있는 점을 고릅니다.
- 반지름 문제: 중심에서 시작해 원까지 닿는 선분을 고릅니다.
- 지름 문제: 중심을 지나 원의 양쪽 끝까지 닿는 선분을 고릅니다.

### 문제 생성 규칙

- 한 판은 10문제입니다.
- 중심 4문제, 반지름 3문제, 지름 3문제를 섞어 냅니다.
- 문제마다 정답 1개와 대표 오개념 3개가 있습니다.
- 원과 선분의 회전·위치는 문제마다 달라집니다.
- 색이 아니라 점·선분·원의 실제 위치 관계로 답을 판단합니다.
- 각 문제의 선택지는 네 장이며, 정답 경로는 문제당 4회 입력입니다.
- 한 판 전체 입력 수는 43회입니다.

### 대표 오개념

| 개념 | 대표 오답 | 화면에서 보이는 이유 |
|---|---|---|
| 중심 | 점이 원의 테두리나 안쪽 한쪽에 있음 | 원 한가운데와 어긋난 위치를 표시 |
| 반지름 | 중심을 지나 양쪽 끝까지 이은 지름을 고름 | 중심에서 한쪽 원까지만 이어야 함을 표시 |
| 지름 | 원의 양쪽 끝은 잇지만 중심을 지나지 않음 | 중심점과 선분이 어긋난 위치를 표시 |

오답 뒤에는 같은 문제를 다시 고를 수 있습니다. 정답을 고르면 선택지 색만 바뀌지 않고, 고른 점이나 선분이 완성된 관계로 남고 한 줄 확인 문장이 나타납니다.

## 3. 학생 진행 흐름

1. **시작 화면**
   제목, 한 줄 목표, 시작 버튼을 먼저 봅니다.
2. **방법 보기 1**
   네 표적 중 알맞은 점이나 선분이 그려진 원을 고르는 방법을 봅니다.
3. **방법 보기 2**
   10문제를 풀고 덮인 표적을 열어 마지막 표적 이름을 확인하는 흐름을 봅니다.
4. **문제 풀기**
   `중심`, `반지름`, `지름` 중 현재 물음을 보고 원 그림 하나를 고릅니다.
5. **오답 확인**
   현재 원에서 점이나 선분이 어디에서 어긋났는지 봅니다.
6. **정답 확인**
   고른 관계가 완성된 모습과 짧은 확인 문장을 봅니다.
7. **점수 보기**
   정답 확인 화면을 충분히 본 뒤 학생이 보상 화면을 엽니다.
8. **보상 확인**
   닫힌 표적을 열면 이번 사건 그림과 실제 점수 변화가 공개됩니다.
9. **왼쪽 표적 변화**
   `다음`을 누르면 모달이 먼저 닫히고, 왼쪽 표적의 단계 효과가 재생됩니다.
10. **최종 결과**
    정답 수와 도달한 표적을 보여 주고 다음 표적 목표를 안내합니다.

## 4. 화면 설계

### 문제 화면

- 왼쪽 보상 장면: Stage 폭 25.78%, 1:2 세로 슬롯
- 오른쪽 학습 영역: Stage 폭 65.50%
- 핵심 2×2 표적 콘솔: Stage 폭 65.50%
- 문제 이름표: 교과 용어 한 단어만 표시
- 지시판: 현재 행동 한 문장만 표시
- 상단: 브랜드, 문제 수, 단원 배지, 설정 버튼을 같은 기준선에 배치

네 선택지는 황동 레일로 연결된 하나의 표적 콘솔 안에 있습니다. 문제 대기·오답·정답 확인에서 콘솔의 폭과 중심축이 움직이지 않습니다.

왼쪽 진행 장면은 최종 결과 장면과 별도입니다. 모든 플레이 이미지는 768×1536이며 `object-fit: contain`으로 표시합니다. 번개늑대몬 전신과 표적의 잘림은 없습니다.

### 설정 화면

설정 버튼은 Stage 오른쪽 위에 있고 다음 기능을 제공합니다.

- 배경 소리 켜기/끄기
- 효과 소리 켜기/끄기
- 방법 다시 보기
- 처음부터 다시 시작
- 설정 닫기

### 보상 화면

`3-2-2-4-mathmon-check-lock`과 같은 공통 `modal-art` 구조를 사용합니다.

- 닫힌 상태: 가려진 표적과 `열기` 버튼
- 열린 상태: 사건 그림, 실제 변화량, `다음` 버튼
- 보이는 설명 문장은 넣지 않음
- `점수 0` 사건은 누적 점수를 지우지 않음
- `다음`을 누른 뒤에만 왼쪽 표적 변화 효과가 재생됨

### 결과 화면

- 최종 결과 장면 6종은 각각 1280×800입니다.
- 결과 제목, 번개늑대몬, 표적, 오른쪽 정보판, `다시` 버튼 장식을 한 장면으로 통일했습니다.
- 오른쪽 정보판에는 생성형 다음 목표 타이틀과 공용 정답 수 이미지만 표시합니다.
- 결과 화면에서 표적 점수 막대를 반복하지 않습니다.
- `다시`는 장면 속 버튼과 같은 경계의 투명 HTML hitbox가 맡습니다.
- 결과 단계가 오를수록 제목을 가려도 차이를 알아볼 수 있게 만들었습니다.

| 단계 | 장면 차이 |
|---|---|
| 연습 표적 | 색 고리에 맞은 화살 없음, 바닥과 받침에 빗나간 화살, 조심스러운 자세 |
| 가장자리 | 바깥 파란 고리 끝의 한 발, 작은 파란 충격파 |
| 명중 | 여러 고리에 명중, 더 큰 축하와 자신 있는 반응 |
| 정중앙 | 정중앙 한 발과 밝은 중심광 |
| 표적왕 | 정중앙 다발 집중, 금빛 표적·왕관·우승 리본 |
| 전설 명중 | 무지개 표적, 망토, 번개 변신과 최고 단계 연출 |

## 5. 표적 점수와 결과 규칙

표적 점수는 0~100 범위에서 누적됩니다.

- 화면 크기별 전체 흐름: `screenshots/report-flow-desktop-contact-sheet.png`, `screenshots/report-flow-tablet-landscape-contact-sheet.png`, `screenshots/report-flow-user-redesign-1082x897-dpr2-contact-sheet.png`, `screenshots/report-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-contact-sheet.png`, `screenshots/report-flow-user-reported-result-panel-axis-1082x897-dpr2-contact-sheet.png`, `screenshots/report-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-contact-sheet.png`, `screenshots/report-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-contact-sheet.png`, `screenshots/report-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-contact-sheet.png`
- 현재 실행본 해시와 개별 캡처 목록: `screenshots/report-evidence-manifest.json`
- 데스크톱: `screenshots/engine-flow-desktop-01-cover.png`부터 `08-result.png`
- 태블릿 가로: `screenshots/engine-flow-tablet-landscape-01-cover.png`부터 `08-result.png`
- 사용자 발견 화면: `screenshots/engine-flow-user-redesign-1082x897-dpr2-01-cover.png`부터 `08-result.png`
- 오답 상태: 각 화면군의 `05b-play-wrong.png`
- 정답 확인: 각 화면군의 `06-confirm.png`
- 닫힌 보상·열린 보상: 각 화면군의 `07-reward-closed.png`, `07b-reward-open.png`
- 플레이 보상 단계 전수: `screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05p-play-tier-*.png`
- 최저 결과: 각 화면군의 `08a-result-practice-0-of-10.png`
- 기준 비교와 입력 통계: `BENCHMARK_AUDIT.md`

<!-- REPORT-EVIDENCE-ALL:START -->

## 2026-08-04 최신 원본 스크린샷 전수

- 실행본 SHA-256: `db997aa04f16ac879c40d6ec63ad5385db885099d7f5d6ff3f15c71dff6657ee`
- 생성 시각: `2026-08-04T15:57:27.252Z`
- 등록 화면 크기: `8개`
- 아래에 직접 삽입한 원본 캡처: `232장`
- 컨택시트만으로 대신하지 않고 manifest에 기록된 원본 캡처를 한 장씩 모두 연결했습니다.

### desktop · 1280×800 · DPR 1 · 29장

![desktop 전체 상태 컨택시트](screenshots/report-flow-desktop-contact-sheet.png)

#### 시작 화면 · `engine-flow-desktop-01-cover.png`

![desktop 시작 화면](screenshots/engine-flow-desktop-01-cover.png)

- 학생이 보는 것: 매스몬 표적 맞히기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-desktop-02-settings.png`

![desktop 설정 화면](screenshots/engine-flow-desktop-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-desktop-03-tutorial-1.png`

![desktop 설명 1 · 풀이 방법](screenshots/engine-flow-desktop-03-tutorial-1.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-desktop-04-tutorial-2.png`

![desktop 설명 2 · 보상과 목표](screenshots/engine-flow-desktop-04-tutorial-2.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-desktop-05-play-step1.png`

![desktop 문제 상태 · 05-play-step1](screenshots/engine-flow-desktop-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-bullseye · `engine-flow-desktop-05p-play-tier-bullseye.png`

![desktop 문제 상태 · 05p-play-tier-bullseye](screenshots/engine-flow-desktop-05p-play-tier-bullseye.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-edge · `engine-flow-desktop-05p-play-tier-edge.png`

![desktop 문제 상태 · 05p-play-tier-edge](screenshots/engine-flow-desktop-05p-play-tier-edge.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-hit · `engine-flow-desktop-05p-play-tier-hit.png`

![desktop 문제 상태 · 05p-play-tier-hit](screenshots/engine-flow-desktop-05p-play-tier-hit.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-legend · `engine-flow-desktop-05p-play-tier-legend.png`

![desktop 문제 상태 · 05p-play-tier-legend](screenshots/engine-flow-desktop-05p-play-tier-legend.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-practice · `engine-flow-desktop-05p-play-tier-practice.png`

![desktop 문제 상태 · 05p-play-tier-practice](screenshots/engine-flow-desktop-05p-play-tier-practice.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-targetking · `engine-flow-desktop-05p-play-tier-targetking.png`

![desktop 문제 상태 · 05p-play-tier-targetking](screenshots/engine-flow-desktop-05p-play-tier-targetking.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-circle-center-on-edge · `engine-flow-desktop-05m-p1-circle-center-on-edge.png`

![desktop 오개념 확인 · p1-circle-center-on-edge](screenshots/engine-flow-desktop-05m-p1-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-circle-radius-as-diameter · `engine-flow-desktop-05m-p1-circle-radius-as-diameter.png`

![desktop 오개념 확인 · p1-circle-radius-as-diameter](screenshots/engine-flow-desktop-05m-p1-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-circle-diameter-misses-center · `engine-flow-desktop-05m-p2-circle-diameter-misses-center.png`

![desktop 오개념 확인 · p2-circle-diameter-misses-center](screenshots/engine-flow-desktop-05m-p2-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-center-on-edge · `engine-flow-desktop-05m-p3-circle-center-on-edge.png`

![desktop 오개념 확인 · p3-circle-center-on-edge](screenshots/engine-flow-desktop-05m-p3-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-radius-as-diameter · `engine-flow-desktop-05m-p3-circle-radius-as-diameter.png`

![desktop 오개념 확인 · p3-circle-radius-as-diameter](screenshots/engine-flow-desktop-05m-p3-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p7-circle-diameter-misses-center · `engine-flow-desktop-05m-p7-circle-diameter-misses-center.png`

![desktop 오개념 확인 · p7-circle-diameter-misses-center](screenshots/engine-flow-desktop-05m-p7-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-desktop-05b-play-wrong.png`

![desktop 오답 확인 · 05b-play-wrong](screenshots/engine-flow-desktop-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-desktop-06-confirm.png`

![desktop 마지막 확인 · 06-confirm](screenshots/engine-flow-desktop-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-desktop-07-reward-closed.png`

![desktop 닫힌 보상](screenshots/engine-flow-desktop-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 표적 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-desktop-07b-reward-open.png`

![desktop 열린 보상](screenshots/engine-flow-desktop-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 표적 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-desktop-08-result.png`

![desktop 실제 결과](screenshots/engine-flow-desktop-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bullseye · `engine-flow-desktop-08a-result-bullseye.png`

![desktop 결과 단계 · bullseye](screenshots/engine-flow-desktop-08a-result-bullseye.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · edge · `engine-flow-desktop-08a-result-edge.png`

![desktop 결과 단계 · edge](screenshots/engine-flow-desktop-08a-result-edge.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · hit · `engine-flow-desktop-08a-result-hit.png`

![desktop 결과 단계 · hit](screenshots/engine-flow-desktop-08a-result-hit.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · legend · `engine-flow-desktop-08a-result-legend.png`

![desktop 결과 단계 · legend](screenshots/engine-flow-desktop-08a-result-legend.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice-0-of-10 · `engine-flow-desktop-08a-result-practice-0-of-10.png`

![desktop 결과 단계 · practice-0-of-10](screenshots/engine-flow-desktop-08a-result-practice-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice · `engine-flow-desktop-08a-result-practice.png`

![desktop 결과 단계 · practice](screenshots/engine-flow-desktop-08a-result-practice.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · targetking · `engine-flow-desktop-08a-result-targetking.png`

![desktop 결과 단계 · targetking](screenshots/engine-flow-desktop-08a-result-targetking.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### tablet-landscape · 1024×768 · DPR 1 · 29장

![tablet-landscape 전체 상태 컨택시트](screenshots/report-flow-tablet-landscape-contact-sheet.png)

#### 시작 화면 · `engine-flow-tablet-landscape-01-cover.png`

![tablet-landscape 시작 화면](screenshots/engine-flow-tablet-landscape-01-cover.png)

- 학생이 보는 것: 매스몬 표적 맞히기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-tablet-landscape-02-settings.png`

![tablet-landscape 설정 화면](screenshots/engine-flow-tablet-landscape-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-tablet-landscape-03-tutorial-1.png`

![tablet-landscape 설명 1 · 풀이 방법](screenshots/engine-flow-tablet-landscape-03-tutorial-1.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-tablet-landscape-04-tutorial-2.png`

![tablet-landscape 설명 2 · 보상과 목표](screenshots/engine-flow-tablet-landscape-04-tutorial-2.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-tablet-landscape-05-play-step1.png`

![tablet-landscape 문제 상태 · 05-play-step1](screenshots/engine-flow-tablet-landscape-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-bullseye · `engine-flow-tablet-landscape-05p-play-tier-bullseye.png`

![tablet-landscape 문제 상태 · 05p-play-tier-bullseye](screenshots/engine-flow-tablet-landscape-05p-play-tier-bullseye.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-edge · `engine-flow-tablet-landscape-05p-play-tier-edge.png`

![tablet-landscape 문제 상태 · 05p-play-tier-edge](screenshots/engine-flow-tablet-landscape-05p-play-tier-edge.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-hit · `engine-flow-tablet-landscape-05p-play-tier-hit.png`

![tablet-landscape 문제 상태 · 05p-play-tier-hit](screenshots/engine-flow-tablet-landscape-05p-play-tier-hit.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-legend · `engine-flow-tablet-landscape-05p-play-tier-legend.png`

![tablet-landscape 문제 상태 · 05p-play-tier-legend](screenshots/engine-flow-tablet-landscape-05p-play-tier-legend.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-practice · `engine-flow-tablet-landscape-05p-play-tier-practice.png`

![tablet-landscape 문제 상태 · 05p-play-tier-practice](screenshots/engine-flow-tablet-landscape-05p-play-tier-practice.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-targetking · `engine-flow-tablet-landscape-05p-play-tier-targetking.png`

![tablet-landscape 문제 상태 · 05p-play-tier-targetking](screenshots/engine-flow-tablet-landscape-05p-play-tier-targetking.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-circle-center-on-edge · `engine-flow-tablet-landscape-05m-p1-circle-center-on-edge.png`

![tablet-landscape 오개념 확인 · p1-circle-center-on-edge](screenshots/engine-flow-tablet-landscape-05m-p1-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-circle-radius-as-diameter · `engine-flow-tablet-landscape-05m-p1-circle-radius-as-diameter.png`

![tablet-landscape 오개념 확인 · p1-circle-radius-as-diameter](screenshots/engine-flow-tablet-landscape-05m-p1-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-circle-diameter-misses-center · `engine-flow-tablet-landscape-05m-p2-circle-diameter-misses-center.png`

![tablet-landscape 오개념 확인 · p2-circle-diameter-misses-center](screenshots/engine-flow-tablet-landscape-05m-p2-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-center-on-edge · `engine-flow-tablet-landscape-05m-p3-circle-center-on-edge.png`

![tablet-landscape 오개념 확인 · p3-circle-center-on-edge](screenshots/engine-flow-tablet-landscape-05m-p3-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-radius-as-diameter · `engine-flow-tablet-landscape-05m-p3-circle-radius-as-diameter.png`

![tablet-landscape 오개념 확인 · p3-circle-radius-as-diameter](screenshots/engine-flow-tablet-landscape-05m-p3-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p7-circle-diameter-misses-center · `engine-flow-tablet-landscape-05m-p7-circle-diameter-misses-center.png`

![tablet-landscape 오개념 확인 · p7-circle-diameter-misses-center](screenshots/engine-flow-tablet-landscape-05m-p7-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-tablet-landscape-05b-play-wrong.png`

![tablet-landscape 오답 확인 · 05b-play-wrong](screenshots/engine-flow-tablet-landscape-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-tablet-landscape-06-confirm.png`

![tablet-landscape 마지막 확인 · 06-confirm](screenshots/engine-flow-tablet-landscape-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-tablet-landscape-07-reward-closed.png`

![tablet-landscape 닫힌 보상](screenshots/engine-flow-tablet-landscape-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 표적 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-tablet-landscape-07b-reward-open.png`

![tablet-landscape 열린 보상](screenshots/engine-flow-tablet-landscape-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 표적 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-tablet-landscape-08-result.png`

![tablet-landscape 실제 결과](screenshots/engine-flow-tablet-landscape-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bullseye · `engine-flow-tablet-landscape-08a-result-bullseye.png`

![tablet-landscape 결과 단계 · bullseye](screenshots/engine-flow-tablet-landscape-08a-result-bullseye.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · edge · `engine-flow-tablet-landscape-08a-result-edge.png`

![tablet-landscape 결과 단계 · edge](screenshots/engine-flow-tablet-landscape-08a-result-edge.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · hit · `engine-flow-tablet-landscape-08a-result-hit.png`

![tablet-landscape 결과 단계 · hit](screenshots/engine-flow-tablet-landscape-08a-result-hit.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · legend · `engine-flow-tablet-landscape-08a-result-legend.png`

![tablet-landscape 결과 단계 · legend](screenshots/engine-flow-tablet-landscape-08a-result-legend.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice-0-of-10 · `engine-flow-tablet-landscape-08a-result-practice-0-of-10.png`

![tablet-landscape 결과 단계 · practice-0-of-10](screenshots/engine-flow-tablet-landscape-08a-result-practice-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice · `engine-flow-tablet-landscape-08a-result-practice.png`

![tablet-landscape 결과 단계 · practice](screenshots/engine-flow-tablet-landscape-08a-result-practice.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · targetking · `engine-flow-tablet-landscape-08a-result-targetking.png`

![tablet-landscape 결과 단계 · targetking](screenshots/engine-flow-tablet-landscape-08a-result-targetking.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### user-redesign-1082x897-dpr2 · 1082×897 · DPR 2 · 29장

![user-redesign-1082x897-dpr2 전체 상태 컨택시트](screenshots/report-flow-user-redesign-1082x897-dpr2-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-redesign-1082x897-dpr2-01-cover.png`

![user-redesign-1082x897-dpr2 시작 화면](screenshots/engine-flow-user-redesign-1082x897-dpr2-01-cover.png)

- 학생이 보는 것: 매스몬 표적 맞히기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-redesign-1082x897-dpr2-02-settings.png`

![user-redesign-1082x897-dpr2 설정 화면](screenshots/engine-flow-user-redesign-1082x897-dpr2-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-redesign-1082x897-dpr2-03-tutorial-1.png`

![user-redesign-1082x897-dpr2 설명 1 · 풀이 방법](screenshots/engine-flow-user-redesign-1082x897-dpr2-03-tutorial-1.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-redesign-1082x897-dpr2-04-tutorial-2.png`

![user-redesign-1082x897-dpr2 설명 2 · 보상과 목표](screenshots/engine-flow-user-redesign-1082x897-dpr2-04-tutorial-2.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-redesign-1082x897-dpr2-05-play-step1.png`

![user-redesign-1082x897-dpr2 문제 상태 · 05-play-step1](screenshots/engine-flow-user-redesign-1082x897-dpr2-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-bullseye · `engine-flow-user-redesign-1082x897-dpr2-05p-play-tier-bullseye.png`

![user-redesign-1082x897-dpr2 문제 상태 · 05p-play-tier-bullseye](screenshots/engine-flow-user-redesign-1082x897-dpr2-05p-play-tier-bullseye.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-edge · `engine-flow-user-redesign-1082x897-dpr2-05p-play-tier-edge.png`

![user-redesign-1082x897-dpr2 문제 상태 · 05p-play-tier-edge](screenshots/engine-flow-user-redesign-1082x897-dpr2-05p-play-tier-edge.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-hit · `engine-flow-user-redesign-1082x897-dpr2-05p-play-tier-hit.png`

![user-redesign-1082x897-dpr2 문제 상태 · 05p-play-tier-hit](screenshots/engine-flow-user-redesign-1082x897-dpr2-05p-play-tier-hit.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-legend · `engine-flow-user-redesign-1082x897-dpr2-05p-play-tier-legend.png`

![user-redesign-1082x897-dpr2 문제 상태 · 05p-play-tier-legend](screenshots/engine-flow-user-redesign-1082x897-dpr2-05p-play-tier-legend.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-practice · `engine-flow-user-redesign-1082x897-dpr2-05p-play-tier-practice.png`

![user-redesign-1082x897-dpr2 문제 상태 · 05p-play-tier-practice](screenshots/engine-flow-user-redesign-1082x897-dpr2-05p-play-tier-practice.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-targetking · `engine-flow-user-redesign-1082x897-dpr2-05p-play-tier-targetking.png`

![user-redesign-1082x897-dpr2 문제 상태 · 05p-play-tier-targetking](screenshots/engine-flow-user-redesign-1082x897-dpr2-05p-play-tier-targetking.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-circle-center-on-edge · `engine-flow-user-redesign-1082x897-dpr2-05m-p1-circle-center-on-edge.png`

![user-redesign-1082x897-dpr2 오개념 확인 · p1-circle-center-on-edge](screenshots/engine-flow-user-redesign-1082x897-dpr2-05m-p1-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-circle-radius-as-diameter · `engine-flow-user-redesign-1082x897-dpr2-05m-p1-circle-radius-as-diameter.png`

![user-redesign-1082x897-dpr2 오개념 확인 · p1-circle-radius-as-diameter](screenshots/engine-flow-user-redesign-1082x897-dpr2-05m-p1-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-circle-diameter-misses-center · `engine-flow-user-redesign-1082x897-dpr2-05m-p2-circle-diameter-misses-center.png`

![user-redesign-1082x897-dpr2 오개념 확인 · p2-circle-diameter-misses-center](screenshots/engine-flow-user-redesign-1082x897-dpr2-05m-p2-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-center-on-edge · `engine-flow-user-redesign-1082x897-dpr2-05m-p3-circle-center-on-edge.png`

![user-redesign-1082x897-dpr2 오개념 확인 · p3-circle-center-on-edge](screenshots/engine-flow-user-redesign-1082x897-dpr2-05m-p3-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-radius-as-diameter · `engine-flow-user-redesign-1082x897-dpr2-05m-p3-circle-radius-as-diameter.png`

![user-redesign-1082x897-dpr2 오개념 확인 · p3-circle-radius-as-diameter](screenshots/engine-flow-user-redesign-1082x897-dpr2-05m-p3-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p7-circle-diameter-misses-center · `engine-flow-user-redesign-1082x897-dpr2-05m-p7-circle-diameter-misses-center.png`

![user-redesign-1082x897-dpr2 오개념 확인 · p7-circle-diameter-misses-center](screenshots/engine-flow-user-redesign-1082x897-dpr2-05m-p7-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-user-redesign-1082x897-dpr2-05b-play-wrong.png`

![user-redesign-1082x897-dpr2 오답 확인 · 05b-play-wrong](screenshots/engine-flow-user-redesign-1082x897-dpr2-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-redesign-1082x897-dpr2-06-confirm.png`

![user-redesign-1082x897-dpr2 마지막 확인 · 06-confirm](screenshots/engine-flow-user-redesign-1082x897-dpr2-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-redesign-1082x897-dpr2-07-reward-closed.png`

![user-redesign-1082x897-dpr2 닫힌 보상](screenshots/engine-flow-user-redesign-1082x897-dpr2-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 표적 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-redesign-1082x897-dpr2-07b-reward-open.png`

![user-redesign-1082x897-dpr2 열린 보상](screenshots/engine-flow-user-redesign-1082x897-dpr2-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 표적 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-redesign-1082x897-dpr2-08-result.png`

![user-redesign-1082x897-dpr2 실제 결과](screenshots/engine-flow-user-redesign-1082x897-dpr2-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bullseye · `engine-flow-user-redesign-1082x897-dpr2-08a-result-bullseye.png`

![user-redesign-1082x897-dpr2 결과 단계 · bullseye](screenshots/engine-flow-user-redesign-1082x897-dpr2-08a-result-bullseye.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · edge · `engine-flow-user-redesign-1082x897-dpr2-08a-result-edge.png`

![user-redesign-1082x897-dpr2 결과 단계 · edge](screenshots/engine-flow-user-redesign-1082x897-dpr2-08a-result-edge.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · hit · `engine-flow-user-redesign-1082x897-dpr2-08a-result-hit.png`

![user-redesign-1082x897-dpr2 결과 단계 · hit](screenshots/engine-flow-user-redesign-1082x897-dpr2-08a-result-hit.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · legend · `engine-flow-user-redesign-1082x897-dpr2-08a-result-legend.png`

![user-redesign-1082x897-dpr2 결과 단계 · legend](screenshots/engine-flow-user-redesign-1082x897-dpr2-08a-result-legend.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice-0-of-10 · `engine-flow-user-redesign-1082x897-dpr2-08a-result-practice-0-of-10.png`

![user-redesign-1082x897-dpr2 결과 단계 · practice-0-of-10](screenshots/engine-flow-user-redesign-1082x897-dpr2-08a-result-practice-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice · `engine-flow-user-redesign-1082x897-dpr2-08a-result-practice.png`

![user-redesign-1082x897-dpr2 결과 단계 · practice](screenshots/engine-flow-user-redesign-1082x897-dpr2-08a-result-practice.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · targetking · `engine-flow-user-redesign-1082x897-dpr2-08a-result-targetking.png`

![user-redesign-1082x897-dpr2 결과 단계 · targetking](screenshots/engine-flow-user-redesign-1082x897-dpr2-08a-result-targetking.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### user-reported-final-reward-ui-broken-1082x897-dpr2 · 1082×897 · DPR 2 · 29장

![user-reported-final-reward-ui-broken-1082x897-dpr2 전체 상태 컨택시트](screenshots/report-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-01-cover.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 시작 화면](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-01-cover.png)

- 학생이 보는 것: 매스몬 표적 맞히기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-02-settings.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 설정 화면](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-03-tutorial-1.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 설명 1 · 풀이 방법](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-03-tutorial-1.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-04-tutorial-2.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 설명 2 · 보상과 목표](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-04-tutorial-2.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05-play-step1.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 문제 상태 · 05-play-step1](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-bullseye · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05p-play-tier-bullseye.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 문제 상태 · 05p-play-tier-bullseye](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05p-play-tier-bullseye.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-edge · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05p-play-tier-edge.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 문제 상태 · 05p-play-tier-edge](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05p-play-tier-edge.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-hit · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05p-play-tier-hit.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 문제 상태 · 05p-play-tier-hit](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05p-play-tier-hit.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-legend · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05p-play-tier-legend.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 문제 상태 · 05p-play-tier-legend](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05p-play-tier-legend.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-practice · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05p-play-tier-practice.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 문제 상태 · 05p-play-tier-practice](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05p-play-tier-practice.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-targetking · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05p-play-tier-targetking.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 문제 상태 · 05p-play-tier-targetking](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05p-play-tier-targetking.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-circle-center-on-edge · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05m-p1-circle-center-on-edge.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 오개념 확인 · p1-circle-center-on-edge](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05m-p1-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-circle-radius-as-diameter · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05m-p1-circle-radius-as-diameter.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 오개념 확인 · p1-circle-radius-as-diameter](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05m-p1-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-circle-diameter-misses-center · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05m-p2-circle-diameter-misses-center.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 오개념 확인 · p2-circle-diameter-misses-center](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05m-p2-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-center-on-edge · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05m-p3-circle-center-on-edge.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 오개념 확인 · p3-circle-center-on-edge](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05m-p3-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-radius-as-diameter · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05m-p3-circle-radius-as-diameter.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 오개념 확인 · p3-circle-radius-as-diameter](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05m-p3-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p7-circle-diameter-misses-center · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05m-p7-circle-diameter-misses-center.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 오개념 확인 · p7-circle-diameter-misses-center](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05m-p7-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05b-play-wrong.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 오답 확인 · 05b-play-wrong](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-06-confirm.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 마지막 확인 · 06-confirm](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-07-reward-closed.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 닫힌 보상](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 표적 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-07b-reward-open.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 열린 보상](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 표적 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08-result.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 실제 결과](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bullseye · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-bullseye.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 결과 단계 · bullseye](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-bullseye.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · edge · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-edge.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 결과 단계 · edge](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-edge.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · hit · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-hit.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 결과 단계 · hit](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-hit.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · legend · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-legend.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 결과 단계 · legend](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-legend.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice-0-of-10 · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-practice-0-of-10.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 결과 단계 · practice-0-of-10](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-practice-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-practice.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 결과 단계 · practice](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-practice.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · targetking · `engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-targetking.png`

![user-reported-final-reward-ui-broken-1082x897-dpr2 결과 단계 · targetking](screenshots/engine-flow-user-reported-final-reward-ui-broken-1082x897-dpr2-08a-result-targetking.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### user-reported-result-panel-axis-1082x897-dpr2 · 1082×897 · DPR 2 · 29장

![user-reported-result-panel-axis-1082x897-dpr2 전체 상태 컨택시트](screenshots/report-flow-user-reported-result-panel-axis-1082x897-dpr2-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-01-cover.png`

![user-reported-result-panel-axis-1082x897-dpr2 시작 화면](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-01-cover.png)

- 학생이 보는 것: 매스몬 표적 맞히기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-02-settings.png`

![user-reported-result-panel-axis-1082x897-dpr2 설정 화면](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-03-tutorial-1.png`

![user-reported-result-panel-axis-1082x897-dpr2 설명 1 · 풀이 방법](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-03-tutorial-1.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-04-tutorial-2.png`

![user-reported-result-panel-axis-1082x897-dpr2 설명 2 · 보상과 목표](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-04-tutorial-2.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05-play-step1.png`

![user-reported-result-panel-axis-1082x897-dpr2 문제 상태 · 05-play-step1](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-bullseye · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05p-play-tier-bullseye.png`

![user-reported-result-panel-axis-1082x897-dpr2 문제 상태 · 05p-play-tier-bullseye](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05p-play-tier-bullseye.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-edge · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05p-play-tier-edge.png`

![user-reported-result-panel-axis-1082x897-dpr2 문제 상태 · 05p-play-tier-edge](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05p-play-tier-edge.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-hit · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05p-play-tier-hit.png`

![user-reported-result-panel-axis-1082x897-dpr2 문제 상태 · 05p-play-tier-hit](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05p-play-tier-hit.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-legend · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05p-play-tier-legend.png`

![user-reported-result-panel-axis-1082x897-dpr2 문제 상태 · 05p-play-tier-legend](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05p-play-tier-legend.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-practice · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05p-play-tier-practice.png`

![user-reported-result-panel-axis-1082x897-dpr2 문제 상태 · 05p-play-tier-practice](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05p-play-tier-practice.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-targetking · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05p-play-tier-targetking.png`

![user-reported-result-panel-axis-1082x897-dpr2 문제 상태 · 05p-play-tier-targetking](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05p-play-tier-targetking.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-circle-center-on-edge · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05m-p1-circle-center-on-edge.png`

![user-reported-result-panel-axis-1082x897-dpr2 오개념 확인 · p1-circle-center-on-edge](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05m-p1-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-circle-radius-as-diameter · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05m-p1-circle-radius-as-diameter.png`

![user-reported-result-panel-axis-1082x897-dpr2 오개념 확인 · p1-circle-radius-as-diameter](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05m-p1-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-circle-diameter-misses-center · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05m-p2-circle-diameter-misses-center.png`

![user-reported-result-panel-axis-1082x897-dpr2 오개념 확인 · p2-circle-diameter-misses-center](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05m-p2-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-center-on-edge · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05m-p3-circle-center-on-edge.png`

![user-reported-result-panel-axis-1082x897-dpr2 오개념 확인 · p3-circle-center-on-edge](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05m-p3-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-radius-as-diameter · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05m-p3-circle-radius-as-diameter.png`

![user-reported-result-panel-axis-1082x897-dpr2 오개념 확인 · p3-circle-radius-as-diameter](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05m-p3-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p7-circle-diameter-misses-center · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05m-p7-circle-diameter-misses-center.png`

![user-reported-result-panel-axis-1082x897-dpr2 오개념 확인 · p7-circle-diameter-misses-center](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05m-p7-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05b-play-wrong.png`

![user-reported-result-panel-axis-1082x897-dpr2 오답 확인 · 05b-play-wrong](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-06-confirm.png`

![user-reported-result-panel-axis-1082x897-dpr2 마지막 확인 · 06-confirm](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-07-reward-closed.png`

![user-reported-result-panel-axis-1082x897-dpr2 닫힌 보상](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 표적 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-07b-reward-open.png`

![user-reported-result-panel-axis-1082x897-dpr2 열린 보상](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 표적 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08-result.png`

![user-reported-result-panel-axis-1082x897-dpr2 실제 결과](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bullseye · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-bullseye.png`

![user-reported-result-panel-axis-1082x897-dpr2 결과 단계 · bullseye](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-bullseye.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · edge · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-edge.png`

![user-reported-result-panel-axis-1082x897-dpr2 결과 단계 · edge](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-edge.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · hit · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-hit.png`

![user-reported-result-panel-axis-1082x897-dpr2 결과 단계 · hit](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-hit.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · legend · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-legend.png`

![user-reported-result-panel-axis-1082x897-dpr2 결과 단계 · legend](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-legend.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice-0-of-10 · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-practice-0-of-10.png`

![user-reported-result-panel-axis-1082x897-dpr2 결과 단계 · practice-0-of-10](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-practice-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-practice.png`

![user-reported-result-panel-axis-1082x897-dpr2 결과 단계 · practice](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-practice.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · targetking · `engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-targetking.png`

![user-reported-result-panel-axis-1082x897-dpr2 결과 단계 · targetking](screenshots/engine-flow-user-reported-result-panel-axis-1082x897-dpr2-08a-result-targetking.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### user-reported-problem-title-side-spikes-1082x897-dpr2 · 1082×897 · DPR 2 · 29장

![user-reported-problem-title-side-spikes-1082x897-dpr2 전체 상태 컨택시트](screenshots/report-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-01-cover.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 시작 화면](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-01-cover.png)

- 학생이 보는 것: 매스몬 표적 맞히기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-02-settings.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 설정 화면](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-03-tutorial-1.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 설명 1 · 풀이 방법](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-03-tutorial-1.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-04-tutorial-2.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 설명 2 · 보상과 목표](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-04-tutorial-2.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05-play-step1.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 문제 상태 · 05-play-step1](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-bullseye · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05p-play-tier-bullseye.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 문제 상태 · 05p-play-tier-bullseye](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05p-play-tier-bullseye.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-edge · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05p-play-tier-edge.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 문제 상태 · 05p-play-tier-edge](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05p-play-tier-edge.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-hit · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05p-play-tier-hit.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 문제 상태 · 05p-play-tier-hit](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05p-play-tier-hit.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-legend · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05p-play-tier-legend.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 문제 상태 · 05p-play-tier-legend](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05p-play-tier-legend.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-practice · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05p-play-tier-practice.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 문제 상태 · 05p-play-tier-practice](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05p-play-tier-practice.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-targetking · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05p-play-tier-targetking.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 문제 상태 · 05p-play-tier-targetking](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05p-play-tier-targetking.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-circle-center-on-edge · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05m-p1-circle-center-on-edge.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 오개념 확인 · p1-circle-center-on-edge](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05m-p1-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-circle-radius-as-diameter · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05m-p1-circle-radius-as-diameter.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 오개념 확인 · p1-circle-radius-as-diameter](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05m-p1-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-circle-diameter-misses-center · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05m-p2-circle-diameter-misses-center.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 오개념 확인 · p2-circle-diameter-misses-center](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05m-p2-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-center-on-edge · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05m-p3-circle-center-on-edge.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 오개념 확인 · p3-circle-center-on-edge](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05m-p3-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-radius-as-diameter · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05m-p3-circle-radius-as-diameter.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 오개념 확인 · p3-circle-radius-as-diameter](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05m-p3-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p7-circle-diameter-misses-center · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05m-p7-circle-diameter-misses-center.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 오개념 확인 · p7-circle-diameter-misses-center](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05m-p7-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05b-play-wrong.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 오답 확인 · 05b-play-wrong](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-06-confirm.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 마지막 확인 · 06-confirm](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-07-reward-closed.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 닫힌 보상](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 표적 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-07b-reward-open.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 열린 보상](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 표적 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08-result.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 실제 결과](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bullseye · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-bullseye.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 결과 단계 · bullseye](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-bullseye.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · edge · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-edge.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 결과 단계 · edge](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-edge.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · hit · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-hit.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 결과 단계 · hit](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-hit.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · legend · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-legend.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 결과 단계 · legend](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-legend.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice-0-of-10 · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-practice-0-of-10.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 결과 단계 · practice-0-of-10](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-practice-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-practice.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 결과 단계 · practice](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-practice.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · targetking · `engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-targetking.png`

![user-reported-problem-title-side-spikes-1082x897-dpr2 결과 단계 · targetking](screenshots/engine-flow-user-reported-problem-title-side-spikes-1082x897-dpr2-08a-result-targetking.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### user-reported-missing-left-reward-panel-1082x897-dpr2 · 1082×897 · DPR 2 · 29장

![user-reported-missing-left-reward-panel-1082x897-dpr2 전체 상태 컨택시트](screenshots/report-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-01-cover.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 시작 화면](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-01-cover.png)

- 학생이 보는 것: 매스몬 표적 맞히기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-02-settings.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 설정 화면](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-03-tutorial-1.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 설명 1 · 풀이 방법](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-03-tutorial-1.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-04-tutorial-2.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 설명 2 · 보상과 목표](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-04-tutorial-2.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05-play-step1.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 문제 상태 · 05-play-step1](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-bullseye · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05p-play-tier-bullseye.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 문제 상태 · 05p-play-tier-bullseye](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05p-play-tier-bullseye.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-edge · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05p-play-tier-edge.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 문제 상태 · 05p-play-tier-edge](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05p-play-tier-edge.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-hit · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05p-play-tier-hit.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 문제 상태 · 05p-play-tier-hit](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05p-play-tier-hit.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-legend · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05p-play-tier-legend.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 문제 상태 · 05p-play-tier-legend](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05p-play-tier-legend.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-practice · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05p-play-tier-practice.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 문제 상태 · 05p-play-tier-practice](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05p-play-tier-practice.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-targetking · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05p-play-tier-targetking.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 문제 상태 · 05p-play-tier-targetking](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05p-play-tier-targetking.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-circle-center-on-edge · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05m-p1-circle-center-on-edge.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 오개념 확인 · p1-circle-center-on-edge](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05m-p1-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-circle-radius-as-diameter · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05m-p1-circle-radius-as-diameter.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 오개념 확인 · p1-circle-radius-as-diameter](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05m-p1-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-circle-diameter-misses-center · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05m-p2-circle-diameter-misses-center.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 오개념 확인 · p2-circle-diameter-misses-center](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05m-p2-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-center-on-edge · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05m-p3-circle-center-on-edge.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 오개념 확인 · p3-circle-center-on-edge](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05m-p3-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-radius-as-diameter · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05m-p3-circle-radius-as-diameter.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 오개념 확인 · p3-circle-radius-as-diameter](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05m-p3-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p7-circle-diameter-misses-center · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05m-p7-circle-diameter-misses-center.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 오개념 확인 · p7-circle-diameter-misses-center](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05m-p7-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05b-play-wrong.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 오답 확인 · 05b-play-wrong](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-06-confirm.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 마지막 확인 · 06-confirm](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-07-reward-closed.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 닫힌 보상](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 표적 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-07b-reward-open.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 열린 보상](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 표적 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08-result.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 실제 결과](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bullseye · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-bullseye.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 결과 단계 · bullseye](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-bullseye.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · edge · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-edge.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 결과 단계 · edge](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-edge.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · hit · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-hit.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 결과 단계 · hit](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-hit.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · legend · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-legend.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 결과 단계 · legend](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-legend.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice-0-of-10 · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-practice-0-of-10.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 결과 단계 · practice-0-of-10](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-practice-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-practice.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 결과 단계 · practice](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-practice.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · targetking · `engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-targetking.png`

![user-reported-missing-left-reward-panel-1082x897-dpr2 결과 단계 · targetking](screenshots/engine-flow-user-reported-missing-left-reward-panel-1082x897-dpr2-08a-result-targetking.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### user-reported-left-reward-character-cropped-1082x897-dpr2 · 1082×897 · DPR 2 · 29장

![user-reported-left-reward-character-cropped-1082x897-dpr2 전체 상태 컨택시트](screenshots/report-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-01-cover.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 시작 화면](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-01-cover.png)

- 학생이 보는 것: 매스몬 표적 맞히기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-02-settings.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 설정 화면](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-03-tutorial-1.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 설명 1 · 풀이 방법](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-03-tutorial-1.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-04-tutorial-2.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 설명 2 · 보상과 목표](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-04-tutorial-2.png)

- 학생이 보는 것: 원의 중심·반지름·지름 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05-play-step1.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 문제 상태 · 05-play-step1](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-bullseye · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05p-play-tier-bullseye.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 문제 상태 · 05p-play-tier-bullseye](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05p-play-tier-bullseye.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-edge · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05p-play-tier-edge.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 문제 상태 · 05p-play-tier-edge](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05p-play-tier-edge.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-hit · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05p-play-tier-hit.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 문제 상태 · 05p-play-tier-hit](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05p-play-tier-hit.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-legend · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05p-play-tier-legend.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 문제 상태 · 05p-play-tier-legend](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05p-play-tier-legend.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-practice · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05p-play-tier-practice.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 문제 상태 · 05p-play-tier-practice](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05p-play-tier-practice.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05p-play-tier-targetking · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05p-play-tier-targetking.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 문제 상태 · 05p-play-tier-targetking](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05p-play-tier-targetking.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-circle-center-on-edge · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05m-p1-circle-center-on-edge.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 오개념 확인 · p1-circle-center-on-edge](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05m-p1-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-circle-radius-as-diameter · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05m-p1-circle-radius-as-diameter.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 오개념 확인 · p1-circle-radius-as-diameter](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05m-p1-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-circle-diameter-misses-center · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05m-p2-circle-diameter-misses-center.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 오개념 확인 · p2-circle-diameter-misses-center](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05m-p2-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-center-on-edge · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05m-p3-circle-center-on-edge.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 오개념 확인 · p3-circle-center-on-edge](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05m-p3-circle-center-on-edge.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p3-circle-radius-as-diameter · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05m-p3-circle-radius-as-diameter.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 오개념 확인 · p3-circle-radius-as-diameter](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05m-p3-circle-radius-as-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p7-circle-diameter-misses-center · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05m-p7-circle-diameter-misses-center.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 오개념 확인 · p7-circle-diameter-misses-center](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05m-p7-circle-diameter-misses-center.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05b-play-wrong.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 오답 확인 · 05b-play-wrong](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-06-confirm.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 마지막 확인 · 06-confirm](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 원의 중심·반지름·지름의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-07-reward-closed.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 닫힌 보상](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 표적 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-07b-reward-open.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 열린 보상](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 표적 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08-result.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 실제 결과](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bullseye · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-bullseye.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 결과 단계 · bullseye](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-bullseye.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · edge · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-edge.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 결과 단계 · edge](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-edge.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · hit · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-hit.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 결과 단계 · hit](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-hit.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · legend · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-legend.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 결과 단계 · legend](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-legend.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice-0-of-10 · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-practice-0-of-10.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 결과 단계 · practice-0-of-10](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-practice-0-of-10.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · practice · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-practice.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 결과 단계 · practice](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-practice.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · targetking · `engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-targetking.png`

![user-reported-left-reward-character-cropped-1082x897-dpr2 결과 단계 · targetking](screenshots/engine-flow-user-reported-left-reward-character-cropped-1082x897-dpr2-08a-result-targetking.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 표적 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

<!-- REPORT-EVIDENCE-ALL:END -->

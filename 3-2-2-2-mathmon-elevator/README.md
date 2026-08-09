# 매스몬 엘리베이터

3학년 2학기 2단원 2차시, 내림 있는 두 자리 수 나눗셈 게임입니다.

동행 매스몬 팩은 `base-pack`, 주인공은 독수리몬입니다.

## 학습 조작

1. 십의 자리에서 `몫 20`, `남은 수 10`처럼 실제 값을 고릅니다.
2. 남은 수와 일의 자리 수를 합쳐 아래 칸으로 내립니다.
3. 내려온 수를 나눈 몫을 고릅니다.

내림 단계도 네 선택지에서 합친 수를 고릅니다. 몫과 남은 수는 색이 아니라 글자로 표시합니다. 한 문제의 정답 경로는 서로 다른 수학 판단 3회이며, 마지막에는 완성식을 확인한 뒤 `문 열기`를 한 번 누릅니다.

문제 풀이 화면은 왼쪽의 큰 계산판과 오른쪽의 한 줄 지시문·선택지 4행으로 나뉩니다. 왼쪽에서는 `65 ÷ 5` 같은 문제식을 위쪽의 밝은 문제 상자에 따로 두고, 세로셈은 아래쪽 계산 상자에서 풀게 했습니다. 두 상자는 폭과 중심선이 같고 사이가 벌어져 있어 문제와 풀이가 한눈에 구분됩니다. 계산판의 일반 숫자는 한 크기로 맞추고, 학생이 지금 정해야 하는 주황색 숫자와 칸만 약 7% 크게 보여 줍니다. 오른쪽 선택지 카드는 바깥 그림자 없이 10px씩 떨어져 있어 서로 닿지 않습니다. 마지막 확인에서는 상자를 모두 접고 교과서식 세로셈만 보여 주며, 오른쪽 열은 짧은 `완성식·문 열기` 카드로 바뀝니다. `65÷5`라면 `13 → 65 → −5 → 15 → −15 → 0`의 계산 순서가 한눈에 이어집니다.

## 이미지 계약

- 설명 1쪽은 `70을 2로 먼저 나누기 → 70 = 2×30+10 → 10+6=16 → 16÷2=8 → 30+8=38`을 한눈에 보여 주는 생성형 안내 이미지 `tutorial-page-1-v7-generated.webp`입니다. 설명 2쪽은 `나눗셈 풀기 → 문 열기 → 점수 확인 → 10문제 뒤 도착 층`을 보여 주는 생성형 안내 이미지 `tutorial-page-2-v4-generated.webp`입니다. 두 실행 자산은 1280×800이며, 설명용 계산판·단계 카드·문구를 CSS/SVG로 겹쳐 그리지 않습니다.
- 문제 장면 3장: 대기 / 하강 / 도착, 각 1280×800
- 독수리몬 반응 3장: 정답 / 오답 / 보상, 각 512×640. 보상 반응은 원본 시트에서 날개 전체를 다시 잘라 좌우 투명 안전 여백을 두고, 1100px 이하 화면에서는 Stage 왼쪽과 이미지 상자 24px, 실제 날개 28px 이상의 여백을 둡니다.
- 보상: 닫힌 문 1장 + 사건 6종
- 결과: 제목·다시 버튼이 포함된 도착 장면 6장 + 정답 수 + 점수. 실행 파일은 각 결과마다 `-vN-generated.webp` 버전명을 사용해 이전 생성 이미지 캐시와 섞이지 않게 합니다.
- 공용 주요 행동 버튼: `다음`, `이전`, `문제 시작`, `결과 보기`는 `_shared/action-buttons/`의 생성형 WebP를 직접 참조합니다.
- 차시 전용 주요 행동 버튼: `문 열기`는 `door-open-button-chromakey.png` 원본과 투명 PNG·실행 WebP를 한 세트로 둡니다.
- 결과 `다시`의 보이는 면은 결과 장면 6장 안에 포함합니다. 실제 클릭은 결과별 버튼 경계에 맞춘 투명 HTML hitbox가 맡고, 별도 버튼 이미지는 화면에 표시하지 않습니다.
- 최저 결과: `0/10`, 점수 0이어도 `지하 비밀기지`에 도착합니다. `다시 준비` 결과는 현재 실행 흐름에서 사용하지 않습니다.
- 컨택시트: `problem-state-contact-sheet.png`, `result-tiers-v4-contact-sheet.png`, `_shared/mathmon/base-pack/contact-sheets/reactions-unit2/eaglemon-reactions-contact-sheet.png`

## 제품 정책

- 전국 순위 문구, 버튼, 화면, 점수 제출·조회는 비활성화되어 학생 흐름에 나타나지 않습니다.
- 오답은 점수를 무조건 깎는 명령은 아닙니다. 문제를 다시 풀어 맞히면 감점 사건 60%, 점수가 오르는 사건 40%의 별도 랜덤 보상표에서 문이 열립니다. 첫 시도 정답은 감점 사건 14%, 점수가 오르는 사건 86%이며, 정답 수는 최종 도착 층에도 따로 반영됩니다.

## 검증

```bash
node scripts/build-lesson.mjs 3-2-2-2-mathmon-elevator
node scripts/qa-lesson-model.mjs 3-2-2-2-mathmon-elevator
node scripts/qa-lesson-flow.mjs 3-2-2-2-mathmon-elevator
node scripts/qa-lesson2-elevator.mjs
node scripts/check-stage-ratio.mjs
node scripts/check-lesson-contract.mjs
node scripts/check-lesson-visual-contract.mjs
```

추가 화면 QA는 Codex 브라우저와 같은 931×897, 사용자가 설명·계산판 문제를 발견한 934×987(DPR 2), 결과 화면 중복을 발견한 1039×651(DPR 2)에서도 진행합니다. 설명 1쪽은 실제 값 흐름과 생성 이미지 단독 렌더를 검사합니다. 문제 화면은 `seed=61`로 첫 문제 `65÷5`를 고정하고 위 문제 상자와 아래 세로셈 상자의 분리, 왼쪽 계산판·오른쪽 조작 열의 간격, 몫 과대·과소, 내림 오답, 마지막 몫 과대·과소, 상자 없는 완료 세로셈과 독수리몬 알파 경계를 결정적으로 재현한 뒤 `0/10` 최저 결과까지 완주합니다. 결과 화면은 6단계 모두에서 버전 이미지 URL, 정답 수·점수 배지·`다시` 버튼의 공통 중앙축, baked-in 버튼과 투명 hitbox 경계, 별도 버튼 이미지 비노출을 검사합니다.

- 몫 과대: `screenshots/engine-flow-codex-browser-05b-play-wrong.png`
- 몫 과소: `screenshots/engine-flow-codex-browser-05b2-play-quotient-too-low.png`
- 내림 오답: `screenshots/engine-flow-codex-browser-05d2-play-down-wrong.png`
- 마지막 몫 과대·과소: `screenshots/engine-flow-codex-browser-05e2-play-ones-too-high.png`, `screenshots/engine-flow-codex-browser-05e3-play-ones-too-low.png`
- `0/10` 결과: `screenshots/engine-flow-codex-browser-08-result-low-0-of-10.png`
- 설명 실제 값·생성 이미지 회귀: `screenshots/engine-flow-reported-svg-overlap-934x987-03-tutorial-1.png`
- 완료 계산판 SVG 겹침 회귀: `screenshots/engine-flow-reported-svg-overlap-934x987-06-confirm.png`
- 독수리몬 날개 잘림 회귀: `screenshots/engine-flow-reported-svg-overlap-934x987-06-confirm.png`
- 지시문·선택판 겹침 회귀: `screenshots/engine-flow-reported-svg-overlap-934x987-05-play-step1.png`
- 결과 중복·정렬 회귀: `screenshots/engine-flow-reported-result-overlap-1039x651-08a-result-middle.png`

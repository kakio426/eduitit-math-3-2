# 매스몬 나누기 농장 정비 보고서

## 개요

`매스몬 나누기 농장`은 3학년 2학기 2단원 1차시, 내림 없는 `(몇십몇) ÷ (몇)`을 다루는 단일 HTML 게임입니다.

- 폴더: `3-2-2-1-mathmon-divide-farm`
- 등록: 루트 `manifest.json`의 `id: 3-2-2-1`
- Stage: `1280x800`, `16:10`
- 커버 표준: `generated-title-overlay`
- 시작 버튼 표준: `generated-button-art`
- 설명 화면 표준: `generated-image-text`
- 설정 표준: `modal-controls`
- 결과 표준: `generated-assets`, `hybrid-generated-dynamic`
- 커버 매스몬: `cover-generated.webp` 안에 포함된 여우몬 장면

## 학습 흐름

```text
첫 화면 -> 설명 1 -> 설명 2 -> 10개 묶음 나누기 -> 낱개 나누기 -> 한 칸 확인 -> 담기 -> 보상 -> 결과
```

문제 후보는 두 자리 수 20~99 중 십의 자리와 일의 자리가 나누는 수 2~9로 각각 나누어떨어지는 경우만 사용합니다. 한 판은 10문제이며, 한 판 안에서 같은 문제를 반복하지 않습니다.

`한 칸 확인` 단계에서는 칸에 들어간 10개 묶음과 낱개를 보고 몫을 확인합니다. 예를 들어 `55 ÷ 5`는 한 칸에 10개 묶음 1개와 낱개 1개가 들어가 `11개`가 됩니다.
낱개가 0개인 `90 ÷ 9` 같은 문제는 낱개 단계를 묻지 않고 `10개 묶음 -> 한 칸`으로 바로 넘어갑니다.

## 화면 정비

- 문제 화면 기본 노출을 큰 문제, 10개 묶음·낱개 당근 조작판, 한 줄 지시, `확인`/`다시` 버튼으로 고정했습니다.
- 왼쪽 농장 영역은 보상 바구니 진행도만 맡기고 비율을 줄였습니다. 수학 풀이 모델은 오른쪽에만 둡니다.
- 오른쪽 풀이판은 바구니 반복 대신 divisor 수만큼의 `나누기 칸`을 만들고, 10개 묶음 당근과 낱개 당근이 칸 안으로 들어간 상태를 보여 줍니다.
- 첫 칸만 `한 칸`으로 표시해 `?`, `10개`, `10+?`, `11개`처럼 지금 볼 값을 보여 주고, 나머지 칸은 같은 도구가 들어간 모습만 보여 줍니다.
- 4지선다 선택지는 제거했습니다. 학생은 당근을 탭하거나 드래그해서 칸에 넣고, 칸마다 똑같이 들어갔는지 `확인`합니다.
- 첫 화면 커버는 여우몬을 농장 장면 안에 함께 생성한 `cover-generated.webp`로 교체하고, 별도 `cover-mathmon` HTML 이미지를 사용하지 않습니다.
- 설명 화면은 `tutorial-page-1-generated.webp`, `tutorial-page-2-generated.webp` 2장 생성 이미지가 보이는 문구와 버튼 표면을 담당합니다. HTML은 접근성용 숨김 텍스트와 투명 `tutorialBackButton`/`tutorialNextButton` hitbox만 맡습니다.
- 첫 화면 시작 버튼은 `start-button-generated.webp` 생성형 버튼 아트로 바꿨습니다.
- 오른쪽 위 전역 조작은 `settingsButton` 톱니바퀴와 `settingsModal`로 이관했습니다.
- 힌트 버튼은 문제 화면에서 제거했습니다.
- 마지막 확인 뒤에는 조작 버튼을 숨기고 첫 칸에 완성값을 남깁니다.
- 보상 모달은 학생이 `담기`를 누른 뒤에만 열립니다.
- 보상 모달의 보이는 결과 문구는 `+n`, `-n`, `0`, `큰 풍년`, `황금` 중 하나로 줄였습니다.
- 결과 화면은 기존 생성형 농장 장면 위에 SVG 오버레이 하나로 도착한 곳, 정답 수, 수확만 보여 주는 `hybrid-generated-dynamic` 구조로 정리했습니다.

## 자산 점검

- `tutorial-page-1-source.png`, `tutorial-page-1-generated.png/webp`: `어떻게 풀어요?` 설명 이미지
- `tutorial-page-2-source.png`, `tutorial-page-2-generated.png/webp`: `무엇을 얻어요?` 설명 이미지
- `tutorial-generated.png/webp`: 이전 설명 배경 자산으로 보존, 현재 화면 표면에는 쓰지 않음
- `reward-events-sprite-generated.png/webp`: 캐릭터 없는 1536x1024, 3x2 보상 스프라이트로 교체
- `cover-generated-source.png`: 여우몬이 포함된 새 커버 생성 원본
- `cover-generated.png/webp`: 여우몬이 농장 장면 안에 포함된 새 커버 생성 자산
- `title-logo-generated.png/webp`: 기존 생성형 제목 아트 유지
- `start-button-source.png`, `start-button-generated.png/webp`: 생성형 시작 버튼 아트 추가
- `result-tier-*.png/webp`: 기존 결과 배경 유지
- 첫 화면 매스몬은 `cover-generated.webp` 장면 안에 포함되며, 커버 위 별도 매스몬 오버레이는 사용하지 않음

## 스크린샷

데스크톱 `1280x800`:

- `screenshots/01-cover.png`
- `screenshots/01b-settings.png`
- `screenshots/02-tutorial.png`
- `screenshots/02b-tutorial-page2.png`
- `screenshots/03-problem-step1.png`
- `screenshots/04-problem-step2.png`
- `screenshots/05-final-confirm.png`
- `screenshots/06-reward.png`
- `screenshots/07-result-measuring.png`
- `screenshots/08-result.png`

태블릿 가로 `1024x640`:

- `screenshots/tablet-01-cover.png`
- `screenshots/tablet-01b-settings.png`
- `screenshots/tablet-02-tutorial.png`
- `screenshots/tablet-02b-tutorial-page2.png`
- `screenshots/tablet-03-problem-step1.png`
- `screenshots/tablet-04-problem-step2.png`
- `screenshots/tablet-05-final-confirm.png`
- `screenshots/tablet-06-reward.png`
- `screenshots/tablet-07-result-measuring.png`
- `screenshots/tablet-08-result.png`

좁은 가로 `918x897`:

- `screenshots/compact-01-cover.png`
- `screenshots/compact-01b-settings.png`
- `screenshots/compact-02-tutorial.png`
- `screenshots/compact-02b-tutorial-page2.png`
- `screenshots/compact-03-problem-step1.png`
- `screenshots/compact-04-problem-step2.png`
- `screenshots/compact-05-final-confirm.png`
- `screenshots/compact-06-reward.png`
- `screenshots/compact-07-result-measuring.png`
- `screenshots/compact-08-result.png`

## 검증 결과

2026-07-07 재구성 기준:

- `node --check scripts/qa-lesson2-divide-farm.mjs`: 통과
- `node scripts/qa-lesson2-divide-farm.mjs`: 통과
- `node --check scripts/check-stage-ratio.mjs`: 통과
- `node scripts/check-stage-ratio.mjs`: 통과
- 후보 문제 48개 모두 내림과 나머지 없음
- 한 판 10문제, 한 판 내 중복 없음
- 10개 묶음·낱개 당근을 칸에 직접 넣은 뒤 `확인`으로 다음 단계에 가는지 확인
- `90 ÷ 9`는 낱개 선택 없이 `tens,combine` 단계만 쓰는지 확인
- 한 칸에 몰아 넣은 오답 경로에서 `칸마다 똑같이 넣어요.` 피드백과 벌레 먹음 보상 처리 확인
- 마지막 단계 정답 뒤 `담기` 버튼 경로 확인
- 문제 풀이 중 왼쪽 농장 장면은 보상 진행만 맡고, 오른쪽 나누기 칸·10개 묶음·낱개 당근·한 줄 지시·확인/다시 버튼만 보이는지 확인
- Codex 브라우저에서 10개 묶음 당근 탭 이동과 드래그 이동을 각각 확인
- 설정 모달 열기/닫기, 배경 소리·효과 소리 localStorage 키, `__mathmonAudioQa` 확인
- 데스크톱 `1280x800`, 태블릿 가로 `1024x640`, 좁은 가로 `918x897`에서 설명 생성 이미지 2장, 텍스트 넘침, 요소 겹침, 설정 버튼 글자 노출, 최종 조작 버튼 잔상 없음 확인

## 텍스트 넘침·요소 겹침 QA

- 확인 크기: 데스크톱 `1280x800`, 태블릿 가로 `1024x640`, 좁은 가로 `918x897`
- 확인 화면: 첫 화면, 설정 모달, 설명 1장, 설명 2장, 문제 1단계, 문제 2단계, 몫 완성 확인, 보상 모달, 결과 확인 중, 결과 완료
- 결과: 텍스트 넘침 0건, 요소 겹침 0건, 설정 버튼 글자 노출 0건, 조작 버튼 크기 흔들림 0건
- 문제 화면 QA: 기본 화면에 큰 문제, 당근 조작판, 한 줄 지시, 확인/다시 버튼만 보임
- 수동 확인: 데스크톱/태블릿 결과 화면에서 SVG 결과값과 투명 `restartButton` hitbox가 Stage 안에 들어오는지 캡처로 확인

## 커버 이관 및 텍스트 넘침·요소 겹침 QA (2026-07-03)

- 확인 크기: 데스크톱 `1280x800`, 태블릿 가로 `1024x768`
- 확인 화면: 첫 화면
- 커버 자산: `cover-generated.png/webp` 1280×800, 여우몬이 농장 장면 안에 포함됨
- DOM 확인: `.cover-mathmon`, `.cover-visual` 커버 노드 0건
- 결과: 제목 아트, 목표, 시작 버튼, 상단 배지, 설정 버튼, 하단 배지의 텍스트 넘침·요소 겹침 0건
- 이미지 확인: 커버 배경 안에 제목, 목표 문장, 숫자, 버튼, UI 패널, 라벨 없음
- 스크린샷 갱신: `screenshots/01-cover.png`, `screenshots/tablet-01-cover.png`

## Humanizer 학생 문구 QA

확인 대상:

- 첫 화면 목표
- 설명 화면 2장
- 설정 모달 문구
- 문제 지시문
- 정답·오답 피드백
- 보상 모달
- 결과 측정 중 문구
- 결과 완료 문구

조정 결과:

- `수확 등급`은 학생 화면에서 `도착한 곳`, `수확`처럼 바로 보이는 말로 줄임
- 숨김 설명 문장은 `10개 묶음부터 나누어요.`, `낱개도`, `답을 확인해요.`처럼 한 행동만 말하게 줄임
- `흉작`은 `빈 바구니`로 바꿈
- `대풍`은 `큰 풍년`으로 바꿈
- `10개 묶음을 칸에 넣어요.`, `낱개 당근을 칸에 넣어요.`, `왼쪽 바구니에 담아요.`처럼 한 문장에 행동 하나만 남김
- 자리값을 붙인 어색한 숫자 표현을 쓰지 않고 `10+?`, `11개`, `칸마다 똑같이 넣어요.`처럼 화면 조작과 바로 이어지는 말로 바꿈

## 남은 범위 밖

- 스마트폰 세로 지원
- 백엔드 저장
- 도감형 수집
- 새 매스몬 팩 제작
- 다른 차시 수정

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
- 매스몬: `assets/mathmon/base-pack/mathmon-2-foxmon.webp`

## 학습 흐름

```text
첫 화면 -> 설명 1 -> 설명 2 -> 십의 자리 나누기 -> 일의 자리 나누기 -> 몫 합치기 -> 수확 보기 -> 보상 -> 결과
```

문제 후보는 두 자리 수 20~99 중 십의 자리와 일의 자리가 나누는 수 2~9로 각각 나누어떨어지는 경우만 사용합니다. 한 판은 10문제이며, 한 판 안에서 같은 문제를 반복하지 않습니다.

`몫 합치기` 단계에는 자리값을 무시한 오답을 넣었습니다. 예를 들어 `82 ÷ 2`의 바른 몫은 `41`이고, 오답으로 `4 + 1 = 5`가 함께 나옵니다.

## 화면 정비

- 문제 화면 기본 노출을 큰 문제, 현재 단계 판, 한 줄 지시, 선택지로 고정했습니다.
- 설명 화면은 `tutorial-page-1-generated.webp`, `tutorial-page-2-generated.webp` 2장 생성 이미지가 보이는 문구와 버튼 표면을 담당합니다. HTML은 접근성용 숨김 텍스트와 투명 `tutorialBackButton`/`tutorialNextButton` hitbox만 맡습니다.
- 첫 화면 시작 버튼은 `start-button-generated.webp` 생성형 버튼 아트로 바꿨습니다.
- 오른쪽 위 전역 조작은 `settingsButton` 톱니바퀴와 `settingsModal`로 이관했습니다.
- 힌트는 닫힌 버튼으로 유지했습니다.
- 마지막 정답 뒤에는 선택지를 숨기고 계산판에 `몫 41` 같은 완성값을 남깁니다.
- 보상 모달은 학생이 `수확 보기`를 누른 뒤에만 열립니다.
- 보상 모달의 보이는 결과 문구는 `수확 +n`, `수확 -n`, `수확 0`, `큰 풍년!`, `황금!` 중 하나로 줄였습니다.
- 결과 화면은 기존 생성형 농장 장면 위에 SVG 오버레이 하나로 도착한 곳, 정답 수, 수확만 보여 주는 `hybrid-generated-dynamic` 구조로 정리했습니다.

## 자산 점검

- `tutorial-page-1-source.png`, `tutorial-page-1-generated.png/webp`: `어떻게 풀어요?` 설명 이미지
- `tutorial-page-2-source.png`, `tutorial-page-2-generated.png/webp`: `무엇을 얻어요?` 설명 이미지
- `tutorial-generated.png/webp`: 이전 설명 배경 자산으로 보존, 현재 화면 표면에는 쓰지 않음
- `reward-events-sprite-generated.png/webp`: 캐릭터 없는 1536x1024, 3x2 보상 스프라이트로 교체
- `cover-generated.png/webp`: 기존 자산 유지
- `title-logo-generated.png/webp`: 기존 생성형 제목 아트 유지
- `start-button-source.png`, `start-button-generated.png/webp`: 생성형 시작 버튼 아트 추가
- `result-tier-*.png/webp`: 기존 결과 배경 유지
- 런타임 매스몬은 base-pack 여우몬만 사용

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

## 검증 결과

2026-07-03 정비 기준:

- `node --check scripts/qa-lesson2-divide-farm.mjs`: 통과
- `node scripts/qa-lesson2-divide-farm.mjs`: 통과
- `node --check scripts/check-stage-ratio.mjs`: 통과
- `node scripts/check-stage-ratio.mjs`: 통과
- 후보 문제 48개 모두 내림과 나머지 없음
- 한 판 10문제, 한 판 내 중복 없음
- 몫 합치기 단계의 자리값 무시 오답 포함 확인
- 중간 오답 1회 경로에서 벌레 먹음 보상 처리 확인
- 마지막 단계 정답 뒤 `수확 보기` 버튼 경로 확인
- 설정 모달 열기/닫기, 배경 소리·효과 소리 localStorage 키, `__mathmonAudioQa` 확인
- 데스크톱 `1280x800`과 태블릿 가로 `1024x640`에서 설명 생성 이미지 2장, 텍스트 넘침, 요소 겹침, 설정 버튼 글자 노출, 최종 선택지 잔상 없음 확인

## 텍스트 넘침·요소 겹침 QA

- 확인 크기: 데스크톱 `1280x800`, 태블릿 가로 `1024x640`
- 확인 화면: 첫 화면, 설정 모달, 설명 1장, 설명 2장, 문제 1단계, 문제 2단계, 몫 완성 확인, 보상 모달, 결과 확인 중, 결과 완료
- 결과: 텍스트 넘침 0건, 요소 겹침 0건, 설정 버튼 글자 노출 0건, 선택지 크기 흔들림 0건
- 수동 확인: 데스크톱/태블릿 결과 화면에서 SVG 결과값과 투명 `restartButton` hitbox가 Stage 안에 들어오는지 캡처로 확인

## Humanizer 학생 문구 QA

확인 대상:

- 첫 화면 목표
- 설명 화면 2장
- 설정 모달 문구
- 문제 지시문
- 힌트
- 정답·오답 피드백
- 보상 모달
- 결과 측정 중 문구
- 결과 완료 문구

조정 결과:

- `수확 등급`은 학생 화면에서 `도착한 곳`, `수확`처럼 바로 보이는 말로 줄임
- 설명 이미지 문장은 `십의 자리부터 나누어요.`, `일의 자리도`, `답을 확인해요.`처럼 한 행동만 말하게 줄임
- `흉작`은 `빈 바구니`로 바꿈
- `대풍`은 `큰 풍년`으로 바꿈
- `몫 41 완성!`, `바구니에 담아 볼까요?`처럼 짧은 행동 문장으로 유지

## 남은 범위 밖

- 스마트폰 세로 지원
- 백엔드 저장
- 도감형 수집
- 새 매스몬 팩 제작
- 다른 차시 수정

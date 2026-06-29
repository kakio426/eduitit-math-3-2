# 매스몬 나누기 농장 정비 보고서

## 개요

`매스몬 나누기 농장`은 3학년 2학기 2단원 1차시, 내림 없는 `(몇십몇) ÷ (몇)`을 다루는 단일 HTML 게임입니다.

- 폴더: `3-2-2-1-mathmon-divide-farm`
- 등록: 루트 `manifest.json`의 `id: 3-2-2-1`
- Stage: `1280x800`, `16:10`
- 커버 표준: `generated-title-overlay`
- 매스몬: `assets/mathmon/base-pack/mathmon-2-foxmon.webp`

## 학습 흐름

```text
첫 화면 -> 설명 -> 십의 자리 나누기 -> 일의 자리 나누기 -> 몫 합치기 -> 수확 보기 -> 보상 -> 결과
```

문제 후보는 두 자리 수 20~99 중 십의 자리와 일의 자리가 나누는 수 2~9로 각각 나누어떨어지는 경우만 사용합니다. 한 판은 10문제이며, 한 판 안에서 같은 문제를 반복하지 않습니다.

`몫 합치기` 단계에는 자리값을 무시한 오답을 넣었습니다. 예를 들어 `82 ÷ 2`의 바른 몫은 `41`이고, 오답으로 `4 + 1 = 5`가 함께 나옵니다.

## 화면 정비

- 문제 화면 기본 노출을 큰 문제, 현재 단계 판, 한 줄 지시, 선택지로 고정했습니다.
- 힌트는 닫힌 버튼으로 유지했습니다.
- 마지막 정답 뒤에는 선택지를 숨기고 계산판에 `몫 41` 같은 완성값을 남깁니다.
- 보상 모달은 학생이 `수확 보기`를 누른 뒤에만 열립니다.
- 보상 모달의 보이는 결과 문구는 `수확 +n`, `수확 -n`, `수확 0`, `큰 풍년!`, `황금!` 중 하나로 줄였습니다.
- 결과 화면 표현은 `농장 길`, `도착한 밭`, `어디까지 왔는지 보는 중` 흐름으로 정리했습니다.

## 자산 점검

- `tutorial-generated.png/webp`: 캐릭터 없는 농장 수확 장면으로 교체
- `reward-events-sprite-generated.png/webp`: 캐릭터 없는 1536x1024, 3x2 보상 스프라이트로 교체
- `cover-generated.png/webp`: 기존 자산 유지
- `title-logo-generated.png/webp`: 기존 생성형 제목 아트 유지
- `result-tier-*.png/webp`: 기존 결과 배경 유지
- 런타임 매스몬은 base-pack 여우몬만 사용

참고: 이번 정비 계획은 기존 결과 배경과 `base-pack` 여우몬 런타임 자산을 유지하는 범위입니다. 최신 RasterStage 결과 화면을 가장 엄격하게 해석하면 결과 장면 안에 매스몬과 고정 시각 요소까지 생성 이미지로 자연 포함하는 리마스터가 남아 있습니다.

## 스크린샷

데스크톱 `1280x800`:

- `screenshots/01-cover.png`
- `screenshots/02-tutorial.png`
- `screenshots/03-problem-step1.png`
- `screenshots/04-problem-step2.png`
- `screenshots/05-final-confirm.png`
- `screenshots/06-reward.png`
- `screenshots/07-result-measuring.png`
- `screenshots/08-result.png`

태블릿 가로 `1024x640`:

- `screenshots/tablet-01-cover.png`
- `screenshots/tablet-02-tutorial.png`
- `screenshots/tablet-03-problem-step1.png`
- `screenshots/tablet-04-problem-step2.png`
- `screenshots/tablet-05-final-confirm.png`
- `screenshots/tablet-06-reward.png`
- `screenshots/tablet-07-result-measuring.png`
- `screenshots/tablet-08-result.png`

## 검증 결과

2026-06-29 정비 기준:

- `node --check scripts/qa-lesson2-divide-farm.mjs`: 통과
- `node scripts/qa-lesson2-divide-farm.mjs`: 통과
- `node scripts/check-stage-ratio.mjs`: 통과
- 후보 문제 48개 모두 내림과 나머지 없음
- 한 판 10문제, 한 판 내 중복 없음
- 몫 합치기 단계의 자리값 무시 오답 포함 확인
- 중간 오답 1회 경로에서 벌레 먹음 보상 처리 확인
- 마지막 단계 정답 뒤 `수확 보기` 버튼 경로 확인
- 데스크톱 `1280x800`과 태블릿 가로 `1024x640`에서 텍스트 넘침, 요소 겹침, 소리 버튼 글자 노출, 최종 선택지 잔상 없음 확인

## 텍스트 넘침·요소 겹침 QA

- 확인 크기: 데스크톱 `1280x800`, 태블릿 가로 `1024x640`
- 확인 화면: 첫 화면, 설명, 문제 1단계, 문제 2단계, 몫 완성 확인, 보상 모달, 결과 확인 중, 결과 완료
- 결과: 텍스트 넘침 0건, 요소 겹침 0건, 소리 버튼 글자 노출 0건, 선택지 크기 흔들림 0건
- 수동 확인: 태블릿 결과 화면에서 `한 번 더` 버튼이 Stage 안에 들어오는지 캡처로 확인

## Humanizer 학생 문구 QA

확인 대상:

- 첫 화면 목표
- 설명 화면 3단계
- 문제 지시문
- 힌트
- 정답·오답 피드백
- 보상 모달
- 결과 측정 중 문구
- 결과 완료 문구

조정 결과:

- `수확 등급`은 학생 화면에서 `농장 길`, `도착한 밭`으로 바꿈
- `농장 등급 살피는 중`은 `어디까지 왔는지 보는 중`으로 바꿈
- `흉작`은 `빈 바구니`로 바꿈
- `대풍`은 `큰 풍년`으로 바꿈
- `몫 41 완성!`, `바구니에 담아 볼까요?`처럼 짧은 행동 문장으로 유지

## 남은 범위 밖

- 스마트폰 세로 지원
- 백엔드 저장
- 도감형 수집
- 새 매스몬 팩 제작
- 다른 차시 수정

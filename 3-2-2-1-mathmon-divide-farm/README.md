# 매스몬 나누기 농장

3학년 2학기 2단원 1차시용 에듀잇티 수학 게임입니다.

- 학습: 내림 없는 `(몇십몇) ÷ (몇)`
- 목표: 수확물을 똑같이 나눠 바구니에 담기
- 문제: 십의 자리와 일의 자리가 각각 나누어떨어지는 두 자리 나눗셈 10문제
- 방식: 십의 자리 나누기 -> 일의 자리 나누기 -> 몫 합치기
- 보상: 문제마다 랜덤 수확 이벤트 1번
- 결과: 수확과 정답 수를 함께 보아 `씨앗 -> 새싹 -> 텃밭 -> 농장 -> 대농장` 중 도착한 밭을 보여 줌
- 실행: `index.html`을 브라우저에서 열기

## 설계

학생은 답 하나만 고르지 않고, 십의 자리 수확물과 일의 자리 수확물을 차례로 나눕니다. 마지막에는 두 몫을 합쳐 `몫 41`처럼 완성값을 확인합니다.

`몫 합치기` 단계에는 자리값을 놓친 오답이 항상 들어갑니다. 예를 들어 `82 ÷ 2`에서는 바른 몫 `41`과 함께 `4 + 1 = 5`처럼 착각하기 쉬운 선택지가 나옵니다.

마지막 정답 뒤에는 보상 모달이 바로 덮지 않습니다. 계산판에 완성값과 `몫 41 완성!`을 보여 주고, 학생이 `수확 보기` 버튼을 눌러 보상으로 넘어갑니다.

## 화면

스크린샷은 `screenshots/` 폴더에 저장합니다.

- `01-cover.png`: 첫 화면
- `02-tutorial.png`: 설명 화면
- `03-problem-step1.png`: 문제 1단계
- `04-problem-step2.png`: 문제 2단계
- `05-final-confirm.png`: 몫 완성 확인
- `06-reward.png`: 수확 이벤트 모달
- `07-result-measuring.png`: 결과 확인 중
- `08-result.png`: 결과 완료
- `tablet-01-cover.png` ~ `tablet-08-result.png`: 태블릿 가로 `1024x640` QA 캡처

## RasterStage 자산

- `cover-generated.png/webp`: 첫 화면 배경
- `title-logo-chromakey.png`: 제목 로고 생성 원본
- `title-logo-generated.png/webp`: 첫 화면 제목 래스터 오버레이
- `tutorial-generated.png/webp`: 캐릭터 없는 설명 배경
- `farm-board-generated.png/webp`: 문제 화면 농장 배경
- `reward-events-sprite-generated.png/webp`: 1536x1024, 3x2 보상 스프라이트
- `result-tier-seed.png/webp`: 씨앗
- `result-tier-sprout.png/webp`: 새싹
- `result-tier-garden.png/webp`: 텃밭
- `result-tier-farm.png/webp`: 농장
- `result-tier-bigfarm.png/webp`: 대농장
- `result-tier-rainbow.png/webp`: 전설 황금밭
- `assets/mathmon/base-pack/mathmon-2-foxmon.webp`: 여우몬

첫 화면은 `generated-title-overlay` 표준입니다. 배경은 글자 없는 `cover-generated.webp`, 제목은 생성형 이미지 기반 `title-logo-generated.webp`, 목표와 시작 버튼은 HTML 오버레이입니다.

설명 배경과 보상 스프라이트는 캐릭터 없는 농장/수확 장면입니다. 런타임 매스몬은 base-pack 여우몬 한 마리만 사용합니다.

## 파일 구성

- `index.html`: 게임 본문
- `PLAN.md`: 정비 계획
- `README.md`: 실행과 구조 설명
- `REPORT.md`: 구현·검증 보고서
- `screenshots/`: 최신 QA 캡처
- `*.png`, `*.webp`: 생성 이미지 원본과 배포 자산

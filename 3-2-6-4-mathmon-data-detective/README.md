# 매스몬 데이터 탐정

에듀잇티 수학 게임 3학년 2학기 6단원 4차시이자 자료 연구소 시리즈의 단원 정점입니다.

- 학습: 그림그래프에서 가장 큰 값, 가장 작은 값, 두 값의 차이 구하기
- 문제: 큰 값 3문제, 작은 값 3문제, 차이 4문제
- 그림 단위: 2 또는 5
- 행동: 현재 지시가 묻는 단서 하나만 고르기
- 확인: 네 줄의 실제 값과 비교·뺄셈 관계를 본 뒤 단서 상자 열기
- 실행: `index.html`

## 문제와 오답

큰 값·작은 값 문제는 줄 이름 하나를 고릅니다. 오답 뒤에는 고른 줄과 네 줄의 실제 값이 함께 남습니다. 차이 문제는 그림 개수 차이만 계산하기, 큰 값 자체, 한 단위 적게 또는 많게 계산하기를 대표 오답으로 둡니다. 읽기와 비교를 한 번에 두 문제로 묻지 않습니다.

## 화면과 자산

- 매스몬: `base-pack`의 여우몬 `base-02-foxmon`
- 생성 자산: 커버, 설명 2장, 문제 배경, 닫힌 상자를 포함한 보상 7상태, 결과 장면 6장, 결과 제목 6장
- 닫힌 상자 원본: `reward-event-closed-source.png` → `reward-event-closed-generated.png` → `reward-event-closed-generated.webp`
- QA 컨택시트: `reward-contact-sheet.png`, `result-scenes-contact-sheet.png`, `result-titles-contact-sheet.png`
- 생성 원본 시트: `reward-source-sheet.png`, `result-scenes-source-sheet.png`, `result-titles-source-sheet.png`
- 공용 시작: `../_shared/mathmon/cover-start-button/start-button-generated.webp`
- 공용 다시: `../_shared/result-actions/retry-button-generated.webp`
- 공용 정답 수: `../_shared/result-count/`

## 보상과 결과

중심 보상은 `탐정 힘`입니다. 일반 `+6~10`, 감소 `-5~-2`, 큰 증가 `+14~22`, 대박 `+30`, 그대로 `0`, 특별 `100`을 쓰며 오답은 최초 한 번 `-6~-3`입니다. 결과는 `첫 단서 → 단서 수첩 → 해결 배지 → 탐정 책상 → 사건 해결실 → 무지개 탐정본부` 순서이고 문턱은 `0/0, 15/2, 35/4, 55/6, 78/8, 특별 100/1`입니다.

## 검증 자료

`screenshots/engine-flow-{desktop,tablet-landscape,unit6-reported-overlap-1024x768-dpr1}-*.png`에 전체 흐름, 차이의 작은·큰 오답, 큰 값 줄 오답, 정답 확인, 닫힌·열린 보상, 결과 6단계를 보관합니다.

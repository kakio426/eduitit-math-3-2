# 매스몬 그림 도장 찍기

에듀잇티 수학 게임 3학년 2학기 6단원 3차시입니다.

- 학습: 큰 그림 10과 작은 그림 1로 수 나타내기
- 문제: 10·14·21·26·30·37·42·48·53·59를 섞은 10문제
- 1단계: 큰 도장 수 고르기
- 2단계: 작은 도장 수 고르기
- 확인: `큰 도장×10 + 작은 도장×1 = 전체 수`를 본 뒤 도장 상자 열기
- 실행: `index.html`

## 문제와 오답

십의 자리와 일의 자리를 바꿔 고르는 값, 하나 적은 값, 하나 많은 값을 대표 오답으로 둡니다. 오답 뒤에는 고른 수만큼의 도장이 작업판에 남고 식에는 `≠`가 나타납니다. 첫 단계 정답 뒤에는 `작은 도장 보기`를 눌러 두 번째 판단으로 넘어갑니다.

## 화면과 자산

- 매스몬: `base-pack`의 유니콘몬 `base-08-unicornmon`
- 생성 자산: 커버, 설명 2장, 문제 배경, 닫힌 상자를 포함한 보상 7상태, 독립 최종 결과 장면 6장
- 닫힌 상자 원본: `reward-event-closed-source.png` → `reward-event-closed-generated.png` → `reward-event-closed-generated.webp`
- 최종 결과 컨택시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-3/result-fullscene-v1/contact-sheets/result-tiers-v1-contact-sheet.png`
- 최종 결과 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-3/result-fullscene-v1/source`
- 왼쪽 진행 컨택시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-3/play-progress-v1/contact-sheets/play-stamp-progress-v1-contact-sheet.png`
- 왼쪽 기준선 시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-3/play-progress-v1/contact-sheets/play-stamp-progress-v1-anchor-audit.png`
- 왼쪽 진행 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-3/play-progress-v1/source`
- 보상 사건 컨택시트: `reward-contact-sheet.png`
- 보상 사건 생성 원본 시트: `reward-source-sheet.png`
- 공용 시작: `../_shared/mathmon/cover-start-button/start-button-generated.webp`
- 공용 다시: `../_shared/result-actions/retry-button-v2-generated.webp`
- 공용 정답 수: `../_shared/result-count/`

## 보상과 결과

중심 보상은 `그래프 힘`입니다. 일반 `+6~10`, 감소 `-5~-2`, 큰 증가 `+14~22`, 대박 `+30`, 그대로 `0`, 특별 `100`을 쓰며 오답은 최초 한 번 `-6~-3`입니다. 결과는 `첫 도장판 → 빛난 도장판 → 숲 그림판 → 하늘 전시대 → 황금 전시실 → 무지개 도장탑` 순서이고 문턱은 `0/0, 15/2, 35/4, 55/6, 78/8, 특별 100/1`입니다.

최종 결과는 1280×800 독립 장면 여섯 장입니다. 비 내리는 폐창고, 봄 정원, 빛나는 숲, 하늘 관측소, 황금·진홍 왕실, 청록·자홍·보라 우주탑으로 환경과 색 계열이 함께 바뀝니다. CSS 필터·블렌드·효과 오버레이로 단계 차이를 만들지 않습니다.

최종 결과를 먼저 승인한 뒤 같은 여섯 세계와 1:1로 연결되는 전용 768×1536 왼쪽 진행 장면을 따로 만들었습니다. 결과 크롭 재사용은 없고 `object-fit: contain`으로 표시합니다.

## 검증 자료

`screenshots/engine-flow-{desktop,tablet-landscape,codex-in-app,user-visibility,user-reported-missing-left-progress,empty-reward-fixture}-*.png`에 두 단계 대기·오답·정답 확인, 마지막 완성식, 보상, 결과 6단계를 보관합니다.

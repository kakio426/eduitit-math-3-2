# 매스몬 인구조사

에듀잇티 수학 게임 3학년 2학기 6단원 1차시입니다. 공개 폴더와 URL은 기존 `3-2-6-1-mathmon-data-rangers`를 유지하고, 학생용 제목과 학습 흐름을 새로 만들었습니다.

- 학습: 강조된 자료를 세어 표의 빈칸 채우기
- 문제: 세 범주의 딱지 12~24개 중 한 범주의 수를 묻는 10문제
- 행동: 현재 딱지를 세어 선택지 4개 중 수 하나 고르기
- 확인: 고른 수가 표 칸에 들어간 뒤 조사 상자 열기
- 실행: `index.html`

## 문제와 오답

정답 범위는 4~12입니다. 오답은 하나 적게, 하나 많게, 옆 범주의 수로 구성합니다. 하나 적게 고르면 세지 못한 딱지가 흐려지고, 하나 많게 고르면 더 센 딱지가 흐린 표시로 남습니다. 정답 뒤에는 표의 `?` 칸이 실제 수로 바뀝니다.

## 화면과 자산

- 매스몬: `base-pack`의 새끼용몬 `base-03-babydragonmon`
- 커버: `cover-source.png` → `cover-generated.webp`
- 설명: `tutorial-page-1-generated.webp`, `tutorial-page-2-generated.webp`
- 문제 배경: `problem-background-source.png` → `problem-background-generated.webp`
- 보상 7상태: `reward-event-closed-generated.webp`와 `reward-{normal,loss,mega,complete,empty,rainbow}-generated.webp`
- 닫힌 상자 원본: `reward-event-closed-source.png` → `reward-event-closed-generated.png` → `reward-event-closed-generated.webp`
- 최종 보상 6장: `result-{first,complete-table,spark-board,notice-board,data-lab,rainbow}-generated.webp`(각 1280×800 독립 생성 장면)
- 문제 왼쪽 진행 보상 6장: `play-census-v1-{first,complete-table,spark-board,notice-board,data-lab,rainbow}-generated.webp`(각 768×1536 전용 생성 장면)
- 최종 보상 컨택시트: `../_shared/mathmon/base-pack/lesson-scenes/3-2-6-1/result-fullscene-v1/contact-sheets/result-tiers-v1-contact-sheet.png`
- 왼쪽 진행 보상 컨택시트: `../_shared/mathmon/base-pack/lesson-scenes/3-2-6-1/play-progress-v1/contact-sheets/play-census-progress-v1-contact-sheet.png`
- 왼쪽 진행 보상 기준선 시트: `../_shared/mathmon/base-pack/lesson-scenes/3-2-6-1/play-progress-v1/contact-sheets/play-census-progress-v1-anchor-audit.png`
- 왼쪽 진행 보상 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-1/play-progress-v1/source`
- 공용 시작: `../_shared/mathmon/cover-start-button/start-button-generated.webp`
- 공용 다시: `../_shared/result-actions/retry-button-v2-generated.webp`
- 공용 정답 수: `../_shared/result-count/result-correct-0-generated.webp`~`result-correct-10-generated.webp`

## 보상과 결과

중심 보상은 `자료 힘` 하나입니다. 일반 `+6~10`, 감소 `-5~-2`, 큰 증가 `+14~22`, 대박 `+30`, 그대로 `0`, 특별 `100` 중 하나가 나옵니다. 오답을 거친 문제는 최초 한 번만 `-6~-3`을 적용합니다. 정답 확인 뒤 닫힌 상자를 열고 사건을 확인하는 Stage-Reveal 흐름입니다.

결과는 `첫 조사표 → 완성 조사표 → 반짝 조사판 → 조사 게시판 → 자료 연구실 → 무지개 자료관` 순서입니다. 문턱은 `0/0, 15/2, 35/4, 55/6, 78/8, 특별 100/1`입니다.

최종 보상은 먼저 여섯 개의 완성 세계를 확정했습니다. 비 오는 낡은 조사 천막에서 시작해 햇빛 마을, 빛나는 숲, 하늘 관측소, 황금 연구실, 무지개 우주 자료관까지 배경·빛·보상물·새끼용몬의 반응이 단계마다 크게 달라집니다. 문제 왼쪽 진행 보상은 이 최종 세계를 기준으로 별도 제작했으며, 최종 이미지를 잘라 재사용하지 않습니다.

## 검증 자료

`screenshots/engine-flow-{desktop,tablet-landscape,codex-in-app,user-visibility,user-reported-missing-left-progress,empty-reward-fixture}-*.png`에 표지, 설정, 설명 2장, 대기, 오답, 정답 확인, 닫힌·열린 보상, 결과 6단계를 보관합니다. 상세 판정은 `REPORT.md`와 `BENCHMARK_AUDIT.md`에 있습니다.

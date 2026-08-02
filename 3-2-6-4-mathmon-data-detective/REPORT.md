# 매스몬 데이터 탐정 제작 보고

검사일: 2026-08-01
최종 판정: **통과**
잔여 P0/P1: 없음

## 구현 결과

- 기존 6-1의 비교 흐름을 이 차시로 옮기고 큰 값 3, 작은 값 3, 차이 4로 문제 유형을 고정했습니다.
- 그림 하나의 단위는 2 또는 5입니다.
- 큰 값·작은 값·차이를 같은 화면에서 동시에 묻지 않고 현재 단서 하나만 묻습니다.
- 차이 오답은 그림 수 차이, 큰 값, 한 단위 적게·많게를 문제 은행 전체에 포함합니다.
- 오답 뒤 고른 줄이나 차이 값이 작업판에 남고, 정답 뒤 네 줄의 값과 최종 관계가 나타납니다.
- 정답 줄의 배열 위치와 관계없이 오답을 `correct`로 잘못 표시하지 않도록 선택지 분류를 고쳤습니다.
- 공용 보상 기준 `mathmon-unified-reward-v1`과 닫힌 상자→사건 공개 Stage-Reveal을 적용했습니다.
- 모델 검사는 고정 시드 64회, 640문제로 제한해 큰 값·작은 값·차이의 모든 오답 표지와 보상 경계값을 확인했습니다.
- `base-pack` 여우몬을 사용하고 랭킹은 비활성화했습니다.

## Humanizer 학생 문구 QA

`데이터를 분석해요` 대신 `그림 수에 2를 곱해 비교해요`, `큰 값에서 작은 값을 빼요`처럼 지금 할 행동을 한 줄로 썼습니다. `2을` 같은 조사 오류도 전수 수정했습니다.

## 교과서식 수 표현 QA

그림 수와 실제 값을 구별합니다. 그림 3개의 단위가 5이면 선택지와 확인에는 `15`를 보여 줍니다. 차이는 실제 값끼리 빼며 그림 개수 차이를 정답으로 인정하지 않습니다.

## 텍스트 넘침·요소 겹침 QA

- 화면: 1280×800 DPR1, 1024×768 DPR1, 1280×720 DPR2, 994×632 DPR1, 사용자 신고 1082×987 DPR2, 빈 보상 1280×800 DPR1
- 상태: 표지, 설정, 설명 1·2, 대기, 차이의 작은·큰 오답, 큰 값 줄 오답, 정답, 완성, 닫힌·열린 보상, 결과 6단계
- overflow 0, 누락 이미지 0, 피드백·선택지 교차 0px, 작업판 이탈 0px
- 대기↔완료 문제판·작업판 좌우 경계와 중심 차이 0px
- 시작·다시 버튼 아트와 hitbox 차이 1px 이하
- 설정 버튼 실제 42×42px

## 실제 영역 측정

| 화면 | Stage | 문제판 | 중심 작업판 | 선택지 최소 |
| --- | ---: | ---: | ---: | ---: |
| 1280×800 | 1203.19×751.98 | 896.39×465.98 | 858.39×384.98 | 210.09×56 |
| 1024×768 | 983.06×614.41 | 742.22×353.94 | 716.22×291.69 | 172.55×52 |

왼쪽 진행 보상 옆 작업판은 Stage 폭의 71.34%와 72.86%입니다. 선택지 글씨는 24px와 20.48px, 지시문은 20.48px와 17.41px입니다.

## 설정·자산·네트워크 QA

- 설정 첫 초점, Escape, Tab 순환, 초점 복귀, 재시작 확인, 방법 복습 복귀 통과
- BGM/SFX 저장 통과
- WebP 49개 `decode()` 통과
- 닫힌·열린 보상에서 이미지·단계판·버튼 교차 0px, 닫힌 상자 512×512 확인
- 랭킹 네트워크 요청 0건
- `reward-contact-sheet.png`와 최종 결과 컨택시트를 전수 확인

## 검증 명령

- `node scripts/build-lesson.mjs 3-2-6-4-mathmon-data-detective` → PASS
- `node scripts/qa-unit6-data.mjs` → PASS
- `node scripts/qa-lesson-flow.mjs 3-2-6-4-mathmon-data-detective` → PASS
- `node scripts/qa-unit6-browser.mjs 3-2-6-4-mathmon-data-detective` → PASS

## 2026-07-31 최종 회귀

- `1280×800`, `1024×768`, 신고 회귀 화면 `1024×768 DPR1`에서 전체 흐름과 결과 6단계를 다시 캡처했습니다. 제목 불투명 픽셀↔막대 여백 `8px 이상`, 결과 요소 교차 `0px`, 공통 축 편차 Stage 폭 `1.5% 이하`입니다.
- 문제 작업 영역 Stage 폭 `95% 이상`, 상단 글자 `16px`, 설정 hitbox `42×42px`; 탐정 오답 증거 표시와 함께 넘침·교차·누락·랭킹 요청 `0건`입니다.

## 2026-08-01 현재 실측

- 왼쪽 진행 보상과 나란히 둔 작업영역은 1280×800에서 `896.39×661.98px`(Stage 폭 `74.50%`, 면적 `65.58%`), 1024×768에서 `742.22×529.94px`(Stage 폭 `75.50%`, 면적 `65.12%`)입니다.
- 문제판·지시판·선택지는 각각 desktop `896.39×465.98`, `896.39×92`, `896.39×74px`, tablet `742.22×353.94`, `742.22×86`, `742.22×66px`이며 형제 교차는 `0px`입니다.
- 선택지 최소 크기는 desktop `210.09×56px`, tablet `172.55×52px`입니다. 신고 회귀 화면과 탐정 오답 증거 상태의 넘침·Stage 이탈·이미지 누락은 `0건`입니다.

## 2026-08-01 최종 보상 우선 재제작

- 문제 왼쪽 진행 보상을 만들기 전에 최종 보상부터 `result-tier-fullscene-native-v1` 독립 1280×800 장면 여섯 장으로 확정했습니다.
- 장면은 `비 내리는 폐탐정소 → 봄 수첩 캠프 → 초록빛 숲 보관소 → 파란 하늘 탐정기지 → 황금·진홍 해결궁 → 청록·자홍·보라 우주 본부`로 달라집니다.
- 최상위 두 단계는 황금·진홍과 청록·자홍·보라로 색 계열부터 구분했습니다. CSS 필터·블렌드·효과 오버레이는 0건입니다.
- 최종 결과 컨택시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-4/result-fullscene-v1/contact-sheets/result-tiers-v1-contact-sheet.png`
- 최종 결과 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-4/result-fullscene-v1/source`
- 최종 결과 승인 뒤 전용 768×1536 왼쪽 진행 장면 여섯 장을 새로 만들었습니다. 결과 크롭 재사용은 0건이고 런타임 표시는 모두 `object-fit: contain`입니다.
- 왼쪽 진행 컨택시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-4/play-progress-v1/contact-sheets/play-detective-progress-v1-contact-sheet.png`
- 왼쪽 기준선 시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-4/play-progress-v1/contact-sheets/play-detective-progress-v1-anchor-audit.png`
- 왼쪽 진행 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-4/play-progress-v1/source`
- 여우몬 선언 기준점은 `centerX 0.50`, `centerY 0.51~0.56`, `footY 0.58~0.64`, 높이 `0.16`이며 전신 잘림은 0건입니다.
- 왼쪽 패널은 Stage 기준 `left 1.65% / top 11% / width 19.2% / height 84%`입니다. 패널 네 변 오차 1px 이하와 학습 영역 교차 0px를 검사합니다.

## 현재 화면 증거

현재 `index.html`에서 시작·설명·문제·탐정 오답·정답 확인·닫힌 보상·열린 보상·결과 6단계를 6개 화면 크기로 다시 캡처했습니다. 현재 흐름 142장만 증거로 묶었습니다.

- 화면 크기 `1280×800 DPR1`: `screenshots/report-flow-desktop-contact-sheet.png`
- 화면 크기 `1024×768 DPR1`: `screenshots/report-flow-tablet-landscape-contact-sheet.png`
- 화면 크기 `1280×720 DPR2`: `screenshots/report-flow-codex-in-app-contact-sheet.png`
- 화면 크기 `994×632 DPR1`: `screenshots/report-flow-user-visibility-contact-sheet.png`
- 화면 크기 `1082×987 DPR2`: `screenshots/report-flow-user-reported-missing-left-progress-contact-sheet.png`
- 화면 크기 `1280×800 DPR1`, 빈 보상 사건: `screenshots/report-flow-empty-reward-fixture-contact-sheet.png`

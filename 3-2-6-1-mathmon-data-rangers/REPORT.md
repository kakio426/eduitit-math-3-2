# 매스몬 인구조사 제작 보고

검사일: 2026-08-01
최종 판정: **통과**
잔여 P0/P1: 없음

## 현재 화면 증거

현재 `index.html`에서 다시 만든 시작·설명·문제·보상·결과 화면입니다. 각 시트에는 문제 대기, 오답, 정답 확인, 닫힌/열린 보상과 결과 6단계가 함께 들어 있습니다.

- 화면 크기 `1280×800`: `screenshots/report-flow-desktop-contact-sheet.png`
- 화면 크기 `1024×768`: `screenshots/report-flow-tablet-landscape-contact-sheet.png`
- 화면 크기 `1280×720`, DPR 2: `screenshots/report-flow-codex-in-app-contact-sheet.png`
- 화면 크기 `994×632`: `screenshots/report-flow-user-visibility-contact-sheet.png`
- 사용자가 왼쪽 보상 누락을 확인한 화면 크기 `1082×987`, DPR 2: `screenshots/report-flow-user-reported-missing-left-progress-contact-sheet.png`
- 빈 보상 전용 화면 크기 `1280×800`: `screenshots/report-flow-empty-reward-fixture-contact-sheet.png`

## 구현 결과

- 좁은 2열 화면을 중앙 단일 작업판과 하단 선택지 구조로 교체했습니다.
- 문제는 10개이며 강조된 범주의 수가 4~12, 전체 자료 수가 12~24가 되도록 고정 seed 문제 은행을 구성했습니다.
- 모든 단계가 공통 `id`, `label`, `instruction`, `answer`, `answerChoiceId`, `choices`, `correctText`, `reveal`, `advance` 계약을 사용합니다.
- 정답 수는 엔진에서 문제당 한 번만 늘고, `applyReward()`는 `power`, `specialSeen` 패치만 반환합니다.
- 공용 보상 기준 `mathmon-unified-reward-v1`과 Stage-Reveal을 적용하고, 결과를 미리 보여 주지 않는 닫힌 상자 전용 이미지를 연결했습니다.
- 모델 검사는 차시당 고정 시드 64회, 640문제로 제한해 모든 오답 표지·피드백과 보상 경계값을 확인했습니다.
- 랭킹 UI와 네트워크 요청을 끄고 `base-pack`의 등록된 새끼용몬만 사용했습니다.

## Humanizer 학생 문구 QA

목표, 설명, 지시, 선택지, 오답, 정답 확인, 보상, 결과 문구를 전수 확인했습니다. `자료를 측정합니다` 같은 어른 말 대신 `딱지를 세어 표 칸에 넣어요`처럼 화면에서 바로 하는 행동으로 바꿨습니다. 한 문장에는 행동이나 이유 하나만 남겼습니다.

## 텍스트 넘침·요소 겹침 QA

- 화면: 1280×800 DPR1, 1024×768 DPR1, `unit6-reported-overlap-1024x768-dpr1`
- 상태: 표지, 설정, 설명 1·2, 대기, 작은 오답, 큰 오답, 정답 확인, 마지막 완성, 닫힌·열린 보상, 결과 6단계
- 자동 판정: 텍스트 overflow 0, 누락 이미지 0, 피드백·선택지 교차 0px, 작업판 이탈 0px
- 대기와 완료의 문제판·작업판 좌우 경계와 중심 차이: 모두 0px
- 공용 시작 버튼과 hitbox 차이: 1px 이하
- 공용 다시 버튼과 hitbox 차이: 1px 이하
- 설정 버튼: 실제 42×42px

## 실제 영역 측정

| 화면 | Stage | 문제판 | 중심 작업판 | 선택지 최소 |
| --- | ---: | ---: | ---: | ---: |
| 1280×800 | 1203.19×751.98 | 896.39×465.98 | 896.39×465.98 | 210.09×56 |
| 1024×768 | 983.06×614.41 | 742.22×353.94 | 742.22×353.94 | 173.05×52 |

왼쪽 진행 보상을 제외한 학습 작업 영역은 Stage 폭의 74.50%와 75.50%입니다. 문제판·지시판·선택지는 같은 오른쪽 작업 축을 쓰고 서로 겹치지 않습니다.

## 설정·자산·네트워크 QA

- 첫 토글 초점, Escape 닫기, Tab/Shift+Tab 순환, 설정 버튼 초점 복귀 통과
- 처음부터 확인·취소, 방법 복습 후 같은 문제 복귀 통과
- `mathmon-audio-bgm-enabled`, `mathmon-audio-sfx-enabled` 새로고침 저장 통과
- 현재 실행 WebP 37개 `decode()` 통과
- 닫힌·열린 보상에서 이미지·단계판·버튼 교차 0px, 닫힌 상자 PNG/WebP 512×512 확인
- 랭킹 관련 네트워크 요청 0건
- 보상 컨택시트 `reward-contact-sheet.png`
- 결과 컨택시트 `result-scenes-contact-sheet.png`
- 결과 제목 컨택시트 `result-titles-contact-sheet.png`

## 검증 명령

- `node scripts/build-lesson.mjs 3-2-6-1-mathmon-data-rangers` → PASS
- `node scripts/qa-unit6-data.mjs` → PASS
- `node scripts/qa-lesson-flow.mjs 3-2-6-1-mathmon-data-rangers` → PASS
- `node scripts/qa-unit6-browser.mjs 3-2-6-1-mathmon-data-rangers` → PASS

현재 코드에서 만든 스크린샷만 증거로 사용합니다. 이전 실행본은 `_archive/2026-07-23-pre-realignment/`에서 복구할 수 있습니다.

## 2026-07-31 최종 회귀

- `1280×800`, `1024×768`, 신고 회귀 화면 `1024×768 DPR1`에서 표지부터 결과까지 다시 캡처했습니다. 결과 6단계 모두 제목의 실제 불투명 픽셀과 막대 사이 여백 `8px 이상`, 동적 요소 교차 `0px`, 공통 축 편차 Stage 폭 `1.5% 이하`를 통과했습니다.
- 왼쪽 진행 보상 추가 뒤 문제 작업 영역은 Stage 폭 `74.5~75.5%`, 상단 글자 `16px`, 설정 hitbox `42×42px`이며 넘침·교차·이미지 누락·랭킹 요청은 `0건`입니다.

## 2026-08-01 현재 실측

- 작업영역은 1280×800에서 `896.39×661.98px`(Stage 폭 `74.50%`, 면적 `65.58%`), 1024×768에서 `742.22×529.94px`(Stage 폭 `75.50%`, 면적 `65.12%`)입니다.
- 문제판·지시판·선택지는 각각 desktop `896.39×465.98`, `896.39×92`, `896.39×74px`, tablet `742.22×353.94`, `742.22×86`, `742.22×66px`이며 형제 교차는 `0px`입니다.
- 선택지 최소 크기는 desktop `210.09×56px`, tablet 약 `173.05×52px`입니다. 신고 회귀 `1082×987 DPR2`에서도 작업영역 Stage 폭 `75.50%`, 넘침·Stage 이탈·이미지 누락은 `0건`입니다.

## 2026-08-01 최종 보상 우선 재제작·왼쪽 진행 보상 QA

- 최종 보상 6단계를 먼저 `result-tier-fullscene-native-v1` 기준의 독립 1280×800 생성 장면으로 확정했습니다. `비 오는 조사 천막 → 햇빛 마을 → 빛나는 숲 → 하늘 관측소 → 황금 연구실 → 무지개 우주 자료관`으로 환경·빛·보상물·캐릭터 반응이 함께 달라집니다.
- 최종 보상 컨택시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-1/result-fullscene-v1/contact-sheets/result-tiers-v1-contact-sheet.png`
- 왼쪽 진행 보상 컨택시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-1/play-progress-v1/contact-sheets/play-census-progress-v1-contact-sheet.png`
- 왼쪽 진행 보상 기준선 시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-1/play-progress-v1/contact-sheets/play-census-progress-v1-anchor-audit.png`
- 왼쪽 진행 보상 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-1/play-progress-v1/source`
- 최상위 두 단계는 황금 연구실과 무지개 우주 자료관으로 색 계열부터 다르며, CSS `filter`·`mix-blend-mode`·효과 오버레이 없이 장면 자체로 차이를 냅니다.
- 최종 장면 확정 뒤에만 전용 768×1536 왼쪽 진행 장면 6장을 제작했습니다. 최종 결과 이미지 크롭 재사용은 0건이며 모든 이미지는 `object-fit: contain`입니다.
- 새끼용몬 전신 기준점은 여섯 장에서 `centerX 0.50`, `centerY 0.53~0.54`, `footY 0.67~0.70`, 높이 `0.30~0.32`입니다. 발 기준선 최대 차이는 `0.03`이고 전신 잘림은 0건입니다.
- 왼쪽 패널은 Stage 기준 `left 1.65% / top 11% / width 19.2% / height 84%`로 고정했습니다. 실제 네 변 오차는 모든 검사 화면에서 1px 이하, 학습 영역과 가로 교차는 0px입니다.
- 현재 하네스 화면은 `1280×800`, `1024×768`, `1280×720 DPR2`, `994×632`, 신고 회귀 `1082×987 DPR2`, empty 보상 `1280×800`입니다. 문제 대기·오답·정답 확인·닫힌/열린 보상·결과 6단계에서 넘침·겹침·이미지 누락은 0건입니다.
- `empty` 고정 fixture에서 누적값 `47`은 유지되고 이번 변화만 `0`, 화면 문구는 `그대로`로 확인했습니다.
- 결과판 픽셀 검출 중심과 선언 축 차이는 전 단계 `0.5px 이하`, 동적 슬롯 네 변 오차는 `1px 이하`, 형제 교차는 0px입니다.
- Humanizer QA에서 학생용 보이는 문구와 진행 패널 `aria-label`을 다시 읽었습니다. `지금 모습`, `첫 조사표`, `자료 힘은 0이에요`처럼 짧고 바로 이해되는 말만 남겼습니다.

검증 결과:

- `build-lesson.mjs` PASS
- `check-lesson-contract.mjs` PASS
- `qa-lesson-flow.mjs` 6개 viewport PASS
- 현재 브라우저 스크린샷 156장 보관

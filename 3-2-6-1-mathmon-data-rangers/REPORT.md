# 매스몬 인구조사 제작 보고

검사일: 2026-07-23
최종 판정: **통과**
잔여 P0/P1: 없음

## 구현 결과

- 좁은 2열 화면을 중앙 단일 작업판과 하단 선택지 구조로 교체했습니다.
- 문제는 10개이며 강조된 범주의 수가 4~12, 전체 자료 수가 12~24가 되도록 고정 seed 문제 은행을 구성했습니다.
- 모든 단계가 공통 `id`, `label`, `instruction`, `answer`, `answerChoiceId`, `choices`, `correctText`, `reveal`, `advance` 계약을 사용합니다.
- 정답 수는 엔진에서 문제당 한 번만 늘고, `applyReward()`는 `power`, `specialSeen` 패치만 반환합니다.
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
| 1280×800 | 1203.19×751.98 | 1159.19×457.98 | 1040×384.05 | 275.80×56 |
| 1024×768 | 983.06×614.41 | 942.13×343.47 | 916.13×288.86 | 222.53×52 |

중심 작업판은 Stage 폭의 86.44%와 93.19%, Stage 면적의 44.14%와 43.81%입니다. 선택지 글씨는 24px와 20.48px, 지시문은 20.48px와 17.41px입니다.

## 설정·자산·네트워크 QA

- 첫 토글 초점, Escape 닫기, Tab/Shift+Tab 순환, 설정 버튼 초점 복귀 통과
- 처음부터 확인·취소, 방법 복습 후 같은 문제 복귀 통과
- `mathmon-audio-bgm-enabled`, `mathmon-audio-sfx-enabled` 새로고침 저장 통과
- 현재 실행 WebP 36개 `decode()` 통과
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

# 매스몬 분수 줄다리기 제작 보고

## 2026-08-23 공통 보상 정책 v2 검수

- 확률·점수·결과 기준은 `_shared/contracts/mathmon-unified-reward-v2.json`의 `mathmon-unified-reward-v2`를 단일 기준으로 사용합니다.
- 처음에 맞힌 문제는 `69% 보통 / 10% 작은 하락 / 12% 큰 보상 / 5% 대박 / 3.8% 그대로 / 0.2% 특별`입니다.
- 한 번이라도 틀린 문제는 정답 보상표를 다시 쓰지 않습니다. `50% 작은 감점 / 50% 그대로`만 나오며, 양수·대박·특별 보상은 나오지 않습니다.
- 따라서 오답은 정답보다 불리하지만 무조건 감점되지는 않습니다. 누적값을 지우는 `0으로 초기화`도 쓰지 않습니다.
- 1~4단원 17개 실행본을 대상으로 경계값 검사와 차시당 10만 회 확률 시뮬레이션을 통과했습니다. 아래 제작 이력에 남은 v1 명칭이나 예전 확률표는 현재 실행 기준이 아니며 이 절의 v2 기준으로 대체됩니다.


## 2026-08-22 최종 결과판 검은 마스크 제거

- 최종 장면에서 검은 사각형을 만들던 `result-bg-*-generated.webp` 6장과 별도 `result-panel-generated.webp` 덧대기를 실행 경로에서 제거했습니다.
- 자산 폴더에 이미 보존되어 있던 깨끗한 `result-{draw,smallwin,win,bigwin,champion,rainbow}-generated.webp` 6장을 결과 장면에 직접 연결했습니다. 호랑몬·환경·단계 제목·나무 결과판·`다시` 버튼은 한 장면 안에 있고, 점수·진행 막대·정답 수·다음 목표만 동적으로 표시합니다.
- 방어 규칙으로 `#resultPanelArt`를 항상 숨기고, 소스와 빌드본에 `resultPanel` 참조나 `result-bg-*` 결과 참조가 다시 들어오면 전용 QA가 실패하도록 고정했습니다.
- 사용자가 확인한 `934×987 DPR 2`를 `user-reported-result-double-panel` 회귀 화면으로 등록했습니다. 실제 버튼으로 10문제를 완주한 전설 단계에서 배경은 `1280×800`, 중복 결과판은 `hidden / display:none / 0×0`이고, 점수·`10/10`·안내·다시 버튼이 원래 결과판 안에 보입니다.
- 새 학생 문구나 새 생성 이미지는 만들지 않았습니다. 기존 고해상도 원본과 승인된 결과 컨택시트를 그대로 복원해 제목·캐릭터·색감이 바뀌지 않게 했습니다.

## 2026-08-22 완료 화면 막대 유지·간격 재조정

- 정답을 확인한 위 문제판에도 두 분수의 칸 막대를 남겼습니다. 위에서는 각 분수와 막대를 바로 연결해 보고, 아래에서는 두 길이를 같은 시작점에 포개어 차이를 확인합니다.
- 위 두 분수의 SVG 중심 간격을 `466 → 280` 단위로 약 `40%` 줄였습니다. `934×987 DPR 2` 실제 화면의 중심 간격은 `223.225px`, 막대 사이 간격은 `39.862px`입니다.
- 각 분수와 자기 막대의 가로 중심 오차는 좌우 모두 `0px`입니다. 분수 아래 막대까지의 세로 간격은 `8.445px`, 비교 기호와 막대의 세로 간격은 `10.918px`입니다.
- 아래 겹친 길이 그림은 `337.377×77.115px`, 그림과 버튼의 간격은 `30.901px`입니다. 그림 중심과 완료 상자 중심 차이는 `0px`, 버튼 중심 차이는 `0.003px`입니다.
- 위 칸 막대 `2개`와 아래 겹침 비교 `1개`가 모두 보이며, Stage·문제판·완료 상자 밖 넘침과 요소 교차는 `0건`입니다.
- 새 학생 문구는 만들지 않았습니다. 기존 정답·피드백 문구는 Humanizer 기준에서 짧고 자연스러워 그대로 유지했습니다.
- 등록된 `7`개 화면 크기에서 `223`개 현재 화면을 다시 캡처했고 `qa-lesson-flow.mjs`를 통과했습니다.

## 2026-08-22 완료 화면 겹친 길이 비교 보완

- 아래 완료 상자에 작게 반복되던 정답식은 화면에서 없애고 접근성용 `1×1px` 정보로만 남겼습니다. 완료 상자에서 실제로 보이는 문구는 `승부 보기` 하나입니다.
- 정답 확인 뒤에는 두 노란 길이를 같은 시작점에 포갭니다. 서로 다른 노란색, 분수 아래의 색상 키, 두 끝점 사이의 차이 표시를 더해 어느 쪽이 얼마나 긴지 바로 비교할 수 있게 했습니다.
- `934×987 DPR 2`의 `2분의 1`과 `4분의 1` 완료 상태를 실측했습니다. 시작점 차이는 `0px`, 실제 겹침 영역은 `83.710×20.728px`, 완료 버튼의 패널 중심 오차는 가로 `0.004px`, 세로 `0px`입니다.
- 대기·오답 상태의 칸으로 나눈 분수 막대를 유지했습니다. 후속 수정으로 정답 상태에도 위 막대를 남기고, 아래에는 겹친 길이 비교를 함께 보여 줍니다.
- 등록된 `7`개 화면 크기에서 시작·설명·문제·오답·정답·보상·결과 전체 흐름을 다시 캡처했으며 `qa-lesson-flow.mjs`를 통과했습니다.
- 새로 만든 학생 문구는 없습니다. 기존 정답 피드백은 짧고 자연스러워 Humanizer 기준에서 그대로 유지했습니다.

## 2026-08-22 보기 분수 정렬·비교판 간격 보완

- 보기의 쌓인 분수를 아래로 `8` SVG 단위 옮겼습니다. `934×987 DPR 2`에서 보이는 분수와 보기 카드의 가로 중심 차이는 `0px`, 세로 중심 차이는 `0.1px`이며 카드 밖 넘침은 `0건`입니다.
- 위 비교판의 분수 막대를 아래로 `12` SVG 단위 옮겼습니다. 같은 화면에서 분수 글리프와 막대 사이 간격은 좌우 모두 `5.256px`, 가로 중심 차이는 `0px`입니다.
- 대기 화면에서 아래 안내판과 뜻이 겹치던 `두 막대의 길이를 비교해요.` 문구는 비교판에서 제거했습니다. 오답·정답 뒤의 확인 문구는 유지했고 막대와의 최소 간격은 `18.173px`입니다.
- 등록된 `7`개 화면 크기에서 시작·설명·문제·오답·정답·보상·결과 전체 흐름을 다시 캡처했으며 `qa-lesson-flow.mjs`를 통과했습니다.
- 새로 만든 학생 문구는 없습니다. 남은 비교 지시와 정답·오답 피드백은 Humanizer 기준에서 짧고 자연스러워 그대로 유지했습니다.

## 2026-08-22 문제판·보기 위계와 왼쪽 상태판 회귀

- 위 문제판에 이미 있는 분수 막대를 보기에서 제거했습니다. 보기는 쌓인 분수만 남기고, `934×987 DPR 2`에서 보기 높이를 `132px`로 줄였습니다.
- 확보한 높이는 위 문제판에 배정했습니다. 같은 화면에서 문제판은 `275.72px`, 제목은 `39.23px`이며 문제판이 보기보다 두 배 이상 큽니다.
- 왼쪽 진행 패널은 그림과 상태판을 `minmax(0, 1fr) auto` 두 행으로 나눴습니다. 상태판은 `64.67px`이고 내부 `scrollHeight 63px = clientHeight 63px`이라 `지금 모습`, 결과 이름, 진행 막대가 잘리지 않습니다.
- 문제판→안내판→보기의 실제 간격은 각각 `8px`입니다. 분수 SVG의 위쪽 안전 여백과 단계 상승 효과의 왼쪽 진행 레인 격리도 함께 확인했습니다.
- 사용자가 댓글을 남긴 `934×987 DPR 2`를 영구 회귀 뷰포트로 등록했습니다. 총 `7`개 fixture, `223`개 현재 스크린샷에서 전체 흐름·보상·결과 6종을 다시 검사했고 넘침·겹침·Stage 이탈·이미지 누락은 모두 `0건`입니다.
- 학생 문구는 Humanizer 기준으로 다시 읽었습니다. 짧고 학년 수준에 맞아 의미를 바꾸는 문구 수정은 하지 않았습니다.

## 2026-08-09 보상 패널 효과·폭 회귀

- 일반 점수 상승은 `is-changing` 패널 플레어만 사용하고 Stage 임팩트는 쓰지 않으며, 표시 시간은 `640ms`입니다. 등급 상승은 `is-tier-up`·진행 장면 교체·Stage 폭 `32% 이상` 임팩트를 사용하고 `1560ms`(최소 읽기 시간 `1200ms`) 유지합니다.
- 왼쪽 진행 패널은 Stage 폭 `24.5%`(`23.4375~25.2%` 허용), 문제 작업 영역과 최소 간격 `1.5625%`로 데스크톱·태블릿에서 측정했습니다. 넘침·교차는 `0건`입니다.
- 현재 실행본에서 `qa-lesson-flow.mjs` 보상 fixture, `check-stage-ratio.mjs`, `check-lesson-contract.mjs`, 학생 보상 문구 브라우저 QA `176/176`을 통과했습니다.

## 2026-08-09 중간 보상 명칭 QA

- 보상 모달의 `이번 변화`·`줄 힘`을 `줄다리기 점수 +N/-N/0`으로 통일하고, 왼쪽 진행 그림의 접근성 문구도 같은 이름으로 맞췄습니다.
- Chrome `1280×800`, `1024×768`에서 보상 8상태를 전수 확인했습니다. 텍스트 넘침·요소 교차·Stage 이탈은 모두 0건입니다.
- 중앙 보상은 `unit3-modal-art-compact-v2`로 고정했습니다: 카드 `430×480px(43:48)`, Stage 최대 폭 `82%`, 이미지 `250×250px`. reward-only 브라우저 하네스에서 닫힘·열림 실제 rect를 확인했습니다.

## 2026-08-02 최종 보상 우선 재구축과 왼쪽 진행 보상 적용

- 먼저 최종 보상 6등급을 전부 새로 만들고 실제 결과 화면에서 확정한 뒤, 그 상승 흐름을 기준으로 문제 왼쪽 진행 보상 6장을 별도로 만들었습니다. 최종 결과 이미지를 잘라서 재사용한 장면은 `0장`입니다.
- 최종 결과는 `비 오는 빈 연습장 → 따뜻한 학교 운동장 → 협곡 다리 → 설산 정상 → 황금 챔피언 경기장 → 우주 무지개 신전`으로 바뀝니다. 배경·조명·호랑몬 반응·메달/깃발/트로피·색 계열이 인접 단계마다 두 가지 이상 달라지며, 상위 두 단계도 황금 왕실과 보라·청록 무지개 우주로 분리했습니다.
- 최종 보상 6장은 각각 `1280×800` 완성 장면입니다. 등급 제목과 `다시` 표면은 생성 이미지 안에 있고, 줄다리기 힘·막대·정답 수·다음 목표만 동적 슬롯으로 표시합니다. CSS 단계 필터·혼합 모드·결과 효과 오버레이는 사용하지 않습니다.
- 최종 보상 자산 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-4/result-fullscene-v1/contact-sheets/result-tiers-v4-contact-sheet.png`
- 최종 보상 브라우저 컨택시트: `screenshots/result-all-tiers-desktop-contact-sheet.png`, `screenshots/result-all-tiers-tablet-landscape-contact-sheet.png`
- 문제 왼쪽 진행 보상은 같은 여섯 환경을 `768×1536` 세로 전용 장면으로 다시 생성했습니다. 여섯 장 모두 호랑몬 전신 잘림 `0건`, 중심 `x=0.50`, 몸 중심 `y=0.56~0.57`, 발 기준선 `y=0.69~0.70`, 보이는 몸 높이 `0.30~0.31`입니다.
- 왼쪽 자산 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-4/play-progress-v1/contact-sheets/play-tug-progress-v1-contact-sheet.png`
- 왼쪽 생성 원본: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-4/play-progress-v1/source`
- 왼쪽 기준선 검사: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-4/play-progress-v1/contact-sheets/play-tug-progress-v1-anchor-audit.png`
- 왼쪽 패널은 `stage-left-play-progress-v1`로 Stage 기준 `left 1.65% / top 11% / width 24.5% / height 84%`에 고정했습니다. 모든 화면 크기에서 네 변 오차는 `1px` 이하, 학습 영역 교차는 `0px`, 이미지와 패널 중심 차이는 `1px` 이하입니다.
- 모달이 완전히 닫힌 뒤 `320ms`를 기다리고, 단계 이미지 교체와 Stage 폭 `35%`의 전용 충격 효과를 `1560ms` 보여 준 다음에만 다음 문제로 이동합니다. 고정 `무승부 → 아슬아슬 승리` fixture로 이미지 변경·모달 선행 닫힘·문제 번호 고정을 검사했습니다.
- `empty` fixture에서는 누적 줄다리기 힘을 유지하고 이번 변화만 `0`으로 처리했습니다.

### 현재 화면 증거와 화면 크기

- 시작·설정·설명·문제 대기·대표 오답 2종·정답 확인·닫힌 보상·열린 보상·단계 상승 효과·결과 6등급을 현재 `index.html` 해시 기준으로 다시 캡처했습니다.
- `1280×800`: `screenshots/report-flow-desktop-contact-sheet.png`
- `1024×768`: `screenshots/report-flow-tablet-landscape-contact-sheet.png`
- `1280×720`, DPR 2: `screenshots/report-flow-codex-in-app-contact-sheet.png`
- `994×632`: `screenshots/report-flow-user-visibility-contact-sheet.png`
- 사용자가 왼쪽 보상 누락을 확인한 회귀 화면 `1082×987`, DPR 2: `screenshots/report-flow-user-reported-missing-left-progress-contact-sheet.png`
- 문제판·보기 위계와 상태판 잘림을 확인한 브라우저 댓글 화면 `934×987`, DPR 2: `screenshots/report-flow-browser-comment-choice-hierarchy-and-progress-contact-sheet.png`
- 최종 결과판 검은 마스크와 중복 판을 확인한 회귀 화면 `934×987`, DPR 2: `screenshots/report-flow-user-reported-result-double-panel-contact-sheet.png`
- 빈 보상 전용 `1280×800`: `screenshots/report-flow-empty-reward-fixture-contact-sheet.png`
- 총 `8`개 fixture, `255`개 현재 스크린샷이며 텍스트 넘침·요소 겹침·Stage 이탈·이미지 누락은 모두 `0건`입니다.

### Humanizer 학생 문구 QA

- 왼쪽 패널 이름은 제작 용어인 `진행 보상`, `등급`, `단계`를 쓰지 않고 `지금 모습`으로 표시했습니다.
- 결과 이름 `무승부`, `아슬아슬 승리`, `승리`, `큰 승리`, `챔피언`, `전설의 승리`는 화면의 변화와 바로 연결되고, 한 패널 안에서 같은 뜻을 반복하지 않습니다.

## 2026-07-28 전체 점검 수정 결과

- 결과 6단계를 글자·버튼 없는 생성 배경, 투명 생성 제목, 동적 줄다리기 힘·정답 수·다음 목표, 투명 생성 `다시` 버튼으로 분리했습니다.
- 결과 제목·줄다리기 힘·정답 수·다음 목표·버튼을 게시판의 한 세로축에 맞췄습니다.
- 결과 이름은 `아슬아슬 승리`, `큰 승리`, `전설의 승리`로 다듬고, 마지막 안내는 `마지막 승부 결과`처럼 자연스럽게 고쳤습니다.
- `1280×800`, `1024×768`에서 결과 6단계를 모두 검사했습니다. 축 오차는 Stage 폭의 1.5% 이하, 요소 교차·Stage 이탈·누락 이미지는 0건, 버튼 아트와 hitbox 경계 차이는 1px 이하입니다.
- 최신 배경 컨택시트는 `result-tiers-v3-contact-sheet.png`, 제목 컨택시트는 `result-titles-v3-contact-sheet.png`입니다.

## 2026-07-23 V2 보완 결과

- 공용 시작 버튼 `../_shared/mathmon/cover-start-button/start-button-generated.webp`만 사용합니다.
- 커버는 `shared-canonical-v1`, 표시 크기 `360×152px`, 작은 화면 최소 `300×127px`, 비율 `1611:680` 계약을 따릅니다.
- 문제 화면 상단은 왼쪽 `에듀잇티 수학 게임`, 가운데 `N/10`, 오른쪽 `4단원 분수`, 설정 버튼 순서로 고정했습니다.
- 줄다리기 선물 상자와 보상 6종을 `closed + 6 events` 7장 상태 세트로 연결했습니다.
- 작은 분수를 고른 오답 상태에서도 학생이 고른 막대와 실제 큰 막대, `<` 관계를 바로 확인하도록 고쳤습니다.
- 결과 등급 6장과 문제 은행, 보상 확률, 랭킹 비활성화 정책은 유지했습니다.
- 사용 매스몬 팩은 정식 승인된 `diversity-reward-pack`이며 주인공은 호랑몬입니다. 호랑몬 manifest에 4차시 커버·설명·보상·결과 사용처를 기록했습니다.

## 생성 이미지와 상태 세트

- 닫힌 보상 런타임: `reward-event-closed-generated.webp`, `512×512`
- 보상 상태: `closed`, `normal`, `loss`, `mega`, `perfect`, `empty`, `rainbow`
- 보상 컨택시트: `reward-events-v3-contact-sheet.png`
- 결과 배경 6장 컨택시트: `result-tiers-v3-contact-sheet.png`
- 결과 제목 6장 컨택시트: `result-titles-v3-contact-sheet.png`
- 닫힌 보상에는 글자·숫자·결과 등급·버튼이 없습니다.
- 차시별 시작 버튼 원본·PNG·WebP는 제거했으며 공용 자산을 복제하거나 변형하지 않았습니다.

## 학습 조작과 입력 통계

- 한 문제의 수학적 판단은 `더 큰 분수 하나 고르기` 1회입니다.
- 정답 경로의 물리 입력은 선택 1회, 확인과 이동을 포함해 4탭입니다.
- 문제 은행 전체 통계는 수학적 판단 `최소 1 / 중앙값 1 / 평균 1 / 최대 1`, 물리 입력 `최소 4 / 중앙값 4 / 평균 4 / 최대 4`입니다.
- 대표 오답은 `분모가 같은데 작은 분수를 고른 상태`와 `단위분수에서 작은 분수를 고른 상태`를 각각 막대 길이와 `<` 관계로 확인합니다.

## 브라우저 실측

`scripts/qa-lesson-flow.mjs`로 10문제를 완주했습니다. 아래 값은 현재 코드에서 측정한 `getBoundingClientRect()` 기준입니다.

| 화면 | Stage | 작업 영역 | Stage 폭 비율 | Stage 면적 비율 | 1순위 선택지 | 2순위 문제판 |
| --- | --- | --- | ---: | ---: | --- | --- |
| 1280×800 | 1203.19×751.98 | 1082.88×661.98 | 90.00% | 79.23% | 1082.88×310, 37.10% | 1082.88×281.98, 33.75% |
| 1024×768 | 983.06×614.41 | 884.78×525.94 | 90.00% | 77.04% | 884.78×310, 45.41% | 884.78×145.94, 21.38% |

- 선택지 최소 크기: 데스크톱 `534.94×310px`, 태블릿 `435.89×310px`
- 설정 버튼: 두 화면 모두 `42×42px`, 톱니 아이콘 `20×20px`
- 실제 글자 크기: 상단 라벨 `14.4px`, 문제 제목 최소 `34.82px`, 지시문 최소 `15.87px`, 선택지 최소 `20.48px`
- 상단 행과 문제판 최소 간격 `6px`, 문제판·지시문·선택지 사이 간격 `8px`
- 터치 영역: 모든 조작 `42×42px` 이상
- 정답 대기 → 확인 상태 중심축 차이: `0px`이며 허용값 `1px` 이하
- 브랜드·진행 수·단원·설정 버튼 교차: `0px`
- 텍스트 넘침, 요소 교차, Stage 이탈, 이미지 로드 실패: 모두 `0건`
- 시작 버튼 아트와 hitbox의 너비·높이·중심 차이: 모두 `1px` 이하

## 상태별 최신 증거

- 화면 크기: `1280×800`, `1024×768`
- 상태: 커버, 설정 모달, 설명 1·2, 문제 대기, 오답 2종, 정답 확인, 마지막 확인, 닫힌 보상, 열린 보상, 결과 6등급
- 현재 증거: `screenshots/engine-flow-desktop-*`, `screenshots/engine-flow-tablet-landscape-*`
- 결과 6등급: `screenshots/engine-flow-*-08a-result-*.png`
- 이전 증거: `screenshots/_archive/2026-07-12-pre-v2/`
- 랭킹 UI·API 요청, 콘솔 오류, 실패 응답: 모두 `0건`

## 검사 결과

- `node scripts/qa-engine-unit4-tug-source.mjs` 통과
- 대상 lesson build, lesson contract, visual contract V2, Stage ratio 검사 통과
- `node scripts/check-run-randomness.mjs` 통과
- `node scripts/check-ranking-disabled.mjs` 통과
- `node scripts/qa-lesson-flow.mjs 3-2-4-4-mathmon-fraction-tug` 양쪽 화면 10문제 완주 통과

## Humanizer 학생 문구 QA

학생 문구는 `색칠된 칸이 많은 쪽이 더 커요.`, `똑같이 나눈 한 칸이 긴 쪽이 더 커요.`, `고른 막대가 더 짧아요.`처럼 비교 기준 하나만 담았습니다. 제작자 용어와 같은 뜻의 반복 문구는 학생 화면에 남기지 않았습니다.

문제 지시는 `두 분수 중 더 큰 것을 골라요.`로 짧게 유지하고, 정답 확인·접근성 이름은 `/` 대신 `8분의 3`처럼 읽는 말로 표시합니다. 보이는 쌓인 분수와 학생 문구의 표현이 어긋나지 않는지 문제 은행 전체를 소스 QA로 검사합니다.

## 2026-07-31 최종 회귀

- 현재 소스 재빌드 뒤 `1280×800`, `1024×768` 전체 흐름과 결과 6단계를 다시 캡처했습니다. 글자 넘침·요소 겹침·Stage 이탈·이미지 누락은 `0건`입니다.
- 문제·정답 확인·완성 문구의 숫자 `/` 분수 표기 `0건`을 전용 source QA로 고정했습니다.

## 2026-08-01 Kiro 6차 차단 항목 회귀

- 질문·줄·분수 막대를 밝고 불투명한 문제판 안에 두고, 선택지는 불투명한 `#f5fdff` 표면으로 고정했습니다.
- 정답 확인은 분자에 맞는 `이/가` 조사를 사용합니다.
- 선택지 접근성 이름도 `4분의 1`처럼 읽는 말만 사용하며 `/` 표기는 없습니다. 소스 QA가 두 선택지의 `aria-label`을 전수 검사합니다.
- `empty` 사건은 누적 줄다리기 힘을 유지하며, 누적값 `47` 브라우저 fixture를 통과했습니다.

## 2026-08-01 Kiro 8차 심층 회귀

- 대기부터 왼쪽·오른쪽의 실제 분수와 막대를 모두 보여 줍니다. 정답·오답 확인에서도 원래 피연산자 순서를 바꾸지 않고, 정답 부호만 원래 왼쪽/오른쪽 값으로 계산합니다.
- 완료판은 `#e2f7fc` 불투명 표면입니다. 소스 QA가 `larger` 우선 재배치가 되돌아오지 않는지와 문제판·선택지·완료판의 실색을 검사합니다.

## 결과판 내부 결속 이력 (2026-08-03, 2026-08-22 정리)

- 2026-08-03에는 결과판을 별도 래스터 레이어로 덧대는 이관 구성을 사용했습니다. 이 구성이 검은 마스크와 덧댄 판을 함께 노출하므로 2026-08-22에 종료했습니다.
- 현재는 단계별 완성 장면의 실제 픽셀에서 남색 결과판 중심을 검출하고, 점수·막대·정답 수·다음 목표·다시 hitbox가 단계별 중심축을 따르는지 검사합니다.
- 별도 `.result-panel-art`는 학생 화면에서 항상 숨김 상태이며, 깨끗한 완성 장면과 중복될 수 없습니다.

<!-- REPORT-EVIDENCE-ALL:START -->

## 2026-08-29 최신 원본 스크린샷 전수

- 실행본 SHA-256: `04f997c9b929660fb03eb30cfea86aeac2b0767a9327fcba8cc62f79e1c213cb`
- 생성 시각: `2026-08-29T10:30:34.676Z`
- 등록 회귀 이름: `9개`
- 실제 실행 화면 조건: `7개`
- 동일 조건 별칭 통합: `2개`
- 아래에 직접 삽입한 원본 캡처: `195장`
- 같은 width×height×DPR과 같은 fixture 조건은 한 번만 실행하고, 과거 오류 이름은 별칭으로 보존했습니다.
- manifest에 기록된 실제 실행 원본 캡처를 한 장씩 연결했습니다.

### desktop · 1280×800 · DPR 1 · 32장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `full-flow`

![desktop 전체 상태 컨택시트](screenshots/report-flow-desktop-contact-sheet.png)

#### 시작 화면 · `engine-flow-desktop-01-cover.png`

![desktop 시작 화면](screenshots/engine-flow-desktop-01-cover.png)

- 학생이 보는 것: 매스몬 분수 줄다리기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-desktop-02-settings.png`

![desktop 설정 화면](screenshots/engine-flow-desktop-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-desktop-03-tutorial-1.png`

![desktop 설명 1 · 풀이 방법](screenshots/engine-flow-desktop-03-tutorial-1.png)

- 학생이 보는 것: 분모가 같은 분수와 단위분수 비교하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-desktop-04-tutorial-2.png`

![desktop 설명 2 · 보상과 목표](screenshots/engine-flow-desktop-04-tutorial-2.png)

- 학생이 보는 것: 분모가 같은 분수와 단위분수 비교하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-desktop-05-play-step1.png`

![desktop 문제 상태 · 05-play-step1](screenshots/engine-flow-desktop-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-desktop-05n-next-problem-clean.png`

![desktop 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-desktop-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-compare-unit-fraction-smaller · `engine-flow-desktop-05m-p1-compare-unit-fraction-smaller.png`

![desktop 오개념 확인 · p1-compare-unit-fraction-smaller](screenshots/engine-flow-desktop-05m-p1-compare-unit-fraction-smaller.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-compare-same-denominator-smaller · `engine-flow-desktop-05m-p2-compare-same-denominator-smaller.png`

![desktop 오개념 확인 · p2-compare-same-denominator-smaller](screenshots/engine-flow-desktop-05m-p2-compare-same-denominator-smaller.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-desktop-05b-play-wrong.png`

![desktop 오답 확인 · 05b-play-wrong](screenshots/engine-flow-desktop-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-desktop-06-confirm.png`

![desktop 마지막 확인 · 06-confirm](screenshots/engine-flow-desktop-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-desktop-07-reward-closed.png`

![desktop 닫힌 보상](screenshots/engine-flow-desktop-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 줄다리기 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-desktop-07b-reward-open.png`

![desktop 열린 보상](screenshots/engine-flow-desktop-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 줄다리기 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-desktop-07c-reward-impact.png`

![desktop 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-desktop-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 줄다리기 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-desktop-08-result.png`

![desktop 실제 결과](screenshots/engine-flow-desktop-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · draw · `engine-flow-desktop-08a-result-draw.png`

![desktop 결과 단계 · draw](screenshots/engine-flow-desktop-08a-result-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · bigwin · `engine-flow-desktop-08c-result-cohesion-bigwin.png`

![desktop 결과 결속 · bigwin](screenshots/engine-flow-desktop-08c-result-cohesion-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · champion · `engine-flow-desktop-08c-result-cohesion-champion.png`

![desktop 결과 결속 · champion](screenshots/engine-flow-desktop-08c-result-cohesion-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · draw · `engine-flow-desktop-08c-result-cohesion-draw.png`

![desktop 결과 결속 · draw](screenshots/engine-flow-desktop-08c-result-cohesion-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · rainbow · `engine-flow-desktop-08c-result-cohesion-rainbow.png`

![desktop 결과 결속 · rainbow](screenshots/engine-flow-desktop-08c-result-cohesion-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · smallwin · `engine-flow-desktop-08c-result-cohesion-smallwin.png`

![desktop 결과 결속 · smallwin](screenshots/engine-flow-desktop-08c-result-cohesion-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · win · `engine-flow-desktop-08c-result-cohesion-win.png`

![desktop 결과 결속 · win](screenshots/engine-flow-desktop-08c-result-cohesion-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-bigwin · `engine-flow-desktop-08v-result-visual-integrity-bigwin.png`

![desktop 결과 상태 · 08v-result-visual-integrity-bigwin](screenshots/engine-flow-desktop-08v-result-visual-integrity-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-champion · `engine-flow-desktop-08v-result-visual-integrity-champion.png`

![desktop 결과 상태 · 08v-result-visual-integrity-champion](screenshots/engine-flow-desktop-08v-result-visual-integrity-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-draw · `engine-flow-desktop-08v-result-visual-integrity-draw.png`

![desktop 결과 상태 · 08v-result-visual-integrity-draw](screenshots/engine-flow-desktop-08v-result-visual-integrity-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-rainbow · `engine-flow-desktop-08v-result-visual-integrity-rainbow.png`

![desktop 결과 상태 · 08v-result-visual-integrity-rainbow](screenshots/engine-flow-desktop-08v-result-visual-integrity-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-smallwin · `engine-flow-desktop-08v-result-visual-integrity-smallwin.png`

![desktop 결과 상태 · 08v-result-visual-integrity-smallwin](screenshots/engine-flow-desktop-08v-result-visual-integrity-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-win · `engine-flow-desktop-08v-result-visual-integrity-win.png`

![desktop 결과 상태 · 08v-result-visual-integrity-win](screenshots/engine-flow-desktop-08v-result-visual-integrity-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · smallwin · `engine-flow-desktop-08a-result-smallwin.png`

![desktop 결과 단계 · smallwin](screenshots/engine-flow-desktop-08a-result-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · win · `engine-flow-desktop-08a-result-win.png`

![desktop 결과 단계 · win](screenshots/engine-flow-desktop-08a-result-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bigwin · `engine-flow-desktop-08a-result-bigwin.png`

![desktop 결과 단계 · bigwin](screenshots/engine-flow-desktop-08a-result-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · champion · `engine-flow-desktop-08a-result-champion.png`

![desktop 결과 단계 · champion](screenshots/engine-flow-desktop-08a-result-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-desktop-08a-result-rainbow.png`

![desktop 결과 단계 · rainbow](screenshots/engine-flow-desktop-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### tablet-landscape · 1024×768 · DPR 1 · 32장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `full-flow`

![tablet-landscape 전체 상태 컨택시트](screenshots/report-flow-tablet-landscape-contact-sheet.png)

#### 시작 화면 · `engine-flow-tablet-landscape-01-cover.png`

![tablet-landscape 시작 화면](screenshots/engine-flow-tablet-landscape-01-cover.png)

- 학생이 보는 것: 매스몬 분수 줄다리기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-tablet-landscape-02-settings.png`

![tablet-landscape 설정 화면](screenshots/engine-flow-tablet-landscape-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-tablet-landscape-03-tutorial-1.png`

![tablet-landscape 설명 1 · 풀이 방법](screenshots/engine-flow-tablet-landscape-03-tutorial-1.png)

- 학생이 보는 것: 분모가 같은 분수와 단위분수 비교하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-tablet-landscape-04-tutorial-2.png`

![tablet-landscape 설명 2 · 보상과 목표](screenshots/engine-flow-tablet-landscape-04-tutorial-2.png)

- 학생이 보는 것: 분모가 같은 분수와 단위분수 비교하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-tablet-landscape-05-play-step1.png`

![tablet-landscape 문제 상태 · 05-play-step1](screenshots/engine-flow-tablet-landscape-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-tablet-landscape-05n-next-problem-clean.png`

![tablet-landscape 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-tablet-landscape-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-compare-unit-fraction-smaller · `engine-flow-tablet-landscape-05m-p1-compare-unit-fraction-smaller.png`

![tablet-landscape 오개념 확인 · p1-compare-unit-fraction-smaller](screenshots/engine-flow-tablet-landscape-05m-p1-compare-unit-fraction-smaller.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-compare-same-denominator-smaller · `engine-flow-tablet-landscape-05m-p2-compare-same-denominator-smaller.png`

![tablet-landscape 오개념 확인 · p2-compare-same-denominator-smaller](screenshots/engine-flow-tablet-landscape-05m-p2-compare-same-denominator-smaller.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-tablet-landscape-05b-play-wrong.png`

![tablet-landscape 오답 확인 · 05b-play-wrong](screenshots/engine-flow-tablet-landscape-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-tablet-landscape-06-confirm.png`

![tablet-landscape 마지막 확인 · 06-confirm](screenshots/engine-flow-tablet-landscape-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-tablet-landscape-07-reward-closed.png`

![tablet-landscape 닫힌 보상](screenshots/engine-flow-tablet-landscape-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 줄다리기 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-tablet-landscape-07b-reward-open.png`

![tablet-landscape 열린 보상](screenshots/engine-flow-tablet-landscape-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 줄다리기 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-tablet-landscape-07c-reward-impact.png`

![tablet-landscape 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-tablet-landscape-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 줄다리기 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-tablet-landscape-08-result.png`

![tablet-landscape 실제 결과](screenshots/engine-flow-tablet-landscape-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · draw · `engine-flow-tablet-landscape-08a-result-draw.png`

![tablet-landscape 결과 단계 · draw](screenshots/engine-flow-tablet-landscape-08a-result-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · bigwin · `engine-flow-tablet-landscape-08c-result-cohesion-bigwin.png`

![tablet-landscape 결과 결속 · bigwin](screenshots/engine-flow-tablet-landscape-08c-result-cohesion-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · champion · `engine-flow-tablet-landscape-08c-result-cohesion-champion.png`

![tablet-landscape 결과 결속 · champion](screenshots/engine-flow-tablet-landscape-08c-result-cohesion-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · draw · `engine-flow-tablet-landscape-08c-result-cohesion-draw.png`

![tablet-landscape 결과 결속 · draw](screenshots/engine-flow-tablet-landscape-08c-result-cohesion-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · rainbow · `engine-flow-tablet-landscape-08c-result-cohesion-rainbow.png`

![tablet-landscape 결과 결속 · rainbow](screenshots/engine-flow-tablet-landscape-08c-result-cohesion-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · smallwin · `engine-flow-tablet-landscape-08c-result-cohesion-smallwin.png`

![tablet-landscape 결과 결속 · smallwin](screenshots/engine-flow-tablet-landscape-08c-result-cohesion-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · win · `engine-flow-tablet-landscape-08c-result-cohesion-win.png`

![tablet-landscape 결과 결속 · win](screenshots/engine-flow-tablet-landscape-08c-result-cohesion-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-bigwin · `engine-flow-tablet-landscape-08v-result-visual-integrity-bigwin.png`

![tablet-landscape 결과 상태 · 08v-result-visual-integrity-bigwin](screenshots/engine-flow-tablet-landscape-08v-result-visual-integrity-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-champion · `engine-flow-tablet-landscape-08v-result-visual-integrity-champion.png`

![tablet-landscape 결과 상태 · 08v-result-visual-integrity-champion](screenshots/engine-flow-tablet-landscape-08v-result-visual-integrity-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-draw · `engine-flow-tablet-landscape-08v-result-visual-integrity-draw.png`

![tablet-landscape 결과 상태 · 08v-result-visual-integrity-draw](screenshots/engine-flow-tablet-landscape-08v-result-visual-integrity-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-rainbow · `engine-flow-tablet-landscape-08v-result-visual-integrity-rainbow.png`

![tablet-landscape 결과 상태 · 08v-result-visual-integrity-rainbow](screenshots/engine-flow-tablet-landscape-08v-result-visual-integrity-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-smallwin · `engine-flow-tablet-landscape-08v-result-visual-integrity-smallwin.png`

![tablet-landscape 결과 상태 · 08v-result-visual-integrity-smallwin](screenshots/engine-flow-tablet-landscape-08v-result-visual-integrity-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-win · `engine-flow-tablet-landscape-08v-result-visual-integrity-win.png`

![tablet-landscape 결과 상태 · 08v-result-visual-integrity-win](screenshots/engine-flow-tablet-landscape-08v-result-visual-integrity-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · smallwin · `engine-flow-tablet-landscape-08a-result-smallwin.png`

![tablet-landscape 결과 단계 · smallwin](screenshots/engine-flow-tablet-landscape-08a-result-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · win · `engine-flow-tablet-landscape-08a-result-win.png`

![tablet-landscape 결과 단계 · win](screenshots/engine-flow-tablet-landscape-08a-result-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bigwin · `engine-flow-tablet-landscape-08a-result-bigwin.png`

![tablet-landscape 결과 단계 · bigwin](screenshots/engine-flow-tablet-landscape-08a-result-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · champion · `engine-flow-tablet-landscape-08a-result-champion.png`

![tablet-landscape 결과 단계 · champion](screenshots/engine-flow-tablet-landscape-08a-result-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-tablet-landscape-08a-result-rainbow.png`

![tablet-landscape 결과 단계 · rainbow](screenshots/engine-flow-tablet-landscape-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### codex-in-app · 1280×720 · DPR 2 · 32장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `full-flow`

![codex-in-app 전체 상태 컨택시트](screenshots/report-flow-codex-in-app-contact-sheet.png)

#### 시작 화면 · `engine-flow-codex-in-app-01-cover.png`

![codex-in-app 시작 화면](screenshots/engine-flow-codex-in-app-01-cover.png)

- 학생이 보는 것: 매스몬 분수 줄다리기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-codex-in-app-02-settings.png`

![codex-in-app 설정 화면](screenshots/engine-flow-codex-in-app-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-codex-in-app-03-tutorial-1.png`

![codex-in-app 설명 1 · 풀이 방법](screenshots/engine-flow-codex-in-app-03-tutorial-1.png)

- 학생이 보는 것: 분모가 같은 분수와 단위분수 비교하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-codex-in-app-04-tutorial-2.png`

![codex-in-app 설명 2 · 보상과 목표](screenshots/engine-flow-codex-in-app-04-tutorial-2.png)

- 학생이 보는 것: 분모가 같은 분수와 단위분수 비교하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-codex-in-app-05-play-step1.png`

![codex-in-app 문제 상태 · 05-play-step1](screenshots/engine-flow-codex-in-app-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-codex-in-app-05n-next-problem-clean.png`

![codex-in-app 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-codex-in-app-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-compare-unit-fraction-smaller · `engine-flow-codex-in-app-05m-p1-compare-unit-fraction-smaller.png`

![codex-in-app 오개념 확인 · p1-compare-unit-fraction-smaller](screenshots/engine-flow-codex-in-app-05m-p1-compare-unit-fraction-smaller.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-compare-same-denominator-smaller · `engine-flow-codex-in-app-05m-p2-compare-same-denominator-smaller.png`

![codex-in-app 오개념 확인 · p2-compare-same-denominator-smaller](screenshots/engine-flow-codex-in-app-05m-p2-compare-same-denominator-smaller.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-codex-in-app-05b-play-wrong.png`

![codex-in-app 오답 확인 · 05b-play-wrong](screenshots/engine-flow-codex-in-app-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-codex-in-app-06-confirm.png`

![codex-in-app 마지막 확인 · 06-confirm](screenshots/engine-flow-codex-in-app-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-codex-in-app-07-reward-closed.png`

![codex-in-app 닫힌 보상](screenshots/engine-flow-codex-in-app-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 줄다리기 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-codex-in-app-07b-reward-open.png`

![codex-in-app 열린 보상](screenshots/engine-flow-codex-in-app-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 줄다리기 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-codex-in-app-07c-reward-impact.png`

![codex-in-app 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-codex-in-app-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 줄다리기 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-codex-in-app-08-result.png`

![codex-in-app 실제 결과](screenshots/engine-flow-codex-in-app-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · draw · `engine-flow-codex-in-app-08a-result-draw.png`

![codex-in-app 결과 단계 · draw](screenshots/engine-flow-codex-in-app-08a-result-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · bigwin · `engine-flow-codex-in-app-08c-result-cohesion-bigwin.png`

![codex-in-app 결과 결속 · bigwin](screenshots/engine-flow-codex-in-app-08c-result-cohesion-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · champion · `engine-flow-codex-in-app-08c-result-cohesion-champion.png`

![codex-in-app 결과 결속 · champion](screenshots/engine-flow-codex-in-app-08c-result-cohesion-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · draw · `engine-flow-codex-in-app-08c-result-cohesion-draw.png`

![codex-in-app 결과 결속 · draw](screenshots/engine-flow-codex-in-app-08c-result-cohesion-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · rainbow · `engine-flow-codex-in-app-08c-result-cohesion-rainbow.png`

![codex-in-app 결과 결속 · rainbow](screenshots/engine-flow-codex-in-app-08c-result-cohesion-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · smallwin · `engine-flow-codex-in-app-08c-result-cohesion-smallwin.png`

![codex-in-app 결과 결속 · smallwin](screenshots/engine-flow-codex-in-app-08c-result-cohesion-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · win · `engine-flow-codex-in-app-08c-result-cohesion-win.png`

![codex-in-app 결과 결속 · win](screenshots/engine-flow-codex-in-app-08c-result-cohesion-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-bigwin · `engine-flow-codex-in-app-08v-result-visual-integrity-bigwin.png`

![codex-in-app 결과 상태 · 08v-result-visual-integrity-bigwin](screenshots/engine-flow-codex-in-app-08v-result-visual-integrity-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-champion · `engine-flow-codex-in-app-08v-result-visual-integrity-champion.png`

![codex-in-app 결과 상태 · 08v-result-visual-integrity-champion](screenshots/engine-flow-codex-in-app-08v-result-visual-integrity-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-draw · `engine-flow-codex-in-app-08v-result-visual-integrity-draw.png`

![codex-in-app 결과 상태 · 08v-result-visual-integrity-draw](screenshots/engine-flow-codex-in-app-08v-result-visual-integrity-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-rainbow · `engine-flow-codex-in-app-08v-result-visual-integrity-rainbow.png`

![codex-in-app 결과 상태 · 08v-result-visual-integrity-rainbow](screenshots/engine-flow-codex-in-app-08v-result-visual-integrity-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-smallwin · `engine-flow-codex-in-app-08v-result-visual-integrity-smallwin.png`

![codex-in-app 결과 상태 · 08v-result-visual-integrity-smallwin](screenshots/engine-flow-codex-in-app-08v-result-visual-integrity-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-win · `engine-flow-codex-in-app-08v-result-visual-integrity-win.png`

![codex-in-app 결과 상태 · 08v-result-visual-integrity-win](screenshots/engine-flow-codex-in-app-08v-result-visual-integrity-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · smallwin · `engine-flow-codex-in-app-08a-result-smallwin.png`

![codex-in-app 결과 단계 · smallwin](screenshots/engine-flow-codex-in-app-08a-result-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · win · `engine-flow-codex-in-app-08a-result-win.png`

![codex-in-app 결과 단계 · win](screenshots/engine-flow-codex-in-app-08a-result-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bigwin · `engine-flow-codex-in-app-08a-result-bigwin.png`

![codex-in-app 결과 단계 · bigwin](screenshots/engine-flow-codex-in-app-08a-result-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · champion · `engine-flow-codex-in-app-08a-result-champion.png`

![codex-in-app 결과 단계 · champion](screenshots/engine-flow-codex-in-app-08a-result-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-codex-in-app-08a-result-rainbow.png`

![codex-in-app 결과 단계 · rainbow](screenshots/engine-flow-codex-in-app-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### user-visibility · 994×632 · DPR 1 · 32장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `full-flow`

![user-visibility 전체 상태 컨택시트](screenshots/report-flow-user-visibility-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-visibility-01-cover.png`

![user-visibility 시작 화면](screenshots/engine-flow-user-visibility-01-cover.png)

- 학생이 보는 것: 매스몬 분수 줄다리기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-visibility-02-settings.png`

![user-visibility 설정 화면](screenshots/engine-flow-user-visibility-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-visibility-03-tutorial-1.png`

![user-visibility 설명 1 · 풀이 방법](screenshots/engine-flow-user-visibility-03-tutorial-1.png)

- 학생이 보는 것: 분모가 같은 분수와 단위분수 비교하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-visibility-04-tutorial-2.png`

![user-visibility 설명 2 · 보상과 목표](screenshots/engine-flow-user-visibility-04-tutorial-2.png)

- 학생이 보는 것: 분모가 같은 분수와 단위분수 비교하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-visibility-05-play-step1.png`

![user-visibility 문제 상태 · 05-play-step1](screenshots/engine-flow-user-visibility-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-user-visibility-05n-next-problem-clean.png`

![user-visibility 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-user-visibility-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-compare-unit-fraction-smaller · `engine-flow-user-visibility-05m-p1-compare-unit-fraction-smaller.png`

![user-visibility 오개념 확인 · p1-compare-unit-fraction-smaller](screenshots/engine-flow-user-visibility-05m-p1-compare-unit-fraction-smaller.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-compare-same-denominator-smaller · `engine-flow-user-visibility-05m-p2-compare-same-denominator-smaller.png`

![user-visibility 오개념 확인 · p2-compare-same-denominator-smaller](screenshots/engine-flow-user-visibility-05m-p2-compare-same-denominator-smaller.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-user-visibility-05b-play-wrong.png`

![user-visibility 오답 확인 · 05b-play-wrong](screenshots/engine-flow-user-visibility-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-visibility-06-confirm.png`

![user-visibility 마지막 확인 · 06-confirm](screenshots/engine-flow-user-visibility-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-visibility-07-reward-closed.png`

![user-visibility 닫힌 보상](screenshots/engine-flow-user-visibility-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 줄다리기 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-visibility-07b-reward-open.png`

![user-visibility 열린 보상](screenshots/engine-flow-user-visibility-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 줄다리기 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-user-visibility-07c-reward-impact.png`

![user-visibility 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-user-visibility-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 줄다리기 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-visibility-08-result.png`

![user-visibility 실제 결과](screenshots/engine-flow-user-visibility-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · draw · `engine-flow-user-visibility-08a-result-draw.png`

![user-visibility 결과 단계 · draw](screenshots/engine-flow-user-visibility-08a-result-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · bigwin · `engine-flow-user-visibility-08c-result-cohesion-bigwin.png`

![user-visibility 결과 결속 · bigwin](screenshots/engine-flow-user-visibility-08c-result-cohesion-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · champion · `engine-flow-user-visibility-08c-result-cohesion-champion.png`

![user-visibility 결과 결속 · champion](screenshots/engine-flow-user-visibility-08c-result-cohesion-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · draw · `engine-flow-user-visibility-08c-result-cohesion-draw.png`

![user-visibility 결과 결속 · draw](screenshots/engine-flow-user-visibility-08c-result-cohesion-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · rainbow · `engine-flow-user-visibility-08c-result-cohesion-rainbow.png`

![user-visibility 결과 결속 · rainbow](screenshots/engine-flow-user-visibility-08c-result-cohesion-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · smallwin · `engine-flow-user-visibility-08c-result-cohesion-smallwin.png`

![user-visibility 결과 결속 · smallwin](screenshots/engine-flow-user-visibility-08c-result-cohesion-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · win · `engine-flow-user-visibility-08c-result-cohesion-win.png`

![user-visibility 결과 결속 · win](screenshots/engine-flow-user-visibility-08c-result-cohesion-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-bigwin · `engine-flow-user-visibility-08v-result-visual-integrity-bigwin.png`

![user-visibility 결과 상태 · 08v-result-visual-integrity-bigwin](screenshots/engine-flow-user-visibility-08v-result-visual-integrity-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-champion · `engine-flow-user-visibility-08v-result-visual-integrity-champion.png`

![user-visibility 결과 상태 · 08v-result-visual-integrity-champion](screenshots/engine-flow-user-visibility-08v-result-visual-integrity-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-draw · `engine-flow-user-visibility-08v-result-visual-integrity-draw.png`

![user-visibility 결과 상태 · 08v-result-visual-integrity-draw](screenshots/engine-flow-user-visibility-08v-result-visual-integrity-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-rainbow · `engine-flow-user-visibility-08v-result-visual-integrity-rainbow.png`

![user-visibility 결과 상태 · 08v-result-visual-integrity-rainbow](screenshots/engine-flow-user-visibility-08v-result-visual-integrity-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-smallwin · `engine-flow-user-visibility-08v-result-visual-integrity-smallwin.png`

![user-visibility 결과 상태 · 08v-result-visual-integrity-smallwin](screenshots/engine-flow-user-visibility-08v-result-visual-integrity-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-win · `engine-flow-user-visibility-08v-result-visual-integrity-win.png`

![user-visibility 결과 상태 · 08v-result-visual-integrity-win](screenshots/engine-flow-user-visibility-08v-result-visual-integrity-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · smallwin · `engine-flow-user-visibility-08a-result-smallwin.png`

![user-visibility 결과 단계 · smallwin](screenshots/engine-flow-user-visibility-08a-result-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · win · `engine-flow-user-visibility-08a-result-win.png`

![user-visibility 결과 단계 · win](screenshots/engine-flow-user-visibility-08a-result-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bigwin · `engine-flow-user-visibility-08a-result-bigwin.png`

![user-visibility 결과 단계 · bigwin](screenshots/engine-flow-user-visibility-08a-result-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · champion · `engine-flow-user-visibility-08a-result-champion.png`

![user-visibility 결과 단계 · champion](screenshots/engine-flow-user-visibility-08a-result-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-user-visibility-08a-result-rainbow.png`

![user-visibility 결과 단계 · rainbow](screenshots/engine-flow-user-visibility-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### user-reported-missing-left-progress · 1082×987 · DPR 2 · 32장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `full-flow`

![user-reported-missing-left-progress 전체 상태 컨택시트](screenshots/report-flow-user-reported-missing-left-progress-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-reported-missing-left-progress-01-cover.png`

![user-reported-missing-left-progress 시작 화면](screenshots/engine-flow-user-reported-missing-left-progress-01-cover.png)

- 학생이 보는 것: 매스몬 분수 줄다리기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-reported-missing-left-progress-02-settings.png`

![user-reported-missing-left-progress 설정 화면](screenshots/engine-flow-user-reported-missing-left-progress-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-reported-missing-left-progress-03-tutorial-1.png`

![user-reported-missing-left-progress 설명 1 · 풀이 방법](screenshots/engine-flow-user-reported-missing-left-progress-03-tutorial-1.png)

- 학생이 보는 것: 분모가 같은 분수와 단위분수 비교하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-reported-missing-left-progress-04-tutorial-2.png`

![user-reported-missing-left-progress 설명 2 · 보상과 목표](screenshots/engine-flow-user-reported-missing-left-progress-04-tutorial-2.png)

- 학생이 보는 것: 분모가 같은 분수와 단위분수 비교하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-reported-missing-left-progress-05-play-step1.png`

![user-reported-missing-left-progress 문제 상태 · 05-play-step1](screenshots/engine-flow-user-reported-missing-left-progress-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-user-reported-missing-left-progress-05n-next-problem-clean.png`

![user-reported-missing-left-progress 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-user-reported-missing-left-progress-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-compare-unit-fraction-smaller · `engine-flow-user-reported-missing-left-progress-05m-p1-compare-unit-fraction-smaller.png`

![user-reported-missing-left-progress 오개념 확인 · p1-compare-unit-fraction-smaller](screenshots/engine-flow-user-reported-missing-left-progress-05m-p1-compare-unit-fraction-smaller.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-compare-same-denominator-smaller · `engine-flow-user-reported-missing-left-progress-05m-p2-compare-same-denominator-smaller.png`

![user-reported-missing-left-progress 오개념 확인 · p2-compare-same-denominator-smaller](screenshots/engine-flow-user-reported-missing-left-progress-05m-p2-compare-same-denominator-smaller.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-user-reported-missing-left-progress-05b-play-wrong.png`

![user-reported-missing-left-progress 오답 확인 · 05b-play-wrong](screenshots/engine-flow-user-reported-missing-left-progress-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-reported-missing-left-progress-06-confirm.png`

![user-reported-missing-left-progress 마지막 확인 · 06-confirm](screenshots/engine-flow-user-reported-missing-left-progress-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-reported-missing-left-progress-07-reward-closed.png`

![user-reported-missing-left-progress 닫힌 보상](screenshots/engine-flow-user-reported-missing-left-progress-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 줄다리기 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-reported-missing-left-progress-07b-reward-open.png`

![user-reported-missing-left-progress 열린 보상](screenshots/engine-flow-user-reported-missing-left-progress-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 줄다리기 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-user-reported-missing-left-progress-07c-reward-impact.png`

![user-reported-missing-left-progress 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-user-reported-missing-left-progress-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 줄다리기 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-reported-missing-left-progress-08-result.png`

![user-reported-missing-left-progress 실제 결과](screenshots/engine-flow-user-reported-missing-left-progress-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · draw · `engine-flow-user-reported-missing-left-progress-08a-result-draw.png`

![user-reported-missing-left-progress 결과 단계 · draw](screenshots/engine-flow-user-reported-missing-left-progress-08a-result-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · bigwin · `engine-flow-user-reported-missing-left-progress-08c-result-cohesion-bigwin.png`

![user-reported-missing-left-progress 결과 결속 · bigwin](screenshots/engine-flow-user-reported-missing-left-progress-08c-result-cohesion-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · champion · `engine-flow-user-reported-missing-left-progress-08c-result-cohesion-champion.png`

![user-reported-missing-left-progress 결과 결속 · champion](screenshots/engine-flow-user-reported-missing-left-progress-08c-result-cohesion-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · draw · `engine-flow-user-reported-missing-left-progress-08c-result-cohesion-draw.png`

![user-reported-missing-left-progress 결과 결속 · draw](screenshots/engine-flow-user-reported-missing-left-progress-08c-result-cohesion-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · rainbow · `engine-flow-user-reported-missing-left-progress-08c-result-cohesion-rainbow.png`

![user-reported-missing-left-progress 결과 결속 · rainbow](screenshots/engine-flow-user-reported-missing-left-progress-08c-result-cohesion-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · smallwin · `engine-flow-user-reported-missing-left-progress-08c-result-cohesion-smallwin.png`

![user-reported-missing-left-progress 결과 결속 · smallwin](screenshots/engine-flow-user-reported-missing-left-progress-08c-result-cohesion-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · win · `engine-flow-user-reported-missing-left-progress-08c-result-cohesion-win.png`

![user-reported-missing-left-progress 결과 결속 · win](screenshots/engine-flow-user-reported-missing-left-progress-08c-result-cohesion-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-bigwin · `engine-flow-user-reported-missing-left-progress-08v-result-visual-integrity-bigwin.png`

![user-reported-missing-left-progress 결과 상태 · 08v-result-visual-integrity-bigwin](screenshots/engine-flow-user-reported-missing-left-progress-08v-result-visual-integrity-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-champion · `engine-flow-user-reported-missing-left-progress-08v-result-visual-integrity-champion.png`

![user-reported-missing-left-progress 결과 상태 · 08v-result-visual-integrity-champion](screenshots/engine-flow-user-reported-missing-left-progress-08v-result-visual-integrity-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-draw · `engine-flow-user-reported-missing-left-progress-08v-result-visual-integrity-draw.png`

![user-reported-missing-left-progress 결과 상태 · 08v-result-visual-integrity-draw](screenshots/engine-flow-user-reported-missing-left-progress-08v-result-visual-integrity-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-rainbow · `engine-flow-user-reported-missing-left-progress-08v-result-visual-integrity-rainbow.png`

![user-reported-missing-left-progress 결과 상태 · 08v-result-visual-integrity-rainbow](screenshots/engine-flow-user-reported-missing-left-progress-08v-result-visual-integrity-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-smallwin · `engine-flow-user-reported-missing-left-progress-08v-result-visual-integrity-smallwin.png`

![user-reported-missing-left-progress 결과 상태 · 08v-result-visual-integrity-smallwin](screenshots/engine-flow-user-reported-missing-left-progress-08v-result-visual-integrity-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-win · `engine-flow-user-reported-missing-left-progress-08v-result-visual-integrity-win.png`

![user-reported-missing-left-progress 결과 상태 · 08v-result-visual-integrity-win](screenshots/engine-flow-user-reported-missing-left-progress-08v-result-visual-integrity-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · smallwin · `engine-flow-user-reported-missing-left-progress-08a-result-smallwin.png`

![user-reported-missing-left-progress 결과 단계 · smallwin](screenshots/engine-flow-user-reported-missing-left-progress-08a-result-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · win · `engine-flow-user-reported-missing-left-progress-08a-result-win.png`

![user-reported-missing-left-progress 결과 단계 · win](screenshots/engine-flow-user-reported-missing-left-progress-08a-result-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bigwin · `engine-flow-user-reported-missing-left-progress-08a-result-bigwin.png`

![user-reported-missing-left-progress 결과 단계 · bigwin](screenshots/engine-flow-user-reported-missing-left-progress-08a-result-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · champion · `engine-flow-user-reported-missing-left-progress-08a-result-champion.png`

![user-reported-missing-left-progress 결과 단계 · champion](screenshots/engine-flow-user-reported-missing-left-progress-08a-result-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-user-reported-missing-left-progress-08a-result-rainbow.png`

![user-reported-missing-left-progress 결과 단계 · rainbow](screenshots/engine-flow-user-reported-missing-left-progress-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### browser-comment-choice-hierarchy-and-progress · 934×987 · DPR 2 · 32장

- 같은 실행으로 보존한 회귀 이름: `user-reported-result-double-panel`, `user-reported-result-content-scale`
- 캡처 범위: `full-flow`

![browser-comment-choice-hierarchy-and-progress 전체 상태 컨택시트](screenshots/report-flow-browser-comment-choice-hierarchy-and-progress-contact-sheet.png)

#### 시작 화면 · `engine-flow-browser-comment-choice-hierarchy-and-progress-01-cover.png`

![browser-comment-choice-hierarchy-and-progress 시작 화면](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-01-cover.png)

- 학생이 보는 것: 매스몬 분수 줄다리기 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-browser-comment-choice-hierarchy-and-progress-02-settings.png`

![browser-comment-choice-hierarchy-and-progress 설정 화면](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-browser-comment-choice-hierarchy-and-progress-03-tutorial-1.png`

![browser-comment-choice-hierarchy-and-progress 설명 1 · 풀이 방법](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-03-tutorial-1.png)

- 학생이 보는 것: 분모가 같은 분수와 단위분수 비교하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-browser-comment-choice-hierarchy-and-progress-04-tutorial-2.png`

![browser-comment-choice-hierarchy-and-progress 설명 2 · 보상과 목표](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-04-tutorial-2.png)

- 학생이 보는 것: 분모가 같은 분수와 단위분수 비교하기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-browser-comment-choice-hierarchy-and-progress-05-play-step1.png`

![browser-comment-choice-hierarchy-and-progress 문제 상태 · 05-play-step1](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-browser-comment-choice-hierarchy-and-progress-05n-next-problem-clean.png`

![browser-comment-choice-hierarchy-and-progress 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-compare-unit-fraction-smaller · `engine-flow-browser-comment-choice-hierarchy-and-progress-05m-p1-compare-unit-fraction-smaller.png`

![browser-comment-choice-hierarchy-and-progress 오개념 확인 · p1-compare-unit-fraction-smaller](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-05m-p1-compare-unit-fraction-smaller.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p2-compare-same-denominator-smaller · `engine-flow-browser-comment-choice-hierarchy-and-progress-05m-p2-compare-same-denominator-smaller.png`

![browser-comment-choice-hierarchy-and-progress 오개념 확인 · p2-compare-same-denominator-smaller](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-05m-p2-compare-same-denominator-smaller.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-browser-comment-choice-hierarchy-and-progress-05b-play-wrong.png`

![browser-comment-choice-hierarchy-and-progress 오답 확인 · 05b-play-wrong](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-browser-comment-choice-hierarchy-and-progress-06-confirm.png`

![browser-comment-choice-hierarchy-and-progress 마지막 확인 · 06-confirm](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-browser-comment-choice-hierarchy-and-progress-07-reward-closed.png`

![browser-comment-choice-hierarchy-and-progress 닫힌 보상](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 줄다리기 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-browser-comment-choice-hierarchy-and-progress-07b-reward-open.png`

![browser-comment-choice-hierarchy-and-progress 열린 보상](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 줄다리기 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-browser-comment-choice-hierarchy-and-progress-07c-reward-impact.png`

![browser-comment-choice-hierarchy-and-progress 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 줄다리기 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-browser-comment-choice-hierarchy-and-progress-08-result.png`

![browser-comment-choice-hierarchy-and-progress 실제 결과](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · draw · `engine-flow-browser-comment-choice-hierarchy-and-progress-08a-result-draw.png`

![browser-comment-choice-hierarchy-and-progress 결과 단계 · draw](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08a-result-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · bigwin · `engine-flow-browser-comment-choice-hierarchy-and-progress-08c-result-cohesion-bigwin.png`

![browser-comment-choice-hierarchy-and-progress 결과 결속 · bigwin](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08c-result-cohesion-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · champion · `engine-flow-browser-comment-choice-hierarchy-and-progress-08c-result-cohesion-champion.png`

![browser-comment-choice-hierarchy-and-progress 결과 결속 · champion](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08c-result-cohesion-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · draw · `engine-flow-browser-comment-choice-hierarchy-and-progress-08c-result-cohesion-draw.png`

![browser-comment-choice-hierarchy-and-progress 결과 결속 · draw](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08c-result-cohesion-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · rainbow · `engine-flow-browser-comment-choice-hierarchy-and-progress-08c-result-cohesion-rainbow.png`

![browser-comment-choice-hierarchy-and-progress 결과 결속 · rainbow](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08c-result-cohesion-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · smallwin · `engine-flow-browser-comment-choice-hierarchy-and-progress-08c-result-cohesion-smallwin.png`

![browser-comment-choice-hierarchy-and-progress 결과 결속 · smallwin](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08c-result-cohesion-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · win · `engine-flow-browser-comment-choice-hierarchy-and-progress-08c-result-cohesion-win.png`

![browser-comment-choice-hierarchy-and-progress 결과 결속 · win](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08c-result-cohesion-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-bigwin · `engine-flow-browser-comment-choice-hierarchy-and-progress-08v-result-visual-integrity-bigwin.png`

![browser-comment-choice-hierarchy-and-progress 결과 상태 · 08v-result-visual-integrity-bigwin](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08v-result-visual-integrity-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-champion · `engine-flow-browser-comment-choice-hierarchy-and-progress-08v-result-visual-integrity-champion.png`

![browser-comment-choice-hierarchy-and-progress 결과 상태 · 08v-result-visual-integrity-champion](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08v-result-visual-integrity-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-draw · `engine-flow-browser-comment-choice-hierarchy-and-progress-08v-result-visual-integrity-draw.png`

![browser-comment-choice-hierarchy-and-progress 결과 상태 · 08v-result-visual-integrity-draw](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08v-result-visual-integrity-draw.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-rainbow · `engine-flow-browser-comment-choice-hierarchy-and-progress-08v-result-visual-integrity-rainbow.png`

![browser-comment-choice-hierarchy-and-progress 결과 상태 · 08v-result-visual-integrity-rainbow](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08v-result-visual-integrity-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-smallwin · `engine-flow-browser-comment-choice-hierarchy-and-progress-08v-result-visual-integrity-smallwin.png`

![browser-comment-choice-hierarchy-and-progress 결과 상태 · 08v-result-visual-integrity-smallwin](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08v-result-visual-integrity-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-win · `engine-flow-browser-comment-choice-hierarchy-and-progress-08v-result-visual-integrity-win.png`

![browser-comment-choice-hierarchy-and-progress 결과 상태 · 08v-result-visual-integrity-win](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08v-result-visual-integrity-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · smallwin · `engine-flow-browser-comment-choice-hierarchy-and-progress-08a-result-smallwin.png`

![browser-comment-choice-hierarchy-and-progress 결과 단계 · smallwin](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08a-result-smallwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · win · `engine-flow-browser-comment-choice-hierarchy-and-progress-08a-result-win.png`

![browser-comment-choice-hierarchy-and-progress 결과 단계 · win](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08a-result-win.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · bigwin · `engine-flow-browser-comment-choice-hierarchy-and-progress-08a-result-bigwin.png`

![browser-comment-choice-hierarchy-and-progress 결과 단계 · bigwin](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08a-result-bigwin.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · champion · `engine-flow-browser-comment-choice-hierarchy-and-progress-08a-result-champion.png`

![browser-comment-choice-hierarchy-and-progress 결과 단계 · champion](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08a-result-champion.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-browser-comment-choice-hierarchy-and-progress-08a-result-rainbow.png`

![browser-comment-choice-hierarchy-and-progress 결과 단계 · rainbow](screenshots/engine-flow-browser-comment-choice-hierarchy-and-progress-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 줄다리기 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### empty-reward-fixture · 1280×800 · DPR 1 · 3장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `targeted`

![empty-reward-fixture 전체 상태 컨택시트](screenshots/report-flow-empty-reward-fixture-contact-sheet.png)

#### 마지막 확인 · 06-confirm · `engine-flow-empty-reward-fixture-06-confirm.png`

![empty-reward-fixture 마지막 확인 · 06-confirm](screenshots/engine-flow-empty-reward-fixture-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 분모가 같은 분수와 단위분수 비교하기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-empty-reward-fixture-07-reward-closed.png`

![empty-reward-fixture 닫힌 보상](screenshots/engine-flow-empty-reward-fixture-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 줄다리기 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-empty-reward-fixture-07b-reward-open.png`

![empty-reward-fixture 열린 보상](screenshots/engine-flow-empty-reward-fixture-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 줄다리기 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

<!-- REPORT-EVIDENCE-ALL:END -->

## 2026-08-09 최종 보상 정렬 회귀 QA

- 6개 생성 장면마다 다른 결과판 축과 다시 버튼 hitbox를 실제 픽셀 위치에 맞췄다.
- 장면에 이미 들어 있는 큰 생성 제목·다시 버튼 위에 작은 자산을 다시 띄우던 중복 레이어를 제거했다.
- 데스크톱 `1280×800`, 태블릿 가로 `1024×768`에서 축 오차 `1px 이하`, 중복 제목·버튼 `0건`, 넘침·겹침 `0건`을 확인했다.
- 증거: `screenshots/result-typography-desktop-after.png`

## 2026-08-09 결과 타이틀 래스터 무결성 QA

- 범위: `result-title-only-v1` — 장면에 구워진 제목의 실제 배경 픽셀 영역까지 전수 검사했다.
- 장면에 baked-in된 6단계 제목은 독립 DOM 제목을 숨기고 `scene-baked` 픽셀·중복 레이어 검사를 통과했다.
- 데스크톱 `1280×800`과 태블릿 가로 `1024×768` 전수 PASS, 텍스트 넘침·요소 겹침·중복 제목 `0건`이다.
- 증거: `screenshots/result-typography-desktop-contain-after.png`, `screenshots/result-typography-tablet-landscape-contain-after.png`

# 매스몬 분수만큼 담기 제작 보고

## 2026-08-02 왼쪽 진행 보상 완성 및 현재 화면 증거

- 최종 보상 6등급을 먼저 확정·검증한 뒤, 결과 화면을 자르지 않은 문제 왼쪽 전용 생성 장면 6장을 만들었습니다. 흐름은 `한 줌 → 작은 바구니 → 바구니 → 큰 바구니 → 수레 가득 → 전설 바구니`이며, 최종 보상의 `비 오는 빈 채집터 → 작은 밭 → 과수원 → 마법 숲 → 금빛 축제 → 무지개 수정 하늘정원` 차이를 그대로 이어갑니다.
- 진행 원본은 `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-4-2/play-progress-v1/source`, 전수표는 `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-4-2/play-progress-v1/contact-sheets/play-basket-progress-v1-contact-sheet.png`, 토끼몬 중심·발 기준선 검수표는 `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-4-2/play-progress-v1/contact-sheets/play-basket-progress-v1-anchor-audit.png`입니다.
- 여섯 장 모두 런타임 `768×1536`, `object-fit: contain`입니다. 토끼몬 중심은 `0.50`, 발 기준선은 `0.68~0.70`, 전신 높이는 `0.32~0.35`이며, 전신 잘림은 0건입니다.
- 실제 패널은 Stage의 `left 1.65% / top 11% / width 19.2% / height 84%`입니다. 다섯 배포 화면 크기에서 패널 네 변 오차 1px 이하, 이미지·패널 중심 오차 1px 이하, 학습 영역 교차 0px, 라벨 넘침 0건을 통과했습니다.
- 보상 모달을 완전히 닫은 뒤 `320ms`를 기다리고, 단계 이미지 교체와 Stage 폭 `35%`의 전용 빛 효과를 `1560ms` 보여 준 다음에만 다음 문제로 이동합니다. 최소 표시 시간 `1200ms`를 만족하며, `한 줌 → 작은 바구니` 고정 fixture에서 모달 선행 닫힘과 실제 이미지 교체를 확인했습니다.
- 시작, 설명 1·2, 문제 대기·대표 오답·정답 확인·마지막 확인, 닫힌 보상·열린 보상·보상 뒤 변화, 결과 6등급을 현재 빌드로 다시 캡처했습니다. 화면 크기는 `1280×800`, `1024×768`, `1280×720 DPR 2`, `994×632`, `1082×987 DPR 2`이며, 빈 보상은 별도 `1280×800` fixture로 검사했습니다.
- 현재 코드와 해시로 묶은 화면별 전수표: `screenshots/report-flow-desktop-contact-sheet.png`, `screenshots/report-flow-tablet-landscape-contact-sheet.png`, `screenshots/report-flow-codex-in-app-contact-sheet.png`, `screenshots/report-flow-user-visibility-contact-sheet.png`, `screenshots/report-flow-user-reported-missing-left-progress-contact-sheet.png`, `screenshots/report-flow-empty-reward-fixture-contact-sheet.png`
- 현재 증거는 6개 fixture, 149장입니다. 글자 넘침·요소 겹침·Stage 이탈·이미지 누락·콘솔 오류는 모두 0건입니다.

## 2026-08-02 최종 보상 우선 재제작

- 문제 왼쪽 진행 장면을 만들기 전에 최종 보상 6등급부터 다시 제작했습니다.
- `한 줌 → 작은 바구니 → 바구니 → 큰 바구니 → 수레 가득 → 전설 바구니`는 비 오는 빈 채집터·작은 시골 밭·맑은 과수원·마법 숲·황금 수확 축제·무지개 수정 하늘정원으로 이어집니다. 배경, 날씨, 바구니 크기, 조명, 토끼몬의 옷과 반응이 단계마다 함께 달라집니다.
- 각 등급은 서로 다른 1280×800 생성 완성 장면입니다. 등급 제목과 `다시` 버튼 표면은 장면 안에 고정하고, 바구니 빛·진행 막대·정답 수·다음 목표만 빈 결과판 위에 표시합니다. 별도 결과 효과 오버레이, 혼합 모드, 단계별 CSS 필터는 쓰지 않습니다.
- 생성 원본은 `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-4-2/result-fullscene-v1/source`, 런타임 PNG는 같은 경로의 `runtime-png`, 전수표는 `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-4-2/result-fullscene-v1/contact-sheets/result-tiers-v4-contact-sheet.png`입니다.
- 최종 보상 6장과 토끼몬 전신의 잘림은 현재 자산 전수표에서 0건입니다. 실제 브라우저 전수표는 `screenshots/result-all-tiers-desktop-contact-sheet.png`, `screenshots/result-all-tiers-tablet-landscape-contact-sheet.png`입니다.
- `1280×800`, `1024×768`, `1280×720 DPR 2`, `994×632`, `1082×987 DPR 2`에서 10문제 전체 흐름과 결과 6등급을 검사했습니다. 결과판 픽셀 중심은 등급별 `958.5 / 973.5 / 948.5 / 973.5 / 952 / 971px`이고, 선언 축·동적 요소와의 차이는 3px 이내입니다. 장면 잘림·별도 결과 효과 오버레이·혼합 모드·단계 필터·요소 교차·글자 넘침은 모두 0건입니다.
- 문제 왼쪽 진행 6장은 이 최종 세트의 브라우저 검증을 통과한 뒤 별도 제작했고, 위의 `stage-left-play-progress-v1` 계약으로 연결했습니다.

## 2026-07-28 전체 점검 수정 결과

- 이 절은 2026-07-28 당시의 V3 기록입니다. 현재 런타임은 위 2026-08-02 완성 장면 V4 계약을 따릅니다.
- 결과 6단계를 글자·버튼 없는 생성 배경, 투명 생성 제목, 동적 바구니 빛·정답 수·다음 목표, 투명 생성 `다시` 버튼으로 분리했습니다.
- 결과 제목·바구니 빛·정답 수·다음 목표·버튼을 게시판의 한 세로축에 맞췄습니다.
- `12개의 3/4만큼`은 `12개 중 3/4만큼`으로, 단계 안내는 `똑같이 나눴을 때 한 묶음 수`처럼 학생이 바로 행동할 수 있는 말로 고쳤습니다.
- `1280×800`, `1024×768`에서 결과 6단계를 모두 검사했습니다. 축 오차는 Stage 폭의 1.5% 이하, 요소 교차·Stage 이탈·누락 이미지는 0건, 버튼 아트와 hitbox 경계 차이는 1px 이하입니다.
- 최신 배경 컨택시트는 `result-tiers-v3-contact-sheet.png`, 제목 컨택시트는 `result-titles-v3-contact-sheet.png`입니다.

## 2026-07-23 V2 보완 결과

- 공용 시작 버튼 `../_shared/mathmon/cover-start-button/start-button-generated.webp`만 사용합니다.
- 커버는 `shared-canonical-v1`, 표시 크기 `360×152px`, 작은 화면 최소 `300×127px`, 비율 `1611:680` 계약을 따릅니다.
- 문제 화면 상단은 왼쪽 `에듀잇티 수학 게임`, 가운데 `N/10`, 오른쪽 `4단원 분수`, 설정 버튼 순서로 고정했습니다.
- 덮인 바구니와 보상 6종을 `closed + 6 events` 7장 상태 세트로 연결했습니다.
- 결과 등급 6장과 문제 은행, 보상 확률, 랭킹 비활성화 정책은 유지했습니다.
- 사용 매스몬 팩은 승인된 `zero-factory-animal-pack`이며 주인공은 토끼몬입니다.

## 생성 이미지와 상태 세트

- 닫힌 보상 런타임: `reward-event-closed-generated.webp`, `512×512`
- 보상 상태: `closed`, `normal`, `loss`, `mega`, `perfect`, `empty`, `rainbow`
- 보상 컨택시트: `reward-events-v3-contact-sheet.png`
- 결과 배경 6장 컨택시트: `result-tiers-v3-contact-sheet.png`
- 결과 제목 6장 컨택시트: `result-titles-v3-contact-sheet.png`
- 닫힌 보상에는 글자·숫자·결과 등급·버튼이 없습니다.
- 차시별 시작 버튼 원본·PNG·WebP는 제거했으며 공용 자산을 복제하거나 변형하지 않았습니다.

## 학습 조작과 입력 통계

- 한 문제의 수학적 판단은 `한 묶음의 수 구하기`, `분자만큼 담을 수 구하기` 2회입니다.
- 정답 경로의 물리 입력은 두 단계 선택과 확인·이동을 포함해 5탭입니다.
- 문제 은행 전체 통계는 수학적 판단 `최소 2 / 중앙값 2 / 평균 2 / 최대 2`, 물리 입력 `최소 5 / 중앙값 5 / 평균 5 / 최대 5`입니다.
- 대표 오답은 `전체를 분모로 착각하기`와 `묶음 수를 전체 수로 착각하기`를 현재 묶음판에서 확인합니다.

## 브라우저 실측

`scripts/qa-lesson-flow.mjs`로 10문제를 완주했습니다. 아래 값은 현재 코드에서 측정한 `getBoundingClientRect()` 기준입니다.

| 화면 | Stage | 작업 영역 | Stage 폭 비율 | Stage 면적 비율 | 1순위 문제판 | 2순위 선택지 |
| --- | --- | --- | ---: | ---: | --- | --- |
| 1280×800 | 1203.19×751.98 | 1082.88×661.98 | 90.00% | 79.23% | 1082.88×407.98, 48.83% | 1082.88×184, 22.02% |
| 1024×768 | 983.06×614.41 | 884.78×525.94 | 90.00% | 77.04% | 884.78×271.94, 39.84% | 884.78×184, 26.95% |

- 선택지 최소 크기: 데스크톱 약 `263.22×184px`, 태블릿 약 `213.69×184px`
- 설정 버튼: 두 화면 모두 `42×42px`, 톱니 아이콘 `20×20px`
- 실제 글자 크기: 상단 라벨 `14.4px`, 문제 제목 최소 `38.91px`, 지시문 최소 `15.87px`, 선택지 최소 `20.48px`
- 상단 행과 문제판 최소 간격 `6px`, 문제판·지시문·선택지 사이 간격 `8px`
- 터치 영역: 모든 조작 `42×42px` 이상
- 각 단계 대기 → 확인과 마지막 완료 상태 중심축 차이: `0px`이며 허용값 `1px` 이하
- 브랜드·진행 수·단원·설정 버튼 교차: `0px`
- 텍스트 넘침, 요소 교차, Stage 이탈, 이미지 로드 실패: 모두 `0건`
- 시작 버튼 아트와 hitbox의 너비·높이·중심 차이: 모두 `1px` 이하

## 상태별 최신 증거

- 화면 크기: `1280×800`, `1024×768`, `1280×720 DPR 2`, `994×632`, `1082×987 DPR 2`
- 상태: 커버, 설정 모달, 설명 1·2, 문제 1단계, 대표 오답 2종, 1단계 확인, 2단계 대기·확인, 마지막 확인, 닫힌 보상, 열린 보상, 결과 6등급
- 현재 증거: `screenshots/engine-flow-desktop-*`, `screenshots/engine-flow-tablet-landscape-*`
- 결과 6등급: `screenshots/engine-flow-*-08a-result-*.png`
- 이전 증거: `screenshots/_archive/2026-07-12-pre-v2/`
- 랭킹 UI·API 요청, 콘솔 오류, 실패 응답: 모두 `0건`

## 검사 결과

- `node scripts/qa-engine-unit4-scoop-source.mjs` 통과
- 대상 lesson build, lesson contract, visual contract V2, Stage ratio 검사 통과
- `node scripts/check-run-randomness.mjs` 통과
- `node scripts/check-ranking-disabled.mjs` 통과
- `node scripts/qa-lesson-flow.mjs 3-2-4-2-mathmon-fraction-scoop` 다섯 화면 크기 10문제 완주 통과

## Humanizer 학생 문구 QA

학생 문구는 `먼저 전체를 분모로 나눠요.`, `이제 분자만큼 담아요.`, `바구니 보기`처럼 한 문장에 행동 하나만 남겼습니다. 제작자 용어와 같은 뜻의 반복 문구는 학생 화면에 남기지 않았습니다.

## 2026-07-31 최종 회귀

- 현재 소스 재빌드 뒤 `1280×800`, `1024×768` 전체 흐름과 결과 6단계를 다시 캡처했습니다. 글자 넘침·요소 겹침·Stage 이탈·이미지 누락은 `0건`입니다.

## 2026-08-01 학생 분수 문구 회귀

- 문제 은행 전체의 학생 문구에서 `2/3` 같은 표기를 없애고 `3분의 2`처럼 소리 내어 읽는 말로 확인합니다.

## 2026-08-01 Kiro 6차 차단 항목 회귀

- 답을 고르기 전에는 전체 물건을 한 판에 흐트러진 상태로 보여 주며, 한 묶음 수와 묶음별 배치는 미리 보여 주지 않습니다.
- 선택지뿐 아니라 묶음 그림의 안쪽 판과 계산 카드도 불투명한 `#fffdf4` 표면입니다. 문제 문장은 수에 맞는 `은/는` 조사를 사용합니다. 소스 QA가 세 표면의 실색을 검사합니다.
- `empty` 사건은 누적 바구니 힘을 유지하며, 누적값 `47` 브라우저 fixture를 통과했습니다.

## 2026-08-01 Kiro 8차 심층 회귀

- `12개의 3분의 2` fixture는 선택 전에 `전체 12개` 점을 모두 보여 줍니다. 첫 답을 고른 뒤에만 3개의 같은 묶음으로 다시 그립니다.
- 완료판은 `#fff2bf` 불투명 표면입니다. 소스 QA가 전체 점 개수, 대기 상태의 묶음 미노출, 안쪽 판·계산 카드·완료판의 실색을 함께 검사합니다.

## 결과판 내부 결속 v2 (2026-08-03)

- `qa.resultPanelContainmentAudit.standard`를 `result-panel-containment-v2`로 선언했습니다. 결과 배경, 결과 패널, 단계명·정답 수·다시 버튼은 각각 선택 가능한 raster/WebP 레이어이며, 진행값·진행 막대·다음 목표만 동적 UI입니다.
- 안전 여백 `24px` 안에서 패널 네 변, 실제 보이는 rect, hitbox, 요소 간 교차, 공통 중심축 `1px`, 다시 버튼 아트↔hitbox 네 변 `1px`을 검사합니다. 숨긴 다음 목표는 `display:none`과 `0×0` rect를 확인합니다.
- `1280×800`, `1024×768`, `1280×720 DPR2`, `994×632`, `1082×987 DPR2`에서 결과 6단계를 전수 재실행했고, 넘침·요소 겹침·Stage 잘림은 `0건`입니다. 런타임 commit SHA와 lesson JSON SHA도 일치했습니다.

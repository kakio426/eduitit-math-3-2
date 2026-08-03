# 매스몬 그림 도장 찍기 제작 보고

검사일: 2026-08-01
최종 판정: **통과**
잔여 P0/P1: 없음

## 구현 결과

- 10·14·21·26·30·37·42·48·53·59를 한 번씩 쓰는 10문제를 만들었습니다.
- 큰 도장과 작은 도장을 한꺼번에 묻지 않고 두 단계로 나눴습니다.
- 첫 단계 정답은 작업판에 큰 도장과 `큰 수×10` 식으로 남고, 학생이 `작은 도장 보기`를 눌러 다음 단계로 갑니다.
- 마지막에는 `큰 도장×10 + 작은 도장×1 = 전체 수`가 완성된 뒤에만 보상 버튼이 나타납니다.
- 공용 보상 기준 `mathmon-unified-reward-v1`과 닫힌 상자→사건 공개 Stage-Reveal을 적용했습니다.
- 모델 검사는 고정 시드 64회, 640문제로 제한해 두 단계의 오답 분류와 보상·결과 경계값을 확인했습니다.
- `base-pack` 유니콘몬을 사용하고 랭킹은 비활성화했습니다.

## Humanizer 학생 문구 QA

`십의 자릿값을 적용해요` 대신 `10짜리 큰 도장은 몇 개일까요?`처럼 지금 보는 물건과 행동으로 바꿨습니다. 첫 단계, 둘째 단계, 오답, 완성식 문구는 각각 한 가지 행동이나 이유만 말합니다.

## 교과서식 수 표현 QA

큰 도장은 10, 작은 도장은 1을 뜻합니다. `3십`, `7일` 같은 표기를 쓰지 않고 `3×10 + 7×1 = 37`로 보여 줍니다. 문제 은행 10개에서 이 항등식을 검사했습니다.

## 텍스트 넘침·요소 겹침 QA

- 화면: 1280×800 DPR1, 1024×768 DPR1, 1280×720 DPR2, 994×632 DPR1, 사용자 신고 1082×987 DPR2, 빈 보상 1280×800 DPR1
- 상태: 표지, 설정, 설명 1·2, 1단계 대기·작은/큰 오답·정답, 2단계 대기·정답, 마지막 완성, 닫힌·열린 보상, 결과 6단계
- overflow 0, 누락 이미지 0, 피드백·선택지 교차 0px, 작업판 이탈 0px
- 대기↔완료 문제판·작업판 좌우 경계와 중심 차이 0px
- 시작·다시 버튼 아트와 hitbox 차이 1px 이하
- 설정 버튼 실제 42×42px

## 실제 영역 측정

| 화면 | Stage | 문제판 | 중심 작업판 | 선택지 최소 |
| --- | ---: | ---: | ---: | ---: |
| 1280×800 | 1203.19×751.98 | 896.39×465.98 | 896.39×465.98 | 210.09×56 |
| 1024×768 | 983.06×614.41 | 742.22×353.94 | 742.22×353.94 | 172.55×52 |

왼쪽 진행 보상 전용 칸을 뺀 학습 작업 영역은 Stage 폭의 74.50%와 75.50%입니다. 선택지 글씨는 24px와 20.48px, 지시문은 20.48px와 17.41px입니다.

## 설정·자산·네트워크 QA

- 설정 첫 초점, Escape, Tab 순환, 초점 복귀, 재시작 확인, 방법 복습 복귀 통과
- BGM/SFX 저장 통과
- WebP 49개 `decode()` 통과
- 닫힌·열린 보상에서 이미지·단계판·버튼 교차 0px, 닫힌 상자 512×512 확인
- 랭킹 네트워크 요청 0건
- 현재 보상 사건 `reward-contact-sheet.png`, 최종 결과 컨택시트, 왼쪽 진행 컨택시트를 전수 확인했습니다.

## 검증 명령

- `node scripts/build-lesson.mjs 3-2-6-3-mathmon-picture-stamp` → PASS
- `node scripts/qa-unit6-data.mjs` → PASS
- `node scripts/qa-lesson-flow.mjs 3-2-6-3-mathmon-picture-stamp` → PASS
- `node scripts/qa-unit6-browser.mjs 3-2-6-3-mathmon-picture-stamp` → PASS

## 2026-07-31 최종 회귀

- `1280×800`, `1024×768`, 신고 회귀 화면 `1024×768 DPR1`에서 전체 흐름과 결과 6단계를 다시 캡처했습니다. 제목 불투명 픽셀↔막대 여백 `8px 이상`, 결과 요소 교차 `0px`, 공통 축 편차 Stage 폭 `1.5% 이하`입니다.
- 당시 왼쪽 진행 보상 적용 전 문제 작업 영역은 Stage 폭 `95% 이상`이었습니다. 현재 기준은 아래 2026-08-01 실측이며, 상단 글자 `16px`, 설정 hitbox `42×42px`, 넘침·교차·누락·랭킹 요청 `0건`입니다.

## 2026-08-01 현재 실측

- 왼쪽 진행 보상과 나란히 둔 작업영역은 1280×800에서 `896.39×661.98px`(Stage 폭 `74.50%`, 면적 `65.58%`), 1024×768에서 `742.22×529.94px`(Stage 폭 `75.50%`, 면적 `65.12%`)입니다.
- 문제판·지시판·선택지는 각각 desktop `896.39×465.98`, `896.39×92`, `896.39×74px`, tablet `742.22×353.94`, `742.22×86`, `742.22×66px`이며 형제 교차는 `0px`입니다.
- 선택지 최소 크기는 desktop `210.09×56px`, tablet `172.55×52px`입니다. 신고 회귀 화면을 포함한 현재 캡처의 넘침·Stage 이탈·이미지 누락은 `0건`입니다.

## 2026-08-01 Kiro 8차 심층 회귀

- 문제 제목은 목표 수를 다시 읽지 않고 `도장 수를 차례로 골라요.`만 보여 줍니다.
- 첫 단계 식은 `?×10 + 작은 도장 = 14`, 큰 도장 확인 뒤에는 `1×10 + ?×1 = 14`처럼 지금 고를 자리의 물음표 하나만 남깁니다. 마지막에는 물음표 없는 완성식을 보여 줍니다.
- 데이터 QA와 브라우저 QA가 첫 화면 물음표 `1개`, 제목 속 숫자 `0개`, 두 단계 항등식과 현재 캡처의 넘침·교차 `0건`을 검사합니다.
- 최종 빌드보다 오래된 캡처 33장은 `screenshots/_archive/pre-20260801-r9-stale/`로 옮겼고, 루트 증거 폴더의 오래된 PNG는 `0장`입니다.

## 2026-08-01 최종 보상 우선 재제작

- 문제 왼쪽 진행 보상을 만들기 전에 최종 보상부터 `result-tier-fullscene-native-v1` 독립 1280×800 장면 여섯 장으로 확정했습니다.
- 장면은 `비 내리는 폐창고 → 봄 정원 → 빛나는 숲 → 하늘 전시대 → 황금 전시실 → 무지개 우주탑`으로 달라집니다. 인접 단계마다 환경·빛·도장물·유니콘몬 반응 중 두 가지 이상이 바뀝니다.
- 최상위 두 단계는 황금·진홍 왕실과 청록·자홍·보라 우주탑으로 색 계열부터 구분했습니다. CSS 필터·블렌드·효과 오버레이는 0건입니다.
- 최종 결과 컨택시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-3/result-fullscene-v1/contact-sheets/result-tiers-v1-contact-sheet.png`
- 최종 결과 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-3/result-fullscene-v1/source`
- 최종 결과 승인 뒤 전용 768×1536 왼쪽 진행 장면 여섯 장을 새로 만들었습니다. 결과 크롭 재사용은 0건이고 런타임 표시는 모두 `object-fit: contain`입니다.
- 왼쪽 진행 컨택시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-3/play-progress-v1/contact-sheets/play-stamp-progress-v1-contact-sheet.png`
- 왼쪽 기준선 시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-3/play-progress-v1/contact-sheets/play-stamp-progress-v1-anchor-audit.png`
- 왼쪽 진행 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-3/play-progress-v1/source`
- 유니콘몬 선언 기준점은 `centerX 0.50`, `centerY 0.51~0.55`, `footY 0.60~0.65`, 높이 `0.22~0.24`이며 전신 잘림은 0건입니다.
- 왼쪽 패널은 Stage 기준 `left 1.65% / top 11% / width 19.2% / height 84%`입니다. 패널 네 변 오차 1px 이하와 학습 영역 교차 0px를 검사합니다.

## 현재 화면 증거

현재 `index.html`에서 시작·설명·문제 1단계·문제 2단계·오답·정답 확인·닫힌 보상·열린 보상·결과 6단계를 6개 화면 크기로 다시 캡처했습니다. 현재 흐름 132장만 증거로 묶었습니다.

- 화면 크기 `1280×800 DPR1`: `screenshots/report-flow-desktop-contact-sheet.png`
- 화면 크기 `1024×768 DPR1`: `screenshots/report-flow-tablet-landscape-contact-sheet.png`
- 화면 크기 `1280×720 DPR2`: `screenshots/report-flow-codex-in-app-contact-sheet.png`
- 화면 크기 `994×632 DPR1`: `screenshots/report-flow-user-visibility-contact-sheet.png`
- 화면 크기 `1082×987 DPR2`: `screenshots/report-flow-user-reported-missing-left-progress-contact-sheet.png`
- 화면 크기 `1280×800 DPR1`, 빈 보상 사건: `screenshots/report-flow-empty-reward-fixture-contact-sheet.png`

## 결과판 내부 결속 v2 (2026-08-03)

- `qa.resultPanelContainmentAudit.standard`를 `result-panel-containment-v2`로 선언했습니다. 결과 배경, 결과 패널, 단계명·정답 수·다시 버튼은 각각 선택 가능한 raster/WebP 레이어이며, 진행값·진행 막대·다음 목표만 동적 UI입니다.
- 안전 여백 `24px` 안에서 패널 네 변, 실제 보이는 rect, hitbox, 요소 간 교차, 공통 중심축 `1px`, 다시 버튼 아트↔hitbox 네 변 `1px`을 검사합니다. 숨긴 다음 목표는 `display:none`과 `0×0` rect를 확인합니다.
- `1280×800`, `1024×768`, `1280×720 DPR2`, `994×632`, `1082×987 DPR2`에서 결과 6단계를 전수 재실행했고, 넘침·요소 겹침·Stage 잘림은 `0건`입니다. 런타임 commit SHA와 lesson JSON SHA도 일치했습니다.

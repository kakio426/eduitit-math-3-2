# 매스몬 그림 단위 해독 제작 보고

검사일: 2026-08-01
최종 판정: **통과**
잔여 P0/P1: 없음

## 구현 결과

- 그림 하나의 값과 그림 수를 동시에 읽되, 학생 입력은 전체 값 하나 고르기로 제한했습니다.
- 10문제는 단위 2·5·10, 그림 2~8개, 전체 80 이하 계약을 지킵니다.
- 단위를 빼먹거나 한 단위 적게·많게 계산한 값이 실제 선택지에 들어갑니다.
- 오답과 정답 모두 중앙 작업판의 식이 바뀌며, 정답 확인 뒤에만 보상으로 넘어갑니다.
- 공용 보상 기준 `mathmon-unified-reward-v1`과 닫힌 상자→사건 공개 Stage-Reveal을 적용했습니다.
- 모델 검사는 고정 시드 64회, 640문제로 제한해 오답 분류와 보상·결과 경계값을 확인했습니다.
- `base-pack`의 등록된 독수리몬을 커버·결과 장면에 사용하고 랭킹은 비활성화했습니다.

## Humanizer 학생 문구 QA

`단위를 적용합니다` 같은 제작자 말을 쓰지 않고 `그림 하나는 5를 뜻해요`처럼 바로 읽히는 말로 통일했습니다. 지시, 오답 이유, 정답 확인은 각각 한 문장입니다.
첫 설명 그림은 `그림 하나는 얼마일까요?`와 `그림 1개=10 → 그림 4개 → 10×4=40`만 남겨 실제 문제의 곱셈 관계와 같게 고쳤습니다.

## 텍스트 넘침·요소 겹침 QA

- 1280×800 DPR1, 1024×768 DPR1, `unit6-reported-overlap-1024x768-dpr1`
- 표지, 설정, 설명 1·2, 대기, 작은·큰 오답, 정답, 완성, 닫힌·열린 보상, 결과 6단계
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

- 첫 초점, Escape, Tab 순환, 초점 복귀, 재시작 확인, 방법 복습 복귀 통과
- BGM/SFX localStorage 저장 통과
- WebP 49개 `decode()` 통과
- 닫힌·열린 보상에서 이미지·단계판·버튼 교차 0px, 닫힌 상자 512×512 확인
- 랭킹 네트워크 요청 0건
- 현재 보상 사건 `reward-contact-sheet.png`, 최종 장면 `result-fullscene-v1/contact-sheets/result-tiers-v1-contact-sheet.png`, 왼쪽 진행 `play-progress-v1/contact-sheets/play-decode-progress-v1-contact-sheet.png`을 전수 확인했습니다.

## 검증 명령

- `node scripts/build-lesson.mjs 3-2-6-2-mathmon-picture-decoder` → PASS
- `node scripts/qa-unit6-data.mjs` → PASS
- `node scripts/qa-lesson-flow.mjs 3-2-6-2-mathmon-picture-decoder` → PASS
- `node scripts/qa-unit6-browser.mjs 3-2-6-2-mathmon-picture-decoder` → PASS

## 2026-07-31 최종 회귀

- `1280×800`, `1024×768`, 신고 회귀 화면 `1024×768 DPR1`에서 전체 흐름과 결과 6단계를 다시 캡처했습니다. 제목 불투명 픽셀↔막대 여백 `8px 이상`, 결과 요소 교차 `0px`, 공통 축 편차 Stage 폭 `1.5% 이하`입니다.
- 당시 왼쪽 진행 보상 적용 전 문제 작업 영역은 Stage 폭 `95% 이상`이었습니다. 현재 기준은 아래 2026-08-01 실측이며, 상단 글자 `16px`, 설정 hitbox `42×42px`, 넘침·교차·누락·랭킹 요청 `0건`입니다.

## 2026-08-01 현재 실측

- 왼쪽 진행 보상과 나란히 둔 작업영역은 1280×800에서 `896.39×661.98px`(Stage 폭 `74.50%`, 면적 `65.58%`), 1024×768에서 `742.22×529.94px`(Stage 폭 `75.50%`, 면적 `65.12%`)입니다.
- 문제판·지시판·선택지는 각각 desktop `896.39×465.98`, `896.39×92`, `896.39×74px`, tablet `742.22×353.94`, `742.22×86`, `742.22×66px`이며 형제 교차는 `0px`입니다.
- 선택지 최소 크기는 desktop `210.09×56px`, tablet `172.55×52px`입니다. 신고 회귀 화면을 포함한 현재 캡처의 넘침·Stage 이탈·이미지 누락은 `0건`입니다.

## 2026-08-01 최종 보상 우선 재제작·왼쪽 진행 보상 QA

- 최종 보상 6장부터 `result-tier-fullscene-native-v1` 독립 1280×800 장면으로 확정했습니다. `폭풍 야영지 → 새벽 렌즈 캠프 → 마법 숲 → 하늘 관측소 → 황금 해독실 → 무지개 우주탑`으로 환경·빛·보상물·독수리몬 반응이 함께 달라집니다.
- 최상위 두 단계는 황금·진홍 왕립 해독실과 청록·자홍·보라 우주탑으로 색 계열부터 다릅니다. CSS 필터·블렌드·효과 오버레이는 사용하지 않습니다.
- 최종 보상 컨택시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-2/result-fullscene-v1/contact-sheets/result-tiers-v1-contact-sheet.png`
- 최종 장면 승인 뒤 전용 768×1536 왼쪽 진행 장면 6장을 별도 생성했습니다. 결과 크롭 재사용은 0건이고 모든 런타임 이미지는 `object-fit: contain`입니다.
- 왼쪽 진행 컨택시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-2/play-progress-v1/contact-sheets/play-decode-progress-v1-contact-sheet.png`
- 왼쪽 기준선 시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-2/play-progress-v1/contact-sheets/play-decode-progress-v1-anchor-audit.png`
- 왼쪽 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-6-2/play-progress-v1/source`
- 독수리몬 기준점은 `centerX 0.50`, `centerY 0.49~0.52`, `footY 0.61~0.63`, 높이 `0.21~0.25`입니다. 전신 잘림은 0건입니다.
- 왼쪽 패널은 Stage 기준 `left 1.65% / top 11% / width 19.2% / height 84%`입니다. 패널 네 변 오차 1px 이하, 학습 영역 교차 0px를 검사합니다.
- 결과판 픽셀 중심과 상태별 선언 축 차이는 3px 이하, 동적 슬롯 네 변 오차는 1px 이하, 결과 요소 교차는 0px입니다.
- Humanizer QA에서 생성 오류가 난 `반짝 돌보기`를 배포하지 않고, 학생이 바로 읽는 `빛난 렌즈`로 최종 장면과 데이터 이름을 함께 고쳤습니다.
- 진행 패널 접근성 문구도 고정된 `자료 힘` 대신 차시의 실제 이름 `해독 힘`을 읽도록 바꾸고 하네스 회귀 검사로 고정했습니다.

## 현재 화면 증거

현재 `index.html`에서 시작·설명·문제 대기·오답·정답 확인·닫힌 보상·열린 보상·결과 6단계를 6개 화면 크기로 다시 캡처했습니다. 현재 흐름에 속하는 132장만 증거로 묶었으며, 아래 컨택시트가 이 보고서와 같은 코드의 증거입니다.

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

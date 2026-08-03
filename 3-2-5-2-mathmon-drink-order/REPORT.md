# 매스몬 음료 제조 주문 구현 보고서

## 1. 구현 요약

3학년 2학기 5단원 2차시 `들이의 덧셈·뺄셈과 어림`을 단일 HTML 게임으로 구현했습니다. 학생은 10문제 동안 주문에 맞는 들이를 골라요. 정답을 고르면 값이 계산판에 먼저 들어가고, 마지막 단계에서는 완성값을 본 뒤 `주문 보기`를 눌러 보상으로 넘어갑니다.

## 2. 등록

- lesson id: `3-2-5-2`
- folder: `3-2-5-2-mathmon-drink-order`
- title: `매스몬 음료 제조 주문`
- learningGoal: 들이의 덧셈·뺄셈과 어림

## 3. 화면 흐름

```text
첫 화면 -> 설명 -> 문제 -> 보상 -> 결과
```

- 첫 화면: 생성형 배경, 생성형 제목 아트, HTML 목표 문장, 생성형 시작 버튼 아트
- 설명: 2쪽 생성 포스터
- 문제: 큰 문제, 현재 계산판, 한 줄 지시, 선택지만 기본 노출
- 보상: 주문 변화 하나만 표시
- 결과: 결과 단계 생성 이미지, 생성형 결과 타이틀, 생성형 `다시` 버튼 아트

## 4. 생성 이미지 자산

| 파일명 | 역할 |
| --- | --- |
| `cover-source.png` / `cover-generated.webp` | 글자 없는 첫 화면 배경 |
| `title-logo-chromakey.png` / `title-logo-generated.png` / `title-logo-generated.webp` | 생성형 제목 아트 |
| `../_shared/mathmon/cover-start-button/start-button-generated.webp` | 공용 시작 버튼 아트 |
| `reward-event-closed-v2-generated.webp` | 닫힌 보상 장면 |
| `reward-event-*-source.png` / `reward-event-*-generated.webp` | 공개 보상 6상태 개별 512×512 장면 |
| `reward-events-v3-contact-sheet.png` | 보상 7상태 컨택시트 |
| `result-order-*-source.png` / `result-order-*-generated.webp` | 결과 배경 |
| `result-title-*-source.png` / `result-title-*-generated.webp` | 결과 이름 타이틀 아트 |
| `result-retry-button-source.png` / `result-retry-button-generated.webp` | 생성형 다시 버튼 아트 |

## 5. 매스몬 기준

사용 팩은 `zero-factory-animal-pack`이고 기준 매스몬은 냥냥몬(`zfa-04-nyangnyangmon`)입니다. 차시 폴더에는 매스몬 원본을 복사하지 않고, 커버/보상/결과 장면 생성 단계에서 함께 넣는 방식으로 처리합니다.

## 6. 보상과 확률

정답의 숨은 기본 가산값은 0입니다. 정답 사건은 `64%/+6~+10`, `15%/-5~-2`, `12%/+14~+22`, `5%/+30`, `3.8%/0(누적 유지)`, `0.2%/100(특별)`이며, 오답은 문제당 최초 1회 `-6~-3`입니다.

| 결과 | 조건 |
| --- | --- |
| 작은 컵 주문 | 0 이상, 바로 맞힌 문제 0개 이상 |
| 맛있는 주문 | 30 이상, 바로 맞힌 문제 3개 이상 |
| 인기 가게 주문 | 70 이상, 바로 맞힌 문제 7개 이상 |
| 무지개 음료 주문 | 100 이상, 바로 맞힌 문제 1개 이상, 특별 보상 필요 |

## 7. Humanizer QA

학생 문구는 짧은 행동 말 중심으로 구성했습니다.

- 첫 화면 목표: `주문에 맞는 들이를 골라요.`
- 설명 카드: `mL끼리 먼저 봐요.`, `부족하면 1L를 빌려요.`, `주문과 맞는지 봐요.`
- 오답 피드백: `다시 골라요.`
- 보상/결과: `작은 컵 주문`, `맛있는 주문`, `인기 가게 주문`, `무지개 음료 주문`

학생 화면에는 내부 작업실 이름이나 제작자용 말을 보이지 않게 합니다.

## 8. 텍스트 넘침·요소 겹침 QA

브라우저 QA에서 desktop `1280x800`과 tablet landscape `1024x768`을 확인했습니다.

확인 대상:

- 첫 화면
- 설명 1
- 설명 2
- 문제 1단계
- 정답 확인 상태
- 오답 상태
- 보상
- 결과 단계별 화면

확인 결과: 텍스트 넘침 0건, 요소 겹침 0건, Stage 밖 이탈 0건입니다. 결과 화면은 `작은 컵 주문`, `맛있는 주문`, `인기 가게 주문`, `무지개 음료 주문` 4단계를 실제 문제 풀이 흐름으로 도달해 캡처했습니다.

## 9. 검증 명령

- `node scripts/check-rule-consistency.mjs`
- `node scripts/check-stage-ratio.mjs`
- `node scripts/qa-lesson5-drink-order-model.mjs --runs 10000`
- `node scripts/simulate-lesson5-drink-order.mjs --runs 10000`
- Browser QA: Chrome CDP 자동 캡처로 데스크톱과 태블릿 가로 화면 확인

실행 결과: 위 명령과 브라우저 QA 모두 통과했습니다.

## 10. 2026-07-12 이미지 설명·엔진 소스 리마스터

- 2쪽 설명을 생성 포스터로 교체했습니다. 1쪽은 `mL` 계산과 `1000mL = 1L`, 2쪽은 10문제·주문 보상·마지막 결과를 보여 줍니다.
- `_lessons/3-2-5-2-mathmon-drink-order/lesson.json`을 만들고 공통 엔진 빌드 대상으로 옮겼습니다.
- 공유 모델 경로를 빌더와 계약 검사기가 읽도록 `sourceFiles` 계약을 적용했습니다.
- 결과 상태 세트: 4장, 컨택시트 `result-states-contact-sheet.png`
- 매스몬 팩: `zero-factory-animal-pack` / `zfa-04-nyangnyangmon`
- `node scripts/qa-lesson5-drink-order-model.mjs --runs 10000` 통과 (`100,000`문제)
- `node scripts/qa-lesson-flow.mjs 3-2-5-2-mathmon-drink-order` 통과
- 데스크톱 `1280×800`, 태블릿 가로 `1024×768`에서 깨진 이미지·텍스트 넘침·요소 겹침·Stage 밖 이탈 `0건`

## 11. 2026-07-28 전체 점검과 수정

- 닫힌 주문 컵 1장과 `smallOrder`, `bigOrder`, `styleOrder`, `smallOnly`, `specialOrder`, `repair` 6상태 개별 512×512 장면으로 보상 화면을 교체했습니다.
- 결과는 `hybrid-generated-dynamic`으로 바꾸고 결과 제목, 가게 인기, 진행 막대, 바로 맞힌 수, 다음 목표, 다시 버튼을 왼쪽 한 축에 정렬했습니다.
- 결과 4상태를 `1280×800` PNG/WebP로 맞추고 데스크톱·태블릿에서 각각 모두 캡처했습니다.
- Humanizer QA에서 수학 판단이 아닌 `알 수 없어요` 선택지를 삭제했습니다. 주문 비교의 `/` 구분도 가운데점 `·`으로 바꿔 소리 내어 읽기 자연스럽게 했습니다.
- 이미지 생성은 Codex 내장 `imagegen`을 사용했습니다. 최종 프롬프트는 “냥냥몬 음료 가게, 글자 없는 3×2 정사각 패널, 작은 주문·큰 주문·달콤 주문·흘린 컵·무지개 주문·다시 만들기, 같은 카메라와 조명, UI·문자·숫자 없음”과 “같은 장면의 닫힌 주문 컵, 정사각, 문자 없음”입니다.
- 원본 묶음: `reward-events-v2-source.png`, 닫힌 원본: `reward-event-closed-v2-source.png`; 런타임은 상태별 `reward-event-*-generated.webp`이며 전수표는 `reward-events-v3-contact-sheet.png`입니다.
- `check-lesson-contract`, `check-lesson-visual-contract`, 100,000문항 모델 QA, 10,000회 보상 시뮬레이션, 두 viewport 전체 흐름 QA가 PASS입니다.

## 2026-07-31 최종 회귀

- 통합 보상 사건 `64% / 15% / 12% / 5% / 3.8% / 0.2%`, 오답 최초 1회 `-6~-3`을 고정 하네스로 검증했습니다. 빈 사건은 누적값을 유지합니다.
- `1280×800`, `1024×768`에서 긴 문제도 학습 그림이 문제 카드 안에 남고, 오답·각 계산 단계·마지막 확인·보상·결과까지 넘침·교차·누락 `0건`임을 확인했습니다.
- 완료 상태는 선택지만 접고 문제 그림·정답이 들어간 계산판·완성 문장·다음 행동을 그대로 보여 줍니다. `calculation-preserved-v1` 하네스가 대기↔완료 계산판 경계 오차 `1px` 이하와 완료 요소 교차 `0px`를 검사합니다.
- `sourceFiles`는 5단원 들이·무게용 공용 모델·뷰·스타일을 의도적으로 참조하며, 차시별 `workbench.type`과 전용 모델 QA로 문제 유형을 분리합니다.

## 2026-08-01 비교·보상 문구 회귀

- 주문량이 같은 경우 `같아요`가 실제 정답으로 생성됩니다. 전용 10,000회 모델 QA가 동률 정답 발생을 검사합니다.
- 보상은 닫힌 상태 `두근두근!`, 열린 상태 `이번 변화 +N` 또는 `이번 변화 0`만 보여 줍니다.

## 2026-08-01 모델·브라우저 최종 회귀

- 10,000회 실행, 100,000문항에서 `같아요` 정답 5,906건을 확인했습니다.
- 더하기 마지막 지시는 `다 더한 들이를 골라요.`, 빼기 첫 지시는 `1L를 1000mL로 바꿔요.`, 마지막 지시는 `다 뺀 뒤의 들이를 골라요.`로 한 화면 한 행동을 유지합니다.
- `L까지 더한/뺀`과 `1L 줄이고 1000mL 늘려요` 같은 교사용·두 행동 문구는 제거했고, 전용 모델 QA가 되돌아오지 않게 검사합니다.
- desktop `1280×800`, tablet landscape `1024×768` 전체 흐름의 넘침·교차·누락은 `0건`입니다.

## 2026-08-01 Kiro 8차 심층 회귀

- 왼쪽에 L·mL 세로 계산판을 추가했습니다. 대기에는 원래 두 수, 첫 정답 뒤에는 L 합과 mL 합, 단위 바꾸기 뒤에는 정규화한 값, 마지막에는 완성 들이가 차례로 누적됩니다. 빼기에서도 처음 들이를 지우지 않고 빌려 온 수를 위에 따로 표시합니다.
- 오답 문구는 `답보다 1L 많아요`처럼 정답 차이를 알려 주지 않고 `고른 수가 너무 커요/작아요. 계산판을 다시 봐요.`로 바꿨습니다.
- `primary-calculation-accumulates-v1` 하네스가 세 단계 누적값 `1→2→3`, 실색, 실제 정보, 넘침 `0건`을 검사합니다. 100,000회 실행·1,000,000문항에서 동률 정답 `59,465건`을 확인했습니다.

## 2026-08-01 최종 보상 선조정·왼쪽 진행 보상 v1

- 최종 결과를 먼저 `작은 컵 주문 → 맛있는 주문 → 음료 쟁반 주문 → 인기 가게 주문 → 황금 축제 주문 → 무지개 음료 주문` 6단계로 확정했습니다. 기준은 `0/0`, `15/2`, `35/4`, `55/6`, `78/8`, 특별 `100/1`입니다.
- 최종 결과 원본은 `result-order-*-v5-source.png`, 런타임은 `result-order-*-generated.webp`, 자산 컨택시트는 `result-tiers-v5-contact-sheet.png`, 실제 브라우저 컨택시트는 `result-tiers-v5-browser-contact-sheet.png`입니다.
- 여섯 결과 장면은 컵·음료 수·가게 규모·손님 수·조명·색 계열이 단계마다 커지며, 상위 둘은 금빛 궁전과 밤의 무지개 수정 도시로 구분됩니다.
- 결과판 픽셀 중심은 단계별 `423.5`, `387`, `369.5`, `375.5`, `389`, `383.5px`로 검출했고, 선언 축과 최대 오차 `3px` 이하로 연결했습니다.
- 최종 결과 승인 뒤에만 문제 왼쪽 전용 진행 장면 6장을 만들었습니다. 원본은 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-2/play-progress-v1/source/`, 런타임은 `play-drink-v1-*-generated.webp`, 컨택시트는 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-2/play-progress-v1/contact-sheets/play-drink-progress-v1-contact-sheet.png`입니다.
- 진행 이미지는 `768×1536`, `object-fit: contain`이며 최종 결과를 자르거나 재사용하지 않았습니다. 냥냥몬의 같은 카메라·중심·크기·발 기준선과 전신 잘림 `0건`을 유지합니다.
- 현재 원본의 냥냥몬 중심·발 기준선·전신 높이는 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-2/play-progress-v1/contact-sheets/play-drink-progress-v1-anchor-audit.png`에서 6장 전수 확인합니다.
- 패널은 Stage 기준 `left 1.65%`, `top 11%`, `width 19.2%`, `height 84%`입니다. 전환은 모달 닫힘 뒤 `320ms`를 두고 Stage 폭 `35%` 효과와 새 단계 이미지를 `1560ms` 보여 준 뒤 다음 문제로 이동합니다.
- Humanizer 학생 문구 QA에서 패널 문구를 `지금의 주문`, 단계 이름, `가게 인기` 한 줄로 유지했습니다.

## 결과판 내부 결속 v2 (2026-08-03)

- `qa.resultPanelContainmentAudit.standard`를 `result-panel-containment-v2`로 선언했습니다. 결과 배경, 결과 패널, 단계명·정답 수·다시 버튼은 각각 선택 가능한 raster/WebP 레이어이며, 진행값·진행 막대·다음 목표만 동적 UI입니다.
- 안전 여백 `24px` 안에서 패널 네 변, 실제 보이는 rect, hitbox, 요소 간 교차, 공통 중심축 `1px`, 다시 버튼 아트↔hitbox 네 변 `1px`을 검사합니다. 숨긴 다음 목표는 `display:none`과 `0×0` rect를 확인합니다.
- `1280×800`, `1024×768`, `1280×720 DPR2`, `994×632`, `1082×987 DPR2`에서 결과 6단계를 전수 재실행했고, 넘침·요소 겹침·Stage 잘림은 `0건`입니다. 런타임 commit SHA와 lesson JSON SHA도 일치했습니다.

## 2026-08-02 현재 화면 증거

- 시작·설명·문제·보상·결과 상태와 화면 크기별 현재 캡처: `screenshots/report-flow-desktop-contact-sheet.png`, `screenshots/report-flow-tablet-landscape-contact-sheet.png`, `screenshots/report-flow-codex-in-app-contact-sheet.png`, `screenshots/report-flow-user-visibility-contact-sheet.png`, `screenshots/report-flow-user-reported-missing-left-progress-contact-sheet.png`, `screenshots/report-flow-empty-reward-fixture-contact-sheet.png`
- 현재 실행본 해시와 캡처 목록: `screenshots/report-evidence-manifest.json`

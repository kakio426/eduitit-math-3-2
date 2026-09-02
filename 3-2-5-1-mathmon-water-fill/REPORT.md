# 매스몬 물통 채우기 시합 구현 보고서

기존 `zero-factory-animal-pack`의 펭귄몬 결과 6단계와 `result-tiers-v5-contact-sheet.png`는 그대로 유지했습니다.

진행 장면 증거는 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-1/play-progress-v1/source`, `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-1/play-progress-v1/contact-sheets/play-water-progress-v1-contact-sheet.png`, `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-1/play-progress-v1/contact-sheets/play-water-progress-v1-anchor-audit.png`입니다.

상단 조작은 `stage-top-controls-v2`를 쓰며, 배지 글자 `14px`, 문제 번호 `16px`를 실제 측정 기준으로 삼습니다.

## 2026-09-02 상호작용형 문제 재구현

- 5단원 1차시 범위를 `직접 비교 → 같은 모양의 통에 옮겨 비교 → 같은 종이컵으로 재기 → 공정하지 않은 측정 고치기`로 다시 한정했습니다. `L`, `mL` 단위 관계는 뒤 차시 내용이므로 뺐습니다.
- 1번은 `붓기 전 → 붓는 중 → 붓기 후` 장면을 학생이 직접 실행하고, 물이 모두 들어간 뒤 남은 자리를 근거로 들이를 판단합니다.
- 2~3번은 같은 모양의 비교 통에 옮긴 뒤 물높이를 판단합니다. 4~6번은 같은 종이컵으로 잰 횟수를 비교하고, 7~8번은 몇 컵 차이인지 계산합니다.
- 9번은 서로 다른 컵으로 잰 결과를 비교할 수 없는 이유를 찾고, 10번은 같은 컵으로 다시 재어 공정한 결과를 만듭니다.
- 10문제 모두 수학 판단이 최소 한 번 있고, 과정 조작 또는 방법 선택까지 합친 문제 해결 입력은 문제당 평균 1.9회입니다.
- 직접 붓기 생성 그림은 맥락만 보여 줍니다. 정답은 구조화된 문제 데이터와 조작 뒤 HTML 근거 문장이 함께 결정합니다.
- 모델 QA는 10,000회·100,000문항을 통과했습니다. 전체 브라우저 QA는 등록된 7개 화면 크기에서 201개 상태를 확인했고, 텍스트 잘림·요소 겹침·흐름 중단 없이 통과했습니다.

## 2026-09-01 이전 설계 기록

- 아래 내용은 이전 구현 이력입니다. 현재 수업 범위와 문제 구성은 위 `2026-09-02 상호작용형 문제 재구현`을 기준으로 합니다.
- 당시에는 지도서 5단원 2~3차시의 직접 비교·같은 임의 단위 측정·`1 L = 1000 mL` 흐름을 한 실행본에 함께 넣었습니다.
- 단순 물높이 비교는 두 문제만 남기고, 비교 방법·공정한 단위·단위 관계·두 가지 나타내기를 포함했습니다.
- 공용 `Lesson5MeasurementLabModel`, 생성형 물통 프레임, 왼쪽 24.5% 진행 장면, 큰 확인 문장과 오른쪽 행동 버튼을 적용했습니다.
- 새 튜토리얼과 물통 프레임은 맥락 자산이며 정답 근거는 구조화된 문제 데이터입니다.
- Humanizer QA에서 비교 선택지를 `물을 옮겨 부어 비교해요`처럼 소리 내어 읽기 쉬운 행동 말로 줄이고, 내부 제작 용어와 중복 방향 표시는 학생 화면에서 없앴습니다.
- 모델 10,000회에서 100,000문제를 검사했고, 전체 브라우저 QA는 7개 화면 프로필·195개 상태 캡처로 통과했습니다.

## 2026-08-09 보상 패널 효과·폭 회귀

- 일반 점수 상승은 `is-changing` 패널 플레어만 사용하고 Stage 임팩트는 쓰지 않으며, 표시 시간은 `640ms`입니다. 등급 상승은 `is-tier-up`·진행 장면 교체·Stage 폭 `32% 이상` 임팩트를 사용하고 `1560ms`(최소 읽기 시간 `1200ms`) 유지합니다.
- 왼쪽 진행 패널은 Stage 폭 `24.5%`(`23.4375~25.2%` 허용), 문제 작업 영역과 최소 간격 `1.5625%`로 데스크톱·태블릿에서 측정했습니다. 넘침·교차는 `0건`입니다.
- 현재 실행본에서 `qa-lesson-flow.mjs` 보상 fixture, `check-stage-ratio.mjs`, `check-lesson-contract.mjs`, 학생 보상 문구 브라우저 QA `176/176`을 통과했습니다.

## 2026-08-09 중간 보상 명칭 QA

- 보상 모달의 `이번 변화`·`물통 힘`을 `채우기 점수 +N/-N/0`으로 통일했습니다.
- Chrome `1280×800`, `1024×768`에서 보상 8상태를 전수 확인했습니다. 텍스트 넘침·요소 교차·Stage 이탈은 모두 0건입니다.
- 중앙 보상은 `unit3-modal-art-compact-v2`로 고정했습니다: 카드 `430×480px(43:48)`, Stage 최대 폭 `82%`, 이미지 `250×250px`. reward-only 브라우저 하네스에서 닫힘·열림 실제 rect를 확인했습니다.

## 1. 구현 요약

3학년 2학기 5단원 1차시 `들이 비교`를 단일 HTML 게임으로 구현했습니다. 현재 실행본에서 학생은 물을 옮겨 붓고, 같은 모양의 통과 같은 종이컵을 이용해 들이를 비교합니다.

## 1-1. 엔진화 파일럿

2026-07-09 기준 이 차시는 `mathmon-engine-v1` 파일럿으로 전환했습니다.

- 공용 엔진 소스: `_engine/v1/`
- 차시 소스: `_lessons/3-2-5-1-mathmon-water-fill/`
- 빌드 산출물: `3-2-5-1-mathmon-water-fill/index.html`
- 빌드 명령: `node scripts/build-lesson.mjs 3-2-5-1-mathmon-water-fill`

학생용 배포 표면은 기존과 같습니다. `index.html` 안에 CSS/JS가 인라인으로 들어가며, 이미지 자산은 기존 차시 폴더와 `_shared/result-count/`를 참조합니다.

## 2. 등록

- lesson id: `3-2-5-1`
- folder: `3-2-5-1-mathmon-water-fill`
- title: `매스몬 물통 채우기 시합`
- learningGoal: 들이 비교와 L, mL

## 3. 화면 흐름

```text
첫 화면 -> 설명 -> 문제 -> 보상 -> 결과
```

- 첫 화면: 생성형 배경, 생성형 제목 아트, HTML 목표 문장, 생성형 시작 버튼 아트
- 설명: 2쪽 생성 포스터
- 문제: 큰 문제, 현재 계산판, 한 줄 지시, 선택지만 기본 노출
- 보상: 물통 변화 하나만 표시
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
| `result-tank-*-source.png` / `result-tank-*-generated.webp` | 결과 배경 |
| `result-title-*-source.png` / `result-title-*-generated.webp` | 결과 이름 타이틀 아트 |
| `result-retry-button-source.png` / `result-retry-button-generated.webp` | 생성형 다시 버튼 아트 |

## 5. 매스몬 기준

사용 팩은 `zero-factory-animal-pack`이고 기준 매스몬은 펭귄몬(`zfa-06-penguinmon`)입니다. 차시 폴더에는 매스몬 원본을 복사하지 않고, 커버/보상/결과 장면 생성 단계에서 함께 넣는 방식으로 처리합니다.

## 6. 보상과 확률

정답의 숨은 기본 가산값은 0입니다. 정답 사건은 `64%/+6~+10`, `15%/-5~-2`, `12%/+14~+22`, `5%/+30`, `3.8%/0(누적 유지)`, `0.2%/100(특별)`이며, 오답은 문제당 최초 1회 `-6~-3`입니다.

| 결과 | 조건 |
| --- | --- |
| 작은 물통 | 0 이상, 바로 맞힌 문제 0개 이상 |
| 반짝 물통 | 30 이상, 바로 맞힌 문제 3개 이상 |
| 가득 물통 | 70 이상, 바로 맞힌 문제 7개 이상 |
| 무지개 물탑 | 100 이상, 바로 맞힌 문제 1개 이상, 특별 보상 필요 |

## 7. Humanizer QA

학생 문구는 3학년이 소리 내어 읽고 바로 행동할 수 있는 말로 구성했습니다.

- 첫 화면 목표: `같은 기준으로 들이를 재고 나타내요.`
- 방법 문구: `직접 붓거나 같은 컵으로 재어 들이를 비교해요.`
- 선택지: `물을 옮겨 부어 비교해요.`, `같은 크기의 작은 컵으로 재요.`
- 단위 문구: `1L는 1000mL예요.`
- 변화 없음 보상: `0`

학생 화면에는 내부 작업실 이름이나 제작자용 말을 보이지 않게 합니다.

## 8. 텍스트 넘침·요소 겹침 QA

브라우저 QA에서 등록된 7개 화면 프로필과 195개 상태 캡처를 확인했습니다.

확인 대상:

- 첫 화면
- 설명 1
- 설명 2
- 문제 1단계
- 정답 확인 상태
- 오답 상태
- 보상
- 결과 단계별 화면

확인 결과: 텍스트 넘침 0건, 요소 겹침 0건, Stage 밖 이탈 0건입니다. 결과 화면은 `작은 물통`, `반짝 물통`, `가득 물통`, `무지개 물탑` 4단계를 실제 문제 풀이 흐름으로 도달해 캡처했습니다.

## 9. 검증 명령

엔진화 파일럿 검증:

- `node scripts/build-lesson.mjs 3-2-5-1-mathmon-water-fill` 통과
- `node scripts/check-lesson-contract.mjs` 통과
- `node scripts/qa-lesson5-water-fill-model.mjs --runs 1000` 통과
- `node scripts/simulate-lesson5-water-fill.mjs --runs 1000` 통과

루트 Stage 검사:

- `node scripts/check-stage-ratio.mjs` 통과 (`24`개 차시, `16:10` / `1280×800`)

Browser QA:

- `node scripts/qa-engine-water-fill-flow.mjs` 통과
- desktop `1280x800`과 tablet landscape `1024x768`에서 첫 화면, 설정 모달, 설명 1·2, 문제 1단계, 정답 확인, 보상, 결과 흐름을 확인했습니다.
- 현재 캡처: `screenshots/engine-flow-desktop-*.png`, `screenshots/engine-flow-tablet-landscape-*.png`

## 10. 2026-07-12 이미지 설명 리마스터

- 어두운 HTML 설명 카드를 2쪽 생성 포스터로 교체했습니다.
- 1쪽은 눈금에서 들이를 고르는 행동 하나, 2쪽은 10문제·물통 보상·마지막 결과만 보여 줍니다.
- 포스터 런타임 크기: `1280×800`, `object-fit: cover`
- 결과 상태 세트: 4장, 컨택시트 `result-states-contact-sheet.png`
- 매스몬 팩: `zero-factory-animal-pack` / `zfa-06-penguinmon`
- `node scripts/qa-lesson-flow.mjs 3-2-5-1-mathmon-water-fill` 통과
- 데스크톱 `1280×800`, 태블릿 가로 `1024×768` 전체 흐름에서 깨진 이미지·텍스트 넘침·요소 겹침·Stage 밖 이탈 `0건`

## 11. 2026-07-28 전체 점검과 수정

- 기존 보상 화면은 닫힘과 공개 상태의 시각 차이가 작고 중앙 그림이 흐렸습니다. 닫힌 물 캡슐 1장과 `smallFlow`, `bigFlow`, `shineFlow`, `smallOnly`, `specialFlow`, `repair` 6상태 개별 512×512 장면으로 교체했습니다.
- 결과는 `hybrid-generated-dynamic`으로 바꾸고 결과 제목, 물통 힘, 진행 막대, 바로 맞힌 수, 다음 목표, 다시 버튼을 왼쪽 한 축에 정렬했습니다.
- 결과 4상태를 `1280×800` PNG/WebP로 맞추고 데스크톱·태블릿에서 각각 모두 캡처했습니다.
- Humanizer QA에서 수학 판단이 아닌 `알 수 없어요` 선택지를 삭제하고, 비교 문제에는 실제로 고를 수 있는 세 선택지만 남겼습니다.
- 이미지 생성은 Codex 내장 `imagegen`을 사용했습니다. 최종 프롬프트는 “펭귄몬 물 연구실, 글자 없는 3×2 정사각 패널, 작은 물방울·큰 물줄기·반짝 물방울·살짝 튄 물·무지개 물줄기·다시 채우기, 같은 카메라와 조명, UI·문자·숫자 없음”과 “같은 장면의 닫힌 투명 물 캡슐, 정사각, 문자 없음”입니다.
- 원본 묶음: `reward-events-v2-source.png`, 닫힌 원본: `reward-event-closed-v2-source.png`; 런타임은 상태별 `reward-event-*-generated.webp`이며 전수표는 `reward-events-v3-contact-sheet.png`입니다.
- `check-lesson-contract`, `check-lesson-visual-contract`, 100,000문항 모델 QA, 10,000회 보상 시뮬레이션, 두 viewport 전체 흐름 QA가 PASS입니다.

## 2026-07-31 최종 회귀

- 통합 보상 사건 `64% / 15% / 12% / 5% / 3.8% / 0.2%`, 오답 최초 1회 `-6~-3`을 고정 하네스로 검증했습니다. 빈 사건은 누적값을 유지합니다.
- 완료 상태는 선택지만 접고 문제 그림·정답이 들어간 계산판·완성 문장·다음 행동을 그대로 보여 줍니다. `calculation-preserved-v1` 하네스가 대기↔완료 계산판 경계 오차 `1px` 이하와 완료 요소 교차 `0px`를 검사합니다.
- 현재 실행 엔진 이전 캡처는 `screenshots/_archive/pre-20260801-engine-flow/`로 옮겨 현재 증거와 분리했습니다.
- `1280×800`, `1024×768`에서 확대한 학습판, 16px 상단 글자, 42px 설정 버튼, 오답 시 실제 선택값 표시, 560×480 보상 카드와 250×250 그림을 확인했습니다. 넘침·교차·누락은 `0건`입니다.

## 2026-08-01 비교·보상 문구 회귀

- `같아요`가 실제 정답인 문제가 10,000회 실행에서 6,156회 생성됐습니다.
- 보상은 닫힌 상태 `두근두근!`, 열린 상태 `이번 변화 +N` 또는 `이번 변화 0`만 보여 줍니다.

## 2026-08-01 모델·브라우저 최종 회귀

- 10,000회 실행, 100,000문항에서 `같아요` 정답 6,156건을 확인했습니다.
- 눈금 확인은 `눈금은 300mL예요.`, `300mL가 들어갔어요.`처럼 수 단위에 바로 이어지는 자연스러운 말로 통일했습니다. 전용 모델 QA가 `이에요`와 잘못 붙은 조사를 문제 은행 전체에서 차단합니다.
- desktop `1280×800`, tablet landscape `1024×768` 전체 흐름의 넘침·교차·누락은 `0건`입니다.

## 2026-08-01 Kiro 8차 심층 회귀

- 왼쪽 문제판에 `눈금 읽기/비교판`을 추가했습니다. 대기에는 실제 눈금 정보와 `?` 하나, 정답 확인에는 학생이 고른 들이 또는 비교 부호가 같은 판에 들어갑니다.
- `primary-calculation-accumulates-v1` 브라우저 하네스가 대기 정보 2개 이상, 오답 때 답 누적 `0`, 정답 때 누적 `1`, 불투명 표면, 넘침 `0건`을 desktop·tablet에서 검사합니다.
- 100,000회 실행·1,000,000문항에서 `같아요` 정답 `60,918건`을 확인했습니다.

## 2026-08-01 Kiro 9차 차단 항목 회귀

- 오답 문구에서 정답까지 몇 눈금 차이인지 알려 주지 않고, 학생이 고른 눈금이 물높이보다 높은지 낮은지만 말합니다. 모델 QA가 `정답은`, `차이`, `N칸` 형태의 답 누설을 문제 은행 전체에서 차단합니다.
- 이전 `engine-desktop-*`·`engine-tablet-*` 캡처 18장은 `screenshots/_archive/pre-20260801-legacy-engine-names/`로 옮겼습니다. 현재 루트 캡처는 모두 현재 `index.html` 이후에 생성된 증거입니다.

## 2026-08-01 최종 결과 대비 선행 조정

- 기존 결과 4장은 배경·펭귄몬·물통 수·무지개 물탑이 사실상 같은 장면이라 등급 차이가 없었습니다. 왼쪽 진행 보상을 만들기 전에 최종 결과를 먼저 6단계로 다시 만들었습니다.
- 현재 결과는 `작은 물통 → 반짝 물통 → 물줄기 물통 → 가득 물통 → 황금 물탑 → 무지개 물탑`입니다. 일반 기준은 `0/0, 15/2, 35/4, 55/6, 78/8`, 특별 기준은 `100/1`입니다.
- 결과 6장은 각각 다른 1280×800 완성 장면입니다. 하위는 작은 컵과 단일 탱크, 중간은 복수 탱크와 청보라 대형 시설, 상위는 황금 물궁전과 무지개 결정 도시로 장면 자체가 달라집니다.
- 컨택시트는 `result-tiers-v5-contact-sheet.png`입니다. 결과판 내부 픽셀 축은 `363, 360.5, 306, 314, 310, 323.5px`이며 동적 UI의 단계별 선언 축과 최대 `3px` 이내입니다.
- 처음 측정에서 제목 아트와 물통 힘 글자가 `0.36px` 겹쳐 실패해 결과판 슬롯을 다시 배분했습니다. 현재 제목·힘·막대·정답 수·다음 목표·다시 버튼 사이 간격은 하네스 기준을 통과합니다.

## 2026-08-01 왼쪽 진행 보상 연결

- 승인된 최종 결과 6단계를 기준으로 문제 화면 전용 세로 장면 6장을 새로 생성했습니다. 최종 결과 이미지를 자르거나 재사용하지 않았습니다.
- 첫 장에서 펭귄몬의 정면 카메라·중심·크기·발 기준선을 고정하고 나머지 다섯 장을 같은 첫 장에서 편집했습니다. 전신과 두 발 잘림, 검은 띠, 이미지 늘어남은 `0건`입니다.
- 런타임은 `play-water-v1-*-generated.webp` 6장, 각 768×1536, `object-fit: contain`입니다. 원본은 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-1/play-progress-v1/source`, 컨택시트는 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-1/play-progress-v1/contact-sheets/play-water-progress-v1-contact-sheet.png`에 보관합니다.
- 현재 원본의 펭귄몬 중심·발 기준선·전신 높이는 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-1/play-progress-v1/contact-sheets/play-water-progress-v1-anchor-audit.png`에서 6장 전수 확인합니다.
- 패널은 Stage 기준 `left 1.65%`, `top 11%`, `width 24.5%`, `height 84%`입니다. 다섯 화면에서 선언 좌표와 실제 네 변의 최대 오차는 `0.02px` 미만이며 학습 영역 교차는 `0px`입니다.
- 모달을 완전히 닫은 뒤 `320ms`를 두고 장면을 바꾸며, Stage 폭 `35%`의 효과를 `1560ms` 표시합니다. 문제 번호는 최소 `1200ms` 동안 고정됩니다.
- `1280×800`, `1024×768`, `1280×720 DPR 2`, `994×632`, `1082×987 DPR 2` 전체 흐름에서 텍스트 넘침·요소 겹침·이미지 누락은 `0건`입니다.
- `994×632` 회귀에서 기존 물통 그림이 문제 카드 아래로 `7.7px` 벗어나는 실패를 발견해 물통 시각 영역의 고정 최소 높이를 제거했습니다.
- Humanizer 학생 문구 QA에서 새 상태 라벨 `지금의 물통`과 상태 안내를 확인했습니다. 한 화면에는 현재 물통 이름과 물통 힘만 짧게 보여 줍니다.

## 2026-08-02 현재 화면 증거

- 시작·설명·문제·보상·결과 상태와 화면 크기별 현재 캡처: `screenshots/report-flow-desktop-contact-sheet.png`, `screenshots/report-flow-tablet-landscape-contact-sheet.png`, `screenshots/report-flow-codex-in-app-contact-sheet.png`, `screenshots/report-flow-user-visibility-contact-sheet.png`, `screenshots/report-flow-user-reported-missing-left-progress-1082x987-dpr2-contact-sheet.png`, `screenshots/report-flow-empty-reward-fixture-contact-sheet.png`
- 현재 실행본 해시와 캡처 목록: `screenshots/report-evidence-manifest.json`

## 결과판 내부 결속 v2 (2026-08-03)

- `qa.resultPanelContainmentAudit.standard`를 `result-panel-containment-v2`로 선언했습니다. 결과 배경, 결과 패널, 단계명·정답 수·다시 버튼은 각각 선택 가능한 raster/WebP 레이어이며, 진행값·진행 막대·다음 목표만 동적 UI입니다.
- 안전 여백 `24px` 안에서 패널 네 변, 실제 보이는 rect, hitbox, 요소 간 교차, 공통 중심축 `1px`, 다시 버튼 아트↔hitbox 네 변 `1px`을 검사합니다. 숨긴 다음 목표는 `display:none`과 `0×0` rect를 확인합니다.
- `1280×800`, `1024×768`, `1280×720 DPR2`, `994×632`, `1082×987 DPR2`에서 결과 6단계를 전수 재실행했고, 넘침·요소 겹침·Stage 잘림은 `0건`입니다. 런타임 commit SHA와 lesson JSON SHA도 일치했습니다.

<!-- REPORT-EVIDENCE-ALL:START -->

## 2026-09-02 최신 원본 스크린샷 전수

- 실행본 SHA-256: `aec4e3df0be402063e4f0f606d1d66afd208d93bedd7f5c6f75e20b2834f7450`
- 생성 시각: `2026-09-02T09:58:19.792Z`
- 등록 회귀 이름: `8개`
- 실제 실행 화면 조건: `7개`
- 동일 조건 별칭 통합: `1개`
- 아래에 직접 삽입한 원본 캡처: `207장`
- 같은 width×height×DPR과 같은 fixture 조건은 한 번만 실행하고, 과거 오류 이름은 별칭으로 보존했습니다.
- manifest에 기록된 실제 실행 원본 캡처를 한 장씩 연결했습니다.

### desktop · 1280×800 · DPR 1 · 34장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `full-flow`

![desktop 전체 상태 컨택시트](screenshots/report-flow-desktop-contact-sheet.png)

#### 시작 화면 · `engine-flow-desktop-01-cover.png`

![desktop 시작 화면](screenshots/engine-flow-desktop-01-cover.png)

- 학생이 보는 것: 매스몬 물통 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-desktop-02-settings.png`

![desktop 설정 화면](screenshots/engine-flow-desktop-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-desktop-03-tutorial-1.png`

![desktop 설명 1 · 풀이 방법](screenshots/engine-flow-desktop-03-tutorial-1.png)

- 학생이 보는 것: 들이 비교 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-desktop-04-tutorial-2.png`

![desktop 설명 2 · 보상과 목표](screenshots/engine-flow-desktop-04-tutorial-2.png)

- 학생이 보는 것: 들이 비교 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-desktop-05-play-step1.png`

![desktop 문제 상태 · 05-play-step1](screenshots/engine-flow-desktop-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05a-play-action-result · `engine-flow-desktop-05a-play-action-result.png`

![desktop 문제 상태 · 05a-play-action-result](screenshots/engine-flow-desktop-05a-play-action-result.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05c-direct-pour-correct-feedback · `engine-flow-desktop-05c-direct-pour-correct-feedback.png`

![desktop 정답 확인 · 05c-direct-pour-correct-feedback](screenshots/engine-flow-desktop-05c-direct-pour-correct-feedback.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-desktop-05n-next-problem-clean.png`

![desktop 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-desktop-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p4-misconception-물통-높이만-봐요 · `engine-flow-desktop-05m-p4-misconception-물통-높이만-봐요.png`

![desktop 오개념 확인 · p4-misconception-물통-높이만-봐요](screenshots/engine-flow-desktop-05m-p4-misconception-물통-높이만-봐요.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p4-misconception-서로-다른-컵을-써요 · `engine-flow-desktop-05m-p4-misconception-서로-다른-컵을-써요.png`

![desktop 오개념 확인 · p4-misconception-서로-다른-컵을-써요](screenshots/engine-flow-desktop-05m-p4-misconception-서로-다른-컵을-써요.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-desktop-05b-play-wrong.png`

![desktop 오답 확인 · 05b-play-wrong](screenshots/engine-flow-desktop-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-desktop-06-confirm.png`

![desktop 마지막 확인 · 06-confirm](screenshots/engine-flow-desktop-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-desktop-07-reward-closed.png`

![desktop 닫힌 보상](screenshots/engine-flow-desktop-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 현재 물통 단계 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-desktop-07b-reward-open.png`

![desktop 열린 보상](screenshots/engine-flow-desktop-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 현재 물통 단계 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-desktop-07c-reward-impact.png`

![desktop 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-desktop-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 현재 물통 단계 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-desktop-08-result.png`

![desktop 실제 결과](screenshots/engine-flow-desktop-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · full · `engine-flow-desktop-08c-result-cohesion-full.png`

![desktop 결과 결속 · full](screenshots/engine-flow-desktop-08c-result-cohesion-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · rainbow · `engine-flow-desktop-08c-result-cohesion-rainbow.png`

![desktop 결과 결속 · rainbow](screenshots/engine-flow-desktop-08c-result-cohesion-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · small · `engine-flow-desktop-08c-result-cohesion-small.png`

![desktop 결과 결속 · small](screenshots/engine-flow-desktop-08c-result-cohesion-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · spark · `engine-flow-desktop-08c-result-cohesion-spark.png`

![desktop 결과 결속 · spark](screenshots/engine-flow-desktop-08c-result-cohesion-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · stream · `engine-flow-desktop-08c-result-cohesion-stream.png`

![desktop 결과 결속 · stream](screenshots/engine-flow-desktop-08c-result-cohesion-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · tower · `engine-flow-desktop-08c-result-cohesion-tower.png`

![desktop 결과 결속 · tower](screenshots/engine-flow-desktop-08c-result-cohesion-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-full · `engine-flow-desktop-08v-result-visual-integrity-full.png`

![desktop 결과 상태 · 08v-result-visual-integrity-full](screenshots/engine-flow-desktop-08v-result-visual-integrity-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-rainbow · `engine-flow-desktop-08v-result-visual-integrity-rainbow.png`

![desktop 결과 상태 · 08v-result-visual-integrity-rainbow](screenshots/engine-flow-desktop-08v-result-visual-integrity-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-small · `engine-flow-desktop-08v-result-visual-integrity-small.png`

![desktop 결과 상태 · 08v-result-visual-integrity-small](screenshots/engine-flow-desktop-08v-result-visual-integrity-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-spark · `engine-flow-desktop-08v-result-visual-integrity-spark.png`

![desktop 결과 상태 · 08v-result-visual-integrity-spark](screenshots/engine-flow-desktop-08v-result-visual-integrity-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-stream · `engine-flow-desktop-08v-result-visual-integrity-stream.png`

![desktop 결과 상태 · 08v-result-visual-integrity-stream](screenshots/engine-flow-desktop-08v-result-visual-integrity-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-tower · `engine-flow-desktop-08v-result-visual-integrity-tower.png`

![desktop 결과 상태 · 08v-result-visual-integrity-tower](screenshots/engine-flow-desktop-08v-result-visual-integrity-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · full · `engine-flow-desktop-08a-result-full.png`

![desktop 결과 단계 · full](screenshots/engine-flow-desktop-08a-result-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-desktop-08a-result-rainbow.png`

![desktop 결과 단계 · rainbow](screenshots/engine-flow-desktop-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · small · `engine-flow-desktop-08a-result-small.png`

![desktop 결과 단계 · small](screenshots/engine-flow-desktop-08a-result-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · spark · `engine-flow-desktop-08a-result-spark.png`

![desktop 결과 단계 · spark](screenshots/engine-flow-desktop-08a-result-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · stream · `engine-flow-desktop-08a-result-stream.png`

![desktop 결과 단계 · stream](screenshots/engine-flow-desktop-08a-result-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · tower · `engine-flow-desktop-08a-result-tower.png`

![desktop 결과 단계 · tower](screenshots/engine-flow-desktop-08a-result-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### tablet-landscape · 1024×768 · DPR 1 · 34장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `full-flow`

![tablet-landscape 전체 상태 컨택시트](screenshots/report-flow-tablet-landscape-contact-sheet.png)

#### 시작 화면 · `engine-flow-tablet-landscape-01-cover.png`

![tablet-landscape 시작 화면](screenshots/engine-flow-tablet-landscape-01-cover.png)

- 학생이 보는 것: 매스몬 물통 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-tablet-landscape-02-settings.png`

![tablet-landscape 설정 화면](screenshots/engine-flow-tablet-landscape-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-tablet-landscape-03-tutorial-1.png`

![tablet-landscape 설명 1 · 풀이 방법](screenshots/engine-flow-tablet-landscape-03-tutorial-1.png)

- 학생이 보는 것: 들이 비교 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-tablet-landscape-04-tutorial-2.png`

![tablet-landscape 설명 2 · 보상과 목표](screenshots/engine-flow-tablet-landscape-04-tutorial-2.png)

- 학생이 보는 것: 들이 비교 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-tablet-landscape-05-play-step1.png`

![tablet-landscape 문제 상태 · 05-play-step1](screenshots/engine-flow-tablet-landscape-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05a-play-action-result · `engine-flow-tablet-landscape-05a-play-action-result.png`

![tablet-landscape 문제 상태 · 05a-play-action-result](screenshots/engine-flow-tablet-landscape-05a-play-action-result.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05c-direct-pour-correct-feedback · `engine-flow-tablet-landscape-05c-direct-pour-correct-feedback.png`

![tablet-landscape 정답 확인 · 05c-direct-pour-correct-feedback](screenshots/engine-flow-tablet-landscape-05c-direct-pour-correct-feedback.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-tablet-landscape-05n-next-problem-clean.png`

![tablet-landscape 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-tablet-landscape-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p4-misconception-물통-높이만-봐요 · `engine-flow-tablet-landscape-05m-p4-misconception-물통-높이만-봐요.png`

![tablet-landscape 오개념 확인 · p4-misconception-물통-높이만-봐요](screenshots/engine-flow-tablet-landscape-05m-p4-misconception-물통-높이만-봐요.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p4-misconception-서로-다른-컵을-써요 · `engine-flow-tablet-landscape-05m-p4-misconception-서로-다른-컵을-써요.png`

![tablet-landscape 오개념 확인 · p4-misconception-서로-다른-컵을-써요](screenshots/engine-flow-tablet-landscape-05m-p4-misconception-서로-다른-컵을-써요.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-tablet-landscape-05b-play-wrong.png`

![tablet-landscape 오답 확인 · 05b-play-wrong](screenshots/engine-flow-tablet-landscape-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-tablet-landscape-06-confirm.png`

![tablet-landscape 마지막 확인 · 06-confirm](screenshots/engine-flow-tablet-landscape-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-tablet-landscape-07-reward-closed.png`

![tablet-landscape 닫힌 보상](screenshots/engine-flow-tablet-landscape-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 현재 물통 단계 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-tablet-landscape-07b-reward-open.png`

![tablet-landscape 열린 보상](screenshots/engine-flow-tablet-landscape-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 현재 물통 단계 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-tablet-landscape-07c-reward-impact.png`

![tablet-landscape 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-tablet-landscape-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 현재 물통 단계 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-tablet-landscape-08-result.png`

![tablet-landscape 실제 결과](screenshots/engine-flow-tablet-landscape-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · full · `engine-flow-tablet-landscape-08c-result-cohesion-full.png`

![tablet-landscape 결과 결속 · full](screenshots/engine-flow-tablet-landscape-08c-result-cohesion-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · rainbow · `engine-flow-tablet-landscape-08c-result-cohesion-rainbow.png`

![tablet-landscape 결과 결속 · rainbow](screenshots/engine-flow-tablet-landscape-08c-result-cohesion-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · small · `engine-flow-tablet-landscape-08c-result-cohesion-small.png`

![tablet-landscape 결과 결속 · small](screenshots/engine-flow-tablet-landscape-08c-result-cohesion-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · spark · `engine-flow-tablet-landscape-08c-result-cohesion-spark.png`

![tablet-landscape 결과 결속 · spark](screenshots/engine-flow-tablet-landscape-08c-result-cohesion-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · stream · `engine-flow-tablet-landscape-08c-result-cohesion-stream.png`

![tablet-landscape 결과 결속 · stream](screenshots/engine-flow-tablet-landscape-08c-result-cohesion-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · tower · `engine-flow-tablet-landscape-08c-result-cohesion-tower.png`

![tablet-landscape 결과 결속 · tower](screenshots/engine-flow-tablet-landscape-08c-result-cohesion-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-full · `engine-flow-tablet-landscape-08v-result-visual-integrity-full.png`

![tablet-landscape 결과 상태 · 08v-result-visual-integrity-full](screenshots/engine-flow-tablet-landscape-08v-result-visual-integrity-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-rainbow · `engine-flow-tablet-landscape-08v-result-visual-integrity-rainbow.png`

![tablet-landscape 결과 상태 · 08v-result-visual-integrity-rainbow](screenshots/engine-flow-tablet-landscape-08v-result-visual-integrity-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-small · `engine-flow-tablet-landscape-08v-result-visual-integrity-small.png`

![tablet-landscape 결과 상태 · 08v-result-visual-integrity-small](screenshots/engine-flow-tablet-landscape-08v-result-visual-integrity-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-spark · `engine-flow-tablet-landscape-08v-result-visual-integrity-spark.png`

![tablet-landscape 결과 상태 · 08v-result-visual-integrity-spark](screenshots/engine-flow-tablet-landscape-08v-result-visual-integrity-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-stream · `engine-flow-tablet-landscape-08v-result-visual-integrity-stream.png`

![tablet-landscape 결과 상태 · 08v-result-visual-integrity-stream](screenshots/engine-flow-tablet-landscape-08v-result-visual-integrity-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-tower · `engine-flow-tablet-landscape-08v-result-visual-integrity-tower.png`

![tablet-landscape 결과 상태 · 08v-result-visual-integrity-tower](screenshots/engine-flow-tablet-landscape-08v-result-visual-integrity-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · full · `engine-flow-tablet-landscape-08a-result-full.png`

![tablet-landscape 결과 단계 · full](screenshots/engine-flow-tablet-landscape-08a-result-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-tablet-landscape-08a-result-rainbow.png`

![tablet-landscape 결과 단계 · rainbow](screenshots/engine-flow-tablet-landscape-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · small · `engine-flow-tablet-landscape-08a-result-small.png`

![tablet-landscape 결과 단계 · small](screenshots/engine-flow-tablet-landscape-08a-result-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · spark · `engine-flow-tablet-landscape-08a-result-spark.png`

![tablet-landscape 결과 단계 · spark](screenshots/engine-flow-tablet-landscape-08a-result-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · stream · `engine-flow-tablet-landscape-08a-result-stream.png`

![tablet-landscape 결과 단계 · stream](screenshots/engine-flow-tablet-landscape-08a-result-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · tower · `engine-flow-tablet-landscape-08a-result-tower.png`

![tablet-landscape 결과 단계 · tower](screenshots/engine-flow-tablet-landscape-08a-result-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### codex-in-app · 1280×720 · DPR 2 · 34장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `full-flow`

![codex-in-app 전체 상태 컨택시트](screenshots/report-flow-codex-in-app-contact-sheet.png)

#### 시작 화면 · `engine-flow-codex-in-app-01-cover.png`

![codex-in-app 시작 화면](screenshots/engine-flow-codex-in-app-01-cover.png)

- 학생이 보는 것: 매스몬 물통 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-codex-in-app-02-settings.png`

![codex-in-app 설정 화면](screenshots/engine-flow-codex-in-app-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-codex-in-app-03-tutorial-1.png`

![codex-in-app 설명 1 · 풀이 방법](screenshots/engine-flow-codex-in-app-03-tutorial-1.png)

- 학생이 보는 것: 들이 비교 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-codex-in-app-04-tutorial-2.png`

![codex-in-app 설명 2 · 보상과 목표](screenshots/engine-flow-codex-in-app-04-tutorial-2.png)

- 학생이 보는 것: 들이 비교 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-codex-in-app-05-play-step1.png`

![codex-in-app 문제 상태 · 05-play-step1](screenshots/engine-flow-codex-in-app-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05a-play-action-result · `engine-flow-codex-in-app-05a-play-action-result.png`

![codex-in-app 문제 상태 · 05a-play-action-result](screenshots/engine-flow-codex-in-app-05a-play-action-result.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05c-direct-pour-correct-feedback · `engine-flow-codex-in-app-05c-direct-pour-correct-feedback.png`

![codex-in-app 정답 확인 · 05c-direct-pour-correct-feedback](screenshots/engine-flow-codex-in-app-05c-direct-pour-correct-feedback.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-codex-in-app-05n-next-problem-clean.png`

![codex-in-app 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-codex-in-app-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p4-misconception-물통-높이만-봐요 · `engine-flow-codex-in-app-05m-p4-misconception-물통-높이만-봐요.png`

![codex-in-app 오개념 확인 · p4-misconception-물통-높이만-봐요](screenshots/engine-flow-codex-in-app-05m-p4-misconception-물통-높이만-봐요.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p4-misconception-서로-다른-컵을-써요 · `engine-flow-codex-in-app-05m-p4-misconception-서로-다른-컵을-써요.png`

![codex-in-app 오개념 확인 · p4-misconception-서로-다른-컵을-써요](screenshots/engine-flow-codex-in-app-05m-p4-misconception-서로-다른-컵을-써요.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-codex-in-app-05b-play-wrong.png`

![codex-in-app 오답 확인 · 05b-play-wrong](screenshots/engine-flow-codex-in-app-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-codex-in-app-06-confirm.png`

![codex-in-app 마지막 확인 · 06-confirm](screenshots/engine-flow-codex-in-app-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-codex-in-app-07-reward-closed.png`

![codex-in-app 닫힌 보상](screenshots/engine-flow-codex-in-app-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 현재 물통 단계 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-codex-in-app-07b-reward-open.png`

![codex-in-app 열린 보상](screenshots/engine-flow-codex-in-app-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 현재 물통 단계 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-codex-in-app-07c-reward-impact.png`

![codex-in-app 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-codex-in-app-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 현재 물통 단계 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-codex-in-app-08-result.png`

![codex-in-app 실제 결과](screenshots/engine-flow-codex-in-app-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · full · `engine-flow-codex-in-app-08c-result-cohesion-full.png`

![codex-in-app 결과 결속 · full](screenshots/engine-flow-codex-in-app-08c-result-cohesion-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · rainbow · `engine-flow-codex-in-app-08c-result-cohesion-rainbow.png`

![codex-in-app 결과 결속 · rainbow](screenshots/engine-flow-codex-in-app-08c-result-cohesion-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · small · `engine-flow-codex-in-app-08c-result-cohesion-small.png`

![codex-in-app 결과 결속 · small](screenshots/engine-flow-codex-in-app-08c-result-cohesion-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · spark · `engine-flow-codex-in-app-08c-result-cohesion-spark.png`

![codex-in-app 결과 결속 · spark](screenshots/engine-flow-codex-in-app-08c-result-cohesion-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · stream · `engine-flow-codex-in-app-08c-result-cohesion-stream.png`

![codex-in-app 결과 결속 · stream](screenshots/engine-flow-codex-in-app-08c-result-cohesion-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · tower · `engine-flow-codex-in-app-08c-result-cohesion-tower.png`

![codex-in-app 결과 결속 · tower](screenshots/engine-flow-codex-in-app-08c-result-cohesion-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-full · `engine-flow-codex-in-app-08v-result-visual-integrity-full.png`

![codex-in-app 결과 상태 · 08v-result-visual-integrity-full](screenshots/engine-flow-codex-in-app-08v-result-visual-integrity-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-rainbow · `engine-flow-codex-in-app-08v-result-visual-integrity-rainbow.png`

![codex-in-app 결과 상태 · 08v-result-visual-integrity-rainbow](screenshots/engine-flow-codex-in-app-08v-result-visual-integrity-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-small · `engine-flow-codex-in-app-08v-result-visual-integrity-small.png`

![codex-in-app 결과 상태 · 08v-result-visual-integrity-small](screenshots/engine-flow-codex-in-app-08v-result-visual-integrity-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-spark · `engine-flow-codex-in-app-08v-result-visual-integrity-spark.png`

![codex-in-app 결과 상태 · 08v-result-visual-integrity-spark](screenshots/engine-flow-codex-in-app-08v-result-visual-integrity-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-stream · `engine-flow-codex-in-app-08v-result-visual-integrity-stream.png`

![codex-in-app 결과 상태 · 08v-result-visual-integrity-stream](screenshots/engine-flow-codex-in-app-08v-result-visual-integrity-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-tower · `engine-flow-codex-in-app-08v-result-visual-integrity-tower.png`

![codex-in-app 결과 상태 · 08v-result-visual-integrity-tower](screenshots/engine-flow-codex-in-app-08v-result-visual-integrity-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · full · `engine-flow-codex-in-app-08a-result-full.png`

![codex-in-app 결과 단계 · full](screenshots/engine-flow-codex-in-app-08a-result-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-codex-in-app-08a-result-rainbow.png`

![codex-in-app 결과 단계 · rainbow](screenshots/engine-flow-codex-in-app-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · small · `engine-flow-codex-in-app-08a-result-small.png`

![codex-in-app 결과 단계 · small](screenshots/engine-flow-codex-in-app-08a-result-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · spark · `engine-flow-codex-in-app-08a-result-spark.png`

![codex-in-app 결과 단계 · spark](screenshots/engine-flow-codex-in-app-08a-result-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · stream · `engine-flow-codex-in-app-08a-result-stream.png`

![codex-in-app 결과 단계 · stream](screenshots/engine-flow-codex-in-app-08a-result-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · tower · `engine-flow-codex-in-app-08a-result-tower.png`

![codex-in-app 결과 단계 · tower](screenshots/engine-flow-codex-in-app-08a-result-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### user-visibility · 994×632 · DPR 1 · 34장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `full-flow`

![user-visibility 전체 상태 컨택시트](screenshots/report-flow-user-visibility-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-visibility-01-cover.png`

![user-visibility 시작 화면](screenshots/engine-flow-user-visibility-01-cover.png)

- 학생이 보는 것: 매스몬 물통 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-visibility-02-settings.png`

![user-visibility 설정 화면](screenshots/engine-flow-user-visibility-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-visibility-03-tutorial-1.png`

![user-visibility 설명 1 · 풀이 방법](screenshots/engine-flow-user-visibility-03-tutorial-1.png)

- 학생이 보는 것: 들이 비교 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-visibility-04-tutorial-2.png`

![user-visibility 설명 2 · 보상과 목표](screenshots/engine-flow-user-visibility-04-tutorial-2.png)

- 학생이 보는 것: 들이 비교 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-visibility-05-play-step1.png`

![user-visibility 문제 상태 · 05-play-step1](screenshots/engine-flow-user-visibility-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05a-play-action-result · `engine-flow-user-visibility-05a-play-action-result.png`

![user-visibility 문제 상태 · 05a-play-action-result](screenshots/engine-flow-user-visibility-05a-play-action-result.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05c-direct-pour-correct-feedback · `engine-flow-user-visibility-05c-direct-pour-correct-feedback.png`

![user-visibility 정답 확인 · 05c-direct-pour-correct-feedback](screenshots/engine-flow-user-visibility-05c-direct-pour-correct-feedback.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-user-visibility-05n-next-problem-clean.png`

![user-visibility 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-user-visibility-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p4-misconception-물통-높이만-봐요 · `engine-flow-user-visibility-05m-p4-misconception-물통-높이만-봐요.png`

![user-visibility 오개념 확인 · p4-misconception-물통-높이만-봐요](screenshots/engine-flow-user-visibility-05m-p4-misconception-물통-높이만-봐요.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p4-misconception-서로-다른-컵을-써요 · `engine-flow-user-visibility-05m-p4-misconception-서로-다른-컵을-써요.png`

![user-visibility 오개념 확인 · p4-misconception-서로-다른-컵을-써요](screenshots/engine-flow-user-visibility-05m-p4-misconception-서로-다른-컵을-써요.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-user-visibility-05b-play-wrong.png`

![user-visibility 오답 확인 · 05b-play-wrong](screenshots/engine-flow-user-visibility-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-visibility-06-confirm.png`

![user-visibility 마지막 확인 · 06-confirm](screenshots/engine-flow-user-visibility-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-visibility-07-reward-closed.png`

![user-visibility 닫힌 보상](screenshots/engine-flow-user-visibility-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 현재 물통 단계 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-visibility-07b-reward-open.png`

![user-visibility 열린 보상](screenshots/engine-flow-user-visibility-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 현재 물통 단계 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-user-visibility-07c-reward-impact.png`

![user-visibility 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-user-visibility-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 현재 물통 단계 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-visibility-08-result.png`

![user-visibility 실제 결과](screenshots/engine-flow-user-visibility-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · full · `engine-flow-user-visibility-08c-result-cohesion-full.png`

![user-visibility 결과 결속 · full](screenshots/engine-flow-user-visibility-08c-result-cohesion-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · rainbow · `engine-flow-user-visibility-08c-result-cohesion-rainbow.png`

![user-visibility 결과 결속 · rainbow](screenshots/engine-flow-user-visibility-08c-result-cohesion-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · small · `engine-flow-user-visibility-08c-result-cohesion-small.png`

![user-visibility 결과 결속 · small](screenshots/engine-flow-user-visibility-08c-result-cohesion-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · spark · `engine-flow-user-visibility-08c-result-cohesion-spark.png`

![user-visibility 결과 결속 · spark](screenshots/engine-flow-user-visibility-08c-result-cohesion-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · stream · `engine-flow-user-visibility-08c-result-cohesion-stream.png`

![user-visibility 결과 결속 · stream](screenshots/engine-flow-user-visibility-08c-result-cohesion-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · tower · `engine-flow-user-visibility-08c-result-cohesion-tower.png`

![user-visibility 결과 결속 · tower](screenshots/engine-flow-user-visibility-08c-result-cohesion-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-full · `engine-flow-user-visibility-08v-result-visual-integrity-full.png`

![user-visibility 결과 상태 · 08v-result-visual-integrity-full](screenshots/engine-flow-user-visibility-08v-result-visual-integrity-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-rainbow · `engine-flow-user-visibility-08v-result-visual-integrity-rainbow.png`

![user-visibility 결과 상태 · 08v-result-visual-integrity-rainbow](screenshots/engine-flow-user-visibility-08v-result-visual-integrity-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-small · `engine-flow-user-visibility-08v-result-visual-integrity-small.png`

![user-visibility 결과 상태 · 08v-result-visual-integrity-small](screenshots/engine-flow-user-visibility-08v-result-visual-integrity-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-spark · `engine-flow-user-visibility-08v-result-visual-integrity-spark.png`

![user-visibility 결과 상태 · 08v-result-visual-integrity-spark](screenshots/engine-flow-user-visibility-08v-result-visual-integrity-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-stream · `engine-flow-user-visibility-08v-result-visual-integrity-stream.png`

![user-visibility 결과 상태 · 08v-result-visual-integrity-stream](screenshots/engine-flow-user-visibility-08v-result-visual-integrity-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-tower · `engine-flow-user-visibility-08v-result-visual-integrity-tower.png`

![user-visibility 결과 상태 · 08v-result-visual-integrity-tower](screenshots/engine-flow-user-visibility-08v-result-visual-integrity-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · full · `engine-flow-user-visibility-08a-result-full.png`

![user-visibility 결과 단계 · full](screenshots/engine-flow-user-visibility-08a-result-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-user-visibility-08a-result-rainbow.png`

![user-visibility 결과 단계 · rainbow](screenshots/engine-flow-user-visibility-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · small · `engine-flow-user-visibility-08a-result-small.png`

![user-visibility 결과 단계 · small](screenshots/engine-flow-user-visibility-08a-result-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · spark · `engine-flow-user-visibility-08a-result-spark.png`

![user-visibility 결과 단계 · spark](screenshots/engine-flow-user-visibility-08a-result-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · stream · `engine-flow-user-visibility-08a-result-stream.png`

![user-visibility 결과 단계 · stream](screenshots/engine-flow-user-visibility-08a-result-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · tower · `engine-flow-user-visibility-08a-result-tower.png`

![user-visibility 결과 단계 · tower](screenshots/engine-flow-user-visibility-08a-result-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### user-reported-missing-left-progress-1082x987-dpr2 · 1082×987 · DPR 2 · 34장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `full-flow`

![user-reported-missing-left-progress-1082x987-dpr2 전체 상태 컨택시트](screenshots/report-flow-user-reported-missing-left-progress-1082x987-dpr2-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-01-cover.png`

![user-reported-missing-left-progress-1082x987-dpr2 시작 화면](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-01-cover.png)

- 학생이 보는 것: 매스몬 물통 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-02-settings.png`

![user-reported-missing-left-progress-1082x987-dpr2 설정 화면](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-03-tutorial-1.png`

![user-reported-missing-left-progress-1082x987-dpr2 설명 1 · 풀이 방법](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-03-tutorial-1.png)

- 학생이 보는 것: 들이 비교 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-04-tutorial-2.png`

![user-reported-missing-left-progress-1082x987-dpr2 설명 2 · 보상과 목표](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-04-tutorial-2.png)

- 학생이 보는 것: 들이 비교 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05-play-step1.png`

![user-reported-missing-left-progress-1082x987-dpr2 문제 상태 · 05-play-step1](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05a-play-action-result · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05a-play-action-result.png`

![user-reported-missing-left-progress-1082x987-dpr2 문제 상태 · 05a-play-action-result](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05a-play-action-result.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05c-direct-pour-correct-feedback · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05c-direct-pour-correct-feedback.png`

![user-reported-missing-left-progress-1082x987-dpr2 정답 확인 · 05c-direct-pour-correct-feedback](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05c-direct-pour-correct-feedback.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05n-next-problem-clean.png`

![user-reported-missing-left-progress-1082x987-dpr2 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p4-misconception-물통-높이만-봐요 · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05m-p4-misconception-물통-높이만-봐요.png`

![user-reported-missing-left-progress-1082x987-dpr2 오개념 확인 · p4-misconception-물통-높이만-봐요](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05m-p4-misconception-물통-높이만-봐요.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p4-misconception-서로-다른-컵을-써요 · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05m-p4-misconception-서로-다른-컵을-써요.png`

![user-reported-missing-left-progress-1082x987-dpr2 오개념 확인 · p4-misconception-서로-다른-컵을-써요](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05m-p4-misconception-서로-다른-컵을-써요.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05b-play-wrong.png`

![user-reported-missing-left-progress-1082x987-dpr2 오답 확인 · 05b-play-wrong](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-06-confirm.png`

![user-reported-missing-left-progress-1082x987-dpr2 마지막 확인 · 06-confirm](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-07-reward-closed.png`

![user-reported-missing-left-progress-1082x987-dpr2 닫힌 보상](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 현재 물통 단계 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-07b-reward-open.png`

![user-reported-missing-left-progress-1082x987-dpr2 열린 보상](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 현재 물통 단계 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-07c-reward-impact.png`

![user-reported-missing-left-progress-1082x987-dpr2 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 현재 물통 단계 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08-result.png`

![user-reported-missing-left-progress-1082x987-dpr2 실제 결과](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · full · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08c-result-cohesion-full.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 결속 · full](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08c-result-cohesion-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · rainbow · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08c-result-cohesion-rainbow.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 결속 · rainbow](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08c-result-cohesion-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · small · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08c-result-cohesion-small.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 결속 · small](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08c-result-cohesion-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · spark · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08c-result-cohesion-spark.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 결속 · spark](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08c-result-cohesion-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · stream · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08c-result-cohesion-stream.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 결속 · stream](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08c-result-cohesion-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · tower · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08c-result-cohesion-tower.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 결속 · tower](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08c-result-cohesion-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-full · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08v-result-visual-integrity-full.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 상태 · 08v-result-visual-integrity-full](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08v-result-visual-integrity-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-rainbow · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08v-result-visual-integrity-rainbow.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 상태 · 08v-result-visual-integrity-rainbow](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08v-result-visual-integrity-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-small · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08v-result-visual-integrity-small.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 상태 · 08v-result-visual-integrity-small](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08v-result-visual-integrity-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-spark · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08v-result-visual-integrity-spark.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 상태 · 08v-result-visual-integrity-spark](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08v-result-visual-integrity-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-stream · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08v-result-visual-integrity-stream.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 상태 · 08v-result-visual-integrity-stream](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08v-result-visual-integrity-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-tower · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08v-result-visual-integrity-tower.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 상태 · 08v-result-visual-integrity-tower](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08v-result-visual-integrity-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · full · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08a-result-full.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 단계 · full](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08a-result-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08a-result-rainbow.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 단계 · rainbow](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · small · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08a-result-small.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 단계 · small](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08a-result-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · spark · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08a-result-spark.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 단계 · spark](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08a-result-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · stream · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08a-result-stream.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 단계 · stream](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08a-result-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · tower · `engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08a-result-tower.png`

![user-reported-missing-left-progress-1082x987-dpr2 결과 단계 · tower](screenshots/engine-flow-user-reported-missing-left-progress-1082x987-dpr2-08a-result-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### browser-comment-934x987-dpr2 · 934×987 · DPR 2 · 34장

- 같은 실행으로 보존한 회귀 이름: `browser-comment-direct-pour-crop-type-934x987-dpr2`
- 캡처 범위: `full-flow`

![browser-comment-934x987-dpr2 전체 상태 컨택시트](screenshots/report-flow-browser-comment-934x987-dpr2-contact-sheet.png)

#### 시작 화면 · `engine-flow-browser-comment-934x987-dpr2-01-cover.png`

![browser-comment-934x987-dpr2 시작 화면](screenshots/engine-flow-browser-comment-934x987-dpr2-01-cover.png)

- 학생이 보는 것: 매스몬 물통 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-browser-comment-934x987-dpr2-02-settings.png`

![browser-comment-934x987-dpr2 설정 화면](screenshots/engine-flow-browser-comment-934x987-dpr2-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-browser-comment-934x987-dpr2-03-tutorial-1.png`

![browser-comment-934x987-dpr2 설명 1 · 풀이 방법](screenshots/engine-flow-browser-comment-934x987-dpr2-03-tutorial-1.png)

- 학생이 보는 것: 들이 비교 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-browser-comment-934x987-dpr2-04-tutorial-2.png`

![browser-comment-934x987-dpr2 설명 2 · 보상과 목표](screenshots/engine-flow-browser-comment-934x987-dpr2-04-tutorial-2.png)

- 학생이 보는 것: 들이 비교 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-browser-comment-934x987-dpr2-05-play-step1.png`

![browser-comment-934x987-dpr2 문제 상태 · 05-play-step1](screenshots/engine-flow-browser-comment-934x987-dpr2-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05a-play-action-result · `engine-flow-browser-comment-934x987-dpr2-05a-play-action-result.png`

![browser-comment-934x987-dpr2 문제 상태 · 05a-play-action-result](screenshots/engine-flow-browser-comment-934x987-dpr2-05a-play-action-result.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 정답 확인 · 05c-direct-pour-correct-feedback · `engine-flow-browser-comment-934x987-dpr2-05c-direct-pour-correct-feedback.png`

![browser-comment-934x987-dpr2 정답 확인 · 05c-direct-pour-correct-feedback](screenshots/engine-flow-browser-comment-934x987-dpr2-05c-direct-pour-correct-feedback.png)

- 학생이 보는 것: 고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.
- 판단하거나 누르는 것: 완성값과 짧은 확인 문구를 읽습니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 정답 관계가 화면에 완성되었음을 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 계산 단계나 보상 확인으로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-browser-comment-934x987-dpr2-05n-next-problem-clean.png`

![browser-comment-934x987-dpr2 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-browser-comment-934x987-dpr2-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p4-misconception-물통-높이만-봐요 · `engine-flow-browser-comment-934x987-dpr2-05m-p4-misconception-물통-높이만-봐요.png`

![browser-comment-934x987-dpr2 오개념 확인 · p4-misconception-물통-높이만-봐요](screenshots/engine-flow-browser-comment-934x987-dpr2-05m-p4-misconception-물통-높이만-봐요.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p4-misconception-서로-다른-컵을-써요 · `engine-flow-browser-comment-934x987-dpr2-05m-p4-misconception-서로-다른-컵을-써요.png`

![browser-comment-934x987-dpr2 오개념 확인 · p4-misconception-서로-다른-컵을-써요](screenshots/engine-flow-browser-comment-934x987-dpr2-05m-p4-misconception-서로-다른-컵을-써요.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-browser-comment-934x987-dpr2-05b-play-wrong.png`

![browser-comment-934x987-dpr2 오답 확인 · 05b-play-wrong](screenshots/engine-flow-browser-comment-934x987-dpr2-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-browser-comment-934x987-dpr2-06-confirm.png`

![browser-comment-934x987-dpr2 마지막 확인 · 06-confirm](screenshots/engine-flow-browser-comment-934x987-dpr2-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-browser-comment-934x987-dpr2-07-reward-closed.png`

![browser-comment-934x987-dpr2 닫힌 보상](screenshots/engine-flow-browser-comment-934x987-dpr2-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 현재 물통 단계 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-browser-comment-934x987-dpr2-07b-reward-open.png`

![browser-comment-934x987-dpr2 열린 보상](screenshots/engine-flow-browser-comment-934x987-dpr2-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 현재 물통 단계 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-browser-comment-934x987-dpr2-07c-reward-impact.png`

![browser-comment-934x987-dpr2 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-browser-comment-934x987-dpr2-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 현재 물통 단계 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-browser-comment-934x987-dpr2-08-result.png`

![browser-comment-934x987-dpr2 실제 결과](screenshots/engine-flow-browser-comment-934x987-dpr2-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · full · `engine-flow-browser-comment-934x987-dpr2-08c-result-cohesion-full.png`

![browser-comment-934x987-dpr2 결과 결속 · full](screenshots/engine-flow-browser-comment-934x987-dpr2-08c-result-cohesion-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · rainbow · `engine-flow-browser-comment-934x987-dpr2-08c-result-cohesion-rainbow.png`

![browser-comment-934x987-dpr2 결과 결속 · rainbow](screenshots/engine-flow-browser-comment-934x987-dpr2-08c-result-cohesion-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · small · `engine-flow-browser-comment-934x987-dpr2-08c-result-cohesion-small.png`

![browser-comment-934x987-dpr2 결과 결속 · small](screenshots/engine-flow-browser-comment-934x987-dpr2-08c-result-cohesion-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · spark · `engine-flow-browser-comment-934x987-dpr2-08c-result-cohesion-spark.png`

![browser-comment-934x987-dpr2 결과 결속 · spark](screenshots/engine-flow-browser-comment-934x987-dpr2-08c-result-cohesion-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · stream · `engine-flow-browser-comment-934x987-dpr2-08c-result-cohesion-stream.png`

![browser-comment-934x987-dpr2 결과 결속 · stream](screenshots/engine-flow-browser-comment-934x987-dpr2-08c-result-cohesion-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 결속 · tower · `engine-flow-browser-comment-934x987-dpr2-08c-result-cohesion-tower.png`

![browser-comment-934x987-dpr2 결과 결속 · tower](screenshots/engine-flow-browser-comment-934x987-dpr2-08c-result-cohesion-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-full · `engine-flow-browser-comment-934x987-dpr2-08v-result-visual-integrity-full.png`

![browser-comment-934x987-dpr2 결과 상태 · 08v-result-visual-integrity-full](screenshots/engine-flow-browser-comment-934x987-dpr2-08v-result-visual-integrity-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-rainbow · `engine-flow-browser-comment-934x987-dpr2-08v-result-visual-integrity-rainbow.png`

![browser-comment-934x987-dpr2 결과 상태 · 08v-result-visual-integrity-rainbow](screenshots/engine-flow-browser-comment-934x987-dpr2-08v-result-visual-integrity-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-small · `engine-flow-browser-comment-934x987-dpr2-08v-result-visual-integrity-small.png`

![browser-comment-934x987-dpr2 결과 상태 · 08v-result-visual-integrity-small](screenshots/engine-flow-browser-comment-934x987-dpr2-08v-result-visual-integrity-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-spark · `engine-flow-browser-comment-934x987-dpr2-08v-result-visual-integrity-spark.png`

![browser-comment-934x987-dpr2 결과 상태 · 08v-result-visual-integrity-spark](screenshots/engine-flow-browser-comment-934x987-dpr2-08v-result-visual-integrity-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-stream · `engine-flow-browser-comment-934x987-dpr2-08v-result-visual-integrity-stream.png`

![browser-comment-934x987-dpr2 결과 상태 · 08v-result-visual-integrity-stream](screenshots/engine-flow-browser-comment-934x987-dpr2-08v-result-visual-integrity-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 상태 · 08v-result-visual-integrity-tower · `engine-flow-browser-comment-934x987-dpr2-08v-result-visual-integrity-tower.png`

![browser-comment-934x987-dpr2 결과 상태 · 08v-result-visual-integrity-tower](screenshots/engine-flow-browser-comment-934x987-dpr2-08v-result-visual-integrity-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · full · `engine-flow-browser-comment-934x987-dpr2-08a-result-full.png`

![browser-comment-934x987-dpr2 결과 단계 · full](screenshots/engine-flow-browser-comment-934x987-dpr2-08a-result-full.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · rainbow · `engine-flow-browser-comment-934x987-dpr2-08a-result-rainbow.png`

![browser-comment-934x987-dpr2 결과 단계 · rainbow](screenshots/engine-flow-browser-comment-934x987-dpr2-08a-result-rainbow.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · small · `engine-flow-browser-comment-934x987-dpr2-08a-result-small.png`

![browser-comment-934x987-dpr2 결과 단계 · small](screenshots/engine-flow-browser-comment-934x987-dpr2-08a-result-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · spark · `engine-flow-browser-comment-934x987-dpr2-08a-result-spark.png`

![browser-comment-934x987-dpr2 결과 단계 · spark](screenshots/engine-flow-browser-comment-934x987-dpr2-08a-result-spark.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · stream · `engine-flow-browser-comment-934x987-dpr2-08a-result-stream.png`

![browser-comment-934x987-dpr2 결과 단계 · stream](screenshots/engine-flow-browser-comment-934x987-dpr2-08a-result-stream.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · tower · `engine-flow-browser-comment-934x987-dpr2-08a-result-tower.png`

![browser-comment-934x987-dpr2 결과 단계 · tower](screenshots/engine-flow-browser-comment-934x987-dpr2-08a-result-tower.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 현재 물통 단계 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### empty-reward-fixture · 1280×800 · DPR 1 · 3장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `targeted`

![empty-reward-fixture 전체 상태 컨택시트](screenshots/report-flow-empty-reward-fixture-contact-sheet.png)

#### 마지막 확인 · 06-confirm · `engine-flow-empty-reward-fixture-06-confirm.png`

![empty-reward-fixture 마지막 확인 · 06-confirm](screenshots/engine-flow-empty-reward-fixture-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 들이 비교의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-empty-reward-fixture-07-reward-closed.png`

![empty-reward-fixture 닫힌 보상](screenshots/engine-flow-empty-reward-fixture-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 현재 물통 단계 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-empty-reward-fixture-07b-reward-open.png`

![empty-reward-fixture 열린 보상](screenshots/engine-flow-empty-reward-fixture-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 현재 물통 단계 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

<!-- REPORT-EVIDENCE-ALL:END -->

## 2026-08-09 최종 보상 정렬 회귀 QA

- 6개 생성 장면의 실제 결과판 중심을 각각 측정해 제목·동적 값·정답 수·다시 버튼 축을 상태별로 맞췄다.
- 데스크톱 `1280×800`, 태블릿 가로 `1024×768` 전수 캡처에서 축 오차 `1px 이하`, 텍스트 넘침·요소 겹침 `0건`을 확인했다.
- 증거: `screenshots/result-typography-desktop-after.png`

## 2026-08-09 결과 타이틀 래스터 무결성 QA

- 범위: `result-title-only-v1` — 원본 PNG·투명 WebP·manifest와 제목 레이어를 전수 확인했다.
- 6단계 독립 생성 제목의 실제 알파 경계·팔레트·노란색 외 색·판 안전영역 포함·동적 값 간격을 전수 검사했다.
- 데스크톱 `1280×800`과 태블릿 가로 `1024×768`에서 모두 PASS, 텍스트 넘침·요소 겹침 `0건`이다.
- 증거: `screenshots/result-typography-desktop-contain-after.png`, `screenshots/result-typography-tablet-landscape-contain-after.png`

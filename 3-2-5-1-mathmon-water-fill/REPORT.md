# 매스몬 물통 채우기 시합 구현 보고서

## 1. 구현 요약

3학년 2학기 5단원 1차시 `들이 비교와 L, mL`을 단일 HTML 게임으로 구현했습니다. 학생은 10문제 동안 눈금에 맞는 들이를 골라요. 정답을 고르면 값이 계산판에 먼저 들어가고, 마지막 단계에서는 완성값을 본 뒤 `물통 보기`를 눌러 보상으로 넘어갑니다.

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

학생 문구는 짧은 행동 말 중심으로 구성했습니다.

- 첫 화면 목표: `눈금에 맞는 들이를 골라요.`
- 설명 카드: `눈금을 봐요.`, `1L는 1000mL예요.`, `더 많이 든 쪽을 골라요.`
- 오답 피드백: `다시 골라요.`
- 보상/결과: `작은 물통`, `반짝 물통`, `가득 물통`, `무지개 물탑`

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

## 2026-08-01 전수감사 최신 증거

- `screenshots/report-contact-sheet.png`와 `screenshots/report-evidence-manifest.json`이 현재 빌드와 대표 12개 상태를 해시로 연결합니다. Humanizer 금지 우선어·번역투는 `0건`입니다.

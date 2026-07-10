# 매스몬 엘리베이터

에듀잇티 수학 게임 시리즈 2단원 2차시입니다.

- 대상: 3학년 2학기 2단원 2차시
- 학습: 내림 있는 (두 자리)÷(한 자리)
- 문제: 십의 자리에서 남은 십을 일의 자리로 내려 계산하는 나눗셈 10문제 랜덤 출제
- 방식: `십의 자리 나누기 -> 남은 십 내리기 -> 일의 자리 나누기` 3단계 선택형
- 보상: 한 문제를 끝낼 때마다 엘리베이터의 `올라갈 힘` 이벤트가 1번 일어남
- 결과: 일반 층은 올라갈 힘과 정답 수를 함께 보아 지하 정비층 -> 1층 로비 -> 중간층 -> 전망층 -> 옥상 정원 중 도착 층을 보여 줌. 무지개 힘을 얻으면 정답 수와 관계없이 꼭대기 전망대가 열림
- 화면 표준: 생성형 시작 버튼, 설정 모달, 2장 설명, 하이브리드 생성형 결과 화면
- 실행: `index.html`을 브라우저에서 열기

## 설계 의도

`매스몬 엘리베이터`는 내림 있는 나눗셈에서 가장 중요한 장면인 `남은 십을 일의 자리로 내려 합치기`를 엘리베이터가 한 층 내려가는 행동으로 연결합니다.

예를 들어 `52 ÷ 4`는 `5 ÷ 4 = 1, 남은 1십`, `1십 + 2 = 12`, `12 ÷ 4 = 3` 순서로 풀어 최종 몫 `13`을 완성합니다. 선택지에는 `일의 자리만 2`처럼 남은 십을 빠뜨리는 대표 오답을 넣어, 학생이 내림의 의미를 반복해서 확인하게 했습니다.

보상은 `올라갈 힘` 하나로만 유지합니다. 문제 안에서 한 번이라도 틀리면 정전 성격의 감소 이벤트로 처리해 일부러 틀려 보상을 노리는 흐름을 막습니다. 결과는 도감 수집이 아니라 한 판에서 도착한 층 자체가 보상입니다.

## 화면

스크린샷은 `screenshots/` 폴더에 저장합니다.

## RasterStage 이미지

- `cover-generated-source.png`: 독수리몬이 들어간 첫 화면 커버 생성 원본
- `cover-generated.png/webp`: 독수리몬이 엘리베이터 로비 장면 안에 포함된 첫 화면 표지 16:10 RasterStage
- `title-logo-chromakey.png`: GPT Image/imagegen으로 생성한 제목 로고 원본
- `title-logo-generated.png/webp`: 첫 화면 제목 래스터 오버레이
- `start-button-source.png`, `start-button-generated.png/webp`: 생성형 시작 버튼
- `board-shaft-generated.png/webp`: 설명/문제 화면 엘리베이터 샤프트 16:10 RasterStage
- `elevator-car-source.png`: imagegen으로 생성한 엘리베이터 차체 원본(chroma-key)
- `elevator-car-generated.png/webp`: 배경 제거 후 문제 화면에 쓰는 엘리베이터 차체 스프라이트
- `reward-events-sprite-generated.png`: 보상 이벤트 3×2 스프라이트(가속 모터, 슈퍼 모터, 정전, 멈춤, 급행 운행, 무지개 힘)
- `result-basement-generated.png/webp`: 지하 정비층 결과 16:10 RasterStage
- `result-first-generated.png/webp`: 1층 로비 결과 16:10 RasterStage
- `result-middle-generated.png/webp`: 중간층 결과 16:10 RasterStage
- `result-view-generated.png/webp`: 전망층 결과 16:10 RasterStage
- `result-roof-generated.png/webp`: 옥상 정원 결과 16:10 RasterStage
- `result-rainbow-generated.png/webp`: 꼭대기 전망대 결과 16:10 RasterStage
- `result-retry-generated.png/webp`: 다시 준비 결과 16:10 RasterStage
- `assets/mathmon/base-pack/mathmon-5-eaglemon.webp`: 보존된 base-pack 독수리몬 배포본

첫 화면과 결과 화면은 생성 이미지를 RasterStage 배경으로 씁니다. 첫 화면은 `generated-title-overlay` 표준으로, 독수리몬이 로비 조명과 바닥 반사 안에 함께 들어간 `cover-generated.webp`를 사용합니다. 제목은 `title-logo-generated.webp` 래스터 오버레이로 얹고 실제 제목 텍스트는 접근성용 숨김 제목으로 남깁니다. 시작 버튼은 `start-button-generated.webp` 생성형 버튼 아트입니다. 결과 화면은 도착 층별 배경을 동적으로 교체하며, SVG 오버레이 하나가 도착 층, 정답 수, 올라갈 힘만 보여 줍니다. 실제 다시하기는 투명 HTML hitbox가 맡고, 도착 제목과 칭찬 문장은 숨김 접근성 텍스트로 둡니다. 실패 결과는 축하 무대가 아니라 안전하게 다시 준비하는 장면으로 분리했습니다. 생성 이미지에는 텍스트와 숫자를 넣지 않았습니다.

결과 배경 7종은 imagegen으로 생성한 원본을 1280×800 PNG/WebP로 후처리한 파일입니다. 로컬 폰트, canvas, SVG, 기존 PNG/WebP 겹치기로 생성 이미지처럼 보이게 만드는 합성은 쓰지 않았습니다.

문제 화면은 `board-shaft-generated.webp` 한 장을 1280×800 Stage 전체에 사용합니다. 오른쪽의 빈 칠판 자리에 하나의 SVG 나눗셈판을 올리고, HTML은 짧은 지시문과 선택지 hitbox만 맡습니다. CSS는 위치와 크기, 정답·오답 상태만 바꾸며 엘리베이터나 계산 장치를 그리지 않습니다.

첫 단계의 선택지는 색만으로 뜻을 구분하지 않습니다. 네 선택지 모두 왼쪽에 `십의 자리 몫`, 오른쪽에 `나머지`를 글자로 표시합니다. 계산판에서는 이를 `나머지(남은 십)`으로 연결합니다. 문제를 처음 열었을 때는 현재 몫 칸만 보이고, `나머지인 남은 십 -> 내린 수` 관계는 정답을 확인한 뒤에 나타납니다.
마지막 단계에서는 보상 모달로 바로 넘어가지 않고 최종 몫과 `답 N 완성!`을 먼저 보여 줍니다. 학생이 `엘리베이터 움직이기`를 눌러야 보상 이벤트가 열립니다.

## 작업실 파일 구성

- `index.html`: 게임 본문
- `cover-generated.webp`: 첫 화면 표지
- `title-logo-generated.webp`: 첫 화면 제목 오버레이
- `start-button-generated.webp`: 첫 화면 시작 버튼 아트
- `board-shaft-generated.webp`: 설명/문제 화면 배경
- `elevator-car-generated.webp`: 문제 화면 엘리베이터 차체 스프라이트
- `reward-events-sprite-generated.png`: 보상 이벤트 스프라이트
- `result-*-generated.webp`: 결과 화면 등급별 배경
- `assets/mathmon/base-pack/mathmon-5-eaglemon.webp`: 보존된 base-pack 독수리몬 배포본
- `eduitit-logo-mark.png`: 에듀잇티 로고
- `screenshots/`: 화면별 스크린샷
- `REPORT.md`: 게임 설명, 화면 흐름, 보상 구조
- `_lessons/3-2-2-2-mathmon-elevator/`: 공통 엔진이 읽는 차시 설정, 수학 모델, SVG view, 레이아웃 CSS
- 루트 `scripts/qa-engine-unit2-elevator-source.mjs`: 200개 seed의 문제·오개념·선택지 의미 계약 QA
- 루트 `scripts/qa-lesson-flow.mjs`: 데스크톱/태블릿 전체 브라우저 흐름과 화면 QA

학생용 static 사본에는 실행에 필요한 `index.html`, WebP 배경, 엘리베이터 스프라이트, 로고, 문서만 복사합니다. PNG 원본과 `screenshots/`는 작업실에 보관합니다.

## Mathmon Engine v1 골드 스탠더드 이관 (2026-07-10)

- 소스 분리: 공통 화면 흐름은 `_engine/v1`, 차시 설정·문제 생성·SVG 계산판은 `_lessons/3-2-2-2-mathmon-elevator`가 맡습니다. 배포 결과는 기존처럼 독립 실행 `index.html` 한 개입니다.
- 이미지 중심 문제 화면: 기존 `board-shaft-generated.webp`를 잘라 쓰지 않고 Stage 전체 장면으로 되살렸습니다. 문제 화면에서 별도 진행판, 층 목록, 힌트판, 보상판은 보이지 않습니다.
- 한 화면 한 행동: 큰 문제, 현재 계산판, 한 줄 지시, 선택지만 보입니다. 지시문과 오답 피드백은 같은 슬롯을 번갈아 씁니다.
- 선택지 의미 표시: `십의 자리 몫`과 `나머지`를 모든 선택지에 반복 표기합니다. 계산판의 `나머지(남은 십)` 표기가 두 개념을 연결하며, 색은 정답·오답 상태를 돕는 보조 신호일 뿐 뜻을 전달하지 않습니다.
- 단계별 공개: 첫 단계에서는 다음 단계의 `내린 수`를 숨깁니다. 정답 확인 뒤에만 남은 십이 아래로 이동합니다.
- 오개념 기록: 모든 오답 선택지에 `misconceptionId`를 붙였고 첫 선택만이 아니라 단계 안의 모든 시도를 기록합니다.
- 설명 화면: 기존 생성형 설명 2장을 그대로 사용하고 이미지 속 `다음`, `이전`, `계속하기` 표면 위에 투명 hitbox만 둡니다.

검증 명령:

```bash
node scripts/qa-engine-unit2-elevator-source.mjs
node scripts/check-lesson-contract.mjs
node scripts/check-stage-ratio.mjs
node scripts/qa-lesson-flow.mjs 3-2-2-2-mathmon-elevator
```

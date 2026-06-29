# 매스몬 택배 무게 맞추기

에듀잇티 수학 게임 시리즈 3학년 2학기 5단원 4차시 단일 HTML 패키지입니다.

- 대상: 초등학교 3학년 2학기
- 배움주제: 무게의 덧셈·뺄셈과 어림
- 학생 행동: 택배 한도에 맞는 무게를 골라요.
- 문제: 10문제, kg/g 더하기, kg/g 빼기, 한도 고르기
- 보상: 배송 거리와 도착지
- 실행: `index.html`을 브라우저에서 열기

## 화면 흐름

```text
첫 화면 -> 설명 -> 문제 -> 보상 -> 결과
```

문제 화면은 큰 문제, 현재 계산판, 한 줄 지시, 선택지만 기본으로 보여 줍니다. 정답을 고르면 값이 계산판 칸에 들어간 뒤 다음 단계로 넘어갑니다. 마지막 단계 뒤에는 완성된 식을 먼저 보여 주고 `배송 보기` 버튼으로 보상 화면을 엽니다.

## 생성 이미지 자산

`index.html`은 `data-cover-standard="generated-title-overlay"`를 선언합니다. 첫 화면은 글자 없는 배경, 생성형 제목 아트, HTML 목표 문장과 실제 `시작` 버튼으로 나뉩니다.

| 파일명 | 용도 | 런타임 |
| --- | --- | --- |
| `cover-source.png` / `cover-generated.webp` | 글자 없는 택배 작업장 첫 화면 배경 | `cover-generated.webp` |
| `title-logo-chromakey.png` / `title-logo-generated.png` / `title-logo-generated.webp` | 생성형 제목 아트 | `title-logo-generated.webp` |
| `result-home-source.png` / `result-home-generated.webp` | 가까운 집 결과 장면 | `result-home-generated.webp` |
| `result-school-source.png` / `result-school-generated.webp` | 학교 앞 결과 장면 | `result-school-generated.webp` |
| `result-market-source.png` / `result-market-generated.webp` | 시장 앞 결과 장면 | `result-market-generated.webp` |
| `result-mountain-source.png` / `result-mountain-generated.webp` | 산마을 결과 장면 | `result-mountain-generated.webp` |
| `result-harbor-source.png` / `result-harbor-generated.webp` | 바닷가 마을 결과 장면 | `result-harbor-generated.webp` |
| `result-rainbow-source.png` / `result-rainbow-generated.webp` | 무지개 우체국 결과 장면 | `result-rainbow-generated.webp` |

결과 장면에는 생성 단계에서 도착지 풍경과 택배 매스몬이 함께 들어가 있습니다. `result-*-generated.webp`는 도착지 장면 자체를 맡고, 결과 화면 위에 별도 매스몬 PNG/WebP나 로컬에서 만든 제목/버튼 그림을 덧붙이지 않습니다.

## HTML 오버레이 범위

- 첫 화면: 브랜드/단원 배지, 배움주제 배지, 목표 문장, `시작` 버튼
- 문제 화면: 문제식, 단계 칩, 한 줄 지시, 답 칸, 선택지, 확인 문구, `배송 보기` 버튼
- 보상 화면: 길 이름, 거리 막대, 거리 변화, 다음 버튼
- 결과 화면 생성 이미지: 도착지 풍경과 택배 매스몬
- 결과 화면 동적(dynamic) 값: `resultTitle` 도착지 이름, `resultSummary` 바로 맞힌 문제 수와 배송 거리, `resultNext` 다음 목표 문장
- 결과 화면 고정 조작: `retryButton`의 `다시`는 키보드와 스크린리더로 누를 수 있어야 하는 실제 HTML 버튼입니다. 로컬에서 만든 가짜 생성형 버튼 그림이 아니라, 게임을 다시 시작하는 접근성/조작 오버레이로 둡니다.
- 결과 화면 전역 배지/조작: 상단 `오늘의 도착지`, `5단원 무게` 배지와 소리 아이콘은 시리즈 공통 Stage chrome입니다.

결과 화면의 HTML 오버레이는 매 판 달라지는 값과 실제 조작부만 남긴 의도적인 예외입니다. 고정 칭찬 문구나 장면 라벨을 HTML/CSS로 꾸며 생성 이미지처럼 보이게 만들지 않습니다.

## 매스몬 팩

택배 무게 차시 전용 `weight-pack`을 `_shared/mathmon/weight-pack/`에 등록했습니다.

| 파일명 | 용도 |
| --- | --- |
| `_shared/mathmon/weight-pack/raw-chromakey/mathmon-wt-01-courierfox.png` | 생성형 크로마키 원본 |
| `_shared/mathmon/weight-pack/png/mathmon-wt-01-courierfox.png` | 투명 PNG 원본 |
| `_shared/mathmon/weight-pack/webp/mathmon-wt-01-courierfox.webp` | 공용 WebP 배포본 |
| `assets/mathmon/weight-pack/mathmon-wt-01-courierfox.webp` | 차시 실행용 복사본 |
| `_shared/mathmon/weight-pack/contact-sheets/weight-pack-contact-sheet.png` | 팩 확인용 시트 |

첫 화면 배경과 결과 장면에는 매스몬이 생성 이미지 안에 들어가 있으므로, 런타임 복사본은 따로 얹지 않았습니다.

## 보상 구조

정답을 처음에 맞히면 기본 배송 거리 `+6km`가 더해집니다. 그 뒤 길 보상이 한 번 붙습니다.

| 길 | 확률 | 거리 |
| --- | --- | --- |
| 반듯한 길 | 52% | +7~+10km |
| 빠른 길 | 17% | +14~+20km |
| 돌아가는 길 | 15% | -8~-4km |
| 잠깐 멈춤 | 9% | +0km |
| 곧장 길 | 6% | +28km |
| 비밀 길 | 1% | +40km |

오답 뒤에 맞히면 기본 배송 거리는 붙지 않고 `끈 다시 묶기`로 -6~-10km가 한 번 붙습니다. 전체 거리는 4~100km 안에서 움직이며, 결과는 가까운 집, 학교 앞, 시장 앞, 산마을, 바닷가 마을, 무지개 우체국 중 하나로 끝납니다.

## Humanizer QA

학생에게 보이는 문구는 짧은 행동 말로 점검했습니다.

- 첫 화면 목표: `택배 한도에 맞는 무게를 골라요.`
- 설명: `g끼리 먼저 봐요.`, `부족하면 1kg을 빌려요.`, `한도보다 가벼워야 해요.`
- 문제 지시: `g끼리 더한 값을 골라요.`, `남은 택배 무게를 골라요.`, `한도에 맞는 말을 골라요.`
- 피드백: `다시 골라요.`, `...이 들어갔어요.`, `...로 보낼 수 있어요.`
- 보상/결과: `반듯한 길`, `빠른 길`, `가까운 집`, `다시`

학생 화면에는 내부 작업실 이름이나 제작자용 말을 보이지 않게 했습니다.

## 스크린샷

T3 스크린샷은 `screenshots/`에 저장합니다.

- `cover.png`
- `tutorial.png`
- `play-step1.png`
- `play-step2.png`
- `wrong-hint.png`
- `reward.png`
- `result-measurement.png`
- `result.png`
- `tablet-landscape.png`

세로 휴대폰은 기본 지원 대상이 아니며, 별도 세로 차단 화면이 구현되어 있지 않아 `portrait-guard.png`는 만들지 않습니다.

## 검증

- `node -e 'JSON.parse(require("fs").readFileSync("manifest.json","utf8")); const lesson=JSON.parse(require("fs").readFileSync("manifest.json","utf8")).lessons.find((item)=>item.id==="3-2-5-4"); if(!lesson) throw new Error("missing lesson"); console.log(JSON.stringify(lesson,null,2));'`
- Text audit: required student-term pattern against `index.html`, `README.md`, and `REPORT.md`
- `node scripts/check-stage-ratio.mjs`
- `node scripts/qa-lesson5-package-weight-model.mjs --runs 100000`
- Browser QA: `python3 -m http.server 9536` 후 `http://127.0.0.1:9536/3-2-5-4-mathmon-package-weight/index.html`

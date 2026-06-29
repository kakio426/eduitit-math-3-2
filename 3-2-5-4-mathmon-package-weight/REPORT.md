# 매스몬 택배 무게 맞추기 T3 보고서

## 1. 구현 요약

3학년 2학기 5단원 4차시 `무게의 덧셈·뺄셈과 어림`을 단일 HTML 게임으로 정리했습니다. 학생은 10문제 동안 kg와 g 무게를 더하고 빼며, 택배 한도에 맞는 말을 고릅니다. 정답을 고르면 답이 계산판에 먼저 들어가고, 마지막 단계에서는 완성식을 본 뒤 `배송 보기`를 눌러 보상으로 넘어갑니다.

T3에서 루트 등록, 루트 README 차시 표, 차시 README/REPORT, Humanizer QA, 스크린샷 QA, 검증 증거를 마무리했습니다.

## 2. 등록

- `manifest.json` lesson id: `3-2-5-4`
- folder: `3-2-5-4-mathmon-package-weight`
- title: `매스몬 택배 무게 맞추기`
- grade/semester/unit/lesson: `3 / 2 / 5 / 4`
- subject: `수학`
- learningGoal: `kg와 g로 나타낸 무게를 더하고 빼며, 택배 한도에 맞는지 어림해 판단한다.`
- entryFile: `index.html`
- root `README.md`: 현재 시리즈 표에 5단원 4차시 행 추가

## 3. 화면 흐름

```text
첫 화면 -> 설명 -> 문제 -> 보상 -> 결과
```

- 첫 화면: `cover-generated.webp` 배경, `title-logo-generated.webp` 제목 아트, HTML 목표 문장과 실제 `시작` 버튼
- 설명: 3개의 짧은 카드로 g 더하기, 1kg 빌리기, 한도 판단을 안내
- 문제: 큰 문제, 현재 계산판, 한 줄 지시, 선택지만 기본 노출
- 보상: 배송 거리 막대와 길 이름 1개만 크게 표시
- 결과: 도착지 생성 이미지와 동적(dynamic) 결과값, 실제 다시 하기 조작 표시

## 4. 생성 이미지 자산

| 파일명 | 역할 |
| --- | --- |
| `cover-source.png` | 생성형 첫 화면 원본 |
| `cover-generated.webp` | 글자 없는 첫 화면 배경 |
| `title-logo-chromakey.png` | 생성형 제목 크로마키 원본 |
| `title-logo-generated.png` | 배경 제거 제목 PNG |
| `title-logo-generated.webp` | 런타임 제목 WebP |
| `result-home-source.png` / `result-home-generated.webp` | 가까운 집 결과 장면 |
| `result-school-source.png` / `result-school-generated.webp` | 학교 앞 결과 장면 |
| `result-market-source.png` / `result-market-generated.webp` | 시장 앞 결과 장면 |
| `result-mountain-source.png` / `result-mountain-generated.webp` | 산마을 결과 장면 |
| `result-harbor-source.png` / `result-harbor-generated.webp` | 바닷가 마을 결과 장면 |
| `result-rainbow-source.png` / `result-rainbow-generated.webp` | 무지개 우체국 결과 장면 |

결과 장면 안에는 생성 단계에서 도착지 풍경과 택배 매스몬이 함께 들어가 있습니다. `result-*-generated.webp`는 도착지 장면 자체를 맡고, 결과 화면 위에 별도 캐릭터 파일이나 로컬에서 만든 제목/버튼 그림을 덧붙이지 않았습니다.

## 5. 매스몬 팩

택배 차시 전용 `weight-pack`을 씁니다.

| 파일명 | 역할 |
| --- | --- |
| `_shared/mathmon/weight-pack/manifest.json` | 팩 메타데이터 |
| `_shared/mathmon/weight-pack/raw-chromakey/mathmon-wt-01-courierfox.png` | 생성형 크로마키 원본 |
| `_shared/mathmon/weight-pack/png/mathmon-wt-01-courierfox.png` | 투명 PNG 원본 |
| `_shared/mathmon/weight-pack/webp/mathmon-wt-01-courierfox.webp` | 공용 WebP |
| `_shared/mathmon/weight-pack/contact-sheets/weight-pack-contact-sheet.png` | 확인용 시트 |
| `assets/mathmon/weight-pack/mathmon-wt-01-courierfox.webp` | 차시 실행용 WebP |

첫 화면과 결과 장면에는 이미 매스몬이 생성 이미지 안에 있으므로, 차시 실행용 WebP를 별도 오버레이로 올리지 않았습니다.

## 6. HTML 오버레이 경계

- 첫 화면 HTML: 브랜드/단원 배지, 배움주제 배지, 목표 문장, `시작`
- 첫 화면 이미지: 글자 없는 택배 작업장과 생성형 제목 아트
- 문제 화면 HTML: 모든 문제식, 선택지, 답 칸, 피드백, 단계 칩, `배송 보기`
- 보상 화면 HTML: 길 이름, 거리 막대, 거리 변화, 다음 버튼
- 결과 화면 이미지: `result-*-generated.webp` 도착지 배경과 택배 매스몬 장면
- 결과 화면 동적(dynamic) 값: `resultTitle` 도착지 이름, `resultSummary` 바로 맞힌 문제 수와 배송 거리, `resultNext` 다음 목표 문장
- 결과 화면 고정 조작: `retryButton`의 `다시`는 키보드와 스크린리더로 누를 수 있어야 하는 실제 HTML 버튼입니다. 로컬에서 만든 가짜 생성형 버튼 그림이 아니라, 게임을 다시 시작하는 접근성/조작 오버레이입니다.
- 결과 화면 전역 배지/조작: 상단 `오늘의 도착지`, `5단원 무게` 배지와 소리 아이콘은 시리즈 공통 Stage chrome입니다.

이 경계는 의도적인 결과 RasterStage 예외입니다. 도착지 이름, 정답 수, 배송 거리, 다음 목표는 매 판 결과에 따라 바뀌며, `retryButton`은 실제 조작과 접근성을 위해 HTML로 남깁니다. 고정 칭찬 문구나 버튼 장식을 HTML/CSS로 만들어 생성 이미지처럼 보이게 하지 않았습니다.

## 7. 보상과 확률

보상은 배송 거리 하나로 유지합니다. 처음에 맞히면 기본 `+6km`가 붙고, 길 보상이 한 번 더해집니다.

| 길 | 확률 | 거리 변화 |
| --- | --- | --- |
| 반듯한 길 | 52% | +7~+10km |
| 빠른 길 | 17% | +14~+20km |
| 돌아가는 길 | 15% | -8~-4km |
| 잠깐 멈춤 | 9% | +0km |
| 곧장 길 | 6% | +28km |
| 비밀 길 | 1% | +40km |

오답 뒤에 맞히면 기본 `+6km`는 붙지 않고 `끈 다시 묶기`로 -6~-10km가 한 번 붙습니다. 거리는 4~100km 안에서 유지되어 빈손처럼 끝나지 않습니다.

도착지는 거리와 바로 맞힌 문제 수로 정합니다.

| 도착지 | 조건 |
| --- | --- |
| 가까운 집 | 기본 도착지 |
| 학교 앞 | 20km 이상, 바로 맞힌 문제 3개 이상 |
| 시장 앞 | 45km 이상, 바로 맞힌 문제 5개 이상 |
| 산마을 | 70km 이상, 바로 맞힌 문제 7개 이상 |
| 바닷가 마을 | 90km 이상, 바로 맞힌 문제 9개 이상 |
| 무지개 우체국 | 100km, 바로 맞힌 문제 10개, 비밀 길 필요 |

## 8. Humanizer QA

학생 문구는 초3 학생이 소리 내어 바로 읽을 수 있는 말인지 확인했습니다.

- 첫 화면 목표: `택배 한도에 맞는 무게를 골라요.`
- 설명 카드: `g끼리 먼저 봐요.`, `부족하면 1kg을 빌려요.`, `한도보다 가벼워야 해요.`
- 문제 지시: `g끼리 더한 값을 골라요.`, `1kg을 빌린 윗무게를 골라요.`, `한도에 맞는 말을 골라요.`
- 오답 피드백: `다시 골라요.`
- 보상/결과: `반듯한 길`, `빠른 길`, `가까운 집`, `5단원 무게`, `다시`

점검 결과 학생 화면에는 내부 작업실 이름이나 제작자용 말이 보이지 않습니다. 보고서와 README의 기술 설명은 학생 화면이 아닙니다.

## 9. 텍스트 넘침·요소 겹침 QA

브라우저 QA에서 desktop `1280x800`과 tablet landscape `1024x768`을 확인했습니다.

확인 상태:

- 첫 화면: `screenshots/cover.png`
- 설명: `screenshots/tutorial.png`
- 문제 1단계: `screenshots/play-step1.png`
- 문제 2단계: `screenshots/play-step2.png`
- 오답/힌트 상태: `screenshots/wrong-hint.png`
- 보상: `screenshots/reward.png`
- 결과 공개 전 대체 상태: `screenshots/result-measurement.png`
- 결과: `screenshots/result.png`
- 태블릿 가로: `screenshots/tablet-landscape.png`

확인 결과:

- 버튼, 배지, 선택지, 보상 카드, 결과 카드의 글자 넘침 없음
- 소리 버튼과 상단 배지 충돌 없음
- 문제와 선택지 사이의 겹침 없음
- 답 칸과 확인 문구가 보상 화면에 가려지지 않음
- 태블릿 가로에서도 Stage 비율 유지

세로 휴대폰은 기본 지원 대상이 아니며, 별도 세로 차단 화면이 구현되어 있지 않습니다. 그래서 `portrait-guard.png`는 만들지 않았습니다.

## 10. 스크린샷 QA 증거

- Action log: `.omo/evidence/mathmon-lesson5-package-weight/t3-browser-qa.md`
- 화면 파일: `3-2-5-4-mathmon-package-weight/screenshots/`
- 반복 확인: `cover-repeat.png`를 로컬 서버 reload 뒤 캡처해 흔들림 없는 라우팅을 확인

## 11. 검증 명령

- Git 상태 전: `git status --short`
- 등록 확인: `node -e <manifest lesson assertion>`
- 학생 문구 감사: required student-term pattern with `rg`
- Stage 계약: `node scripts/check-stage-ratio.mjs`
- 수학 모델: `node scripts/qa-lesson5-package-weight-model.mjs --runs 100000`
- 브라우저 QA: `python3 -m http.server 9536` 후 local lesson URL을 자동 조작
- Git 상태 후: `git status --short`

증거 파일:

- `.omo/evidence/mathmon-lesson5-package-weight/t3-git-status-before.txt`
- `.omo/evidence/mathmon-lesson5-package-weight/t3-registration.txt`
- `.omo/evidence/mathmon-lesson5-package-weight/t3-humanizer-rg.txt`
- `.omo/evidence/mathmon-lesson5-package-weight/t3-stage.txt`
- `.omo/evidence/mathmon-lesson5-package-weight/t3-math.txt`
- `.omo/evidence/mathmon-lesson5-package-weight/t3-browser-qa.md`
- `.omo/evidence/mathmon-lesson5-package-weight/t3-cleanup.txt`
- `.omo/evidence/mathmon-lesson5-package-weight/t3-git-status-after.txt`

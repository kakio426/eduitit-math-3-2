# 소셜몬 도시 특징 찾기

4학년 2학기 3단원 9~11차시 사회 퀴즈다. 학생은 사진과 지도를 읽고 도시가 어떤 곳인지,
도시의 인구·산업·교통이 어떤 모습인지 찾는다.

- 폴더: `socialmon-4-2-u3-g14-city-features`
- 게임 번호: 14
- 성취기준: `[4사10-02]`
- 한 판: 6문제, 5~7분
- 실행: `index.html` 한 파일을 태블릿 가로나 컴퓨터에서 열면 바로 시작한다.

## 화면 흐름

```text
표지 → 방법 보기 → 문제 6개와 흔적 도장 → 2·4문제 뒤 힌트 → 소셜몬 공개 → 결과
```

화면은 `cover`, `tutorial`, `play`, `result` 네 개뿐이다. 정답 확인, 흔적 도장, 그림자·특징 힌트는
`play` 안의 흐름 상태이고 `settings`와 `trace-reveal`은 공용 오버레이다.

## 6문제

| 순서 | 형식 | 학생 조작 | 하는 일 |
|---:|---|---|---|
| 1 | `source-choice` | 고르기 | 서울 도시 사진에서 도시의 모습 찾기 |
| 2 | `choice` | 고르기 | 도시의 뜻 고르기 |
| 3 | `match` | 이어 보기 | 인구·산업·교통과 설명 잇기 |
| 4 | `source-choice` | 고르기 | 부산 교통 지도에서 교통 시설 읽기 |
| 5 | `match` | 이어 보기 | 전주시의 일터와 하는 일 잇기 |
| 6 | `classify` | 나누어 보기 | 도시의 모습을 두 모둠으로 나누기 |

모든 조작은 탭으로 끝난다. 필수 드래그는 없다.

## 보상

공용 `socialmon-trace-reveal-v1`을 쓴다. 맞히든 틀리든 설명을 확인하면 흔적 1개를 받고,
2문제 뒤 그림자, 4문제 뒤 특징, 마지막에 소셜몬 한 종을 만난다. 점수 증감·감점·등급은 없다.

- 후보 소셜몬: `cranemon`, `elephantmon`, `meerkatmon`
- 오늘의 발견: `도시는 사람과 일, 오가는 길이 함께 모여 있는 곳이에요.`

## 자산

| 파일 | 쓰임 | 종류 |
| --- | --- | --- |
| `assets/source-city-view-v1.webp` | 1번 자료 사진 | 지도서 PDF 54쪽 crop |
| `assets/source-busan-transport-v1.webp` | 4번 자료 지도 | 지도서 PDF 62쪽 crop |
| `assets/cover-copy-v1-generated.webp` | 표지 문구 아트 | 생성형 |
| `assets/option-city-skyline-v1.webp` 외 7장 | 1·4번 선택지 그림 | 생성형 장식 |

사실 자료는 출판사 지도서 지면만 쓴다. 생성 이미지는 표지와 선택지 장식 전용이며 정답 근거가 아니다.
생성 자산 9장의 프롬프트와 금지 요소는 `IMAGEGEN_REQUEST.json`에 남겼다.

## 빌드와 검사

```bash
node scripts/build-social-quiz.mjs socialmon-4-2-u3-g14-city-features
node scripts/check-social-quiz.mjs socialmon-4-2-u3-g14-city-features
node scripts/check-socialmon-source-catalog.mjs socialmon-4-2-u3-g14-city-features
node scripts/check-socialmon-interaction-policy.mjs
node scripts/test-social-quiz-contract.mjs
node scripts/check-socialmon-pack.mjs
node scripts/check-stage-ratio.mjs
node scripts/check-social-series.mjs 4-2 --require-sources

python3 -m http.server 4175
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u3-g14-city-features
```

`quiz.json`이나 자산을 고치면 반드시 다시 빌드하고 브라우저 QA를 다시 찍는다.

## 함께 볼 문서

- `PLAN.md` — 문항 배치와 원고 대비 확정 사항
- `SOURCE_LEDGER.md` — PDF 쪽 대조와 자료 사용 범위
- `HUMANIZER_QA.md` — 학생 문구 점검
- `REPORT.md` — 현재 실행본 기준 검사·브라우저 증거

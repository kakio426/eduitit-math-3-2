# 소셜몬 삼국과 가야 관계 찾기

## 완료 요약

`socialmon-quiz-lite-profile-v2`·`socialmon-quiz-lite-contract-v3` 기준 6문제 단일 HTML을 만들었다. `source-choice` 2개, `match` 2개, `classify` 1개, `choice` 1개로 구성하고 고르기·이어 보기·나누어 보기 세 조작만 썼다. 지도서 자료 이미지는 q1 백제 영역·유물과 q3 가야 철기·토기에서만 사실 근거로 사용했으며, 생성형 이미지는 표지 제목 아트에만 사용했다.

## 자료·문구 검토

`5_2_사회_1_지도서.pdf` SHA-256 `36937a3bbdca94bd47f2f6b02c934759f1933077a3b9ad3d8c7a99fa9f0d4fcb`를 확인했다. PDF 54~57·55·66쪽(인쇄 69~72·70·81쪽)의 광개토 대왕릉비·칠지도·화랑도, 백제 지도, 가야 철기·토기 자료를 `SOURCE_LEDGER.md`와 문항 evidence에 연결했다. `보인다`는 직접 확인, `짐작할 수 있어요`는 유물과 기록을 연결한 추론으로 구분했다.

## Humanizer 학생 문구 QA

표지 목표, 방법 안내, 문제 지시문·선택지·힌트·피드백·결과 문구를 소리 내어 읽는 기준으로 점검했다. `철기 문화를 발전시켰다`처럼 긴 표현은 자료와 함께 읽기 쉬운 `철을 다루고 물건을 주고받았어요`로 다듬었고, `핵심`, `생산량`, `출하`, `등급`, `토큰`, `오브젝트`, `게이트`는 쓰지 않았다. 자세한 기록은 [`HUMANIZER_QA.md`](HUMANIZER_QA.md)에 있다.

## 빌드·브라우저 QA

| 입력 | SHA-256 |
|---|---|
| quiz.json | `019fd6254d15c1ddb1c4ce6669253a71569759c9bbe6e1b8f75ec29653eae504` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 5-2 테마팩 | `45c836227034b7fb08eb630e62d4e07c0a5a61e3000a0ed2c2e6a923a265b1e6` |
| 실행 자산 | `165f54f1c201dfe745efb11113c0838a95ed194ccafecd730c65952995f87d2f` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 정책·스킬 지문 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| 현재 QA 하네스 지문 | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |

마지막 lesson-local QA는 `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u1-g03-three-kingdoms-gaya`로 통과했다. PC·태블릿·회귀 viewport 4개, 상태 감사 120개, PNG 120개, text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser errors 0이다. 공용 엔진·정책·하네스 동결 뒤 `2026-08-12T17:53:07.198Z`에 `desktop-1280x800`, `tablet-landscape-1024x768`, `feedback-reported-1079x929`, `feedback-reported-1079x842` 4개 viewport로 전체 흐름을 다시 캡처했고, 영수증의 정책·하네스 지문은 위 표의 동결 지문과 같다.

## 단원 게이트

5-2 U1 여덟 차시는 아래 단일 게이트 한 번으로 함께 검증했다.

```sh
node scripts/verify-socialmon-delivery.mjs \
  --lesson=socialmon-5-2-u1-g01-prehistory-clues \
  --lesson=socialmon-5-2-u1-g02-bronze-gojoseon \
  --lesson=socialmon-5-2-u1-g03-three-kingdoms-gaya \
  --lesson=socialmon-5-2-u1-g17-three-kingdoms-gaya-life \
  --lesson=socialmon-5-2-u1-g04-unified-silla-balhae \
  --lesson=socialmon-5-2-u1-g05-goryeo-beginnings-society \
  --lesson=socialmon-5-2-u1-g06-goryeo-exchange-culture \
  --lesson=socialmon-5-2-u1-g18-goryeo-cultural-heritage-life
```

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `019fd6254d15c1ddb1c4ce6669253a71569759c9bbe6e1b8f75ec29653eae504` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `45c836227034b7fb08eb630e62d4e07c0a5a61e3000a0ed2c2e6a923a265b1e6` |
| 실행 자산 | `165f54f1c201dfe745efb11113c0838a95ed194ccafecd730c65952995f87d2f` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| QA 하네스 | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |

- QA 생성 시각: `2026-08-12T17:53:07.198Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

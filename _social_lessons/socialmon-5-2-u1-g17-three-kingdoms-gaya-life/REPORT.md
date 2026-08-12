# 소셜몬 삼국과 가야 생활 읽기

## 완료 요약

`socialmon-quiz-lite-profile-v2`·`socialmon-quiz-lite-contract-v3` 기준 6문제 단일 HTML을 완성했다. `source-choice` 2개, `match` 2개, `classify` 1개, `choice` 1개로 구성하고 고르기·이어 보기·나누어 보기 세 조작만 썼다. g03에 있던 가야 철기·토기 생활 판단은 이 차시가 맡도록 분리했으며, 생성 이미지는 표지 문구 아트에만 사용했다.

## 자료·사실과 추론 검토

`5_2_사회_1_지도서.pdf` SHA-256은 `36937a3bbdca94bd47f2f6b02c934759f1933077a3b9ad3d8c7a99fa9f0d4fcb`다. PDF 63~76쪽(인쇄 78~91쪽, 원천 9~10차시)의 수산리 고분 벽화, 가야 철기·토기, 삼국의 생활·불교 자료를 `SOURCE_LEDGER.md`와 문항 evidence에 연결했다. q1·q3은 자료에서 바로 확인한 사실이고, q4·q5는 자료에서 본 사실과 그 단서로 짐작한 생활을 분리했다.

## Humanizer 학생 문구 QA

표지 목표, 방법 안내, 문제 지시문·선택지·힌트·피드백·결과 문구를 5학년이 소리 내어 읽는 기준으로 점검했다. `핵심`, `토큰`, `이벤트`, `게이트`, `힘`, `파워` 같은 제작자 말은 쓰지 않고, 직접 확인은 `보여요`·`그려졌어요`, 생활 해석은 `짐작한 것`으로 구분했다. 기록은 [`HUMANIZER_QA.md`](HUMANIZER_QA.md)에 남겼다.

## 빌드·브라우저 QA

| 입력 | SHA-256 |
|---|---|
| quiz.json | `8c79f508927846bb4442280548ef12085afd1498de0ddf6da74839a5563ee26d` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 5-2 테마팩 | `45c836227034b7fb08eb630e62d4e07c0a5a61e3000a0ed2c2e6a923a265b1e6` |
| 실행 자산 | `233654951da41222ca8ea98a565052c099915a8da79d5d9e5e24426f8a00144d` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 정책·스킬 지문 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| 현재 QA 하네스 지문 | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |

최신 실행본을 `node scripts/build-social-quiz.mjs socialmon-5-2-u1-g17-three-kingdoms-gaya-life`로 빌드한 뒤, `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u1-g17-three-kingdoms-gaya-life`를 실행했다. PC·태블릿·회귀 viewport 4개, 상태 감사 120개, PNG 120개를 확인했고 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser errors 0이다. `screenshots/qa-report.json`은 위 차시·프로필·테마팩·실행 자산·엔진과 현재 policy·harness 지문을 함께 기록한다. 공용 엔진·정책·하네스 동결 뒤 `2026-08-12T17:55:20.893Z`에 `desktop-1280x800`, `tablet-landscape-1024x768`, `feedback-reported-1079x929`, `feedback-reported-1079x842` 4개 viewport로 전체 흐름을 다시 캡처했고, 영수증의 정책·하네스 지문은 위 표의 동결 지문과 같다.

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
| quiz.json | `8c79f508927846bb4442280548ef12085afd1498de0ddf6da74839a5563ee26d` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `45c836227034b7fb08eb630e62d4e07c0a5a61e3000a0ed2c2e6a923a265b1e6` |
| 실행 자산 | `233654951da41222ca8ea98a565052c099915a8da79d5d9e5e24426f8a00144d` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| QA 하네스 | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |

- QA 생성 시각: `2026-08-12T17:55:20.893Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

# 소셜몬 일할 권리, 기업의 책임

## 완료 요약

`socialmon-6-2-u2-g09-worker-company-rights`를 profile-v2 / contract-v3 정식 단일 HTML로 완성했다. 근로자의 권리와 기업의 자유·사회적 책임을 판단하는 6문제 퀴즈이며, 첫 문제는 자료를 보고 고르는 문항이다. 출판사 근거가 화면에 보이는 source-choice 2개와 관계형 문항을 포함하고, 학생 조작은 고르기·나누어 보기 2종만 사용한다. map-hotspots는 사용하지 않는다.

## 지도서·시각 근거 검증

원자료 `/Users/yubyeongju/Downloads/6_2_사회_2_지도서.pdf`의 SHA-256은 `61f3217ce221de1ba4682981d019f99febedd767da9abb384c58e883d76e039a`이다. 지도서 차시 5~7, PDF 32·33·47·52쪽(인쇄 151·152·166·171쪽)의 문항 근거를 원문과 대조했다.

각 source-choice의 실행 이미지는 질문을 눈으로 판단할 수 있는 근거 영역만 보이도록 잘랐고, 최종 브라우저 화면에서 사진·그래프·교과 삽화의 실제 내용과 `source.text`·`alt`를 다시 비교했다. 생성 이미지는 표지 문구에만 사용했으며 정답 근거로 쓰지 않았다. 세부 crop 범위와 출처는 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 기록했다.

## Humanizer 학생 문구 QA

권리와 책임을 승패나 벌의 말로 표현하지 않고, 안전·존중·환경처럼 학생이 바로 이해할 행동으로 고쳤다. 표지 목표, 문제, 보기, 피드백, 결과 및 aria-label을 6학년 학생이 소리 내어 읽는 기준으로 확인했으며, `힘`·`파워`·`토큰`·`이벤트`·`게이트` 같은 금지·제작자 문구는 없다. 세부 점검은 [HUMANIZER_QA.md](HUMANIZER_QA.md)에 남겼다.

## 빌드·정적 검사·브라우저 QA

현재 `index.html`과 [screenshots/qa-report.json](screenshots/qa-report.json)은 아래 입력 지문으로 다시 생성했다. QA 생성 시각(UTC)은 `2026-08-12T13:51:19.213Z`이다.

| 입력 | SHA-256 |
|---|---|
| quiz.json | `7c86fb77b0386b3f5a0d63f097760f22c7de4f0f78453268ee5e80512ea5dcc5` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `6ac3414a27178e03a0f199c2b6262cf50303ee7eb2294ad180cd24e580e75900` |
| 실행 자산 (lessonAssetsSha256) | `d6823fd87bb86e6f6b1e852097916c199226e912bf5b4f5bcef125c1e28c1c97` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| current QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

실행 기록:

- `node scripts/build-social-quiz.mjs socialmon-6-2-u2-g09-worker-company-rights` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u2-g09-worker-company-rights` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-6-2-u2-g09-worker-company-rights` — PASS

브라우저 QA는 등록된 4 viewport에서 전체 흐름 120 state audit과 120 PNG를 새로 검사했다. text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이다. QA 영수증에는 quiz/profile/theme/lesson assets/engine/policy/harness 현재 지문이 모두 들어 있다.

## 전달 게이트

최종 단일 명령:

```sh
node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-6-2-u2-g09-worker-company-rights
```

이 작업에서는 커밋·푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `22361cd1b3f4928d6df8575752d1496f86b127610a54b30cd953dac189778afd` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `6ac3414a27178e03a0f199c2b6262cf50303ee7eb2294ad180cd24e580e75900` |
| 실행 자산 | `d6823fd87bb86e6f6b1e852097916c199226e912bf5b4f5bcef125c1e28c1c97` |
| 엔진 | `4e714a1bdc0e6caf20e362a2a182ad9d0d64d8a5f378c2ebee2f4e155e8fb75a` |
| 정책·스킬 | `fa7ce4222ee3e03a5643e058725c0a43e6aa2ba37c02351baaf1fed89ab91d50` |
| QA 하네스 | `72c00eaa8fed8ba2552f0a559ef49d149c446db98a46f51529ef8cc8dfa504ab` |
| 캡처 PNG 집합 | `1a25048f2be3dfd223078328ac2200373ceb983570814e63c25c2d8b18cb19ad` |

- QA 생성 시각: `2026-08-14T07:51:48.311Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

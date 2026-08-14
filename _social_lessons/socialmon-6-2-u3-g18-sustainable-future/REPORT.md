# 소셜몬 지속 가능한 미래 약속 완료 보고서

## 완료 내용

`socialmon-6-2-u3-g18-sustainable-future`를 profile-v2 / contract-v3 정식 6문제로 완성했다. 고르기·이어 보기 2종을 사용하며, 출판사 자료를 직접 읽는 `source-choice` 3문항과 관계형 `match` 1문항을 포함한다. 개인·기업·국가·국제기구의 역할과 우리 반 실천을 구분해 구성했다. `map-hotspots`는 사용하지 않는다.

## 출처·시각 점검

- 원자료 SHA-256: `ff9e47406a829468cefe527d5ca535bb490b457719b9424ec5197041ef5cc8ba`
- manifest 범위: PDF 67~90쪽 / 지도서 인쇄 326~349쪽 / 교과서 148~161쪽
- 자료형 3문항은 지도서의 개인 실천, 기업·국가 노력, 국제기구·비정부 기구 활동 crop을 직접 사용한다.
- 통신 주제였던 영상 통화·대화·편지·방문 장식은 제거했다. 남은 선택지의 `alt`는 실제 그림만 설명하며 정답 근거로 쓰지 않는다.

자세한 쪽별 근거는 `SOURCE_LEDGER.md`에 기록했다.

## Humanizer 학생 문구 QA

Humanizer v1.6.0 기준으로 표지 목표, 6문제 지시문·선택지·자료 설명·피드백·결과 문구·접근성 문구를 점검했다. 자료 본문은 `생활 속 실천 사진 네 장을 살펴봐요`처럼 정답을 먼저 말하지 않게 했고, 한 문장에 한 행동만 남겼다. S1 0건, S2 0건, 자연도 A이며 주체별 역할, 실천과 효과의 관계, 정답, 출처 쪽, 조작 의미 보존을 확인했다.

## 빌드 지문

| 입력 | SHA-256 |
|---|---|
| quiz.json | `c3737451dc156337f64a946242003a8b3a3a77de7bac928370eff1295c44b9be` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `5314b5a5ad9e0acdd32625c4434952ae09aab770c00349c3c4b1ab36ebd0178c` |
| 실행 자산 | `a89ca0fe45a91477a6604ad135e548d3975f3155b112bb1e599bd42204c0f3e5` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| current QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

## 검사 결과

- `node scripts/build-social-quiz.mjs socialmon-6-2-u3-g18-sustainable-future` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u3-g18-sustainable-future` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4193 node scripts/qa-social-quiz.mjs socialmon-6-2-u3-g18-sustainable-future` — PASS
- 브라우저 QA 생성 시각: `2026-08-12T13:54:28.621Z`
- 브라우저 QA: 4 viewport / 120 state audits / 120 screenshots
- overflow 0 / outside Stage 0 / critical overlap 0 / small target 0 / browser error 0

최신 브라우저 QA 영수증은 `screenshots/qa-report.json`에 있다. 이 작업에서는 커밋하거나 푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `c918e5f5c77daf7a36c9fb0c042e0037bfcf659b62cd2b92af1104ab44b48eff` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `5314b5a5ad9e0acdd32625c4434952ae09aab770c00349c3c4b1ab36ebd0178c` |
| 실행 자산 | `89a7763edfa47fef623da7ffc03aa2f205122ac4f1e263ee328a7b59fefbfd53` |
| 엔진 | `4e714a1bdc0e6caf20e362a2a182ad9d0d64d8a5f378c2ebee2f4e155e8fb75a` |
| 정책·스킬 | `fa7ce4222ee3e03a5643e058725c0a43e6aa2ba37c02351baaf1fed89ab91d50` |
| QA 하네스 | `72c00eaa8fed8ba2552f0a559ef49d149c446db98a46f51529ef8cc8dfa504ab` |
| 캡처 PNG 집합 | `fa14a3c0a9940bcc0d0a605d87ee2b1ff1aaecf2772260591c12572789c16faa` |

- QA 생성 시각: `2026-08-14T09:02:57.156Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

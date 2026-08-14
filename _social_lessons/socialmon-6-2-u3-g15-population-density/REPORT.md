# 소셜몬 사람 수와 인구 밀도 완료 보고서

## 완료 내용

`socialmon-6-2-u3-g15-population-density`를 profile-v2 / contract-v3 정식 6문제로 완성했다. 고르기·이어 보기 2종을 사용하며, 출판사 자료를 직접 읽는 `source-choice` 3문항과 관계형 `match` 1문항을 포함한다. q1은 네 나라의 실제 인구수를 비교하고, q5는 활동 지도에서 분홍색 빗금으로 표시된 인도를 읽게 해 인구수와 인구 밀도 판단을 섞지 않았다. `map-hotspots`는 사용하지 않는다.

## 출처·시각 점검

- 원자료 SHA-256: `ff9e47406a829468cefe527d5ca535bb490b457719b9424ec5197041ef5cc8ba`
- manifest 범위: PDF 22~35쪽 / 지도서 인쇄 281~294쪽 / 교과서 129~134쪽
- 자료형 3문항은 지도서 PDF 23쪽과 29쪽의 출판사 crop을 직접 사용한다.
- 통신 주제였던 영상 통화·대화·편지·방문 장식은 제거했다. 남은 선택지의 `alt`는 실제 그림만 설명하며 정답 근거로 쓰지 않는다.

자세한 쪽별 근거는 `SOURCE_LEDGER.md`에 기록했다.

## Humanizer 학생 문구 QA

Humanizer v1.6.0 기준으로 표지 목표, 6문제 지시문·선택지·자료 설명·피드백·결과 문구·접근성 문구를 점검했다. `인구수가 가장 많은 나라`, `분홍색 빗금으로 표시된 나라`처럼 자료에서 확인할 대상을 분명히 적었다. S1 0건, S2 0건, 자연도 A이며 사실·수치·나라 이름·개념 구분·정답·출처 쪽·조작 의미 보존을 확인했다.

## 빌드 지문

| 입력 | SHA-256 |
|---|---|
| quiz.json | `c26210de85abc0a714346a584b45a334dfa8ee49371ee6e55caa3d8df22ca732` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `986ce7d0649d0569b67b7bb249ae166f5bad03085fa4bb1f0067485b60abe602` |
| 실행 자산 | `f143ea0775184c36b8d0859d689d632fb3b59acdb29ed5e8ca7b6fdb29d7b734` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| current QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

## 검사 결과

- `node scripts/build-social-quiz.mjs socialmon-6-2-u3-g15-population-density` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u3-g15-population-density` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4193 node scripts/qa-social-quiz.mjs socialmon-6-2-u3-g15-population-density` — PASS
- 브라우저 QA 생성 시각: `2026-08-12T13:50:16.208Z`
- 브라우저 QA: 4 viewport / 120 state audits / 120 screenshots
- overflow 0 / outside Stage 0 / critical overlap 0 / small target 0 / browser error 0

최신 브라우저 QA 영수증은 `screenshots/qa-report.json`에 있다. 이 작업에서는 커밋하거나 푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `dd44c62bb4ec6e4e3ee51b08643404ccb2e384e602873beb2235666ed9f547b1` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `986ce7d0649d0569b67b7bb249ae166f5bad03085fa4bb1f0067485b60abe602` |
| 실행 자산 | `3a5bec2f925772c00da38473134c48dffcea8547e8b2c2329fc4fa9931dcae67` |
| 엔진 | `4e714a1bdc0e6caf20e362a2a182ad9d0d64d8a5f378c2ebee2f4e155e8fb75a` |
| 정책·스킬 | `fa7ce4222ee3e03a5643e058725c0a43e6aa2ba37c02351baaf1fed89ab91d50` |
| QA 하네스 | `72c00eaa8fed8ba2552f0a559ef49d149c446db98a46f51529ef8cc8dfa504ab` |
| 캡처 PNG 집합 | `5d5c5347f69e208279ae1e05d604668cc9781c38ac5787077878bff7968a7160` |

- QA 생성 시각: `2026-08-14T08:01:36.204Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

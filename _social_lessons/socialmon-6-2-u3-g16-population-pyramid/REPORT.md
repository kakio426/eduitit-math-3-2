# 소셜몬 인구 피라미드 탐정 완료 보고서

## 완료 내용

`socialmon-6-2-u3-g16-population-pyramid`를 profile-v2 / contract-v3 정식 6문제로 완성했다. 고르기·나누어 보기 2종을 사용하며, 출판사 그래프를 직접 읽는 `source-choice` 3문항과 관계형 `classify` 1문항을 포함한다. 세계 연령 구조 변화, 나이지리아·일본 인구 피라미드, 인도네시아 연령층 자료를 원자료의 수치와 나라 이름대로 구성했다. `map-hotspots`는 사용하지 않는다.

## 출처·시각 점검

- 원자료 SHA-256: `ff9e47406a829468cefe527d5ca535bb490b457719b9424ec5197041ef5cc8ba`
- manifest 범위: PDF 36~48쪽 / 지도서 인쇄 295~307쪽 / 교과서 135~139쪽
- 자료형 3문항은 지도서 PDF 36~38쪽의 출판사 그래프·인구 피라미드 crop을 직접 사용한다.
- 통신 주제였던 영상 통화·대화·편지·방문 장식은 제거했다. 남은 선택지의 `alt`는 실제 그림만 설명하며 정답 근거로 쓰지 않는다.

자세한 쪽별 근거는 `SOURCE_LEDGER.md`에 기록했다.

## Humanizer 학생 문구 QA

Humanizer v1.6.0 기준으로 표지 목표, 6문제 지시문·선택지·자료 설명·피드백·결과 문구·접근성 문구를 점검했다. 어색한 `평균 수명이 큰 편`을 `평균 수명이 긴 편`으로 고치고 비교 기준을 분명히 했다. S1 0건, S2 0건, 자연도 A이며 그래프 수치·연령 구간·나라 이름·증감 방향·정답·출처 쪽·조작 의미 보존을 확인했다.

## 빌드 지문

| 입력 | SHA-256 |
|---|---|
| quiz.json | `4403194460c6912a6614ca34c4ffb2a33e5cfa31448c850bc755eb837178944e` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `986ce7d0649d0569b67b7bb249ae166f5bad03085fa4bb1f0067485b60abe602` |
| 실행 자산 | `59b552084c61fbb7a2dfae0370d399b52ec8a4e7d64cd860f13b8f77439c8b3b` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| current QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

## 검사 결과

- `node scripts/build-social-quiz.mjs socialmon-6-2-u3-g16-population-pyramid` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u3-g16-population-pyramid` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4193 node scripts/qa-social-quiz.mjs socialmon-6-2-u3-g16-population-pyramid` — PASS
- 브라우저 QA 생성 시각: `2026-08-12T13:52:25.240Z`
- 브라우저 QA: 4 viewport / 120 state audits / 120 screenshots
- overflow 0 / outside Stage 0 / critical overlap 0 / small target 0 / browser error 0

최신 브라우저 QA 영수증은 `screenshots/qa-report.json`에 있다. 이 작업에서는 커밋하거나 푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `431e26ff0d394c644767b12cfe5b6e8197a3fdf264a14f605cdc53c7701a9adc` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `986ce7d0649d0569b67b7bb249ae166f5bad03085fa4bb1f0067485b60abe602` |
| 실행 자산 | `0a58c9ddace7a2a54d7c3a02d2dba592fada974de6a4e63a8700c5e6c642bc27` |
| 엔진 | `f87dfdf6ebe0f009de9ed9f018591d3df1d15fd01d655e79948946421e932fdc` |
| 정책·스킬 | `f4e45655f33a1c7cabf8bdf51458a2c9a424ff29cc14a4a6735d0d49e3c9add3` |
| QA 하네스 | `68955bd66faf6a57a11237c3f350f92aad4ce683cc66d20a2dfe7da0abbf2f2c` |
| 캡처 PNG 집합 | `8bd8ef5199333fd00067b60e206d00d4a8ef5a975c189c0cc0b3ec7a624bce22` |

- QA 생성 시각: `2026-08-16T08:49:41.899Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

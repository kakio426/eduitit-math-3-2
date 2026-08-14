# 소셜몬 세계 인구 지도 완료 보고서

## 완료 내용

`socialmon-6-2-u3-g14-world-population-map`을 profile-v2 / contract-v3 정식 6문제로 완성했다. 고르기·나누어 보기·이어 보기 3종을 사용하며, 출판사 자료를 직접 읽는 `source-choice` 4문항과 관계형 문항 2개를 포함한다.

q2·q4는 이 차시에 승인된 `socialmon-source-choice-map-hotspots-v1`이다. 두 문항만 각각 글 선택지 4개와 지도 버튼 4개를 사용한다. 지도는 `6_2_사회_3_지도서.pdf` 15쪽에서 만든 3000×1240 출판사 인구 분포 지도이며, 생성 이미지를 위치 판단 근거로 쓰지 않았다. PC·태블릿 캡처에서 남부 아시아·북부 아프리카·서부 유럽·동아시아 버튼 위치를 직접 대조했다.

## 출처·시각 점검

- 원자료 SHA-256: `ff9e47406a829468cefe527d5ca535bb490b457719b9424ec5197041ef5cc8ba`
- manifest 범위: PDF 1~21쪽 / 지도서 인쇄 260~280쪽 / 교과서 118~128쪽
- 실행 지도: 3000×1240, `150:62`, 최저 브라우저 픽셀 밀도 3.7388273323856445
- 지도 QA: 4 viewport에서 q2·q4 총 8회 audit, 버튼 겹침 0, 접근성 이름 8개 확인
- 통신 주제였던 영상 통화·대화·편지·방문 장식은 제거했다. 남은 선택지의 `alt`는 실제 그림만 설명한다.

자세한 쪽별 근거와 지도 자산 해시는 `SOURCE_LEDGER.md`에 기록했다.

## Humanizer 학생 문구 QA

Humanizer v1.6.0 기준으로 표지 목표, 문제 지시문·선택지·자료 설명·피드백·결과 문구·접근성 이름을 점검했다. 내부 표현 `map-hotspots`는 학생 화면에 노출하지 않고 `지도 위 네 위치 중 한 곳을 눌러요`처럼 행동을 바로 말한다. S1 0건, S2 0건, 자연도 A이며 사실·지역 이름·원인과 결과·정답·출처 쪽·조작 의미 보존을 확인했다.

## 빌드 지문

| 입력 | SHA-256 |
|---|---|
| quiz.json | `c550609f9690102422fe466685678a273ebe206baa49a374d07174d8158e6072` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `986ce7d0649d0569b67b7bb249ae166f5bad03085fa4bb1f0067485b60abe602` |
| 실행 자산 | `6549c7e2e36b98fa8b6cd02cdf5984b55102fb8336a83a2ab41438fef3696dbc` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| current QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

## 검사 결과

- `node scripts/build-social-quiz.mjs socialmon-6-2-u3-g14-world-population-map` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u3-g14-world-population-map` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4193 node scripts/qa-social-quiz.mjs socialmon-6-2-u3-g14-world-population-map` — PASS
- 브라우저 QA 생성 시각: `2026-08-12T13:50:15.897Z`
- 브라우저 QA: 4 viewport / 120 state audits / 120 screenshots
- overflow 0 / outside Stage 0 / critical overlap 0 / small target 0 / browser error 0

최신 브라우저 QA 영수증은 `screenshots/qa-report.json`에 있다. 이 작업에서는 커밋하거나 푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `25aa8891e70803d17d76b14e0f43f652421ada94ce5a8e531db3f757f3dfc71d` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `986ce7d0649d0569b67b7bb249ae166f5bad03085fa4bb1f0067485b60abe602` |
| 실행 자산 | `13832ea5af84b2e3d74193ce20e1bc93750059badacfb82079dea6d394fe9eb8` |
| 엔진 | `4e714a1bdc0e6caf20e362a2a182ad9d0d64d8a5f378c2ebee2f4e155e8fb75a` |
| 정책·스킬 | `fa7ce4222ee3e03a5643e058725c0a43e6aa2ba37c02351baaf1fed89ab91d50` |
| QA 하네스 | `72c00eaa8fed8ba2552f0a559ef49d149c446db98a46f51529ef8cc8dfa504ab` |
| 캡처 PNG 집합 | `8583a0a4188333cbe2d29d1c5a4ce6bdd2335c18a675956c16f424b3c8ae1d4d` |

- QA 생성 시각: `2026-08-14T08:01:37.436Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG, 지도 위치 문항 8건
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

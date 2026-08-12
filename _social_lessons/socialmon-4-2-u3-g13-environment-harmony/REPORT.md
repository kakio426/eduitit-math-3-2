# 소셜몬 사람과 환경의 약속 — 제작·검증 보고서

## 결과

4학년 2학기 사회 3단원 6~8차시(지도서 PDF 37~41쪽)를 바탕으로 환경 이용·개발 뒤 달라진 모습과 사람의 생활·자연을 함께 생각하는 방법을 살피는 6문항 차시를 완성했다. 평택시 교통 지도와 시화 갯벌 간척 전후 사진은 출판사 PDF crop을 정답 근거로 사용했고, 생성형 이미지는 투명 cover-copy와 선택지 장식으로만 사용했다.

## 제품 계약

- profile: `socialmon-quiz-lite-profile-v2`
- contract: `socialmon-quiz-lite-contract-v3`
- flow: `socialmon-four-screen-flow-v1` (`cover`, `tutorial`, `play`, `result`)
- interactions: 고르기(source-choice 2, choice 1, situation-choice 1), 나누어 보기(classify 1), 이어 보기(match 1)
- reward: `socialmon-trace-reveal-v1` — 2문제 뒤 그림자, 4문제 뒤 특징, 마지막 소셜몬 공개
- theme pack: `socialmon-4-2-environment-harmony-v1`
- 사실 자료: 출판사 지도서 PDF crop만 사용. 생성형 cover-copy·선택지 그림은 사실 근거가 아님.

## 원자료 대조

`/Users/yubyeongju/Downloads/4_2_사회_3_지도서.pdf`를 `pdfinfo`, `pdftotext -f 37 -l 41 -layout`, `pdftoppm -f 37 -l 41 -png -r 150`으로 확인하고 PDF 37~41쪽을 텍스트·렌더 이미지로 직접 대조했다. PDF 38쪽(인쇄 227쪽)의 평택시 1970년·2023년 교통 지도와 PDF 39쪽(인쇄 228쪽)의 시화 갯벌 간척 전후 사진을 실행 자료로 crop했으며, PDF 37쪽의 환경 이용·개발 균형과 PDF 40~41쪽의 생태 하천·자연 휴식년제·생태 도시 사례를 나머지 문항의 근거로 기록했다. crop 좌표, 원본·실행본, 대체 텍스트와 사용 범위는 [SOURCE_LEDGER.md](./SOURCE_LEDGER.md)에 남겼다.

## 자산

- 표지 문구: [cover-copy-v1-generated.webp](./assets/cover-copy-v1-generated.webp), 원본 [cover-copy-v1-source.png](./assets/cover-copy-v1-source.png) — 투명 생성형 래스터 한 덩어리
- 사실 자료: [source-traffic-change-v1.webp](./assets/source-traffic-change-v1.webp), [source-mudflat-change-v1.webp](./assets/source-mudflat-change-v1.webp) 및 각 `*-source.png` 원본
- q1/q4 선택지: 자연폭 512px 이상 생성형 PNG 원본 8장과 실행 WebP 8장. 모두 장식 역할이며 정답 근거가 아님을 `quiz.json`에 기록했다.

## 정적·빌드 검사

실행 결과:

```text
PASS build-social-quiz socialmon-4-2-u3-g13-environment-harmony
PASS check-social-quiz ... / contract socialmon-quiz-lite-contract-v3
PASS check-socialmon-source-catalog (1 lessons)
PASS check-social-series 4-2 --require-sources (16 games / 48 source lessons / sources verified)
SOCIALMON_INTERACTION_POLICY: PASS
PASS test-social-quiz-contract
PASS check-socialmon-pack socialmon-discovery-pack-v1
Stage ratio contract OK (25 lesson packages, 16:10 / 1280x800)
```

## 최신 브라우저 QA

실행 URL: `http://127.0.0.1:4175/_social_lessons/socialmon-4-2-u3-g13-environment-harmony/`

```bash
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-4-2-u3-g13-environment-harmony
```

결과: 등록 viewport 4종(`desktop-1280x800`, `tablet-landscape-1024x768`, `feedback-reported-1079x929`, `feedback-reported-1079x842`)에서 120 상태 audit·120 PNG를 통과했다. 텍스트 넘침 0, Stage 밖 0, 핵심 겹침 0, 작은 조작 대상 0, 브라우저 오류 0이며 cover·tutorial·play·result, answering·feedback-correct·feedback-wrong·trace-stamped·trace-silhouette·trace-trait, settings·trace-reveal을 포함한다. 전체 영수증은 [screenshots/qa-report.json](./screenshots/qa-report.json)이다.

브라우저 QA 성공 시각: `2026-08-12T13:42:52.051Z`. 이 성공 이후 공용 engine·profile·harness 파일의 외부 지문 변경은 확인되지 않았으며, 영수증과 아래 보고서 지문은 같은 실행 입력을 가리킨다.

## 현재 입력 지문

| 입력 | SHA-256 |
| --- | --- |
| `quiz.json` | `8269d816c78903ab8d5aa5df661fca0b292ead58cbd2dec52e1bc2872e9acb75` |
| `quiz-lite-v2/profile.json` | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| `environment-harmony-v1/pack.json` | `bb16c31ab2f07b4f6afbc556a5b9304df400125d56d77ffe2cd218798e92bda0` |
| 실행 자산 fingerprint | `cac7b0fb191e5d3cf7affa92cf2e6b51b4a8fd6f80d7ab82c4ff34671d426abb` |
| 공용 engine 입력 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 정책·스킬 지문 | `0360a28ee2085006abe1bb851b8f9b04a3f6aff8e44b62722fabf4a3a5a46126` |
| 현재 하네스 지문 | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

## 문구 QA·최종 게이트

Humanizer 학생 문구 QA는 [HUMANIZER_QA.md](./HUMANIZER_QA.md)에 기록했다. 목표·방법 보기·문제 지시문·선택지·설명·보상·결과 문구를 초등학생이 소리 내어 읽는 기준으로 확인했고, 내부 제작 용어와 예전 브랜드명을 배제했다.

마지막 개별 변경 파일 게이트:

```bash
SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-4-2-u3-g13-environment-harmony/quiz.json"]' \
  node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-4-2-u3-g13-environment-harmony
```

이 명령은 최신 브라우저 증거·빌드 지문·source catalog·4-2 series·공용 pack·16:10 Stage와 REPORT 현재 지문을 함께 확인한다.

## 최종 동결 중 브라우저 QA 갱신

이 절은 앞선 중간 실행 기록보다 우선한다. 최종 4-2 매니페스트를 확정한 뒤 전체 흐름을 다시 캡처했다. Humanizer 학생 문구 점검 기록은 HUMANIZER_QA.md에 보존했다.

- 영수증 생성 시각: 2026-08-12T15:34:28.099Z
- viewport 4종 / 상태 audit 120건 / PNG 120장
- 텍스트 넘침 0 / Stage 밖 0 / 핵심 겹침 0 / 작은 조작 대상 0 / 브라우저 오류 0

| 최종 입력 | SHA-256 |
| --- | --- |
| quiz.json | 8269d816c78903ab8d5aa5df661fca0b292ead58cbd2dec52e1bc2872e9acb75 |
| profile | 1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84 |
| theme pack | bb16c31ab2f07b4f6afbc556a5b9304df400125d56d77ffe2cd218798e92bda0 |
| 실행 자산 | cac7b0fb191e5d3cf7affa92cf2e6b51b4a8fd6f80d7ab82c4ff34671d426abb |
| engine | f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776 |
| 정책·스킬 | 8b2758e2f939bc661cee7b0fd8eef4cc6f4114efd44d65ce5af969f1b07fd122 |
| 하네스 | 509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300 |

공용 동결 요청에 따라 이 갱신 뒤 verify-socialmon-delivery와 test-socialmon-hooks는 실행하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `8269d816c78903ab8d5aa5df661fca0b292ead58cbd2dec52e1bc2872e9acb75` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `bb16c31ab2f07b4f6afbc556a5b9304df400125d56d77ffe2cd218798e92bda0` |
| 실행 자산 | `cac7b0fb191e5d3cf7affa92cf2e6b51b4a8fd6f80d7ab82c4ff34671d426abb` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a6bb69510ff5258dd2d5b9a3ef74635f1f3369bc32b821d5bfb88500ac034978` |
| QA 하네스 | `4311e2b76bd42939807336a04129bfb518c22856b174241715a2a75168ebbdc5` |

- QA 생성 시각: `2026-08-12T19:49:55.635Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

# 소셜몬 나라를 지키려 한 사람들 — 전달 보고서

profile-v2 / contract-v3 정식 6문제 단일 HTML이다. `cover → tutorial → play → result` 네 화면, 고르기·이어 보기·나누어 보기 조작, `socialmon-trace-reveal-v1` 흔적 보상을 사용했다. 을사늑약 뒤의 통치와 의병의 저항을 지도서 자료로 살피며, 식민 통치와 피해를 승패나 희화화로 다루지 않았다.

## 근거와 학생 문구

- `5_2_사회_3_지도서.pdf` SHA-256: `bffc72e13f62212554b35ab0299edd78c48e1957db99acf6bd83cc4ccd3cfa78`
- PDF 14~15쪽(인쇄 265~266쪽)의 을사늑약, 의병·의병 사진 자료를 확인했다.
- 문항별 사실·추론, 자료·선택지 이미지의 alt·출처는 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 기록했다.
- 생성형 제목 아트는 표지 분위기와 제목에만 썼으며 사실 근거로 쓰지 않았다.
- [HUMANIZER_QA.md](HUMANIZER_QA.md)에서 Humanizer 학생 문구 QA를 완료했다. 이번 재빌드·QA에서 학생 문구를 바꾸지 않았으므로 그 기록이 현재 실행본과 같다.

## 현재 빌드 지문

| 입력 | SHA-256 |
|---|---|
| `quiz.json` | `fd760e90a7c4bde3aa0f24a777231c1cc9e946e5246a71f74ab5cb41d55b0953` |
| profile-v2 | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 승인 테마팩 `socialmon-5-2-colonial-resistance-v1` | `71805fadb6ebaff218ef2a5946e5e904c1d8a851be03efa22cde1513b25aa1de` |
| 차시 실행 자산 | `68d67e91828caf3ca4206f95f3762d2e0b42da3bd23be0b6ec74ca84f73ebbc0` |
| 실행 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 정책 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| 현재 QA 하네스 | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |

## 빌드·정적 검사·브라우저 QA

- `node scripts/build-social-quiz.mjs socialmon-5-2-u3-g12-resistance-to-protect-nation` — PASS
- `node scripts/check-social-quiz.mjs socialmon-5-2-u3-g12-resistance-to-protect-nation` — PASS
- `node scripts/check-stage-ratio.mjs` 및 소셜몬 정책·계약·팩·시리즈 검사 — PASS
- **브라우저 QA**: `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u3-g12-resistance-to-protect-nation` — PASS
- PC `desktop-1280x800`, 태블릿 `tablet-landscape-1024x768`, 사용자 발견 회귀 `feedback-reported-1079x929`·`feedback-reported-1079x842` 4 viewport에서 전체 흐름을 다시 캡처했다. 120 state audit, 120 PNG이며 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이다.
- 표지·설정·방법 포스터, 세 조작의 문제 대기, 대표 정답·오답, 흔적 0~6, 그림자·특징 힌트, 여섯 결과 소셜몬, 자료·선택지 이미지 로드와 출처 위치, `답 확인` 안전 여백을 모두 확인했다.
- 최신 영수증: [screenshots/qa-report.json](screenshots/qa-report.json), 생성 시각 `2026-08-12T17:49:09.815Z`; 동결된 정책·하네스 지문을 반영했다.

## 개별 final gate

```sh
SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-5-2-u3-g12-resistance-to-protect-nation/quiz.json"]' node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-5-2-u3-g12-resistance-to-protect-nation
```

커밋·푸시는 하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `bbc5a099f50e0b4a408810af011e69acaddf5b492761bad980419cffb3b90f86` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `71805fadb6ebaff218ef2a5946e5e904c1d8a851be03efa22cde1513b25aa1de` |
| 실행 자산 | `68d67e91828caf3ca4206f95f3762d2e0b42da3bd23be0b6ec74ca84f73ebbc0` |
| 엔진 | `f87dfdf6ebe0f009de9ed9f018591d3df1d15fd01d655e79948946421e932fdc` |
| 정책·스킬 | `3a879b55a96cf8c5a845059e818f88d003cc1ba051b7c27eb8cf6db8b323eef1` |
| QA 하네스 | `68955bd66faf6a57a11237c3f350f92aad4ce683cc66d20a2dfe7da0abbf2f2c` |
| 캡처 PNG 집합 | `907fd71659e18643b61492722370743b56374e38fe7930cd01bf5f980108c3e6` |

- QA 생성 시각: `2026-08-16T08:39:35.085Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

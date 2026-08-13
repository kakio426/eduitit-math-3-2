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
| quiz.json | `fdacdedea521d322bc2329c01d161b28b41ffbb2b061ade9d0e1994196462613` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `71805fadb6ebaff218ef2a5946e5e904c1d8a851be03efa22cde1513b25aa1de` |
| 실행 자산 | `68d67e91828caf3ca4206f95f3762d2e0b42da3bd23be0b6ec74ca84f73ebbc0` |
| 엔진 | `4e714a1bdc0e6caf20e362a2a182ad9d0d64d8a5f378c2ebee2f4e155e8fb75a` |
| 정책·스킬 | `10fcf3bfab242828a749754983bd059db5e5bc671b7e2fc6a51861e4c571b621` |
| QA 하네스 | `72c00eaa8fed8ba2552f0a559ef49d149c446db98a46f51529ef8cc8dfa504ab` |
| 캡처 PNG 집합 | `140f83519bbc7e1c26e84b4da8ed2a3c4ce20902082fea9462ecf3932ab177db` |

- QA 생성 시각: `2026-08-13T13:26:05.944Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

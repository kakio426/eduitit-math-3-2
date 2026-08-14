# 소셜몬 일제 통치 아래 달라진 생활 — 전달 보고서

profile-v2 / contract-v3 정식 6문제 단일 HTML이다. `cover → tutorial → play → result` 네 화면, 고르기·이어 보기·나누어 보기 조작, `socialmon-trace-reveal-v1` 흔적 보상을 사용했다. 철도·도시·학교 자료를 비교해 통치 아래 달라진 생활을 살피며, 불평등과 학교 통제를 승패나 희화화로 다루지 않았다.

## 근거와 학생 문구

- `5_2_사회_3_지도서.pdf` SHA-256: `bffc72e13f62212554b35ab0299edd78c48e1957db99acf6bd83cc4ccd3cfa78`
- PDF 41·42·44쪽(인쇄 292·293·295쪽)의 철도·도시 시설·학교 통제 자료를 확인했다.
- 문항별 사실·추론, 자료·선택지 이미지의 alt·출처는 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 기록했다.
- 생성형 제목 아트는 표지 분위기와 제목에만 썼으며 사실 근거로 쓰지 않았다.
- [HUMANIZER_QA.md](HUMANIZER_QA.md)에서 Humanizer 학생 문구 QA를 완료했다. 이번 재빌드·QA에서 학생 문구를 바꾸지 않았으므로 그 기록이 현재 실행본과 같다.

## 현재 빌드 지문

| 입력 | SHA-256 |
|---|---|
| `quiz.json` | `243862024643b2e1265816fc72a361ea63bc840697d927fe46fd78b9015b0b53` |
| profile-v2 | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 승인 테마팩 `socialmon-5-2-colonial-resistance-v1` | `71805fadb6ebaff218ef2a5946e5e904c1d8a851be03efa22cde1513b25aa1de` |
| 차시 실행 자산 | `bad72d1e218521763e01fd1b971f4b72610b17b25f327ceb20b1a444119d6397` |
| 실행 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 정책 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| 현재 QA 하네스 | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |

## 빌드·정적 검사·브라우저 QA

- `node scripts/build-social-quiz.mjs socialmon-5-2-u3-g15-life-under-japanese-rule` — PASS
- `node scripts/check-social-quiz.mjs socialmon-5-2-u3-g15-life-under-japanese-rule` — PASS
- `node scripts/check-stage-ratio.mjs` 및 소셜몬 정책·계약·팩·시리즈 검사 — PASS
- **브라우저 QA**: `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u3-g15-life-under-japanese-rule` — PASS
- PC `desktop-1280x800`, 태블릿 `tablet-landscape-1024x768`, 사용자 발견 회귀 `feedback-reported-1079x929`·`feedback-reported-1079x842` 4 viewport에서 전체 흐름을 다시 캡처했다. 120 state audit, 120 PNG이며 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이다.
- 표지·설정·방법 포스터, 세 조작의 문제 대기, 대표 정답·오답, 흔적 0~6, 그림자·특징 힌트, 여섯 결과 소셜몬, 자료·선택지 이미지 로드와 출처 위치, `답 확인` 안전 여백을 모두 확인했다.
- 최신 영수증: [screenshots/qa-report.json](screenshots/qa-report.json), 생성 시각 `2026-08-12T17:56:46.709Z`; 동결된 정책·하네스 지문을 반영했다.

## 개별 final gate

```sh
SOCIALMON_GATE_CHANGED_FILES_JSON='["_social_lessons/socialmon-5-2-u3-g15-life-under-japanese-rule/quiz.json"]' node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-5-2-u3-g15-life-under-japanese-rule
```

커밋·푸시는 하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `41558060cc17d2b39d706fecce969581f265048cef1c8c1910e9998b270f700f` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `71805fadb6ebaff218ef2a5946e5e904c1d8a851be03efa22cde1513b25aa1de` |
| 실행 자산 | `bad72d1e218521763e01fd1b971f4b72610b17b25f327ceb20b1a444119d6397` |
| 엔진 | `4e714a1bdc0e6caf20e362a2a182ad9d0d64d8a5f378c2ebee2f4e155e8fb75a` |
| 정책·스킬 | `10fcf3bfab242828a749754983bd059db5e5bc671b7e2fc6a51861e4c571b621` |
| QA 하네스 | `72c00eaa8fed8ba2552f0a559ef49d149c446db98a46f51529ef8cc8dfa504ab` |
| 캡처 PNG 집합 | `2926c0db87d93838b6b10a1cbf3dbb524446ce0fc2152f80dd2567f59f7cbf44` |

- QA 생성 시각: `2026-08-14T06:28:12.280Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

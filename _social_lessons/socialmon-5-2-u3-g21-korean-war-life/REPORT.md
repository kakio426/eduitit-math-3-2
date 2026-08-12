# 소셜몬 전쟁 속 생활과 평화 — 전달 보고서

5학년 2학기 사회 3단원 10~14차시를 바탕으로 만든 profile-v2 / contract-v3
정식 6문제 단일 HTML이다. `cover → tutorial → play → result` 네 화면과
고르기·이어 보기·나누어 보기 3종 조작, `socialmon-trace-reveal-v1` 보상을 쓴다.
전쟁·피란·이산가족을 승부나 놀이로 다루지 않고, 사진과 기록에서 생활 변화를
살핀 뒤 평화를 소중히 여기는 태도로 마무리한다.

## 근거와 학생 문구

- `5_2_사회_3_지도서.pdf` SHA-256: `bffc72e13f62212554b35ab0299edd78c48e1957db99acf6bd83cc4ccd3cfa78`
- PDF 69~96쪽(인쇄 320~347쪽), 원천 10~14차시를 확인했다.
- q1·q4는 실제 지도서 자료와 네 선택지 crop, alt, 화면 오른쪽 아래 출처를 쓴다.
- 생성형 이미지는 정확한 제목·목표 표지에만 쓰고 역사적 사실의 근거로 쓰지 않았다.
- [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 문항별 사실·추론과 자산 출처를 기록했다.
- [HUMANIZER_QA.md](HUMANIZER_QA.md)에서 5학년 학생 문구 Humanizer QA를 완료했다. 이번 재빌드·QA에서 학생 문구를 바꾸지 않았으므로 그 기록이 현재 실행본과 같다.

## 현재 빌드 지문

| 입력 | SHA-256 |
|---|---|
| `quiz.json` | `f1d64ad43eebeb71c934c7c4a0d6d8fc07719f8cf9cf3b13c7dc66dc292913ff` |
| profile-v2 | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 `socialmon-5-2-liberation-war-v1` | `c9c5b16075a4d304faabc2fae2c4d7c1ba15b9abd3fee15f880cd87452bc17f0` |
| 차시 실행 자산 | `15f284a423ebfeb4a8f4c1517ff6e067cabb1e444fccaa946063e76ab4ce152b` |
| 실행 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 정책 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| 현재 QA 하네스 | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |

## 빌드·정적 검사·브라우저 QA

- `node scripts/build-social-quiz.mjs socialmon-5-2-u3-g21-korean-war-life` — PASS
- `node scripts/check-social-quiz.mjs socialmon-5-2-u3-g21-korean-war-life` — PASS
- 출처 카탈로그·상호작용 정책·계약 fixture·소셜몬 팩·16:10 Stage 검사 — PASS
- **브라우저 QA**: `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u3-g21-korean-war-life` — PASS
- PC `desktop-1280x800`, 태블릿 `tablet-landscape-1024x768`, 사용자 발견 회귀
  `feedback-reported-1079x929`·`feedback-reported-1079x842` 4 viewport, 120 state audit,
  120 PNG를 현재 코드로 새로 만들었다.
- text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이다.
- 자료 이미지·선택지 이미지 로드, 출처 위치, 답 확인 안전 여백, 흔적 0~6,
  대표 정답·오답, 여섯 결과 소셜몬을 모두 확인했다.
- 최신 영수증: [screenshots/qa-report.json](screenshots/qa-report.json), 생성 시각
  `2026-08-12T18:00:58.850Z`; 동결된 정책·하네스 지문을 반영했다.

## 최종 전달 게이트

```sh
node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-5-2-u3-g21-korean-war-life
```

커밋·푸시는 하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `f1d64ad43eebeb71c934c7c4a0d6d8fc07719f8cf9cf3b13c7dc66dc292913ff` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `c9c5b16075a4d304faabc2fae2c4d7c1ba15b9abd3fee15f880cd87452bc17f0` |
| 실행 자산 | `15f284a423ebfeb4a8f4c1517ff6e067cabb1e444fccaa946063e76ab4ce152b` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| QA 하네스 | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |

- QA 생성 시각: `2026-08-12T18:00:58.850Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

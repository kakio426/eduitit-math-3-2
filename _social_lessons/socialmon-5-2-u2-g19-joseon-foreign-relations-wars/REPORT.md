# 소셜몬 조선과 주변 나라 관계 잇기

## 완료 요약

`socialmon-5-2-u2-g19-joseon-foreign-relations-wars`를 profile-v2 / contract-v3 정식
6문제 단일 HTML로 만들었다. 화면 흐름은 `cover → tutorial → play → result` 네
화면이며, 고르기·이어 보기·순서 놓기 3종 조작만 썼다.

- q1·q3: 지도서 지도와 의병 삽화를 보는 `source-choice` 2문항
- q2·q5: 주변 나라 관계와 두 전쟁의 결과를 잇는 `match` 2문항
- q4: 임진왜란을 이겨 낸 여러 역할을 고르는 `choice` 1문항
- q6: 병자호란의 흐름을 놓는 `sequence` 1문항
- 결과 후보: 공용 discovery-pack-v1의 `cranemon`, `elephantmon`, `platypusmon`

## 지도서 검증

원자료 `~/Downloads/5_2_사회_2_지도서.pdf`의 SHA-256은
`cfa9afd5c46c9b871aafdf771615580946d16e3f5730b4b3ed03f204135777d9`이며 출처
카탈로그와 일치한다. PDF 41~48쪽(인쇄 196~203쪽)을 텍스트와 렌더링으로 대조해
명·일본·여진과의 관계, 4군·6진, 의병·수군, 임진왜란의 피해, 병자호란의 흐름을
확인했다. 직접 확인한 사실과 학생 판단은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에
나눠 기록했다.

생성형 이미지는 표지 제목·목표 아트에만 쓰며 정답 근거로 쓰지 않았다. q1·q3의
자료와 네 그림 선택지는 지도서 렌더링 crop이고, 모두 alt와 출처를 연결했다.

## Humanizer 학생 문구 QA

[HUMANIZER_QA.md](HUMANIZER_QA.md) 기준으로 표지 목표, 방법 안내, 문제 지시문,
선택지, 피드백, 결과 문구를 검토했다. `대외 관계`, `군신 관계`, `연합 전력`,
`이벤트`, `토큰`, `힘`처럼 어렵거나 제작자에게 익숙한 말은 `주변 나라 관계`,
`임금과 신하의 관계`, `함께 나섰어요`처럼 고쳤다. 전쟁 피해를 가볍게 만드는 말은
쓰지 않았다.

## 빌드·정적 검사·브라우저 QA

현재 `index.html`과 QA 영수증은 2026-08-12에 같은 입력으로 생성했다.

| 입력 | SHA-256 |
|---|---|
| quiz.json | `d078c808dd80b4876b1f1f5c13820aaf1fa46dc14baf8834347ba15dcf4709d6` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 5-2 joseon-v1 theme pack | `1dcc1ea59d64485c857d26efe0e82e94e67611eefc7eb0dbfcc69d08c244f82f` |
| lesson assets | `113ccf4470bba8386de10998ac140a6c44b800ae60c0923102ba251c5b671ff9` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| current QA harness | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |
- `node scripts/build-social-quiz.mjs socialmon-5-2-u2-g19-joseon-foreign-relations-wars` — PASS
- `node scripts/check-social-quiz.mjs socialmon-5-2-u2-g19-joseon-foreign-relations-wars` — PASS
- `node scripts/check-socialmon-source-catalog.mjs socialmon-5-2-u2-g19-joseon-foreign-relations-wars` — PASS
- `node scripts/test-social-quiz-contract.mjs` — PASS
- `node scripts/check-socialmon-pack.mjs` — PASS
- `node scripts/check-stage-ratio.mjs` — PASS
- `node scripts/check-socialmon-interaction-policy.mjs` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:43119 node scripts/qa-social-quiz.mjs socialmon-5-2-u2-g19-joseon-foreign-relations-wars` — PASS

브라우저 QA는 `desktop-1280x800`, `tablet-landscape-1024x768`,
`feedback-reported-1079x929`, `feedback-reported-1079x842`에서 전체 흐름을 검사했다.
총 4 viewport, 120 state audit, 120 PNG이며 text overflow 0, Stage 밖 0, critical
overlap 0, small target 0, browser error 0이다. 최신 영수증은
[screenshots/qa-report.json](screenshots/qa-report.json)이고 현재 정책·하네스 지문을
포함한다.

## 기존 차시 이관

g19는 기존 g09 q5의 주변 나라 관계와 g11에 섞인 청·병자호란 판단을 독립 차시로
옮긴 구성이다. 소유 범위를 지키기 위해 g09·g11 파일은 수정하지 않았으며, 그 두
기존 문항의 삭제·대체는 시리즈 통합 담당자가 처리할 후속 항목이다.

## 개별 final gate

마지막 단일 명령은
`node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-5-2-u2-g19-joseon-foreign-relations-wars`다.
공용 엔진·profile·policy·scripts·hooks·문서와 5-2 시리즈 계획·manifest는 수정하지
않았고, 커밋하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `39fd67e152f6404651447fa1efec0726e0a67c713c57e473c198db63ff936485` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `1dcc1ea59d64485c857d26efe0e82e94e67611eefc7eb0dbfcc69d08c244f82f` |
| 실행 자산 | `113ccf4470bba8386de10998ac140a6c44b800ae60c0923102ba251c5b671ff9` |
| 엔진 | `4e714a1bdc0e6caf20e362a2a182ad9d0d64d8a5f378c2ebee2f4e155e8fb75a` |
| 정책·스킬 | `10fcf3bfab242828a749754983bd059db5e5bc671b7e2fc6a51861e4c571b621` |
| QA 하네스 | `72c00eaa8fed8ba2552f0a559ef49d149c446db98a46f51529ef8cc8dfa504ab` |
| 캡처 PNG 집합 | `f14eb7c8e0ddaaf0073900ab62a0a57e1d6671832efb417d43b7b0d242290491` |

- QA 생성 시각: `2026-08-13T13:25:28.274Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

# 소셜몬 조선 후기 변화 찾기

## 완료 요약

`socialmon-5-2-u2-g10-late-joseon-change`를 profile-v2 / contract-v3 정식 6문제
단일 HTML로 완성했다. `cover → tutorial → play → result` 네 화면과 고르기·이어
보기·나누어 보기 세 조작을 사용하며, q1·q4는 출판사 지도서 자료를 직접 읽는
`source-choice`다.

- q1·q4: 지도서 그림을 보고 조선 후기 농업·새 문물의 변화 고르기
- q2·q5: 경제 단서와 사회 변화의 뜻 이어 보기
- q3: 경제 모습과 사회 모습 나누어 보기
- q6: 조선 후기 변화의 전체 모습 고르기
- 생성형 표지 아트 한 덩어리에 시리즈명·제목·목표를 담았고, 사실 근거로 쓰지 않았다.
- 식민 통치·독립운동·전쟁을 희화화하지 않았으며, 학생에게 보이는 보상은 흔적 공개만 쓴다.

## 지도서 검증

원자료 `~/Downloads/5_2_사회_2_지도서.pdf`의 SHA-256은
`cfa9afd5c46c9b871aafdf771615580946d16e3f5730b4b3ed03f204135777d9`이며 출처
카탈로그와 일치한다. PDF 54·55·60·61쪽을 `pdftotext -layout`과 300 dpi
렌더링으로 대조했고, 모내기·장시·상평통보·서양 문물·실학·신분제 동요를 직접
확인했다. 사실과 추론을 나눈 근거 및 crop 자산은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 있다.

## Humanizer 학생 문구 QA

Humanizer 기준으로 표지 목표, 방법 포스터, 문제 지시문·선택지·피드백·결과
문구를 소리 내어 읽는 흐름으로 점검했다. `경제적 변화`처럼 교과서에만 머무는
말은 그림과 함께 `농업·상업이 달라진 모습`으로 풀어 쓰고, `서양 문물이 전래됨`
대신 `새로운 물건과 생각을 접했어요`처럼 학생이 바로 이해할 수 있는 말로
정리했다. `장시`, `상평통보`, `실학`은 이 차시에서 꼭 필요한 낱말이므로 자료
그림과 짧은 설명을 함께 제시했으며, 한 문장에는 행동 하나만 남겼다.

## 빌드·정적 검사·브라우저 QA

현재 `index.html`은 아래 입력으로 다시 빌드했고, 브라우저 QA도 같은 입력 지문으로
2026-08-12에 다시 생성했다.

| 입력 | SHA-256 |
|---|---|
| quiz.json | `25f077d4193c279337cf7472b5ab88cc7135f9b0df55a8aa1c89abd2444be702` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `18dfc1e7615bfc5596a335e4b8242353b5b317763134f399466d26f8d0afd395` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| current QA harness | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |
실행 기록:

- `node scripts/build-social-quiz.mjs socialmon-5-2-u2-g10-late-joseon-change` — PASS
- `node scripts/check-social-quiz.mjs socialmon-5-2-u2-g10-late-joseon-change` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u2-g10-late-joseon-change` — PASS

브라우저 QA는 PC `desktop-1280x800`, 태블릿 `tablet-landscape-1024x768`, 회귀
viewport 두 개에서 전체 흐름을 검사했다. 총 4 viewport, 120 state audit, 120 PNG,
text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이다.
최신 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이며 정책·하네스·엔진 지문도 함께 기록되어 있다.

## 전달 게이트

최종 단일 명령:

```sh
node scripts/verify-socialmon-delivery.mjs --series=5-2 --lesson=socialmon-5-2-u2-g10-late-joseon-change
```

이 작업에서는 커밋·푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `61adb90d3836486898c17eb7f48925e2624f0daac72d3599323fd94cf0b4d109` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `18dfc1e7615bfc5596a335e4b8242353b5b317763134f399466d26f8d0afd395` |
| 실행 자산 | `c7c4d6d8abdc3fb3c323ff16e054afe85eb3078f0f53ecd7646b0b90cca7723d` |
| 엔진 | `4e714a1bdc0e6caf20e362a2a182ad9d0d64d8a5f378c2ebee2f4e155e8fb75a` |
| 정책·스킬 | `10fcf3bfab242828a749754983bd059db5e5bc671b7e2fc6a51861e4c571b621` |
| QA 하네스 | `72c00eaa8fed8ba2552f0a559ef49d149c446db98a46f51529ef8cc8dfa504ab` |
| 캡처 PNG 집합 | `e0697ccaf2a0e7ddef536ac9e6ead9a958ebb0e7b1b5d24aaf90a24d7c7fc711` |

- QA 생성 시각: `2026-08-14T06:30:41.919Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

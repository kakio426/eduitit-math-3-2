# 소셜몬 광복과 전쟁 뒤의 생활

## 완료 요약

`socialmon-5-2-u3-g16-liberation-war-life`를 profile-v2 / contract-v3 정식 6문제
단일 HTML로 완성했다. `cover → tutorial → play → result` 네 화면과 고르기·이어
보기·나누어 보기 세 조작을 사용하며, q1·q4는 출판사 지도서 사진·그림을 직접
읽는 `source-choice`다.

- q1: 피란민 사진에서 전쟁을 피해 이동한 생활 모습 고르기
- q2: 전쟁 중 겪은 어려움과 이어 간 일 나누어 보기
- q3: 광복·정부 수립·전쟁의 뜻 이어 보기
- q4: 밀면 자료에서 피란민의 생활 모습 고르기
- q5: 시설 피해·이산가족·천막 학교의 영향을 이어 보기
- q6: 전쟁의 아픔을 돌아보는 평화의 태도 고르기
- 생성형 표지 아트 한 덩어리에 시리즈명·제목·목표를 담았고, 사실 근거로 쓰지 않았다.
- 전쟁을 승부·놀이·보상처럼 다루지 않았고, 피해를 겨루거나 당시 사람을 탓하는 문구를 쓰지 않았다.

## 지도서 검증

원자료 `~/Downloads/5_2_사회_3_지도서.pdf`의 SHA-256은
`bffc72e13f62212554b35ab0299edd78c48e1957db99acf6bd83cc4ccd3cfa78`이며 출처
카탈로그와 일치한다. PDF 67·70·71·73·83쪽을 `pdftotext -layout`과 300 dpi
렌더링으로 대조했고, 광복·정부 수립, 피란민·천막 학교, 밀면, 전쟁 뒤 시설
피해·이산가족 자료를 직접 확인했다. 사실과 추론을 나눈 근거 및 crop 자산은
[SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 있다.

## Humanizer 학생 문구 QA

Humanizer 기준으로 표지 목표, 방법 포스터, 문제 지시문·선택지·피드백·결과
문구를 소리 내어 읽는 흐름으로 점검했다. `전쟁의 영향`처럼 넓은 말을 `사진과
기록으로 사람들의 생활을 살펴봐요`로 풀고, `피란민`은 사진 속 이동 모습과
함께 제시했다. `광복`, `이산가족`, `천막 학교`는 이 차시에서 꼭 필요한 낱말이므로
짧은 설명과 자료를 함께 두었으며, 학생이 전쟁을 재미있는 대결로 받아들이지
않도록 평화 문장을 짧고 분명하게 정리했다. 이번 재빌드·QA에서 학생 문구를 바꾸지
않았으므로 이 점검 결과가 현재 실행본과 같다.

## 빌드·정적 검사·브라우저 QA

현재 `index.html`은 아래 입력으로 다시 빌드했고, 브라우저 QA도 같은 입력 지문으로
2026-08-12에 다시 생성했다.

| 입력 | SHA-256 |
|---|---|
| quiz.json | `8b7b264eca9b867815beaba26928ee288ab483174b63288687a34edd98057385` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack `socialmon-5-2-liberation-war-v1` | `c9c5b16075a4d304faabc2fae2c4d7c1ba15b9abd3fee15f880cd87452bc17f0` |
| 차시 실행 자산 | `8c21836e9ec560c0f8e9e9fc4657c772d009217f63b8c3ce1194ec1ecc197ebf` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| current QA harness | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |

실행 기록:

- `node scripts/build-social-quiz.mjs socialmon-5-2-u3-g16-liberation-war-life` — PASS
- `node scripts/check-social-quiz.mjs socialmon-5-2-u3-g16-liberation-war-life` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u3-g16-liberation-war-life` — PASS

브라우저 QA는 PC `desktop-1280x800`, 태블릿 `tablet-landscape-1024x768`, 사용자 발견
회귀 `feedback-reported-1079x929`·`feedback-reported-1079x842`에서 전체 흐름을 다시
캡처했다. 총 4 viewport, 120 state audit, 120 PNG,
text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이다.
표지·설정·방법 포스터, 세 조작의 문제 대기, 대표 정답·오답, 흔적 0~6, 그림자·특징
힌트, 여섯 결과 소셜몬, 자료·선택지 이미지 로드와 출처 위치, `답 확인` 안전 여백을
모두 확인했다.
최신 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이며 생성 시각은
`2026-08-12T17:58:54.616Z`, 동결된 정책·하네스·엔진 지문도 함께 기록되어 있다.

## 전달 게이트

최종 단일 명령:

```sh
node scripts/verify-socialmon-delivery.mjs --series=5-2 --lesson=socialmon-5-2-u3-g16-liberation-war-life
```

이 작업에서는 커밋·푸시하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `8b7b264eca9b867815beaba26928ee288ab483174b63288687a34edd98057385` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `c9c5b16075a4d304faabc2fae2c4d7c1ba15b9abd3fee15f880cd87452bc17f0` |
| 실행 자산 | `8c21836e9ec560c0f8e9e9fc4657c772d009217f63b8c3ce1194ec1ecc197ebf` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| QA 하네스 | `4311e2b76bd42939807336a04129bfb518c22856b174241715a2a75168ebbdc5` |

- QA 생성 시각: `2026-08-12T19:41:32.219Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

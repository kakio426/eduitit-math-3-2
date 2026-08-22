# 소셜몬 사회 변화 살펴보기 검수 보고서

- 상태: QA 통과
- 작업 번호: `3-2-1-1`
- 공식 식별자: `socialmon-3-2-u1-g01-social-change-medium`
- 학생 화면 출처 비노출: 정적·브라우저 QA에서 확인함

## Humanizer 학생 문구 QA

- 대상 학년이 바로 이해할 수 있는 말, 번역투, 불필요한 쉼표를 점검함.
- 현재 학생 노출 문구 전체를 소리 내어 읽는 기준으로 확인했으며, Humanizer 등급 A와 학년별 읽기 기준을 통과함.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `7be41ddafef9a72e88474cbf93d59adee2b27583f68c0bdc02c42285b313e892` |
| profile.json | `b776b679b9950e15571b55a9338aa74f915b75add6831caf6330424bf3e1409c` |
| 테마팩 | `c1c86ffdea10bfb3ae91a08253ee9c7176eb2445f9be24ec0c47dea4011d3591` |
| 실행 자산 | `77e448dc12a57af85b51f003dac3bfc73995ec55c6c825d7c459b1bef3a463f6` |
| 엔진 | `6e019197ba91e531c178f6fc9bc83d8794e886df95fa524b0b77849fcff112c2` |
| 정책·스킬 | `087958f485e2fc12d4efa90a8cbc3d70961bb88e74887b4aa27edaa81417b909` |
| QA 하네스 | `cd058d6f2f725418ae3b6619ff949db3e083ee972a613346d0c2698703044d75` |
| 캡처 PNG 집합 | `7de47bb6e61f5c317bfba7ae41ac72c887dccbf03ca7ab22bf27723c765e3d2d` |

- QA 생성 시각: `2026-08-22T11:08:58.165Z`
- 브라우저 QA: 6개 viewport, 222개 상태, 222개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

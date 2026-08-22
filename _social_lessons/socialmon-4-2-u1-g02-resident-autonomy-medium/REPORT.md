# 소셜몬 주민 자치 참여하기 검수 보고서

- 상태: QA 통과
- 작업 번호: `4-2-1-2`
- 공식 식별자: `socialmon-4-2-u1-g02-resident-autonomy-medium`
- 학생 화면 출처 비노출: 정적·브라우저 QA에서 확인함

## Humanizer 학생 문구 QA

- 대상 학년이 바로 이해할 수 있는 말, 번역투, 불필요한 쉼표를 점검함.
- 현재 학생 노출 문구 전체를 소리 내어 읽는 기준으로 확인했으며, Humanizer 등급 A와 학년별 읽기 기준을 통과함.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `1b88d92c877ccd47314f0cce89957fd1014d019eda3324565edda70b6ff30ee5` |
| profile.json | `b776b679b9950e15571b55a9338aa74f915b75add6831caf6330424bf3e1409c` |
| 테마팩 | `9520573ede08c0c1cdc2fe00f78ef683042147ee1a1270c3cadc76ce737671e9` |
| 실행 자산 | `27e8386b55ddfc7d32a6206c130e1bd25788fc65e9e4df30fc544c4ee55cdbb0` |
| 엔진 | `6e019197ba91e531c178f6fc9bc83d8794e886df95fa524b0b77849fcff112c2` |
| 정책·스킬 | `f2e62a0b3744d28ac66e1c26b728ab82c06807b788a03413010a2fddfbf1060f` |
| QA 하네스 | `cd058d6f2f725418ae3b6619ff949db3e083ee972a613346d0c2698703044d75` |
| 캡처 PNG 집합 | `291ba724add69aeee78fae057f7256e8762d1d1195b7c0d761a674101af7a358` |

- QA 생성 시각: `2026-08-22T11:19:35.041Z`
- 브라우저 QA: 6개 viewport, 234개 상태, 234개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

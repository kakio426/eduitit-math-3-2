# 소셜몬 학교 민주주의 실천하기 검수 보고서

- 상태: QA 통과
- 작업 번호: `4-2-1-1`
- 공식 식별자: `socialmon-4-2-u1-g01-school-democracy-medium`
- 학생 화면 출처 비노출: 정적·브라우저 QA에서 확인함

## Humanizer 학생 문구 QA

- 대상 학년이 바로 이해할 수 있는 말, 번역투, 불필요한 쉼표를 점검함.
- 현재 학생 노출 문구 전체를 소리 내어 읽는 기준으로 확인했으며, Humanizer 등급 A와 학년별 읽기 기준을 통과함.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `469538884d4f81a8caf229197ca42a0eb0f702ccd10c579e03bf1bdded3d3aed` |
| profile.json | `b776b679b9950e15571b55a9338aa74f915b75add6831caf6330424bf3e1409c` |
| 테마팩 | `9520573ede08c0c1cdc2fe00f78ef683042147ee1a1270c3cadc76ce737671e9` |
| 실행 자산 | `691fd53ae20fc4729340448c809c0ce4c0c7d69f277eb39ba256a00470f03cfa` |
| 엔진 | `6e019197ba91e531c178f6fc9bc83d8794e886df95fa524b0b77849fcff112c2` |
| 정책·스킬 | `f2e62a0b3744d28ac66e1c26b728ab82c06807b788a03413010a2fddfbf1060f` |
| QA 하네스 | `cd058d6f2f725418ae3b6619ff949db3e083ee972a613346d0c2698703044d75` |
| 캡처 PNG 집합 | `a6f4b444552da8a4c4d6af60e7f347f8ed2f9adc8f77a868c8b47f234daf097b` |

- QA 생성 시각: `2026-08-22T11:19:09.193Z`
- 브라우저 QA: 6개 viewport, 216개 상태, 216개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

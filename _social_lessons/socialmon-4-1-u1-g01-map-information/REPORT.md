# 소셜몬 지도 정보 읽기 검수 보고서

- 상태: QA 통과
- 작업 번호: `4-1-1-1`
- 공식 식별자: `socialmon-4-1-u1-g01-map-information`
- 학생 화면 출처 비노출: 정적·브라우저 QA에서 확인함

## Humanizer 학생 문구 QA

- 대상 학년이 바로 이해할 수 있는 말, 번역투, 불필요한 쉼표를 점검함.
- 현재 학생 노출 문구 전체를 소리 내어 읽는 기준으로 확인했으며, Humanizer 등급 A와 학년별 읽기 기준을 통과함.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `11bd8358ab30111b9ca6753fe75211934ade11b04e1cd25895761520ccab50c7` |
| profile.json | `b776b679b9950e15571b55a9338aa74f915b75add6831caf6330424bf3e1409c` |
| 테마팩 | `2ea4a73f3261385e3699ab7ce2d41b82caa77c18c094c2f7aebbc3967d207326` |
| 실행 자산 | `7e7b2a3da90f445029834521777241c42f8995afca294a5fe56722d82cf4ca9b` |
| 엔진 | `6e019197ba91e531c178f6fc9bc83d8794e886df95fa524b0b77849fcff112c2` |
| 정책·스킬 | `360bbcfb5783700cc694258ef588c43120cc94079bb95edd2973c30e4800f096` |
| QA 하네스 | `cd058d6f2f725418ae3b6619ff949db3e083ee972a613346d0c2698703044d75` |
| 캡처 PNG 집합 | `64ee7b7dc4dc7d396587c2bddab7a65154c1048cca21ca3d1e5ad1725056a2c7` |

- QA 생성 시각: `2026-08-22T11:12:42.014Z`
- 브라우저 QA: 6개 viewport, 228개 상태, 228개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

# 소셜몬 여러 장소 살펴보기 검수 보고서

- 상태: QA 통과
- 작업 번호: `3-1-1-1`
- 공식 식별자: `socialmon-3-1-u1-g01-many-places`
- 학생 화면 출처 비노출: 정적·브라우저 QA에서 확인함

## Humanizer 학생 문구 QA

- 대상: 개념 카드 4장 제목·본문·핵심 문장. 3학년이 소리 내어 읽어도 바로 이해되는 짧은 문장으로 맞춤.
- 개념 2의 `묶이는 장소`를 `같이 모이는 장소`로, 개념 3의 `넣을 수 있어요`를 `넣어요`로 바꿈.
- 개념 4는 `소개하면`·`나눠요`처럼 교실에서 바로 하는 말로 맞춤.
- 번역투·한자어·`할 수 있어요` 반복은 개념 카드에서 걸러 둠.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `de0b91811ed654243f56dd1238e931f28b887243de81938f42010381efa5cab1` |
| profile.json | `0fe2372b0459a9adc85e04b573776a95d84eff746b5068e4c65fbe359c50c259` |
| 테마팩 | `e9dd57251aca44d6df8210b71e3152b68a85e193140603c59312321d0f828952` |
| 실행 자산 | `a1403f8a612daa8c5d17ba61913ddfca155aa330bbe598edd7946d27d91da60e` |
| 엔진 | `8de20386dc912c3cc56220ac2536ddb29696bb9bf82cc336b5aa1a9903ab5b4d` |
| 정책·스킬 | `bea5fa3701cd2a354157977ee5e30ec762b55dbdf262d42e05ecc31fbb710532` |
| QA 하네스 | `7883efe2c719adade9474bd9df2d9a9496e4d569960130de57189987bc65de81` |
| 캡처 PNG 집합 | `f2493af14c1bcf2cc31b88281e251f21550a1076a7ab73fb56418a9479ee3d89` |

- QA 생성 시각: `2026-08-21T01:39:51.086Z`
- 브라우저 QA: 6개 viewport, 240개 상태, 240개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

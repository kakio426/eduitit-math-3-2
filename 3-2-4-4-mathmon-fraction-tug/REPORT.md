# 매스몬 분수 줄다리기 제작 보고

## 2026-08-02 최종 보상 우선 재구축과 왼쪽 진행 보상 적용

- 먼저 최종 보상 6등급을 전부 새로 만들고 실제 결과 화면에서 확정한 뒤, 그 상승 흐름을 기준으로 문제 왼쪽 진행 보상 6장을 별도로 만들었습니다. 최종 결과 이미지를 잘라서 재사용한 장면은 `0장`입니다.
- 최종 결과는 `비 오는 빈 연습장 → 따뜻한 학교 운동장 → 협곡 다리 → 설산 정상 → 황금 챔피언 경기장 → 우주 무지개 신전`으로 바뀝니다. 배경·조명·호랑몬 반응·메달/깃발/트로피·색 계열이 인접 단계마다 두 가지 이상 달라지며, 상위 두 단계도 황금 왕실과 보라·청록 무지개 우주로 분리했습니다.
- 최종 보상 6장은 각각 `1280×800` 완성 장면입니다. 등급 제목과 `다시` 표면은 생성 이미지 안에 있고, 줄다리기 힘·막대·정답 수·다음 목표만 동적 슬롯으로 표시합니다. CSS 단계 필터·혼합 모드·결과 효과 오버레이는 사용하지 않습니다.
- 최종 보상 자산 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-4/result-fullscene-v1/contact-sheets/result-tiers-v4-contact-sheet.png`
- 최종 보상 브라우저 컨택시트: `screenshots/result-all-tiers-desktop-contact-sheet.png`, `screenshots/result-all-tiers-tablet-landscape-contact-sheet.png`
- 문제 왼쪽 진행 보상은 같은 여섯 환경을 `768×1536` 세로 전용 장면으로 다시 생성했습니다. 여섯 장 모두 호랑몬 전신 잘림 `0건`, 중심 `x=0.50`, 몸 중심 `y=0.56~0.57`, 발 기준선 `y=0.69~0.70`, 보이는 몸 높이 `0.30~0.31`입니다.
- 왼쪽 자산 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-4/play-progress-v1/contact-sheets/play-tug-progress-v1-contact-sheet.png`
- 왼쪽 생성 원본: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-4/play-progress-v1/source`
- 왼쪽 기준선 검사: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-4/play-progress-v1/contact-sheets/play-tug-progress-v1-anchor-audit.png`
- 왼쪽 패널은 `stage-left-play-progress-v1`로 Stage 기준 `left 1.65% / top 11% / width 19.2% / height 84%`에 고정했습니다. 모든 화면 크기에서 네 변 오차는 `1px` 이하, 학습 영역 교차는 `0px`, 이미지와 패널 중심 차이는 `1px` 이하입니다.
- 모달이 완전히 닫힌 뒤 `320ms`를 기다리고, 단계 이미지 교체와 Stage 폭 `35%`의 전용 충격 효과를 `1560ms` 보여 준 다음에만 다음 문제로 이동합니다. 고정 `무승부 → 아슬아슬 승리` fixture로 이미지 변경·모달 선행 닫힘·문제 번호 고정을 검사했습니다.
- `empty` fixture에서는 누적 줄다리기 힘을 유지하고 이번 변화만 `0`으로 처리했습니다.

### 현재 화면 증거와 화면 크기

- 시작·설정·설명·문제 대기·대표 오답 2종·정답 확인·닫힌 보상·열린 보상·단계 상승 효과·결과 6등급을 현재 `index.html` 해시 기준으로 다시 캡처했습니다.
- `1280×800`: `screenshots/report-flow-desktop-contact-sheet.png`
- `1024×768`: `screenshots/report-flow-tablet-landscape-contact-sheet.png`
- `1280×720`, DPR 2: `screenshots/report-flow-codex-in-app-contact-sheet.png`
- `994×632`: `screenshots/report-flow-user-visibility-contact-sheet.png`
- 사용자가 왼쪽 보상 누락을 확인한 회귀 화면 `1082×987`, DPR 2: `screenshots/report-flow-user-reported-missing-left-progress-contact-sheet.png`
- 빈 보상 전용 `1280×800`: `screenshots/report-flow-empty-reward-fixture-contact-sheet.png`
- 총 `6`개 fixture, `149`개 현재 스크린샷이며 텍스트 넘침·요소 겹침·Stage 이탈·이미지 누락은 모두 `0건`입니다.

### Humanizer 학생 문구 QA

- 왼쪽 패널 이름은 제작 용어인 `진행 보상`, `등급`, `단계`를 쓰지 않고 `지금 모습`으로 표시했습니다.
- 결과 이름 `무승부`, `아슬아슬 승리`, `승리`, `큰 승리`, `챔피언`, `전설의 승리`는 화면의 변화와 바로 연결되고, 한 패널 안에서 같은 뜻을 반복하지 않습니다.

## 2026-07-28 전체 점검 수정 결과

- 결과 6단계를 글자·버튼 없는 생성 배경, 투명 생성 제목, 동적 줄다리기 힘·정답 수·다음 목표, 투명 생성 `다시` 버튼으로 분리했습니다.
- 결과 제목·줄다리기 힘·정답 수·다음 목표·버튼을 게시판의 한 세로축에 맞췄습니다.
- 결과 이름은 `아슬아슬 승리`, `큰 승리`, `전설의 승리`로 다듬고, 마지막 안내는 `마지막 승부 결과`처럼 자연스럽게 고쳤습니다.
- `1280×800`, `1024×768`에서 결과 6단계를 모두 검사했습니다. 축 오차는 Stage 폭의 1.5% 이하, 요소 교차·Stage 이탈·누락 이미지는 0건, 버튼 아트와 hitbox 경계 차이는 1px 이하입니다.
- 최신 배경 컨택시트는 `result-tiers-v3-contact-sheet.png`, 제목 컨택시트는 `result-titles-v3-contact-sheet.png`입니다.

## 2026-07-23 V2 보완 결과

- 공용 시작 버튼 `../_shared/mathmon/cover-start-button/start-button-generated.webp`만 사용합니다.
- 커버는 `shared-canonical-v1`, 표시 크기 `360×152px`, 작은 화면 최소 `300×127px`, 비율 `1611:680` 계약을 따릅니다.
- 문제 화면 상단은 왼쪽 `에듀잇티 수학 게임`, 가운데 `N/10`, 오른쪽 `4단원 분수`, 설정 버튼 순서로 고정했습니다.
- 줄다리기 선물 상자와 보상 6종을 `closed + 6 events` 7장 상태 세트로 연결했습니다.
- 작은 분수를 고른 오답 상태에서도 학생이 고른 막대와 실제 큰 막대, `<` 관계를 바로 확인하도록 고쳤습니다.
- 결과 등급 6장과 문제 은행, 보상 확률, 랭킹 비활성화 정책은 유지했습니다.
- 사용 매스몬 팩은 정식 승인된 `diversity-reward-pack`이며 주인공은 호랑몬입니다. 호랑몬 manifest에 4차시 커버·설명·보상·결과 사용처를 기록했습니다.

## 생성 이미지와 상태 세트

- 닫힌 보상 런타임: `reward-event-closed-generated.webp`, `512×512`
- 보상 상태: `closed`, `normal`, `loss`, `mega`, `perfect`, `empty`, `rainbow`
- 보상 컨택시트: `reward-events-v3-contact-sheet.png`
- 결과 배경 6장 컨택시트: `result-tiers-v3-contact-sheet.png`
- 결과 제목 6장 컨택시트: `result-titles-v3-contact-sheet.png`
- 닫힌 보상에는 글자·숫자·결과 등급·버튼이 없습니다.
- 차시별 시작 버튼 원본·PNG·WebP는 제거했으며 공용 자산을 복제하거나 변형하지 않았습니다.

## 학습 조작과 입력 통계

- 한 문제의 수학적 판단은 `더 큰 분수 하나 고르기` 1회입니다.
- 정답 경로의 물리 입력은 선택 1회, 확인과 이동을 포함해 4탭입니다.
- 문제 은행 전체 통계는 수학적 판단 `최소 1 / 중앙값 1 / 평균 1 / 최대 1`, 물리 입력 `최소 4 / 중앙값 4 / 평균 4 / 최대 4`입니다.
- 대표 오답은 `분모가 같은데 작은 분수를 고른 상태`와 `단위분수에서 작은 분수를 고른 상태`를 각각 막대 길이와 `<` 관계로 확인합니다.

## 브라우저 실측

`scripts/qa-lesson-flow.mjs`로 10문제를 완주했습니다. 아래 값은 현재 코드에서 측정한 `getBoundingClientRect()` 기준입니다.

| 화면 | Stage | 작업 영역 | Stage 폭 비율 | Stage 면적 비율 | 1순위 선택지 | 2순위 문제판 |
| --- | --- | --- | ---: | ---: | --- | --- |
| 1280×800 | 1203.19×751.98 | 1082.88×661.98 | 90.00% | 79.23% | 1082.88×310, 37.10% | 1082.88×281.98, 33.75% |
| 1024×768 | 983.06×614.41 | 884.78×525.94 | 90.00% | 77.04% | 884.78×310, 45.41% | 884.78×145.94, 21.38% |

- 선택지 최소 크기: 데스크톱 `534.94×310px`, 태블릿 `435.89×310px`
- 설정 버튼: 두 화면 모두 `42×42px`, 톱니 아이콘 `20×20px`
- 실제 글자 크기: 상단 라벨 `14.4px`, 문제 제목 최소 `34.82px`, 지시문 최소 `15.87px`, 선택지 최소 `20.48px`
- 상단 행과 문제판 최소 간격 `6px`, 문제판·지시문·선택지 사이 간격 `8px`
- 터치 영역: 모든 조작 `42×42px` 이상
- 정답 대기 → 확인 상태 중심축 차이: `0px`이며 허용값 `1px` 이하
- 브랜드·진행 수·단원·설정 버튼 교차: `0px`
- 텍스트 넘침, 요소 교차, Stage 이탈, 이미지 로드 실패: 모두 `0건`
- 시작 버튼 아트와 hitbox의 너비·높이·중심 차이: 모두 `1px` 이하

## 상태별 최신 증거

- 화면 크기: `1280×800`, `1024×768`
- 상태: 커버, 설정 모달, 설명 1·2, 문제 대기, 오답 2종, 정답 확인, 마지막 확인, 닫힌 보상, 열린 보상, 결과 6등급
- 현재 증거: `screenshots/engine-flow-desktop-*`, `screenshots/engine-flow-tablet-landscape-*`
- 결과 6등급: `screenshots/engine-flow-*-08a-result-*.png`
- 이전 증거: `screenshots/_archive/2026-07-12-pre-v2/`
- 랭킹 UI·API 요청, 콘솔 오류, 실패 응답: 모두 `0건`

## 검사 결과

- `node scripts/qa-engine-unit4-tug-source.mjs` 통과
- 대상 lesson build, lesson contract, visual contract V2, Stage ratio 검사 통과
- `node scripts/check-run-randomness.mjs` 통과
- `node scripts/check-ranking-disabled.mjs` 통과
- `node scripts/qa-lesson-flow.mjs 3-2-4-4-mathmon-fraction-tug` 양쪽 화면 10문제 완주 통과

## Humanizer 학생 문구 QA

학생 문구는 `색칠된 칸이 많은 쪽이 더 커요.`, `똑같이 나눈 한 칸이 긴 쪽이 더 커요.`, `고른 막대가 더 짧아요.`처럼 비교 기준 하나만 담았습니다. 제작자 용어와 같은 뜻의 반복 문구는 학생 화면에 남기지 않았습니다.

문제 지시는 `두 분수 중 더 큰 것을 골라요.`로 짧게 유지하고, 정답 확인·접근성 이름은 `/` 대신 `8분의 3`처럼 읽는 말로 표시합니다. 보이는 쌓인 분수와 학생 문구의 표현이 어긋나지 않는지 문제 은행 전체를 소스 QA로 검사합니다.

## 2026-07-31 최종 회귀

- 현재 소스 재빌드 뒤 `1280×800`, `1024×768` 전체 흐름과 결과 6단계를 다시 캡처했습니다. 글자 넘침·요소 겹침·Stage 이탈·이미지 누락은 `0건`입니다.
- 문제·정답 확인·완성 문구의 숫자 `/` 분수 표기 `0건`을 전용 source QA로 고정했습니다.

## 2026-08-01 Kiro 6차 차단 항목 회귀

- 질문·줄·분수 막대를 밝고 불투명한 문제판 안에 두고, 선택지는 불투명한 `#f5fdff` 표면으로 고정했습니다.
- 정답 확인은 분자에 맞는 `이/가` 조사를 사용합니다.
- 선택지 접근성 이름도 `4분의 1`처럼 읽는 말만 사용하며 `/` 표기는 없습니다. 소스 QA가 두 선택지의 `aria-label`을 전수 검사합니다.
- `empty` 사건은 누적 줄다리기 힘을 유지하며, 누적값 `47` 브라우저 fixture를 통과했습니다.

## 2026-08-01 Kiro 8차 심층 회귀

- 대기부터 왼쪽·오른쪽의 실제 분수와 막대를 모두 보여 줍니다. 정답·오답 확인에서도 원래 피연산자 순서를 바꾸지 않고, 정답 부호만 원래 왼쪽/오른쪽 값으로 계산합니다.
- 완료판은 `#e2f7fc` 불투명 표면입니다. 소스 QA가 `larger` 우선 재배치가 되돌아오지 않는지와 문제판·선택지·완료판의 실색을 검사합니다.

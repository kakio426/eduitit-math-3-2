# 3학년 2학기 1·2단원 공용 자원 계약

학생 화면에서 반복되는 고정 시각 요소를 한 번만 관리하기 위한 확정 목록입니다. 차시별 테마·점수·결과 등급은 바꾸되, 아래 파일은 복제하거나 새로 만들지 않습니다.

| 요소 | 공용 ID | 실행 참조 | 적용 범위 |
| --- | --- | --- | --- |
| 시작 버튼 | `mathmon-cover-start-button-v1` | `../_shared/mathmon/cover-start-button/start-button-generated.webp` | 1·2단원 8차시 |
| 주요 행동 버튼 | `mathmon-primary-action-buttons-v1` | `../_shared/action-buttons/{next,previous,problem-start,result-view}-button-generated.webp` | 설명·보상 흐름의 같은 행동 |
| 결과 정답 수 | `mathmon-result-correct-count-v1` | `../_shared/result-count/result-correct-{0..10}-generated.webp` | 모든 결과 |
| 다시 버튼 | `mathmon-result-retry-button-v1` | `../_shared/result-actions/retry-button-generated.webp` | 모든 결과 |
| 순위 보기 버튼 | `mathmon-scoreboard-result-button-v1` | `../_shared/scoreboard/scoreboard-result-button-generated.webp` | 모든 결과 |
| 브랜드 마크 원본 | `eduitit-brand-mark-v1` | `_shared/brand/eduitit-logo-mark.png` | 각 차시의 같은 배포본 기준 |
| 매스몬 반응 | `mathmon-base-reaction-pack-v1` | `_shared/mathmon/base-pack/webp/reactions-unit2/` | 2단원 4차시 |

## 표시와 상호작용

- 시작 버튼은 1280×800 Stage에서 보이는 아트와 hitbox를 `360×152px`, 원본 비율 `1611:680`으로 맞춥니다. `<main>`에는 `data-cover-start-asset="shared-canonical-v1"`를 둡니다.
- `다음`, `이전`, `문제 시작`, `결과 보기`처럼 여러 차시에서 뜻이 같은 주요 행동은 공용 행동 버튼을 직접 참조합니다. 다른 뜻의 글자를 CSS로 덮지 않으며, 차시 소재 전용 행동은 같은 시각 계열의 별도 생성 자산으로 둡니다.
- 공용 행동 버튼은 생성형 글자 아트와 HTML hitbox를 같은 경계로 맞추고, 보이는 HTML 텍스트를 중복하지 않습니다. 숫자 선택지·설정·닫기에는 이 큰 버튼 규격을 적용하지 않습니다.
- 결과 정답 수는 `correctCount`를 `0..10`으로 제한한 뒤 해당 WebP의 `src`만 바꿉니다. HTML/SVG로 큰 `0/10` 글자를 새로 그리지 않습니다.
- 결과의 `순위 보기`와 `다시`는 생성 아트를 보이고, 같은 경계의 투명 HTML 버튼이 키보드·터치 접근성과 클릭을 맡습니다. 순위 버튼은 점수 여부와 관계없이 모든 결과에 표시합니다.
- 브랜드 마크는 `_shared/brand/`에서 한 번만 관리합니다. 각 독립 HTML 패키지의 로컬 배포본은 이 원본과 같은 파일이어야 합니다.
- 매스몬 반응은 `base-pack/manifest.json`의 foxmon·eaglemon·unicornmon·kingdragonmon `correct/wrong/reward` 4세트만 사용합니다. 차시 폴더의 WebP는 독립 실행용 동일 배포본입니다.

## 변경 절차

이 계약의 자산 자체를 바꾸려면 사용자의 명시적 승인, 원본/PNG/WebP 검증, 모든 참조 차시의 실제 화면 QA가 필요합니다. 차시 하나의 필요만으로 공용 파일을 색 변경·재가공·복제하지 않습니다.

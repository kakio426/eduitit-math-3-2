# 3-2-6-1 source report

## 엔진 범위

- `mathmon-engine-v1`의 Stage, 커버, 설정 모달, 설명 2장, 문제 흐름, 보상, 결과 화면을 그대로 사용합니다.
- 차시 고유 코드는 문제 생성기, 자료판 렌더러, 자료판 CSS로 제한했습니다.

## 학생 문구 QA

- 첫 화면: `표를 보고 가장 많은 것을 골라요.`
- 문제 지시문: `점이 가장 많은 줄을 골라요.`, `사과 줄의 점을 세요.`, `많은 수에서 적은 수를 빼요.`
- 보상 문구: `불빛이 켜졌어요.`, `조금 켜졌어요.`, `크게 반짝였어요.`

어른스러운 용어인 `데이터`, `분석`, `통계`, `이벤트`는 학생 화면 문구에서 쓰지 않았습니다.

## QA

- 빌드: `node scripts/build-lesson.mjs 3-2-6-1-mathmon-data-rangers`
- 계약: `node scripts/check-lesson-contract.mjs`
- 브라우저 흐름: `node scripts/qa-lesson-flow.mjs 3-2-6-1-mathmon-data-rangers`
- 확인 viewport: 1280x800, 1024x768
- 결과: placeholder 0개, 누락 이미지 0개, 텍스트 넘침 0개

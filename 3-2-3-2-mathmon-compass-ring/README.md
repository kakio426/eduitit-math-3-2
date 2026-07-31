# 매스몬 컴퍼스 마법진

에듀잇티 수학 게임 시리즈 3학년 2학기 3단원 2차시입니다.

- 학습: 컴퍼스의 벌린 길이와 반지름의 관계
- 목표: 반지름만큼 컴퍼스를 벌려요.
- 문제: 반지름 2~6 cm를 각각 두 번씩 섞은 10문제
- 행동: 반지름만큼 벌어진 컴퍼스 그림 1개 고르기
- 흐름: 첫 화면 → 방법 보기 → 문제 → 정답 확인 → 랜덤 마법진 빛 → 결과
- 실행: `index.html`을 브라우저에서 열기

## 학습 화면

큰 원에서 주어진 반지름을 먼저 보고, 눈금 위에 놓인 컴퍼스 그림 4개 중 알맞은 벌림을 고릅니다. 모든 문제에는 반지름을 지름으로 착각한 보기와 한 칸 좁거나 넓은 보기가 들어갑니다.

오답을 고르면 선택한 벌림으로 실제로 그려질 작은 원이나 큰 원의 호가 목표 원과 겹쳐 보입니다. 정답을 고르면 `중심에 바늘 놓기 → 반지름만큼 벌리기 → 컴퍼스 돌리기 → 원 완성` 순서가 SVG로 이어집니다. 학생은 원이 완성된 뒤 `마법 보기`를 눌러 문제 화면 위에 뜬 보상 상자를 엽니다.

## 화면과 자산

- `problem-stage-generated.webp`: 1280×800 밝은 마법 기하 작업실 문제 배경
- `problem-stage-generated.png`: 1280×800 작업 원본
- `problem-stage-source.png`: imagegen 생성 원본
- 문제 중 진행 장면: `play-progress-v3-*-generated.webp` 6장, 각 418×627
- 진행 장면 생성 원본: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/play-progress-v3/source`
- 진행 장면 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/play-progress-v3/contact-sheets/play-progress-v3-contact-sheet.png`
- 동행 매스몬: `diversity-reward-pack`의 수정부엉몬(`mathmon-drv-05-crystalowl`)
- 설명 1: `반지름 3 cm = 컴퍼스 벌림 3 cm`를 원·눈금·컴퍼스로 직접 연결
- 설명 2: 10문제·마법진 빛 변화·마지막 마법진 이름만 안내
- 보상 상태 세트: 열기 전 봉인 상자 1장과 사건별 이미지 6장, 모두 512×512
- 보상 컨택시트: `reward-events-v3-contact-sheet.png`
- 보상 표시: 문제 화면을 그대로 둔 중앙 `modal-art` 카드와 9px 배경 블러
- 결과 완성 장면 세트: `result-*-generated.webp` 6장, 각 1280×800, 배경·수정부엉몬·마법진·빛·고정 제목·빈 결과판·`다시` 버튼을 한 이미지에 포함
- 결과 원본·계약: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/result-fullscene-v3/`
- 결과 자산 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/result-fullscene-v3/contact-sheets/result-fullscene-v3-contact-sheet.png`
- 결과 표시: 완성 장면 한 장 위에 마법진 빛·정답 수·다음 목표 같은 넓은 범위 동적 값만 SVG/생성 숫자 이미지로 표시
- 원·반지름·눈금·컴퍼스: 정확한 길이 관계가 필요한 SVG
- 선택: 같은 좌표의 HTML 버튼과 접근성 이름

문제 화면 왼쪽에는 지금의 마법진 단계와 짧은 빛 막대만 보입니다. `3-2-3-1`과 `3-2-2-3`의 왼쪽 진행 레인을 참고해 패널을 Stage 기준 `left 2.9%`, `top 11%`, `width 25.2%`, `height 84%`로 고정했습니다. v3 생성 장면은 수정부엉몬을 왼쪽 아래, 마법진 장치를 오른쪽에 두고 두 대상의 전신과 받침대를 모두 보여 줍니다. 단계 이미지는 결과 장면을 잘라 쓰지 않고 문제 화면용 6장을 따로 사용하며 `object-fit: contain`으로 전체가 보이게 합니다. 오른쪽에는 큰 질문, 현재 반지름 그림, 한 줄 지시 또는 피드백, 컴퍼스 선택지만 둡니다.

## 보상

중심 보상은 마법진 빛 하나입니다. 문제 화면 위 중앙 모달에서 닫힌 상자와 `열기`만 먼저 보여 줍니다. 뒤의 문제 화면은 9px 블러로 멈춰 두고, 학생이 열면 사건 이미지, `마법진 빛 ±값`, `다음`만 남습니다. `다음`을 누르면 모달이 완전히 닫히고 320ms 동안 시선을 옮길 여백이 생깁니다. 그 뒤 새 단계 이미지로 바뀌면서 왼쪽 레인 바깥까지 번지는 빛기둥·원형 충격파·섬광·확대 효과가 1560ms 동안 나타납니다. 효과가 끝난 다음에만 다음 문제로 넘어갑니다. 증가·감소·큰 증가·완벽한 원·0·무지개 중 하나가 공개되며, 0 사건은 지금까지 모은 빛을 없애지 않고 이번 변화만 0으로 처리합니다. 오답 손해는 흔한 정답 보상의 최소 증가량보다 작게 제한합니다.

보상 경제는 `mathmon-unified-reward-v1`을 그대로 씁니다. 정답 사건은 보통 `64%/+6~10`, 작은 손해 `15%/-5~-2`, 큰 보상 `12%/+14~22`, 완벽한 원 `5%/+30`, 그대로 `3.8%/0`, 특별 `0.2%/100`입니다. 문제당 최초 오답은 `-6~-3`이고, 일반 결과 기준은 `0/0 → 15/2 → 35/4 → 55/6 → 78/8`, 특별 결과는 특별 사건이 나온 `100/1`입니다.

## 공통 화면·QA 계약

- 시작 버튼: `shared-canonical-v1`, 공용 자산 `../_shared/mathmon/cover-start-button/start-button-generated.webp`
- 표시 크기: 1280 화면 360×152px, 1024 화면 최소 300×127px, 비율 `1611 / 680`
- 문제 HUD: 왼쪽 브랜드, 가운데 `1/10`, 오른쪽 `3단원 원`; 진행 막대는 숨김
- 상단 조작 정렬: 단원 배지와 설정 버튼은 같은 `--stage-inset` 상단 좌표와 42px 높이를 사용하며, 실제 상단·세로 중심·높이 차이를 각각 1px 이하로 검사
- 보상 모달: `560×480px(7:6)` 카드와 `250×250px` 이미지 슬롯, Stage 중앙·크기 오차 1px 이하, 512×512 자산, 이미지·변화량·버튼 겹침 0, 배경 블러 8px 이상
- 보상 후 효과: `modal-dismiss-world-impact-v2`, 모달 공개 중 배경 이미지 고정, 모달 닫힘 뒤 320ms 시선 이동 여백, Stage 폭 35% 효과 레이어, 최소 1200ms 표시·1560ms 종료 뒤 다음 문제 전환
- 작업 영역 최소 폭: Stage의 65%. 실제 측정은 두 QA 화면 모두 66.00%
- 왼쪽 진행 장면: `stage-left-play-progress-v1`, 수정부엉몬 전신과 마법진이 함께 있는 6단계 전용 이미지, 동일 418×627 캔버스, 매스몬 중심 `(0.30, 0.66)`·발 기준선 `0.88`, 잘림 없는 `contain`
- 최종 결과: `result-tier-fullscene-native-v1`, 단계별 서로 다른 1280×800 완성 장면, `visualRank 0~5`, 별도 효과 이미지·blend mode·등급별 CSS filter 금지
- 결과판 상태별 축: `흐린 원 804`, `작은 마법진 803`, `마법진 810`, `큰 마법진 828`, `대마법진 925`, `전설 마법진 871`. 각 축은 생성 이미지의 실제 빈 결과판 픽셀 중심과 3px 이내입니다.
- 결과판 슬롯: 기본 축 802에서 동적 값 `(622,232,360,52)`, 진행 막대 `(622,302,360,28)`, 정답 수 `(712,345,180,112)`, 다음 목표 `(622,482,360,48)`를 상태별 축 차이만큼 함께 이동합니다. 다시하기 hitbox는 `(735,618,335,120)`을 유지합니다.
- 결과판 픽셀 하네스: 브라우저가 실제 `resultBg`를 1280×800 canvas에 그리고 어두운 판의 연속 픽셀 경계를 검출합니다. JSON 슬롯끼리만 맞아도 이미지 속 판 중심과 다르면 실패합니다.
- 읽기·조작 최소값: 설정 42×42px, 배지 14px, 문제 수 16.8px, 지시문·선택지 글자 18px, 패널 간격 8px
- 대표 오개념: 컴퍼스를 좁게 벌림, 넓게 벌림, 지름만큼 벌림
- 입력 통계: 문제당 4/4/4/4회(최소/중앙값/평균/최대), 한 판 총 43회
- 이전 흐름 캡처: `_archive/20260723-pre-harness-remediation/screenshots/`
- 상세 기준 비교: `BENCHMARK_AUDIT.md`

## 엔진 소스

- `_lessons/3-2-3-2-mathmon-compass-ring/lesson.json`: 차시 설정·문제·보상·결과
- `_lessons/3-2-3-2-mathmon-compass-ring/model.js`: 문제와 보상 상태
- `_lessons/3-2-3-2-mathmon-compass-ring/view.js`: 원·컴퍼스 SVG와 화면 렌더링
- `_lessons/3-2-3-2-mathmon-compass-ring/lesson.css`: 차시 전용 레이아웃
- `index.html`: 빌드 산출물

## 검증 화면

`screenshots/engine-flow-{desktop,tablet-landscape}-*.png`에 1280×800과 1024×768의 첫 화면, 설정, 방법 보기, 문제, 오개념 3종, 정답 확인, 닫힌·열린 보상, 결과 화면이 있습니다. 사용자가 발견한 보상 화면은 `1082×897`, DPR 2 회귀 화면으로 등록했고, 같은 전체 흐름은 `screenshots/engine-flow-reported-{reward-closed,complete}-1082x897-dpr2-*.png`에 남겼습니다. 새 모달 구조를 제보한 화면은 `1082×987`, DPR 2의 `reported-reward-modal-1082x987-dpr2`로 따로 고정했습니다. 닫힌·열린 모달과 모달을 닫은 직후의 강한 단계 상승 효과는 같은 화면군의 `07-reward-closed.png`, `07b-reward-open.png`, `07c-reward-impact.png`에서 확인할 수 있습니다. 상단 단원 배지와 설정 버튼 정렬 화면은 `screenshots/engine-flow-reported-top-controls-1082x987-dpr2-*.png`에 남겼습니다. 수정부엉몬과 마법진의 v3 6단계 전환은 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/play-progress-v3/contact-sheets/play-progress-v3-contact-sheet.png`에서 한 번에 비교할 수 있습니다.

최종 결과 6단계의 실제 브라우저 렌더는 `screenshots/result-all-tiers-desktop-contact-sheet.png`와 `screenshots/result-all-tiers-tablet-landscape-contact-sheet.png`에서 한 번에 비교합니다. 개별 원본은 같은 폴더의 `engine-flow-{desktop,tablet-landscape}-08a-result-{faint,small,ring,big,grand,legend}.png`입니다. 거부된 배경+효과 합성 방식은 `_archive/20260731-rejected-result-overlay/`에 격리했고 현재 런타임에서는 참조하지 않습니다.

추가 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.

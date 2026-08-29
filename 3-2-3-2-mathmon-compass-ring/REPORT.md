# 매스몬 컴퍼스 마법진 제작 보고 (3-2-3-2)

## 2026-08-23 공통 보상 정책 v2 검수

- 확률·점수·결과 기준은 `_shared/contracts/mathmon-unified-reward-v2.json`의 `mathmon-unified-reward-v2`를 단일 기준으로 사용합니다.
- 처음에 맞힌 문제는 `69% 보통 / 10% 작은 하락 / 12% 큰 보상 / 5% 대박 / 3.8% 그대로 / 0.2% 특별`입니다.
- 한 번이라도 틀린 문제는 정답 보상표를 다시 쓰지 않습니다. `50% 작은 감점 / 50% 그대로`만 나오며, 양수·대박·특별 보상은 나오지 않습니다.
- 따라서 오답은 정답보다 불리하지만 무조건 감점되지는 않습니다. 누적값을 지우는 `0으로 초기화`도 쓰지 않습니다.
- 1~4단원 17개 실행본을 대상으로 경계값 검사와 차시당 10만 회 확률 시뮬레이션을 통과했습니다. 아래 제작 이력에 남은 v1 명칭이나 예전 확률표는 현재 실행 기준이 아니며 이 절의 v2 기준으로 대체됩니다.


## 이번 고도화

- 기존 검은 패널과 왼쪽 점수 장치를 생성 이미지 기반의 밝은 마법 기하 작업실로 교체했습니다.
- 숫자 버튼만 고르던 방식을 눈금과 실제 벌림이 보이는 컴퍼스 그림 4개 선택으로 바꿨습니다.
- 문제 화면을 `큰 질문 → 반지름 그림 → 한 줄 지시 → 컴퍼스 선택지`로 줄였습니다.
- 오답에는 선택한 벌림으로 그려질 원의 호를, 정답에는 실제 컴퍼스 회전과 완성 원을 보여 주는 SVG 확인 상태를 추가했습니다.
- 소스 엔진을 `_lessons/3-2-3-2-mathmon-compass-ring/`로 분리하고 `index.html`을 빌드 산출물로 전환했습니다.

## 2026-07-12 1단원 기준 시각 흐름 보강

- 커버의 수정부엉몬을 설명·보상·결과까지 유지하고, 팩은 `diversity-reward-pack` 하나로 고정했습니다.
- 설명 1은 `반지름 3 cm`, `바늘과 연필심 사이 3 cm`, `두 길이가 같아요`를 실제 그림과 눈금으로 연결합니다.
- 설명 2에서는 풀이법을 반복하지 않고 `10문제 → 마법진 빛 변화 → 마법진 이름`만 보여 줍니다.
- 랜덤 보상 6종은 빛 증가·감소·큰 증가·완벽한 원·빛 0·무지개 원을 별도 이미지로 구분했습니다.
- 열기 전 봉인 상자 1장을 더해 보상 상태 세트는 7장이며, 컨택시트는 `reward-events-v3-contact-sheet.png`입니다.
- 결과 6장은 모두 1280×800 완성 장면이며, 배경·수정부엉몬·마법진·빛·오른쪽 빈 동적 정보판·고정 제목·`다시` 버튼을 각 이미지 안에서 함께 생성했습니다.
- 결과 자산 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/result-fullscene-v3/contact-sheets/result-fullscene-v3-contact-sheet.png`
- 표지 왼쪽 위는 실제 `eduitit-logo-mark.png`를 쓰며, 공용 상단 슬롯 좌표를 따릅니다.

## 2026-08-10 컴퍼스 눈금 원점 수정

- 설명 1의 가운데 그림을 다시 생성해 컴퍼스 바늘 쪽을 자의 `0`, 연필심 쪽을 `3`에 맞췄습니다.
- 자는 두 점선 사이의 `0 → 1 → 2 → 3` 구간만 보여 주며, 임의의 중간 눈금에서 재기 시작하는 표현을 없앴습니다.
- `compass-ruler-zero-origin-v1` 계약과 `user-reported-compass-ruler-zero-origin-2026-08-10` 회귀 항목을 추가했습니다. 생성 원본에서 두 점선, 세 등간격, 0·1·2·3 긴 눈금, 자의 양 끝 여백을 픽셀로 검사합니다.
- 최신 설명 화면은 `1280×800`과 `1024×768`에서 다시 캡처했습니다. 글자 잘림·패널 겹침·이미지 누락은 0건입니다.
- 차시 전용 소스·자산·Stage 검사는 통과했습니다. 전체 흐름 하네스는 이번 수정과 무관한 보상 공개 단계에서 timeout이 나므로 별도 점검이 필요합니다.

## 2026-08-10 설명 이미지 열화 재수정

- 화면 전체를 반복 생성형 편집해 미세 질감과 글자 테두리가 지글거리던 후보 4장은 모두 채택에서 제외했습니다.
- 깨끗한 최초 PNG를 `tutorial-page-1-v3-clean-master.png`로 보존하고, 이 파일에서 문구와 가운데 `0~3 cm` 도식만 한 번에 편집했습니다. 생성된 후보를 다음 편집의 입력으로 다시 쓰지 않았습니다.
- 최종 생성 원본은 `tutorial-page-1-v3-source.png`, 1280×800 검토본은 `tutorial-page-1-v3-generated.png`, 실행 자산은 `tutorial-page-1-v3-generated.webp`입니다.
- 실행 WebP는 손실 압축이 아닌 `VP8L` 무손실 형식입니다. 디코딩한 3,072,000바이트 RGB 픽셀이 1280×800 PNG와 전부 일치합니다.
- `single-pass-clean-master-lossless-v1` 계약을 추가해 깨끗한 입력·최종 생성 원본·PNG·WebP 해시, 생성 1회, 무손실 인코딩, PNG↔WebP 픽셀 일치를 검사합니다.
- `1280×800`과 `1024×768` 실제 실행 화면에서 문구, `0·1·2·3` 눈금, 두 점선, 바늘·연필심 정렬, 글자 잘림과 요소 겹침을 다시 확인했습니다. 설명 화면 자체는 통과했습니다.
- 전체 흐름 하네스는 설명 화면을 캡처한 뒤 기존 보상 공개 단계의 `reward did not reveal`에서 중단됩니다. 이번 이미지 수정과는 별도 잔여 문제입니다.

## 수학 설계

- 반지름 2~6 cm가 한 판에 각각 두 번 나옵니다.
- 각 문제는 정답, 지름만큼 벌린 보기, 1 cm 좁은 보기, 1 cm 넓은 보기로 구성합니다.
- 모든 오답에는 `misconceptionId`와 한 줄 피드백이 있습니다.
- 컴퍼스의 침과 연필 끝 사이 길이가 눈금에서 직접 보입니다.
- 정답 확인 화면은 `원의 반지름 = 컴퍼스 벌림`을 같은 화면에서 연결합니다.

## 이미지·동적 UI 역할

- 생성 이미지: 마법 기하 작업실, 빛, 책상, 장식용 컴퍼스와 수정 도구
- SVG: 원, 중심점, 반지름, 눈금, 컴퍼스 두 다리, `=`·`≠`
- HTML: 질문과 한 줄 문구, 접근성 버튼 hitbox
- 문제 배경: `problem-stage-generated.webp` 1280×800

## 보상 구조

- 중심 보상은 `마법진 빛` 하나입니다.
- 일반 증감, 큰 증가, 완벽한 원, 0, 무지개 이벤트를 유지했습니다.
- 문제 화면 왼쪽에는 현재 마법진 단계와 빛 막대만 작게 보여 줍니다.
- 정답 확인 뒤 학생이 `마법 보기`를 누르면 문제 화면 위에 중앙 모달이 뜹니다.
- 닫힌 상태는 사건 이미지와 `열기`, 열린 상태는 사건 이미지·변화량·`다음`만 보여 줍니다.
- 0 사건은 현재 누적값을 보존하고, 오답 손해는 통합 보상 계약에 따라 `-6~-3`으로 제한했습니다.

## 2026-07-30 문제 화면 진행 장면·중심 정렬 하네스 보강

- 왼쪽의 고정 장식용 컴퍼스를 보상 진행 장면으로 바꿨습니다.
- `흐린 원`, `작은 마법진`, `마법진`, `큰 마법진`, `대마법진`, `전설 마법진`에 대응하는 문제 화면 전용 이미지 6장을 따로 제작했습니다.
- 첫 세트는 마법진만 있어 매스몬이 빠지고, 생성 장면 안의 초점이 한쪽으로 몰리는 문제가 있었습니다.
- `3-2-2-1`~`3-2-2-4`를 다시 비교했고, 직접 기준은 문제 화면 세로 장면에 매스몬과 현재 보상을 함께 넣은 `3-2-2-3`, `3-2-2-4`로 삼았습니다.
- 실행 자산은 `play-progress-v2-*-generated.webp` 6장이고, 모두 418×627입니다.
- 생성 원본은 `play-progress-v2-source-sheet.png`, 전수 비교 자료는 `play-progress-v2-contact-sheet.png`입니다.
- 모든 단계가 같은 카메라·수정부엉몬 크기·마법진 크기·받침대·기준선을 유지하며 빛과 표정만 커집니다.
- 수정부엉몬 전신과 마법진을 처음부터 같은 생성 장면에 포함했고, 두 대상의 결합 중심은 가로 50%, 세로 약 52%, 바깥 안전 여백은 5%로 계약했습니다. 수정부엉몬 자체는 중심 `(0.76, 0.61)`, 발 기준선 `0.77`, 상태 간 허용 오차 `3%`와 동일 크기로 고정했습니다.
- 결과 장면을 잘라 재사용하지 않았고, 실행 화면은 `object-fit: contain`으로 수정부엉몬 전신·마법진·받침대가 모두 보이게 했습니다.
- 누적값은 짧은 막대로만 보여 주고, 학생이 풀어야 할 반지름·컴퍼스 선택 영역은 기존 Stage 폭 65% 이상 계약을 유지했습니다.
- `generated-play-progress-v2-character-centered` 계약을 추가해 이미지 수, 중복 파일, PNG 크기, 생성 원본·컨택시트 기록, 수정부엉몬 전신, 안전 여백, `contain` CSS가 하나라도 빠지면 자동 검사에서 실패하게 했습니다.
- 왼쪽 보상 패널 중심과 왼쪽 레인 중심, 이미지 중심과 패널 중심을 실제 브라우저 rect로 비교하며 오차 허용값은 각각 1px입니다.
- `stage-left-play-progress-v1`에 따라 패널은 Stage 기준 `left 2.9%`, `top 11%`, `width 25.2%`, `max-height 84%`를 모든 지원 viewport에서 그대로 사용하며 media query로 좌표를 바꾸지 않습니다.
- 학생 문구 `지금의 마법진`과 화면 읽기 문장은 Humanizer 기준으로 확인했습니다. 제작자 용어·번역투·어려운 한자어는 없습니다.
- 통합 보상 경제 이관 전에는 실제 브라우저에서 보상 막대가 `7% → 14% → 19%`로 늘고, 당시 임계값 19%에서 `흐린 원`이 `작은 마법진` 전용 이미지로 바뀌는 것을 확인했습니다. 현재 임계값은 15%입니다.
- GPT 인앱 브라우저의 1082×897 DPR 2 화면에서 진행 패널은 261.76×481.63px, 이미지 슬롯은 255.76×383.63px이었습니다. 이미지 자연 크기는 418×627, `object-fit`은 `contain`, 문제 작업 영역과 교차는 0px입니다.
- 같은 실제 화면에서 왼쪽 레인↔패널 중심 오차와 패널↔이미지 중심 오차는 모두 0px이었고, 브라우저 경고·오류는 0건이었습니다.
- `qa-lesson-flow`가 6단계 전체를 1280×800, 1024×768, 1082×897 DPR 2 회귀 화면 2종에서 강제로 렌더해 파일·단계명·매스몬 id·캐시 버전·자연 크기·표시 비율·두 중심 오차·Stage 경계·학습 영역 교차를 검사합니다.
- 전 화면·전 단계에서 이미지 누락 0건, 라벨 넘침 0건, 진행 패널과 문제 작업 영역 교차 0px였고, 왼쪽 레인 중심 오차 최댓값은 0.008px, 이미지와 패널 중심 오차 최댓값은 0px였습니다.

## Humanizer 학생 문구 QA

- 큰 질문은 `반지름이 3 cm인 원을 그리려면?`으로 바꿔 원을 그리는 목적을 먼저 보여 줍니다.
- 문제 행동은 `바늘과 연필 사이의 길이를 골라요.`로 바꿔 화면에서 실제로 볼 부분을 말했습니다.
- 오답 피드백은 `이대로 돌리면 원이 작아져요`, `원이 커져요`, `목표 원보다 커져요`처럼 선택 결과를 바로 말합니다.
- 정답 확인은 `그대로 돌리면 반지름 3 cm인 원이 돼요.`처럼 그림과 맞는 한 문장으로 줄였습니다.
- 문제 지시와 피드백은 한 문장에 행동이나 이유 하나만 담았습니다.

## 2026-07-30 상단 단원 배지·설정 버튼 좌표 정렬

- 제보 화면의 실제 브라우저 크기는 `1082×987`, DPR 2였습니다.
- 수정 전 단원 배지는 Stage 위에서 `18px`, 설정 버튼은 공용 `--stage-inset=21.63px`에 놓여 상단 모서리와 세로 중심이 각각 `3.63px` 어긋났습니다.
- 차시별 `top: 18px` 보정을 제거하고 HUD와 설정 버튼이 모두 공용 `--stage-inset` 좌표를 쓰게 했습니다. 두 요소의 높이는 모두 42px입니다.
- 수정 후 실제 브라우저에서 상단 오차 `0px`, 세로 중심 오차 `0px`, 높이 차이 `0px`, 두 요소 사이 간격 `20.34px`를 확인했습니다.
- `stage-top-controls-v1` 계약과 `topControlsAudit`를 추가했습니다. `qa-lesson-flow`가 실제 rect를 재어 상단·세로 중심·높이 오차 1px 이하, 가로 간격 8px 이상을 검사합니다.
- `reported-top-controls-1082x987-dpr2`를 영구 회귀 화면으로 등록했으며, 수정 전 제보 이미지는 `_archive/20260730-pre-top-controls-alignment/user-reported-top-controls-before.png`에 보관했습니다.
- 학생에게 보이는 문구는 바꾸지 않았습니다.

## 텍스트 넘침·요소 겹침 QA

- 1280×800: 첫 화면, 설정, 방법 2장, 문제, 오답, 정답 확인, 보상, 결과 확인
- 1024×768 태블릿 가로: 같은 전체 흐름 확인
- 자동 측정 결과: overflow 0, missingImages 0
- 눈으로 확인한 결과: 질문·원·지시문·선택지 겹침 0, 컴퍼스 눈금 잘림 0

## 2026-07-23 하네스 보완

- 목표를 `반지름만큼 컴퍼스를 벌려요.`로 다듬고 학생 문구 전체를 Humanizer 기준으로 다시 읽었습니다.
- 공용 시작 버튼과 hitbox의 중심·너비·높이 차이는 두 화면 모두 1px 이하입니다.
- 문제 HUD의 브랜드·문제 수·단원·설정 버튼은 서로 겹치지 않습니다.
- 1280×800 브라우저에서 실제 Stage는 1203.19×751.98px, 작업 영역은 794.11×659.98px입니다. Stage 폭의 66.00%, 면적의 57.93%입니다.
- 1024×768 브라우저에서 실제 Stage는 983.06×614.41px, 작업 영역은 648.84×522.41px입니다. Stage 폭의 66.00%, 면적의 56.12%입니다.
- 핵심 문제판 면적은 데스크톱 28.24%, 태블릿 25.83%로 선택지 묶음보다 큽니다.
- 최소 선택지 크기는 데스크톱 392.55×130.95px, 태블릿 319.92×101.50px입니다.
- 설정 버튼은 42×42px, 브랜드·단원 배지는 14px, 문제 수는 16.8px, 태블릿 지시문은 18.43px 이상입니다.
- 선택지의 실제 렌더 글자는 18px 이상이며, 문제판·지시판·선택지 사이 실제 간격은 8px 이상입니다.
- 문제 SVG의 바깥 표면은 문제판 안에 들어오고, 컴퍼스 눈금·수치·선택지 이름은 SVG 경계를 벗어나지 않습니다.
- 대기 문제판과 완료 패널의 좌우 경계·중심 차이는 1px 이하입니다.
- `좁게 벌림`, `넓게 벌림`, `지름만큼 벌림` 오답 상태를 두 화면에서 각각 캡처했습니다.
- 이전 전체 흐름 캡처는 `_archive/20260723-pre-harness-remediation/screenshots/`에 보관했습니다.

## 2026-07-27 SVG 원 그리기·Stage-Reveal 보상 수정 (이전 기록)

> 이 절의 Stage-Reveal 구조는 2026-07-30 모달 이관으로 대체되었습니다. SVG 원 그리기와 회귀 화면 기록은 그대로 유효합니다.

- 실패 화면은 `1082×897`, DPR 2였습니다. 실제 Stage는 1038.75×649.22px이고 좌상단은 (21.63, 123.89)이었습니다.
- 정답 뒤 정적인 `원 = 컴퍼스` 그림만 보이던 상태를 `중심에 바늘 놓기 → 벌림 맞추기 → 컴퍼스 회전 → 원 완성` SVG 연속 상태로 바꿨습니다.
- 좁음·넓음·지름 오답은 선택한 벌림으로 실제로 그려질 원호와 목표 원을 겹쳐 보여 줍니다.
- 기존의 큰 빈 설명 상자를 높이 `88~104px` 확인 레일로 줄이고, 완성 그림과 같은 중앙 축 아래에 한 줄 확인과 `마법 보기` 버튼만 남겼습니다.
- 닫힌 보상 이미지를 작은 중앙 모달에 넣던 구조를 제거하고, 3-2-2-1과 같은 `Stage-Reveal` 흐름으로 이관했습니다. 왼쪽 사건 이미지와 오른쪽 현재 단계·진행·버튼이 같은 Stage 안에서 닫힘/열림으로 바뀝니다.
- 보상 상태 계약은 `closed`, `normal`, `loss`, `mega`, `perfect`, `empty`, `rainbow` 7장으로 고정했습니다.
- 결과 화면에서 배경에 이미 생성된 `다시` 버튼 위로 불투명 공용 버튼이 중복되던 문제를 없앴습니다. 실제 HTML은 배경 버튼과 맞춘 투명 hitbox만 맡고, 정답 수 이미지는 위로 옮겨 교차 0px를 확보했습니다.
- `reported-reward-closed-1082x897-dpr2`와 `reported-complete-1082x897-dpr2`를 `lesson.json > qa.viewports`에 영구 회귀 항목으로 등록했습니다.
- 현재 전체 흐름 QA는 데스크톱, 태블릿 가로, 제보 화면 2종에서 모두 종료 코드 0입니다. 잔여 P0/P1은 없습니다.

## 2026-07-27 제보 화면 재수정

- 제보 화면은 `1082×897`, DPR 2였고, 로컬 서버가 종료된 뒤 사건 이미지를 처음 요청하면서 `naturalWidth=0`인 깨진 이미지가 왼쪽에 표시된 상태였습니다.
- 보상 7장 이미지를 게임 로드 직후 미리 받아 두고, 사건 이미지 요청이 실패하면 이미 받아 둔 닫힌 상자 이미지로 돌아가도록 보강했습니다.
- 전체 흐름 QA가 닫힌·열린 Stage-Reveal의 배경과 사건 이미지를 모두 `complete && naturalWidth > 0`으로 검사하도록 바꿨습니다. 앞으로 같은 깨진 이미지 상태는 QA에서 실패합니다.
- 문제 대기 화면에서는 중심점·반지름·원을 따라 움직이는 연필 끝만 보여 줍니다. 정답 벌림을 그대로 보여 주는 컴퍼스는 숨기고, 답을 고른 뒤에만 중심 고정 → 벌림 맞추기 → 한 바퀴 돌리기 → 완성 원 순서로 이어집니다.

## 2026-07-30 3단원 공통 보상 모달 이관

- 3-2-3-1, 3-2-3-2, 3-2-3-3, 3-2-3-4의 보상 설정과 실행 코드를 다시 비교했습니다. 1·3·4차시는 `reward.mode="modal-art"`이고, 2차시만 전체 화면 `stage-reveal`이었습니다.
- 직접 기준은 3-2-3-1의 공용 엔진 흐름인 `rewardPop → reward-card → reward-visual → 열기/다음`으로 삼았습니다. 문제 화면을 바꾸지 않고 그 위에 모달을 겹칩니다.
- 2차시의 별도 `compass-reward-story`, `onRewardPrepare`, Stage-Reveal CSS를 제거했습니다. 공용 엔진의 `openRewardModal`, `revealRewardModal`, `advanceAfterReward` 경로를 그대로 사용합니다.
- 기존 닫힌 상자 1장과 사건 이미지 6장, 누적값, 사건 확률, 0 누적 유지, 오답 손해 규칙은 바꾸지 않았습니다.
- 닫힌 모달은 이미지와 `열기`만 보여 주고, 열린 모달은 이미지·`마법진 빛 ±값`·`다음`만 보여 줍니다. 제목·설명·현재 단계·진행 막대를 모달에서 반복하지 않습니다.
- 진행 패널은 모달이 닫힌 뒤에만 새 누적값으로 바뀝니다. 사건 이미지가 공개되는 동안 뒤의 흐린 문제 화면이 먼저 변하지 않습니다.
- 제보 화면의 실제 크기 `1082×987`, DPR 2를 `reported-reward-modal-1082x987-dpr2`로 영구 등록했습니다. 수정 전 화면은 `_archive/20260730-pre-modal-reward/user-reported-stage-reveal-before.png`에 보관했습니다.
- `unit3-modal-art-v1` 하네스를 추가했습니다. 닫힘·열림 각각에서 활성 화면이 `screen-play`인지, 카드가 Stage 중앙인지, 이미지가 512×512 자산을 쓰는 정사각 슬롯인지, 이미지·변화량·버튼이 겹치지 않는지, 버튼 역할이 한 개만 보이는지 검사합니다.
- 프로젝트 차시 제작 스킬에는 사용자가 기존 단원형 모달을 명시했을 때 적용할 `modal-art` 예외 계약과 같은 좌표·겹침 검사를 추가했습니다. 기본 Stage-Reveal 원칙은 유지합니다.
- 첫 검사에서 열린 변화량 글자의 아래쪽 넘침 2px을 발견했습니다. 줄높이와 위아래 안쪽 여백을 고친 뒤 넘침 0으로 통과했습니다.
- 제보 화면에서 Stage 중심과 카드 중심 오차는 가로 0px, 세로 0.008px이었고, 보상 이미지 슬롯은 250×250px, 정사각 오차 0px이었습니다. 이미지·변화량·버튼 교차는 0px입니다.
- 2026-07-31부터 3-2-3-1의 폭을 기준으로 `unit3-modal-art-v1` 카드 자체도 `560×480px(7:6)`, 이미지 슬롯 `250×250px`로 고정했습니다. 닫힘과 열림 사이 카드 크기 변화는 허용하지 않으며 각 변 오차는 1px 이하입니다.
- Humanizer 학생 문구 QA 결과, 보이는 문구는 `열기`, `마법진 빛 ±값`, `다음` 또는 마지막의 `결과 보기`로 한 행동씩 짧게 읽힙니다. 제작자 용어, 번역투, 뜻 반복은 없습니다.

## 검증 결과

- `node scripts/qa-engine-unit3-compass-source.mjs` → PASS
- `node scripts/build-lesson.mjs 3-2-3-2-mathmon-compass-ring` → PASS
- `node scripts/check-lesson-contract.mjs 3-2-3-1-mathmon-target-hit 3-2-3-2-mathmon-compass-ring 3-2-3-3-mathmon-double-bridge 3-2-3-4-mathmon-circle-pattern` → PASS
- `node scripts/check-lesson-visual-contract.mjs 3-2-3-2-mathmon-compass-ring` → PASS
- `node scripts/check-stage-ratio.mjs --lesson=3-2-3-1-mathmon-target-hit --lesson=3-2-3-2-mathmon-compass-ring --lesson=3-2-3-3-mathmon-double-bridge --lesson=3-2-3-4-mathmon-circle-pattern` → PASS (대상 4개)
- `node scripts/check-rule-consistency.mjs` → PASS
- `node scripts/check-ranking-disabled.mjs` → PASS
- `node scripts/check-run-randomness.mjs` → PASS
- `node scripts/qa-lesson-flow.mjs 3-2-3-2-mathmon-compass-ring` → PASS (1280×800, 1024×768, 1082×897 DPR 2 회귀 화면 2종, 1082×987 DPR 2 상단 조작·보상 모달 회귀 화면)
- 브라우저 QA: 6단계 진행 이미지와 SVG 오답·완성, 닫힌·열린 보상, 결과의 이미지 누락·텍스트 넘침·요소 겹침 0

## 2026-07-31 보상 모달 블러·마법진 변화 효과 보강

- 제보 당시 열린 탭은 `?v=20260730-crystalowl-centered` 캐시 주소였고, 실행 DOM도 `reward.mode="stage-reveal"`, 활성 화면 `screen-reward`인 이전 빌드였습니다. 현재 빌드는 `modal-art`만 사용합니다.
- 3-2-3-1과 같은 순서로 맞췄습니다. 마지막 정답 확인 뒤 문제 화면을 유지한 중앙 모달을 열고, 모달 뒤 화면에는 `blur(9px) saturate(.78)`을 적용합니다.
- 모달이 열려 있는 동안 왼쪽 진행 이미지와 효과 클래스는 바뀌지 않습니다. `다음`을 누르면 모달을 먼저 닫고, 왼쪽 마법진에 밝기 변화·다중 광채·세로 섬광을 720ms 보여 준 뒤 다음 문제로 넘어갑니다.
- 첫 하네스 실행에서 차시별 닫기 훅이 전역에 확실히 등록되지 않아 효과 없이 문제 번호가 `1/10 → 2/10`으로 즉시 바뀌는 결함을 발견했습니다. `onRewardReveal`·`onRewardDismiss`를 명시 등록하고, 엔진이 효과 Promise를 기다리게 고쳤습니다.
- `modal-dismiss-world-impact-v1` 회귀 계약을 추가했습니다. 모달 공개 중 배경 이미지 고정, 효과 클래스 0개, 모달 닫힘 뒤 효과 클래스 활성, 효과 중 `problemIndex=0`, 효과 종료 뒤 `problemIndex=1`을 실제 브라우저에서 검사합니다.
- 제보 크기 `1082×987`, DPR 2에서 중앙 모달·9px 블러·닫은 뒤 효과를 다시 확인했습니다. 카드 중심 오차 1px 이하, 정사각 이미지 오차 1px 이하, 텍스트 넘침·요소 교차·이미지 누락은 모두 0건입니다.

## 2026-07-31 모달·왼쪽 진행 보상 좌표 고정

- 3-2-3-1의 중앙 모달과 3-2-3-1/3-2-2-3의 왼쪽 진행 레인을 비교해 `unit3-modal-art-v1`과 `stage-left-play-progress-v1` 수치를 프로젝트 스킬·루트 하네스·매스몬 자산 계약에 함께 고정했습니다.
- 중앙 모달은 닫힘·열림 모두 `560×480px(7:6)`, 이미지 슬롯 `250×250px`입니다. 닫힌 상태의 공용 `scale(.94)`도 제거해 실제 렌더 rect가 235px로 줄지 않게 했습니다.
- 왼쪽 패널은 Stage 기준 `left 2.9%`, `top 11%`, `width 25.2%`, `height 84%`이며 지원 viewport의 media query에서 이 네 좌표를 바꾸지 않습니다.
- 문제 화면 진행 자산은 결과 6단계와 1:1인 418×627 이미지 6장으로 고정했습니다. 수정부엉몬 중심 `(0.76, 0.61)`, 발 기준선 `0.77`, 위치 허용 오차 `3%`, 동일 크기·동일 카메라를 계약했습니다.
- 전체 `qa-lesson-flow`의 6개 등록 viewport에서 닫힌·열린 모달 카드 크기와 이미지 크기 오차는 1px 이하였습니다. 왼쪽 패널 left/top/width 오차 최댓값은 약 `0.015px`, 왼쪽 레인 중심 오차 최댓값은 약 `0.016px`, 이미지↔패널 중심 오차는 `0px`, 학습 영역 교차는 `0px`였습니다.
- 화면에 보이는 학생 문구는 바꾸지 않아 이번 변경의 Humanizer 대상 문구 증감은 없습니다.
- 증거 화면은 `screenshots/engine-flow-reported-reward-modal-1082x987-dpr2-07-reward-closed.png`, `07b-reward-open.png`, `07c-reward-impact.png`입니다. 이전 제보 화면은 `_archive/20260731-pre-reward-impact-modal/`에 보관했습니다.
- 학생에게 보이는 새 문구는 추가하지 않았습니다. 기존 `열기`, `마법진 빛 +값`, `다음`은 Humanizer 기준에서 한 문장 한 행동과 초3 읽기 수준을 유지합니다.

## 검증 자산

- 데스크톱: `screenshots/engine-flow-desktop-01-cover.png`부터 `08-result.png`
- 태블릿 가로: `screenshots/engine-flow-tablet-landscape-01-cover.png`부터 `08-result.png`
- 사용자 제보 화면: `screenshots/engine-flow-reported-{reward-closed,complete}-1082x897-dpr2-*.png`
- 상단 조작 정렬 제보 화면: `screenshots/engine-flow-reported-top-controls-1082x987-dpr2-*.png`
- 보상 모달 제보 화면: `screenshots/engine-flow-reported-reward-modal-1082x987-dpr2-07-reward-closed.png`, `07b-reward-open.png`, `07c-reward-impact.png`
- 최신 보상 수정 전 화면: `_archive/20260731-pre-reward-impact-modal/`
- 보상 모달 수정 전 화면: `_archive/20260730-pre-modal-reward/user-reported-stage-reveal-before.png`
- 오답 상태: 각 화면군의 `05b-play-wrong.png`
- 정답 확인: 각 화면군의 `06-confirm.png`
- 닫힌 보상·열린 보상: 각 화면군의 `07-reward-closed.png`, `07b-reward-open.png`
- 오개념별 화면: 각 화면군의 `05m-p1-compass-*.png`
- 진행 단계 실제 화면: 각 화면군의 `05-play-step1.png`
- 진행 이미지 6단계 전수 비교: `play-progress-v2-contact-sheet.png`
- 수정 전 매스몬 없는 진행 장면: `_archive/20260730-pre-mathmon-centered/`
- 기준 비교와 입력 통계: `BENCHMARK_AUDIT.md`

## 2026-07-31 왼쪽 진행 보상 세로 길이 고정

- 실패 원인은 패널이 `height:auto; max-height:84%`여서 이미지와 정보칸 높이만큼만 렌더된 것이었습니다. 재현 화면 `1280×720`, DPR 2에서 실제 높이는 Stage의 `73.72%`, 아래 빈 공간은 `15.28%`였습니다.
- `stage-left-play-progress-v1`의 패널 계약을 `left/top/width/height` 네 좌표로 바꾸고 `height:auto`와 최대 높이만 쓰는 구현을 금지했습니다.
- 3-2-3-2는 `top 11%`, `height 84%`로 고정했습니다. 같은 재현 화면에서 실제 높이는 `84.00%`, 아래 여백은 `5.00%`입니다.
- `qa.playProgressAudit.panelPlacement.heightRatio=0.84`를 선언하고 브라우저 하네스가 left/top/width/height 네 값의 실제 rect 오차를 모두 `1px` 이하로 검사하도록 바꿨습니다.
- 6단계 전수 검사에서 네 좌표 오차 최댓값은 약 `0.016px`, 학습 영역 가로 교차는 `0px`, Stage 이탈·문구 넘침·이미지 누락은 `0건`이었습니다.
- `reported-play-progress-short-1280x720-dpr2`를 영구 회귀 viewport로 추가했습니다. 증거 화면은 `screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-05-play-step1.png`입니다.
- 학생에게 보이는 문구는 바꾸지 않았습니다.

## 2026-07-31 왼쪽 매스몬 v3 세트·모달 뒤 단계 상승 효과

- 진행 장면은 `generated-play-progress-v3-left-character` 6장으로 교체했습니다. 실행 파일은 `play-progress-v3-*-generated.webp`, 생성 원본은 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/play-progress-v3/source`, 전수 비교 자료는 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/play-progress-v3/contact-sheets/play-progress-v3-contact-sheet.png`입니다.
- 수정부엉몬의 가로 중심·세로 중심·발 기준선·크기는 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/play-progress-v3/contact-sheets/play-progress-v3-anchor-audit.png`에서 6단계를 전수 확인했습니다.
- 6장은 모두 418×627이고 수정부엉몬 전신을 왼쪽 아래, 마법진 장치를 오른쪽에 둡니다. 매스몬 중심은 `(0.30, 0.66)`, 발 기준선은 `0.88`, 허용 오차는 `3%`로 계약했습니다. 단계가 오를수록 청록빛 → 보랏빛 → 금빛·무지개빛으로 장면 변화가 커집니다.
- `scripts/build-unit3-compass-play-progress-v3.cjs`가 생성 원본을 실행 PNG·WebP와 컨택시트로 빌드합니다. 원본 6장, 실행 6장, 컨택시트와 `contract.json`은 공용 `diversity-reward-pack` 아래에서 한 세트로 관리합니다.
- 모달 뒤 효과는 `modal-dismiss-world-impact-v2`로 올렸습니다. 모달이 열린 동안에는 이전 단계 이미지와 효과 클래스가 그대로이고, `다음`으로 모달을 완전히 닫은 뒤 새 단계 이미지·빛기둥·원형 충격파·섬광·단계 이름 펄스를 함께 시작합니다.
- 제보된 가독성 문제를 반영해 모달 닫힘 뒤 320ms의 시선 이동 여백을 추가했습니다. 효과 전체 시간은 1560ms, 최소 읽기 시간은 1200ms이며 그동안 `problemIndex`는 바뀌지 않습니다.
- 효과를 패널 안에만 가두지 않고 Stage 폭 35%, 높이 92%의 별도 레이어로 확장했습니다. 큰 금빛 원형 파동·보랏빛 광채·회전 광선이 왼쪽 진행 레인 주변으로 번지고, 문제·선택지의 클릭 영역은 가리지 않습니다.
- 하네스는 `14점/정답 2개/일반 +6` 고정 fixture로 `흐린 원 → 작은 마법진`의 현재 15점 임계값을 반드시 넘깁니다. 모달 공개 중 이미지 불변, 모달 닫힘 선행, 320ms 시선 이동 여백, 전후 이미지 `src` 변경, 단계 ID 변경, `is-tier-up` 활성, `effectKind=tier-up`, 효과 정점의 Stage 폭 32% 이상, 최소 1200ms 동안 문제 번호 유지, 종료 뒤 다음 문제 이동을 실제 시각으로 검사합니다.
- 전체 흐름은 1280×800, 1024×768, 1280×720 DPR 2와 사용자 제보 1082×897/1082×987 DPR 2를 포함한 7개 viewport에서 통과했습니다. 6단계 모두 자연 크기 418×627, 누락·글자 넘침·학습 영역 가로 교차 0건이며 패널 네 변 오차 최댓값은 0.016px, 이미지↔패널 중심 오차는 0px입니다.
- 모달 뒤 단계 상승 증거 화면은 `screenshots/engine-flow-desktop-07c-reward-impact.png`와 각 회귀 화면군의 `07c-reward-impact.png`입니다. 모달 닫힘·열림 화면과 별도로 캡처해 효과가 뒤 화면에서만 시작되는 순서를 확인했습니다.
- 학생에게 보이는 문구는 추가하거나 바꾸지 않았습니다. 기존 문구는 Humanizer 기준을 그대로 통과합니다.

## 2026-07-31 통합 보상 경제 이관·최종 결과 6단계 캡처

- 표시 방식은 사용자가 지정한 `modal-art`를 유지하고, 실제 확률·증감·결과 기준만 프로젝트 스킬의 `mathmon-unified-reward-v1`으로 이관했습니다.
- 정답 사건은 `64%/+6~10`, `15%/-5~-2`, `12%/+14~22`, `5%/+30`, `3.8%/0`, `0.2%/100`이며, 최초 오답은 문제당 한 번 `-6~-3`입니다.
- 일반 결과 기준은 `0/0`, `15/2`, `35/4`, `55/6`, `78/8`이고, 특별 사건 결과는 `100/1`입니다. `0` 사건은 누적값을 유지합니다.
- 소스 하네스가 표준 선언, 사건 6개의 순서별 확률·최솟값·최댓값, 오답 범위, 결과 임계값, `0` 누적 유지, `+30`의 실제 덧셈 동작을 검사합니다. 공통 `check-lesson-contract`도 표준 선언 뒤 값이 어긋나면 실패합니다.
- 브라우저 하네스는 최종 결과 6단계를 모든 등록 viewport에서 강제로 렌더하고 각각 `08a-result-*.png`로 캡처합니다.
- 6단계 비교 중 특별 결과의 다음 목표가 `작은 마법진`으로 되돌아가던 오류를 발견해, `전설 마법진`은 `최고 단계예요!`로 끝나도록 결과 탐색을 고치고 소스 회귀 검사를 추가했습니다.
- 데스크톱 6단계 비교는 `screenshots/result-all-tiers-desktop-contact-sheet.png`, 태블릿 가로 6단계 비교는 `screenshots/result-all-tiers-tablet-landscape-contact-sheet.png`입니다.

## 2026-07-31 최종 결과 완성 장면 재생성·오버레이 금지

- 배경 위에 별도 효과 이미지를 `screen` blend로 얹었던 시안은 사용자 요구와 달라 폐기했습니다. 관련 런타임 이미지 6장·생성 스크립트·공유 세트·이전 컨택시트는 `_archive/20260731-rejected-result-overlay/`에 격리했고 현재 코드와 매니페스트에서는 참조하지 않습니다.
- 최종 결과를 `result-tier-fullscene-native-v1`로 바꿨습니다. 여섯 결과는 각각 배경·수정부엉몬·마법진·마법광·환경 조명·고정 제목·빈 결과판·`다시` 버튼 표면을 한 번에 생성한 서로 다른 1280×800 완성 장면입니다.
- 시각 변화는 `희미한 바닥 선 → 작은 완성 원 → 복합 보라 마법진 → 화면을 채우는 보라·청록 원 → 공간 전체가 금빛으로 바뀐 대마법진 → 무지개 천문 공간으로 바뀐 전설 마법진` 순서입니다. 최상위 두 단계는 효과만 커지는 것이 아니라 환경과 색 계열 자체가 바뀝니다.
- 원본·PNG·WebP·계약·자산 컨택시트는 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/result-fullscene-v3/`에 보관하고 실행 WebP/PNG 6장을 차시 폴더에 연결했습니다.
- 최초 연결에서는 결과판의 동적 값·진행 막대·정답 수·다음 목표를 Stage X `802px` 한 축으로 고정했습니다. 이후 실제 이미지 픽셀을 대조해 상위 결과 장면의 빈 결과판 중심이 달라지는 결함을 발견했고, 아래 「결과판 픽셀 축 회귀 수정」에서 상태별 축과 픽셀 하네스로 교체했습니다.
- 소스 하네스는 `impactImage`, `resultImpactStates`, 효과 DOM 생성 코드, 단계별 배경 filter가 없음을 검사합니다. 공통 계약과 브라우저 하네스는 모든 결과 단계와 등록 viewport에서 완성 장면 자연 크기 1280×800, `object-fit: cover`, `mix-blend-mode: normal`, `filter: none`, `opacity: 1`, 금지 효과 DOM 0개, Stage 네 변 오차 1px 이하를 검사합니다.
- 동적 축, 글자 크기, 슬롯 포함, 세로 간격, 다시하기 네 변도 실제 rect로 측정합니다. 허용 오차는 각각 1px이고 요소 교차는 0px입니다.
- 데스크톱·태블릿 가로 실제 결과 6단계 컨택시트를 만들었지만, 당시 하네스는 선언 축끼리만 비교해 `대마법진`·`전설 마법진`의 이미지 속 결과판 중심 불일치를 잡지 못했습니다. 이 판정은 아래 픽셀 기반 회귀 수정으로 대체합니다.
- 프로젝트 차시 스킬, 자산 스킬, 공용 매스몬 자산 계약, `LESSON_COMMONS.md`, `AGENTS.md`/`CLAUDE.md`에 완성 장면 및 오버레이 금지 규칙을 동기화했습니다. 공통 `check-lesson-contract.mjs`도 결과 수·순서·visualRank·고유 완성 장면·슬롯 경계·공통 축·금지 합성을 검사합니다.
- `QA_ENGINE_UNIT3_COMPASS_SOURCE`, `CHECK_LESSON_CONTRACT`, `QA_LESSON_FLOW`를 통과했습니다. 데스크톱·태블릿·사용자 제보 viewport를 포함한 전체 흐름에서 누락 이미지·텍스트 넘침·요소 겹침은 0건입니다.
- 학생에게 보이는 문구는 바꾸지 않았으므로 이번 변경의 Humanizer 문구 증감은 없습니다.

## 2026-07-31 결과판 픽셀 축 회귀 수정

- 원인은 폰트 렌더링이 아니라 6장의 생성 이미지에서 빈 결과판 위치가 달라졌는데 런타임과 하네스가 전역 `axisX=802`만 사용한 것이었습니다. 어두운 결과판 내부 픽셀의 가로 중심은 `흐린 원 803.5`, `작은 마법진 803`, `마법진 809.5`, `큰 마법진 827.5`, `대마법진 924.5`, `전설 마법진 871`이었습니다.
- `result.layout.axisXByTier`와 `qa.resultVisualAudit.dynamicAxisByTier`를 추가해 상태별 축을 `804/803/810/828/925/871`로 고정했습니다. 마법진 빛, 진행 막대, 정답 수 이미지, 다음 목표는 각 상태의 한 축을 함께 사용합니다.
- `dark-panel-contiguous-run-v1` 픽셀 하네스를 추가했습니다. 실제 브라우저의 `resultBg`를 1280×800 canvas로 읽고 오른쪽 탐색 영역에서 어두운 연속 열을 찾아 결과판 중심을 계산합니다. 검출 중심과 선언 축이 3px을 넘거나, 동적 UI 실제 중심이 검출 중심에서 벗어나면 실패합니다.
- 기존 검사는 JSON의 `dynamicAxisX`와 JSON 슬롯·DOM rect만 서로 비교해 잘못된 축도 통과할 수 있었습니다. 공통 `check-lesson-contract`는 이제 상태별 런타임 축과 QA 축의 1:1 일치, 전 상태 값 존재, 픽셀 탐색 영역·임계값·허용 오차를 함께 검사합니다.
- 데스크톱·태블릿 가로와 등록 회귀 viewport 전부에서 6단계 결과를 다시 캡처했습니다. `QA_LESSON_FLOW`, `QA_ENGINE_UNIT3_COMPASS_SOURCE`, `CHECK_LESSON_CONTRACT`, `LESSON_VISUAL_CONTRACT`, Stage 비율, 랭킹 비활성화 검사가 모두 통과했습니다.
- 최신 6단계 비교는 `screenshots/result-all-tiers-desktop-contact-sheet.png`와 `screenshots/result-all-tiers-tablet-landscape-contact-sheet.png`입니다. 학생 문구는 바꾸지 않아 Humanizer 문구 증감은 없습니다.

## 현재 증거 화면 크기

- 기본 데스크톱 1280×800, 태블릿 가로 1024×768, 낮은 창 1280×720 DPR 2를 전체 흐름으로 확인했습니다.
- 사용자 제보 조건 1082×897 DPR 2와 1082×987 DPR 2도 전체 흐름으로 확인했습니다. 같은 물리 조건의 별칭 2개는 각각 하나의 실행으로 합쳐 7개 등록 조건을 5개 실제 실행으로 검사했습니다.

<!-- REPORT-EVIDENCE-ALL:START -->

## 2026-08-29 최신 원본 스크린샷 전수

- 실행본 SHA-256: `dd525112f25bcaaaeb4bd671ddb4bea802ade0714d0aa221c46556ff42fabd41`
- 생성 시각: `2026-08-29T10:29:59.249Z`
- 등록 회귀 이름: `7개`
- 실제 실행 화면 조건: `5개`
- 동일 조건 별칭 통합: `2개`
- 아래에 직접 삽입한 원본 캡처: `105장`
- 같은 width×height×DPR과 같은 fixture 조건은 한 번만 실행하고, 과거 오류 이름은 별칭으로 보존했습니다.
- manifest에 기록된 실제 실행 원본 캡처를 한 장씩 연결했습니다.

### desktop · 1280×800 · DPR 1 · 21장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `full-flow`

![desktop 전체 상태 컨택시트](screenshots/report-flow-desktop-contact-sheet.png)

#### 시작 화면 · `engine-flow-desktop-01-cover.png`

![desktop 시작 화면](screenshots/engine-flow-desktop-01-cover.png)

- 학생이 보는 것: 매스몬 컴퍼스 마법진 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-desktop-02-settings.png`

![desktop 설정 화면](screenshots/engine-flow-desktop-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-desktop-03-tutorial-1.png`

![desktop 설명 1 · 풀이 방법](screenshots/engine-flow-desktop-03-tutorial-1.png)

- 학생이 보는 것: 컴퍼스로 원 그리기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-desktop-04-tutorial-2.png`

![desktop 설명 2 · 보상과 목표](screenshots/engine-flow-desktop-04-tutorial-2.png)

- 학생이 보는 것: 컴퍼스로 원 그리기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-desktop-05-play-step1.png`

![desktop 문제 상태 · 05-play-step1](screenshots/engine-flow-desktop-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-desktop-05n-next-problem-clean.png`

![desktop 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-desktop-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-compass-too-narrow · `engine-flow-desktop-05m-p1-compass-too-narrow.png`

![desktop 오개념 확인 · p1-compass-too-narrow](screenshots/engine-flow-desktop-05m-p1-compass-too-narrow.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-compass-too-wide · `engine-flow-desktop-05m-p1-compass-too-wide.png`

![desktop 오개념 확인 · p1-compass-too-wide](screenshots/engine-flow-desktop-05m-p1-compass-too-wide.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-compass-uses-diameter · `engine-flow-desktop-05m-p1-compass-uses-diameter.png`

![desktop 오개념 확인 · p1-compass-uses-diameter](screenshots/engine-flow-desktop-05m-p1-compass-uses-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-desktop-05b-play-wrong.png`

![desktop 오답 확인 · 05b-play-wrong](screenshots/engine-flow-desktop-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-desktop-06-confirm.png`

![desktop 마지막 확인 · 06-confirm](screenshots/engine-flow-desktop-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-desktop-07-reward-closed.png`

![desktop 닫힌 보상](screenshots/engine-flow-desktop-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 마법진 빛 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-desktop-07b-reward-open.png`

![desktop 열린 보상](screenshots/engine-flow-desktop-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 마법진 빛 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-desktop-07c-reward-impact.png`

![desktop 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-desktop-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 마법진 빛 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-desktop-08-result.png`

![desktop 실제 결과](screenshots/engine-flow-desktop-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · faint · `engine-flow-desktop-08a-result-faint.png`

![desktop 결과 단계 · faint](screenshots/engine-flow-desktop-08a-result-faint.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · small · `engine-flow-desktop-08a-result-small.png`

![desktop 결과 단계 · small](screenshots/engine-flow-desktop-08a-result-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · ring · `engine-flow-desktop-08a-result-ring.png`

![desktop 결과 단계 · ring](screenshots/engine-flow-desktop-08a-result-ring.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · big · `engine-flow-desktop-08a-result-big.png`

![desktop 결과 단계 · big](screenshots/engine-flow-desktop-08a-result-big.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · grand · `engine-flow-desktop-08a-result-grand.png`

![desktop 결과 단계 · grand](screenshots/engine-flow-desktop-08a-result-grand.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · legend · `engine-flow-desktop-08a-result-legend.png`

![desktop 결과 단계 · legend](screenshots/engine-flow-desktop-08a-result-legend.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### tablet-landscape · 1024×768 · DPR 1 · 21장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `full-flow`

![tablet-landscape 전체 상태 컨택시트](screenshots/report-flow-tablet-landscape-contact-sheet.png)

#### 시작 화면 · `engine-flow-tablet-landscape-01-cover.png`

![tablet-landscape 시작 화면](screenshots/engine-flow-tablet-landscape-01-cover.png)

- 학생이 보는 것: 매스몬 컴퍼스 마법진 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-tablet-landscape-02-settings.png`

![tablet-landscape 설정 화면](screenshots/engine-flow-tablet-landscape-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-tablet-landscape-03-tutorial-1.png`

![tablet-landscape 설명 1 · 풀이 방법](screenshots/engine-flow-tablet-landscape-03-tutorial-1.png)

- 학생이 보는 것: 컴퍼스로 원 그리기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-tablet-landscape-04-tutorial-2.png`

![tablet-landscape 설명 2 · 보상과 목표](screenshots/engine-flow-tablet-landscape-04-tutorial-2.png)

- 학생이 보는 것: 컴퍼스로 원 그리기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-tablet-landscape-05-play-step1.png`

![tablet-landscape 문제 상태 · 05-play-step1](screenshots/engine-flow-tablet-landscape-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-tablet-landscape-05n-next-problem-clean.png`

![tablet-landscape 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-tablet-landscape-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-compass-too-narrow · `engine-flow-tablet-landscape-05m-p1-compass-too-narrow.png`

![tablet-landscape 오개념 확인 · p1-compass-too-narrow](screenshots/engine-flow-tablet-landscape-05m-p1-compass-too-narrow.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-compass-too-wide · `engine-flow-tablet-landscape-05m-p1-compass-too-wide.png`

![tablet-landscape 오개념 확인 · p1-compass-too-wide](screenshots/engine-flow-tablet-landscape-05m-p1-compass-too-wide.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-compass-uses-diameter · `engine-flow-tablet-landscape-05m-p1-compass-uses-diameter.png`

![tablet-landscape 오개념 확인 · p1-compass-uses-diameter](screenshots/engine-flow-tablet-landscape-05m-p1-compass-uses-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-tablet-landscape-05b-play-wrong.png`

![tablet-landscape 오답 확인 · 05b-play-wrong](screenshots/engine-flow-tablet-landscape-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-tablet-landscape-06-confirm.png`

![tablet-landscape 마지막 확인 · 06-confirm](screenshots/engine-flow-tablet-landscape-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-tablet-landscape-07-reward-closed.png`

![tablet-landscape 닫힌 보상](screenshots/engine-flow-tablet-landscape-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 마법진 빛 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-tablet-landscape-07b-reward-open.png`

![tablet-landscape 열린 보상](screenshots/engine-flow-tablet-landscape-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 마법진 빛 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-tablet-landscape-07c-reward-impact.png`

![tablet-landscape 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-tablet-landscape-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 마법진 빛 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-tablet-landscape-08-result.png`

![tablet-landscape 실제 결과](screenshots/engine-flow-tablet-landscape-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · faint · `engine-flow-tablet-landscape-08a-result-faint.png`

![tablet-landscape 결과 단계 · faint](screenshots/engine-flow-tablet-landscape-08a-result-faint.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · small · `engine-flow-tablet-landscape-08a-result-small.png`

![tablet-landscape 결과 단계 · small](screenshots/engine-flow-tablet-landscape-08a-result-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · ring · `engine-flow-tablet-landscape-08a-result-ring.png`

![tablet-landscape 결과 단계 · ring](screenshots/engine-flow-tablet-landscape-08a-result-ring.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · big · `engine-flow-tablet-landscape-08a-result-big.png`

![tablet-landscape 결과 단계 · big](screenshots/engine-flow-tablet-landscape-08a-result-big.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · grand · `engine-flow-tablet-landscape-08a-result-grand.png`

![tablet-landscape 결과 단계 · grand](screenshots/engine-flow-tablet-landscape-08a-result-grand.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · legend · `engine-flow-tablet-landscape-08a-result-legend.png`

![tablet-landscape 결과 단계 · legend](screenshots/engine-flow-tablet-landscape-08a-result-legend.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### reported-play-progress-short-1280x720-dpr2 · 1280×720 · DPR 2 · 21장

- 같은 실행으로 보존한 회귀 이름: 없음
- 캡처 범위: `full-flow`

![reported-play-progress-short-1280x720-dpr2 전체 상태 컨택시트](screenshots/report-flow-reported-play-progress-short-1280x720-dpr2-contact-sheet.png)

#### 시작 화면 · `engine-flow-reported-play-progress-short-1280x720-dpr2-01-cover.png`

![reported-play-progress-short-1280x720-dpr2 시작 화면](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-01-cover.png)

- 학생이 보는 것: 매스몬 컴퍼스 마법진 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-reported-play-progress-short-1280x720-dpr2-02-settings.png`

![reported-play-progress-short-1280x720-dpr2 설정 화면](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-reported-play-progress-short-1280x720-dpr2-03-tutorial-1.png`

![reported-play-progress-short-1280x720-dpr2 설명 1 · 풀이 방법](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-03-tutorial-1.png)

- 학생이 보는 것: 컴퍼스로 원 그리기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-reported-play-progress-short-1280x720-dpr2-04-tutorial-2.png`

![reported-play-progress-short-1280x720-dpr2 설명 2 · 보상과 목표](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-04-tutorial-2.png)

- 학생이 보는 것: 컴퍼스로 원 그리기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-reported-play-progress-short-1280x720-dpr2-05-play-step1.png`

![reported-play-progress-short-1280x720-dpr2 문제 상태 · 05-play-step1](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-reported-play-progress-short-1280x720-dpr2-05n-next-problem-clean.png`

![reported-play-progress-short-1280x720-dpr2 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-compass-too-narrow · `engine-flow-reported-play-progress-short-1280x720-dpr2-05m-p1-compass-too-narrow.png`

![reported-play-progress-short-1280x720-dpr2 오개념 확인 · p1-compass-too-narrow](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-05m-p1-compass-too-narrow.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-compass-too-wide · `engine-flow-reported-play-progress-short-1280x720-dpr2-05m-p1-compass-too-wide.png`

![reported-play-progress-short-1280x720-dpr2 오개념 확인 · p1-compass-too-wide](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-05m-p1-compass-too-wide.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-compass-uses-diameter · `engine-flow-reported-play-progress-short-1280x720-dpr2-05m-p1-compass-uses-diameter.png`

![reported-play-progress-short-1280x720-dpr2 오개념 확인 · p1-compass-uses-diameter](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-05m-p1-compass-uses-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-reported-play-progress-short-1280x720-dpr2-05b-play-wrong.png`

![reported-play-progress-short-1280x720-dpr2 오답 확인 · 05b-play-wrong](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-reported-play-progress-short-1280x720-dpr2-06-confirm.png`

![reported-play-progress-short-1280x720-dpr2 마지막 확인 · 06-confirm](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-reported-play-progress-short-1280x720-dpr2-07-reward-closed.png`

![reported-play-progress-short-1280x720-dpr2 닫힌 보상](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 마법진 빛 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-reported-play-progress-short-1280x720-dpr2-07b-reward-open.png`

![reported-play-progress-short-1280x720-dpr2 열린 보상](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 마법진 빛 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-reported-play-progress-short-1280x720-dpr2-07c-reward-impact.png`

![reported-play-progress-short-1280x720-dpr2 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 마법진 빛 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-reported-play-progress-short-1280x720-dpr2-08-result.png`

![reported-play-progress-short-1280x720-dpr2 실제 결과](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · faint · `engine-flow-reported-play-progress-short-1280x720-dpr2-08a-result-faint.png`

![reported-play-progress-short-1280x720-dpr2 결과 단계 · faint](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-08a-result-faint.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · small · `engine-flow-reported-play-progress-short-1280x720-dpr2-08a-result-small.png`

![reported-play-progress-short-1280x720-dpr2 결과 단계 · small](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-08a-result-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · ring · `engine-flow-reported-play-progress-short-1280x720-dpr2-08a-result-ring.png`

![reported-play-progress-short-1280x720-dpr2 결과 단계 · ring](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-08a-result-ring.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · big · `engine-flow-reported-play-progress-short-1280x720-dpr2-08a-result-big.png`

![reported-play-progress-short-1280x720-dpr2 결과 단계 · big](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-08a-result-big.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · grand · `engine-flow-reported-play-progress-short-1280x720-dpr2-08a-result-grand.png`

![reported-play-progress-short-1280x720-dpr2 결과 단계 · grand](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-08a-result-grand.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · legend · `engine-flow-reported-play-progress-short-1280x720-dpr2-08a-result-legend.png`

![reported-play-progress-short-1280x720-dpr2 결과 단계 · legend](screenshots/engine-flow-reported-play-progress-short-1280x720-dpr2-08a-result-legend.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### reported-reward-closed-1082x897-dpr2 · 1082×897 · DPR 2 · 21장

- 같은 실행으로 보존한 회귀 이름: `reported-complete-1082x897-dpr2`
- 캡처 범위: `full-flow`

![reported-reward-closed-1082x897-dpr2 전체 상태 컨택시트](screenshots/report-flow-reported-reward-closed-1082x897-dpr2-contact-sheet.png)

#### 시작 화면 · `engine-flow-reported-reward-closed-1082x897-dpr2-01-cover.png`

![reported-reward-closed-1082x897-dpr2 시작 화면](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-01-cover.png)

- 학생이 보는 것: 매스몬 컴퍼스 마법진 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-reported-reward-closed-1082x897-dpr2-02-settings.png`

![reported-reward-closed-1082x897-dpr2 설정 화면](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-reported-reward-closed-1082x897-dpr2-03-tutorial-1.png`

![reported-reward-closed-1082x897-dpr2 설명 1 · 풀이 방법](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-03-tutorial-1.png)

- 학생이 보는 것: 컴퍼스로 원 그리기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-reported-reward-closed-1082x897-dpr2-04-tutorial-2.png`

![reported-reward-closed-1082x897-dpr2 설명 2 · 보상과 목표](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-04-tutorial-2.png)

- 학생이 보는 것: 컴퍼스로 원 그리기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-reported-reward-closed-1082x897-dpr2-05-play-step1.png`

![reported-reward-closed-1082x897-dpr2 문제 상태 · 05-play-step1](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-reported-reward-closed-1082x897-dpr2-05n-next-problem-clean.png`

![reported-reward-closed-1082x897-dpr2 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-compass-too-narrow · `engine-flow-reported-reward-closed-1082x897-dpr2-05m-p1-compass-too-narrow.png`

![reported-reward-closed-1082x897-dpr2 오개념 확인 · p1-compass-too-narrow](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-05m-p1-compass-too-narrow.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-compass-too-wide · `engine-flow-reported-reward-closed-1082x897-dpr2-05m-p1-compass-too-wide.png`

![reported-reward-closed-1082x897-dpr2 오개념 확인 · p1-compass-too-wide](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-05m-p1-compass-too-wide.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-compass-uses-diameter · `engine-flow-reported-reward-closed-1082x897-dpr2-05m-p1-compass-uses-diameter.png`

![reported-reward-closed-1082x897-dpr2 오개념 확인 · p1-compass-uses-diameter](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-05m-p1-compass-uses-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-reported-reward-closed-1082x897-dpr2-05b-play-wrong.png`

![reported-reward-closed-1082x897-dpr2 오답 확인 · 05b-play-wrong](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-reported-reward-closed-1082x897-dpr2-06-confirm.png`

![reported-reward-closed-1082x897-dpr2 마지막 확인 · 06-confirm](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-reported-reward-closed-1082x897-dpr2-07-reward-closed.png`

![reported-reward-closed-1082x897-dpr2 닫힌 보상](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 마법진 빛 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-reported-reward-closed-1082x897-dpr2-07b-reward-open.png`

![reported-reward-closed-1082x897-dpr2 열린 보상](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 마법진 빛 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-reported-reward-closed-1082x897-dpr2-07c-reward-impact.png`

![reported-reward-closed-1082x897-dpr2 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 마법진 빛 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-reported-reward-closed-1082x897-dpr2-08-result.png`

![reported-reward-closed-1082x897-dpr2 실제 결과](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · faint · `engine-flow-reported-reward-closed-1082x897-dpr2-08a-result-faint.png`

![reported-reward-closed-1082x897-dpr2 결과 단계 · faint](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-08a-result-faint.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · small · `engine-flow-reported-reward-closed-1082x897-dpr2-08a-result-small.png`

![reported-reward-closed-1082x897-dpr2 결과 단계 · small](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-08a-result-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · ring · `engine-flow-reported-reward-closed-1082x897-dpr2-08a-result-ring.png`

![reported-reward-closed-1082x897-dpr2 결과 단계 · ring](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-08a-result-ring.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · big · `engine-flow-reported-reward-closed-1082x897-dpr2-08a-result-big.png`

![reported-reward-closed-1082x897-dpr2 결과 단계 · big](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-08a-result-big.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · grand · `engine-flow-reported-reward-closed-1082x897-dpr2-08a-result-grand.png`

![reported-reward-closed-1082x897-dpr2 결과 단계 · grand](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-08a-result-grand.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · legend · `engine-flow-reported-reward-closed-1082x897-dpr2-08a-result-legend.png`

![reported-reward-closed-1082x897-dpr2 결과 단계 · legend](screenshots/engine-flow-reported-reward-closed-1082x897-dpr2-08a-result-legend.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### reported-top-controls-1082x987-dpr2 · 1082×987 · DPR 2 · 21장

- 같은 실행으로 보존한 회귀 이름: `reported-reward-modal-1082x987-dpr2`
- 캡처 범위: `full-flow`

![reported-top-controls-1082x987-dpr2 전체 상태 컨택시트](screenshots/report-flow-reported-top-controls-1082x987-dpr2-contact-sheet.png)

#### 시작 화면 · `engine-flow-reported-top-controls-1082x987-dpr2-01-cover.png`

![reported-top-controls-1082x987-dpr2 시작 화면](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-01-cover.png)

- 학생이 보는 것: 매스몬 컴퍼스 마법진 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-reported-top-controls-1082x987-dpr2-02-settings.png`

![reported-top-controls-1082x987-dpr2 설정 화면](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-reported-top-controls-1082x987-dpr2-03-tutorial-1.png`

![reported-top-controls-1082x987-dpr2 설명 1 · 풀이 방법](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-03-tutorial-1.png)

- 학생이 보는 것: 컴퍼스로 원 그리기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-reported-top-controls-1082x987-dpr2-04-tutorial-2.png`

![reported-top-controls-1082x987-dpr2 설명 2 · 보상과 목표](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-04-tutorial-2.png)

- 학생이 보는 것: 컴퍼스로 원 그리기 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-reported-top-controls-1082x987-dpr2-05-play-step1.png`

![reported-top-controls-1082x987-dpr2 문제 상태 · 05-play-step1](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 문제 상태 · 05n-next-problem-clean · `engine-flow-reported-top-controls-1082x987-dpr2-05n-next-problem-clean.png`

![reported-top-controls-1082x987-dpr2 문제 상태 · 05n-next-problem-clean](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-05n-next-problem-clean.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 오개념 확인 · p1-compass-too-narrow · `engine-flow-reported-top-controls-1082x987-dpr2-05m-p1-compass-too-narrow.png`

![reported-top-controls-1082x987-dpr2 오개념 확인 · p1-compass-too-narrow](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-05m-p1-compass-too-narrow.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-compass-too-wide · `engine-flow-reported-top-controls-1082x987-dpr2-05m-p1-compass-too-wide.png`

![reported-top-controls-1082x987-dpr2 오개념 확인 · p1-compass-too-wide](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-05m-p1-compass-too-wide.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오개념 확인 · p1-compass-uses-diameter · `engine-flow-reported-top-controls-1082x987-dpr2-05m-p1-compass-uses-diameter.png`

![reported-top-controls-1082x987-dpr2 오개념 확인 · p1-compass-uses-diameter](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-05m-p1-compass-uses-diameter.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 오답 확인 · 05b-play-wrong · `engine-flow-reported-top-controls-1082x987-dpr2-05b-play-wrong.png`

![reported-top-controls-1082x987-dpr2 오답 확인 · 05b-play-wrong](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-05b-play-wrong.png)

- 학생이 보는 것: 고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.
- 판단하거나 누르는 것: 어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 관계와 고른 답이 왜 맞지 않는지 확인합니다.
- 다음 상태로 넘어가는 이유: 같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.

#### 마지막 확인 · 06-confirm · `engine-flow-reported-top-controls-1082x987-dpr2-06-confirm.png`

![reported-top-controls-1082x987-dpr2 마지막 확인 · 06-confirm](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: 컴퍼스로 원 그리기의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-reported-top-controls-1082x987-dpr2-07-reward-closed.png`

![reported-top-controls-1082x987-dpr2 닫힌 보상](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 마법진 빛 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-reported-top-controls-1082x987-dpr2-07b-reward-open.png`

![reported-top-controls-1082x987-dpr2 열린 보상](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 마법진 빛 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-reported-top-controls-1082x987-dpr2-07c-reward-impact.png`

![reported-top-controls-1082x987-dpr2 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 마법진 빛 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-reported-top-controls-1082x987-dpr2-08-result.png`

![reported-top-controls-1082x987-dpr2 실제 결과](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · faint · `engine-flow-reported-top-controls-1082x987-dpr2-08a-result-faint.png`

![reported-top-controls-1082x987-dpr2 결과 단계 · faint](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-08a-result-faint.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · small · `engine-flow-reported-top-controls-1082x987-dpr2-08a-result-small.png`

![reported-top-controls-1082x987-dpr2 결과 단계 · small](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-08a-result-small.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · ring · `engine-flow-reported-top-controls-1082x987-dpr2-08a-result-ring.png`

![reported-top-controls-1082x987-dpr2 결과 단계 · ring](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-08a-result-ring.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · big · `engine-flow-reported-top-controls-1082x987-dpr2-08a-result-big.png`

![reported-top-controls-1082x987-dpr2 결과 단계 · big](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-08a-result-big.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · grand · `engine-flow-reported-top-controls-1082x987-dpr2-08a-result-grand.png`

![reported-top-controls-1082x987-dpr2 결과 단계 · grand](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-08a-result-grand.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · legend · `engine-flow-reported-top-controls-1082x987-dpr2-08a-result-legend.png`

![reported-top-controls-1082x987-dpr2 결과 단계 · legend](screenshots/engine-flow-reported-top-controls-1082x987-dpr2-08a-result-legend.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 마법진 빛 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

<!-- REPORT-EVIDENCE-ALL:END -->

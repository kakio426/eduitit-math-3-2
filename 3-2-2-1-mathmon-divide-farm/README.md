# 매스몬 나누기 농장

3학년 2학기 2단원 1차시, 내림 없는 두 자리 수 나눗셈 게임입니다. 동행 매스몬 팩은 `base-pack`, 주인공은 여우몬입니다. 문제를 풀어 숫자 점수를 모으는 대신, 바구니를 열 때마다 농장이 달라지고 10문제 뒤 이번 농장을 완성합니다.

## 학습 조작

묶음과 낱개를 나눌 때는 답 선택 버튼을 쓰지 않습니다. 한 화면에는 현재 나눠 담을 당근과 바구니만 크게 보여 주고, 마지막 덧셈에서만 숫자판을 사용합니다.
상단은 전체 나눗셈식을 담은 왼쪽 패널과 현재 계산·질문을 담은 오른쪽 패널로 나눠, 두 식의 역할이 섞이지 않게 했습니다.

1. `80 ÷ 4`와 `한 바구니에 몇 묶음씩?`을 보고, 화면의 당근 묶음을 하나씩 바구니로 끌어 옮깁니다.
2. 모든 당근을 나눠 담습니다. 양이 다르면 바구니끼리 당근을 다시 옮겨 똑같이 만듭니다.
3. 정답이면 `40 ÷ 4 = 10`과 같은 양의 바구니를 확인합니다.
4. `하나씩 나누기`를 눌러 `8 ÷ 4`와 `한 바구니에 몇 개씩?`을 보고 낱개 당근도 모두 끌어 옮깁니다.
5. `나눈 값 더하기`를 누르면 전체 식은 `42 ÷ 2 = ?`로 남고, 바구니 답은 숨겨집니다. 왼쪽 카드에서 `묶음 나누기 40 ÷ 2 = 20`과 `낱개 나누기 2 ÷ 2 = 1`이 바로 아래의 `20 + 1 = ?`로 이어집니다. 학생이 답 `21`을 숫자판으로 쓴 뒤에만 완성식과 `한 바구니에 21개씩`이 나타납니다.

문제당 수학적 판단은 `묶음을 똑같이 나누기`, `낱개를 똑같이 나누기`, `나눈 값 더하기` 3번입니다. 모든 당근을 직접 옮긴 뒤 두 자리 답 입력과 확인까지 포함한 문제 완료 입력 수는 최소 9회, 중앙값 17회, 평균 15.87회, 최대 23회입니다. `수확 보기`까지 세면 각각 1회가 더해집니다. 문제 은행은 유효한 식 30개에서 매 판 10개를 랜덤으로 뽑고, 한 판에서 같은 식을 반복하지 않습니다.

## 농장 성장 흐름

`나눗셈 해결 → 수확 보기 → 바구니 열기 → 농장 변화 → 다음 문제 → 최종 농장`

- 설명 2: `10문제를 풀고 농장을 키워요.`와 `씨앗 → 새싹 → 텃밭 → 농장 → 대농장 → ?`를 먼저 보여 줍니다.
- 문제: 조용한 작업대와 작은 현재 농장 배지만 남깁니다. 내부 수확값과 다음 목표는 숨깁니다.
- 보상: 별도 전체 화면에서 닫힌 바구니를 열고, 변화량 한 줄 뒤 현재 농장과 다음 목표를 봅니다.
- 결과: 숫자 수확량 대신 실제 농장 장면, 농장 이름, 다음 목표, 정답 수를 보여 줍니다.
- 전국 순위: 내부 수확값을 서버에서 다시 계산해 기존 순위와 호환합니다.

## 보상 v2

`reward.mode`는 `stage-reveal`, `reward.version`은 `farm-growth-v2`입니다.

| 사건 | 가중치 | 변화 |
|---|---:|---:|
| 일반 수확 | 6400 | `+6~+10` |
| 벌레 | 1500 | `-5~-2` |
| 대풍작 | 1200 | `+14~+22` |
| 황금 당근 | 500 | `+10` |
| 빈 바구니 | 380 | `0`, 누적값 유지 |
| 황금밭 | 20 | 특별 결과 직행 |
| 문제에서 실수 | 별도 | `-8~-4` |

농장 기준은 `씨앗 0`, `새싹 15·정답 2`, `텃밭 35·정답 4`, `농장 55·정답 6`, `대농장 78·정답 8`, `황금밭 특별 사건`입니다. 정답을 많이 맞히면 평균 농장 단계가 높아지지만 최고 결과는 보장하지 않습니다.

## 이미지 계약

- 표지: 글자 없는 `cover-generated.webp` + 생성형 제목·시작 버튼.
- 설명: `tutorial-page-1-generated.webp`, `tutorial-page-2-generated.webp`.
- 문제 배경: `farm-board-generated.webp`와 대기·진행·완료 3장, 모두 1280×800.
- 문제 조작: 생성형 빈 바구니, `10개 묶음`, 낱개 당근 WebP와 1·2·3·4묶음 바구니 상태 이미지. 현재 단계의 당근을 모두 직접 끌어 옮깁니다.
- 농장 성장: `farm-stage-*-generated.webp` 6장, 투명 512×512.
- 보상: `reward-closed-generated.webp` 1장, `reward-event-*-generated.webp` 6장, 투명 512×512.
- 보상 무대: `reward-stage-generated.webp`, 1280×800.
- 결과: `result-tier-*.webp` 6장, 각 1280×800 + 생성형 농장명·다음 목표·정답 수·버튼 자산.
- 주요 이동 버튼: `다음`, `하나씩 나누기`, `나눈 값 더하기`, `수확 보기`, `바구니 열기`, `결과 보기`, `다시`를 같은 금빛 캡슐 계열로 표시합니다. 라벨별 크로마키 원본 PNG, 투명 PNG, 실행 WebP를 따로 보관합니다.

현재 컨택시트:

- `problem-backgrounds-v2-contact-sheet.png`
- `farm-growth-stages-v2-contact-sheet.png`
- `reward-events-v2-contact-sheet.png`
- `result-scenes-v3-contact-sheet.png`
- `result-title-contact-sheet.png`
- `result-next-titles-v2-contact-sheet.png`
- `_shared/mathmon/base-pack/contact-sheets/reactions-unit2/foxmon-reactions-contact-sheet.png`

생성 원본 PNG와 배포 PNG/WebP를 함께 보관합니다. 배경 제거·크롭·WebP 변환만 후처리하고, 새 물건이나 글자를 로컬에서 합성하지 않습니다.

## 전국 순위 상태

현재 제품 정책에 따라 학생 화면의 전국 순위 문구·버튼·화면과 점수 제출·조회 요청은 비활성화합니다. 10문제를 마치면 결과 화면에서 `다시`만 선택할 수 있습니다.

## 실행과 검증

```bash
node scripts/build-lesson.mjs 3-2-2-1-mathmon-divide-farm
node scripts/qa-lesson-model.mjs 3-2-2-1-mathmon-divide-farm
node scripts/qa-lesson-flow.mjs 3-2-2-1-mathmon-divide-farm
node scripts/qa-lesson2-divide-farm.mjs
node scripts/simulate-lesson2-farm-growth.mjs
node scripts/check-stage-ratio.mjs
node scripts/check-lesson-contract.mjs
node scripts/check-lesson-visual-contract.mjs
```

백엔드는 `/Users/yubyeongju/Documents/eduitit`에서 `./.venv/bin/python manage.py test mathmon_scoreboard`로 확인합니다.

흐름 QA는 `1280×800`, `1024×768`, `918×897`, `934×987`, `926×688`에서 설명 1·2, 문제 대기, 대표 오답, 묶음 확인, 낱개 대기·확인, 마지막 덧셈의 근거 식·오답, 최종 완성식, 보상 닫힘·열림, 마지막 `결과 보기`, 결과를 실제 렌더와 rect로 확인합니다. 터치 영역 42px 이상, 형제 영역 겹침 0px, Stage 밖 넘침 0px을 검사합니다.

소스는 `_lessons/3-2-2-1-mathmon-divide-farm/`, 독립 실행 배포본은 이 폴더의 `index.html`입니다.

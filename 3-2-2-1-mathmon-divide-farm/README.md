# 매스몬 나누기 농장

3학년 2학기 2단원 1차시, 내림 없는 두 자리 수 나눗셈 게임입니다. 동행 매스몬 팩은 `base-pack`, 주인공은 여우몬입니다. 문제를 풀어 숫자 점수를 모으는 대신, 바구니를 열 때마다 농장이 달라지고 10문제 뒤 이번 농장을 완성합니다.

## 학습 조작

4지선다와 채소 반복 옮기기를 쓰지 않습니다. 학생이 먼저 **한 바구니에 몇 개씩 들어가는지**를 숫자로 결정하고, 생성 이미지 채소는 학생이 만든 답을 확인하는 역할만 합니다.

1. `60을 바구니 3개에 똑같이 나눠요.`를 보고 한 바구니의 실제 값 `20`을 입력합니다.
2. 적게 쓰면 남는 채소, 많이 쓰면 부족한 채소를 현재 바구니에서 확인합니다.
3. 정답을 확정한 뒤에만 `10개 묶음` 이미지가 바구니 3개에 놓입니다.
4. 낱개도 같은 방식으로 나누어 일의 자리 몫을 만듭니다.
5. 두 값을 더해 전체 몫을 직접 입력하고 완성식을 확인합니다.

문제당 수학적 판단은 `십의 자리 몫`, `일의 자리 몫`, `전체 몫` 3번입니다. 정답 경로의 물리 입력은 모든 문제에서 8회이며, 같은 뜻의 채소 옮기기를 되풀이하지 않습니다.

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
- 문제 조작: 생성형 빈 바구니, `10개 묶음`, 낱개 당근 WebP.
- 농장 성장: `farm-stage-*-generated.webp` 6장, 투명 512×512.
- 보상: `reward-closed-generated.webp` 1장, `reward-event-*-generated.webp` 6장, 투명 512×512.
- 보상 무대: `reward-stage-generated.webp`, 1280×800.
- 결과: `result-tier-*.webp` 6장, 각 1280×800 + 생성형 농장명·다음 목표·정답 수·버튼 자산.

현재 컨택시트:

- `problem-backgrounds-v2-contact-sheet.png`
- `farm-growth-stages-v2-contact-sheet.png`
- `reward-events-v2-contact-sheet.png`
- `result-scenes-v3-contact-sheet.png`
- `result-title-contact-sheet.png`
- `result-next-titles-v2-contact-sheet.png`
- `_shared/mathmon/base-pack/contact-sheets/reactions-unit2/foxmon-reactions-contact-sheet.png`

생성 원본 PNG와 배포 PNG/WebP를 함께 보관합니다. 배경 제거·크롭·WebP 변환만 후처리하고, 새 물건이나 글자를 로컬에서 합성하지 않습니다.

## 전국 순위 버전 호환

- v2 답안의 `reward` 기록에는 `version: "farm-growth-v2"`를 함께 보냅니다.
- 서버는 답안 전체가 v2면 새 규칙, 전체가 무버전이면 기존 v1 규칙을 적용합니다.
- 무버전과 v2가 섞인 제출, 조작된 변화량, 서버 계산과 다른 최종 수확값은 거부합니다.
- 결과 화면의 `순위 보기`는 기존 `전국 수확 순위`를 엽니다.

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

흐름 QA는 `1280×800`, `1024×768`, `918×897`에서 설명 2, 문제 대기·오답·단계별 정답 확인, 완성식, 보상 닫힘·열림, 6단계 결과, 전국 순위를 캡처합니다.

소스는 `_lessons/3-2-2-1-mathmon-divide-farm/`, 독립 실행 배포본은 이 폴더의 `index.html`입니다.

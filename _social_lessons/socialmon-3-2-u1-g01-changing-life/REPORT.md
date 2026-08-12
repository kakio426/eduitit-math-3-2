# 소셜몬 달라진 생활 찾기 검증 보고서

검증일: 2026-08-12
상태: 대표 정식 차시 실행본 통과

## 결과

- 실행본: `_social_lessons/socialmon-3-2-u1-g01-changing-life/index.html`
- 공통 엔진: `socialmon-quiz-lite-v1`
- 공용 프로필: `socialmon-quiz-lite-profile-v2`
- 시리즈 계약: `socialmon-quiz-lite-contract-v3`
- 화면 표준: `socialmon-four-screen-flow-v1`
- 문항 조작 표준: `socialmon-tap-interactions-v1`
- 차시 원본 해시: `835468128f06aa12ccffbebc2b9c9e74136b35cfc9195a2d25379870f4660d91`
- 공용 프로필 해시: `83dc174711611820cf11f1e172444e1abe64146d1366fdfeb26779db99f3b167`
- 사회 변화 테마팩 해시: `3bb2404c433edc94aeb6058c4e10239835ce322a8711d1f398a81a662a2bff18`
- 공용 엔진 해시: `c87d04f68e32eb2d4b298fa996dde3a0a79dd5122e11c9084ec9d63a3d7d8c20`
- 수업 범위: 3학년 2학기 1단원 1~2차시 `우리 사회의 변화 모습`
- 성취기준: `[4사03-01]`
- 문제 수: 6문항
- 예상 시간: 5~7분
- 배포 형태: CSS·런타임·내용 JSON을 인라인한 단일 HTML

## 문항과 출처 검토

기준 자료는 `3_2_사회_1_지도서.pdf`다. 문항별 PDF 쪽, 지도서 인쇄 쪽,
교과서 쪽, 사용 근거는 `SOURCE_LEDGER.md`에 기록했다.

| 문항 | 형식 | 확인 내용 | 근거 |
|---:|---|---|---|
| 1 | 자료 보고 고르기 | 옛 도시락과 오늘날 학교 급식 | PDF 12쪽, 지도서 27쪽 |
| 2 | 짝 잇기 | 국민학교·오전/오후반·도시락의 변화 | PDF 12쪽, 지도서 27쪽 |
| 3 | 하나 고르기 | 사회 모습은 계속 달라짐 | PDF 12~13쪽, 지도서 27~28쪽 |
| 4 | 자료 보고 고르기 | 태어나는 아이 수 감소와 어린이집 변화 | PDF 17쪽, 지도서 32쪽 |
| 5 | 나누기 | 사람 수·수명 변화와 과학 기술 | PDF 13쪽, 지도서 28쪽 |
| 6 | 짝 잇기 | 변화의 까닭과 달라진 생활 연결 | PDF 13쪽, 지도서 28쪽 |

- 실제 화면은 `cover`, `tutorial`, `play`, `result` 네 개다.
- 여섯 문항은 고르기·이어 보기·나누어 보기 세 조작 틀을 쓴다.
- 자료를 직접 읽는 문항 2개와 관계형 문항 3개를 포함한다.
- 모든 문항은 필수 드래그 없이 탭으로 완주한다.

- 1번 사진은 출판사 지도서의 1960년 학교 점심 사진을 의미 변화 없이 WebP로
  변환했다.
- 4번 자료 카드는 지도서의 기사 사례를 초3 문장으로 짧게 바꿔 썼다.
- 정답과 한 줄 설명은 각 문항의 같은 근거에서 대조했다.
- 표지와 결과의 생성 이미지는 분위기용이며 정답 근거로 쓰지 않았다.
- 외부 공개 배포 전에는 출판사 사진의 재사용 권한 범위를 다시 확인한다.

## 소셜몬과 시각 자산

- 활성 팩: `socialmon-discovery-pack-v1`, 상태 `active-approved`
- 결과 캐릭터: 키위몬, 오리너구리몬, 미어캣몬, 코끼몬, 두루미몬, 천산갑몬
- 수학 매스몬 및 보존 후보와 동물종 중복: 0건
- 캐릭터 자산: 투명 PNG 6개와 실행 WebP 6개, 모두 768×768
- 표지 생성 배경: `social-change-cover-v1.webp`, 1280×800
- 표지 생성 문구 아트: `assets/cover-copy-v1-generated.webp`
- 표지 생성 원본: `assets/cover-copy-v1-source.png`
- 방법 생성 포스터: `_shared/socialmon/quiz-lite-v2/tutorial/tutorial-poster-v1-generated.webp`, 1280×800
- 문제 생성 배경: `_shared/socialmon/quiz-lite-v2/backgrounds/discovery-workbench-play-v1-generated.webp`, 1280×800
- 브랜드 마크: `_shared/brand/mathmon-cloud-mark.webp` 직접 참조, `socialmon-purple-cloud-mark-v1`
- 결과 생성 배경: `socialmon-result-hall-v1.webp`, 1280×800
- 사실 자료 사진: `source-1960-school-lunch.webp`, 224×143

표지 문구 아트, 방법 포스터, 문제 배경은 내장 이미지 생성으로 만들었다. 표지에는
`SOCIALMON QUIZ`, `소셜몬 달라진 생활 찾기`, 목표 문장을 한 덩어리의 투명
래스터로 넣었다. 방법 포스터에는 자료 보기, 답 확인, 흔적 공개, 6문제와 결과
안내를 한 장에 담았다. 문제 배경은 왼쪽 탐험 창과 오른쪽 학습 공간만 맡고,
정답 근거·글자·소셜몬은 굽지 않았다.

출판사 원본 사진 자체가 224×143이라 새 사실 이미지를 만들지 않고 같은 파일을
더 크게 보여 주었다. 1079×929 회귀 화면에서 사진은 205×130.86px로 렌더되어
Stage 폭의 19.0%를 차지한다.

## 보상과 결과

- 표준: `socialmon-trace-reveal-v1`
- 흐름: `정답 확인 → 흔적 도장 → 2·4문제 힌트 → 소셜몬 만나기`
- 오답이어도 설명을 확인하면 흔적 하나를 받지만 정답 수는 늘지 않는다.
- 후보는 오리너구리몬, 미어캣몬, 코끼몬이며 한 판에서 같은 확률로 한 종을 정한다.
- 2문제 뒤 그림자, 4문제 뒤 특징, 마지막 결과는 처음 정한 같은 소셜몬이다.
- 문제 화면 왼쪽에는 같은 소셜몬을 계속 두고 흔적 0~6에 따라 아래에서 위로
  0.68초 동안 천천히 드러낸다.
- 상단에는 문제 번호만 보이고, 흔적 수는 왼쪽 여섯 흔적으로 보여 준다.
- 결과 화면은 `6문제 중 N문제 정답 + 소셜몬 1종 + 오늘의 발견`을 보여 준다.
- 점수 증감, 감점, 특별 사건, 결과 등급은 없다.
- 로그인, 랭킹, 도감, 답안 전송, 백엔드는 없다.

## Humanizer 학생 문구 QA

표지 목표, 방법 보기, 문제 지시문, 선택지, 피드백, 보상, 결과 문장을 모두
초등학교 3학년이 소리 내어 읽는 기준으로 확인했다.

- 자연도 등급: A
- S1 패턴: 0건
- S2 패턴: 0건
- 번역투·어른용 제작 용어: 0건
- 새 문구 `누가 나타날까요?`, `모습이 조금 보이기 시작해요.`, `거의 다 보였어요.`는
  화면에서 바로 보이는 변화 한 가지씩만 말하도록 확인했다.
- 화면에서 두 줄로 갈라지던 `늘어난 노인 복지 시설`은 출처 의미를 유지하며
  `노인 복지 시설`로 줄였다.
- 수치·고유명사·인과관계·부정·인용·핵심 결론의 의미 보존 6항을 통과했다.

## 브라우저 QA

확인 화면 크기:

- 데스크톱 1280×800
- 태블릿 가로 1024×768
- 사용자 제보 회귀 1079×929

확인 상태:

- 표지, 설정, 방법 보기
- 6문항 대기 화면
- 대표 오답·정답 확인
- 오답/정답 뒤 흔적 도장
- 2문제 뒤 그림자와 4문제 뒤 특징 힌트
- 왼쪽 소셜몬 흔적 0~6 전 상태
- 일반 결과와 여섯 소셜몬 결과 미리 보기

결과:

- 상태 검사 90회, 최신 스크린샷 90장
- 텍스트 넘침 0건
- Stage 밖 이탈 0건
- 주요 요소 교차 0건
- 42×42px 미만 조작부 0건
- 브라우저 오류 0건

시각 계약 실측:

| 화면 | 왼쪽 패널 | 학습 영역 간격 | 자료 사진 | 선택지 |
|---|---:|---:|---:|---:|
| 1280×800 | Stage 24.4995% | Stage 1.5625% | Stage 18.9990% | 76.80px / 21.76px / Stage 31.0% 이하 |
| 1024×768 | Stage 24.4995% | Stage 1.5625% | Stage 18.9987% | 64px / 19px / Stage 31.0% 이하 |
| 1079×929 | Stage 24.4990% | Stage 1.5625% | Stage 18.9991% | 64.73px / 19px / Stage 31.0% 이하 |

- 표지 HTML 시리즈명·제목·목표의 보이는 rect는 모두 1×1px 접근성 영역이고,
  생성 문구 아트만 화면에 보인다.
- 방법 포스터는 모든 viewport에서 Stage 네 변과 일치했다. `알겠어요` hitbox의
  선언 좌표 대비 네 변 최대 오차는 0.03px 이하다.
- 활성 화면마다 보라 구름 브랜드 마크 1개가 로드됐다.
- 보이는 진행 표시기는 `#questionProgress` 한 개뿐이다.
- 흔적 0~6의 발자국 수와 공개 비율 7개 상태를 모든 viewport에서 확인했다.

수동으로 1079×929 표지, 방법 보기, 1번 자료 문항과 피드백, 흔적 0·6,
1024×768의 2·5번과 그림자 힌트를 다시 보았다. 그림자와 결과가 같은 소셜몬으로
이어졌고, 글자 잘림, 불필요한 줄바꿈, 자료 가림이 없음을 확인했다.

## 통과한 검사

```bash
node scripts/build-social-quiz.mjs socialmon-3-2-u1-g01-changing-life
node scripts/check-social-quiz.mjs socialmon-3-2-u1-g01-changing-life
node scripts/test-social-quiz-contract.mjs
node scripts/check-socialmon-pack.mjs
node scripts/check-stage-ratio.mjs
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-3-2-u1-g01-changing-life
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs social-quiz-component-demo
SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-3-2-u1-g06-living-together
```

공통 컴포넌트 데모와 profile-v1 정식 차시도 같은 엔진으로 다시 빌드했다. 각각
46개 상태의 브라우저 회귀를 통과해 기존 계약 호환을 확인했다.

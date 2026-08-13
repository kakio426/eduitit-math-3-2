# 소셜몬 선사 생활 단서 찾기

## 완료 요약

`socialmon-5-2-u1-g01-prehistory-clues`를 profile-v2 / contract-v3 정식 6문제 단일 HTML로 만들었다. 화면 흐름은 `cover → tutorial → play → result` 네 화면이고, 문제에서는 고르기·나누어 보기·순서 놓기 세 조작만 썼다.

- q1·q3: 지도서 그림을 직접 보는 `source-choice` 2문항
- q2·q5: 그림에서 바로 본 사실과 유물로 짐작한 생활을 나누는 `classify` 2문항
- q4: 신석기 생활 모습을 고르는 `choice` 1문항
- q6: 이동 생활 → 물가 정착 → 농사 시작 흐름을 놓는 `sequence` 1문항
- 결과 후보: 현재 승인된 공용 profile-v2 discovery-pack-v1의 `platypusmon`, `meerkatmon`, `elephantmon`

grade5 discovery pack은 현재 `draft-style-review` 상태라 정식 차시에 연결하지 않았다. 5-2 테마팩은 기존 공용 표지 배경과 현재 profile 결과를 참조하며, 새 공유 캐릭터·배경은 만들지 않았다.

## 지도서 검증

원자료 `~/Downloads/5_2_사회_1_지도서.pdf`의 SHA-256은 `36937a3bbdca94bd47f2f6b02c934759f1933077a3b9ad3d8c7a99fa9f0d4fcb`이며 출처 카탈로그와 일치한다. PDF 11~26쪽을 150 dpi로 렌더링하고 `pdftotext`로 같은 범위를 추출해 대조했다. 카탈로그의 인쇄 쪽 대응값은 `인쇄 쪽 = PDF 쪽 + 15`이므로 이 게임의 범위는 PDF 11~26 / 인쇄 26~41이다.

- 구석기 핵심: PDF 15~17 / 인쇄 30~32. PDF 16(인쇄 31)의 교과서 13쪽 그림과 지도서 예시 답안에서 동굴·불·사냥·채집·뗀석기와 이동 생활을 확인했다.
- 신석기 핵심: PDF 21~26 / 인쇄 36~41. PDF 22(인쇄 37)의 교과서 16쪽 그림에서 움집·마을·간석기·빗살무늬 토기·가락바퀴·뼈바늘을 확인했고, PDF 25~26(인쇄 40~41)의 물고기잡이 도구 활동과 풀이에서 낚시 도구·그물·찌르개 모양 도구 및 물가 정착 생활 답을 대조했다.
- 직접 확인한 단서와 단서에서 짐작한 생활을 문항 데이터와 `SOURCE_LEDGER.md`에 분리해 기록했다. 생성 이미지는 표지 제목 아트에만 쓰고 사실 근거로 쓰지 않았다.

자세한 쪽별 근거와 crop 자산 기록은 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 있다.

## Humanizer 학생 문구 QA

Humanizer 기준으로 표지 목표, 방법 포스터, 문제 지시문·선택지·힌트·피드백·결과 문구를 소리 내어 읽는 흐름으로 점검했다. `지도서는 설명해요`처럼 교사용으로 들리는 문장은 `불은 몸을 지키고 음식을 익혀 먹는 데 썼어요`로 바꾸고, `정착 생활`은 `한곳에 머물러 살았어요`로 풀어 썼다. `단서`, `움집`, `간석기`, `빗살무늬 토기`처럼 이 차시에서 꼭 필요한 낱말은 그림·유물과 함께 제시하고, 한 문장에 행동 하나만 남겼다.

## 빌드·정적 검사·브라우저 QA

현재 `index.html`은 아래 입력으로 다시 빌드했고, 브라우저 QA도 같은 입력 지문으로 2026-08-12에 다시 생성했다.

| 입력 | SHA-256 |
|---|---|
| quiz.json | `ca6ec9aec758e68b7e1b2a46d5cbb53ca0f934c1d533fa8a1a1796220eea1e2a` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 5-2 테마팩 | `1a00a30e229dd103bfa12bd5d09ef859b964849bffc804f438785c6392ca5071` |
| 실행 자산 | `917b241353ad7dd278ba2e939f41634676773c07ad6e72134c952ef14dcbc98a` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 정책·스킬 지문 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| 현재 QA 하네스 지문 | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |

실행 기록:

- `node scripts/build-social-quiz.mjs socialmon-5-2-u1-g01-prehistory-clues` — PASS
- `node scripts/check-social-quiz.mjs socialmon-5-2-u1-g01-prehistory-clues` — PASS
- `node scripts/check-socialmon-source-catalog.mjs socialmon-5-2-u1-g01-prehistory-clues` — PASS
- `node scripts/check-socialmon-interaction-policy.mjs` — PASS
- `node scripts/test-social-quiz-contract.mjs` — PASS
- `node scripts/check-stage-ratio.mjs` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u1-g01-prehistory-clues` — PASS

브라우저 QA는 PC `desktop-1280x800`과 태블릿 `tablet-landscape-1024x768`, 회귀 viewport `feedback-reported-1079x929`, `feedback-reported-1079x842`에서 전체 흐름을 검사했다. 총 4 viewport, 120 state audit, 120 PNG가 생성됐고 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이다. 최신 영수증은 [screenshots/qa-report.json](screenshots/qa-report.json)이며, 현재 정책·하네스 지문도 함께 기록되어 있다. 공용 엔진·정책·하네스 동결 뒤 `2026-08-12T17:47:02.323Z`에 `desktop-1280x800`, `tablet-landscape-1024x768`, `feedback-reported-1079x929`, `feedback-reported-1079x842` 4개 viewport로 전체 흐름을 다시 캡처했고, 영수증의 정책·하네스 지문은 위 표의 동결 지문과 같다.

## 단원 게이트

5-2 U1 여덟 차시는 아래 단일 게이트 한 번으로 함께 검증했다.

```sh
node scripts/verify-socialmon-delivery.mjs \
  --lesson=socialmon-5-2-u1-g01-prehistory-clues \
  --lesson=socialmon-5-2-u1-g02-bronze-gojoseon \
  --lesson=socialmon-5-2-u1-g03-three-kingdoms-gaya \
  --lesson=socialmon-5-2-u1-g17-three-kingdoms-gaya-life \
  --lesson=socialmon-5-2-u1-g04-unified-silla-balhae \
  --lesson=socialmon-5-2-u1-g05-goryeo-beginnings-society \
  --lesson=socialmon-5-2-u1-g06-goryeo-exchange-culture \
  --lesson=socialmon-5-2-u1-g18-goryeo-cultural-heritage-life
```

이 작업에서는 커밋하지 않았다.

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `576d0a276d0506e057e74d65b1eb2ca6861f3cf240dc951d92e9f36e07617f84` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `1a00a30e229dd103bfa12bd5d09ef859b964849bffc804f438785c6392ca5071` |
| 실행 자산 | `917b241353ad7dd278ba2e939f41634676773c07ad6e72134c952ef14dcbc98a` |
| 엔진 | `4e714a1bdc0e6caf20e362a2a182ad9d0d64d8a5f378c2ebee2f4e155e8fb75a` |
| 정책·스킬 | `10fcf3bfab242828a749754983bd059db5e5bc671b7e2fc6a51861e4c571b621` |
| QA 하네스 | `72c00eaa8fed8ba2552f0a559ef49d149c446db98a46f51529ef8cc8dfa504ab` |
| 캡처 PNG 집합 | `a31c9a555a474722a9f6066169c66f1a455ed591793e0dd43cbb9de5978d1f5f` |

- QA 생성 시각: `2026-08-13T13:19:08.615Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

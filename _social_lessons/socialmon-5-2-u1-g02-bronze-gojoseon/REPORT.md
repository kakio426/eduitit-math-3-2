# 소셜몬 청동기와 고조선 흔적 찾기

## 완료 요약

`socialmon-quiz-lite-profile-v2`·`socialmon-quiz-lite-contract-v3` 기준 6문제 단일 HTML을 만들었다. `source-choice` 2개, `match` 2개, `classify` 1개, `choice` 1개로 구성하고 고르기·이어 보기·나누어 보기 세 조작만 썼다. 지도서 자료 이미지는 q1 청동기 마을과 q3 고인돌 분포에서만 사실 근거로 사용했으며, 생성형 이미지는 표지 제목 아트에만 사용했다.

## 자료·문구 검토

`5_2_사회_1_지도서.pdf` SHA-256 `36937a3bbdca94bd47f2f6b02c934759f1933077a3b9ad3d8c7a99fa9f0d4fcb`를 확인했다. PDF 27·29·42쪽(인쇄 42·44·57쪽)의 청동기 마을, 고인돌 분포·모양, 8조법 기록을 `SOURCE_LEDGER.md`와 문항 evidence에 연결했다. `보인다/적혀 있다`는 직접 확인, `짐작할 수 있어요`는 유물·기록에서 이끌어 낸 추론으로 구분했다.

## Humanizer 학생 문구 QA

표지 목표, 방법 안내, 문제 지시문·선택지·힌트·피드백·결과 문구를 소리 내어 읽는 기준으로 점검했다. `생산량`, `출하`, `등급`, `토큰`, `오브젝트`, `게이트` 같은 제작자 말은 쓰지 않았고, `힘을 모은 사회`는 `여러 사람이 함께 일한 사회`로 고쳤다. 자세한 기록은 [`HUMANIZER_QA.md`](HUMANIZER_QA.md)에 있다.

## 빌드·브라우저 QA

| 입력 | SHA-256 |
|---|---|
| quiz.json | `5f90c894491e53d1e6f48a6ae9cd3208c7f056830531199d8bb6e98e3e52e9d3` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 5-2 테마팩 | `1a00a30e229dd103bfa12bd5d09ef859b964849bffc804f438785c6392ca5071` |
| 실행 자산 | `1102fad4fb1c8d85c52b3924671cf3983599a808046c4ee48e1b0c12e6d58c5d` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 현재 정책·스킬 지문 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| 현재 QA 하네스 지문 | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |

마지막 전체 흐름 QA는 `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4174 node scripts/qa-social-quiz.mjs socialmon-5-2-u1-g02-bronze-gojoseon`로 통과했다. PC `desktop-1280x800`, 태블릿 `tablet-landscape-1024x768`, 회귀 viewport `feedback-reported-1079x929`, `feedback-reported-1079x842` 4개에서 표지·설정·방법·문제 대기·오답 확인·정답 확인·흔적 도장·그림자·특징·결과 미리보기·실제 결과를 다시 캡처했고, 상태 감사 120개와 PNG 120개에서 text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이다. 영수증 [screenshots/qa-report.json](screenshots/qa-report.json)의 정책·하네스 지문은 위 표의 동결된 공용 지문과 같다. 공용 엔진·정책·하네스 동결 뒤 `2026-08-12T17:50:33.812Z`에 `desktop-1280x800`, `tablet-landscape-1024x768`, `feedback-reported-1079x929`, `feedback-reported-1079x842` 4개 viewport로 전체 흐름을 다시 캡처했고, 영수증의 정책·하네스 지문은 위 표의 동결 지문과 같다.

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
  --lesson=socialmon-5-2-u1-g01-prehistory-clues \
  --lesson=socialmon-5-2-u1-g02-bronze-gojoseon \
  --lesson=socialmon-5-2-u1-g03-three-kingdoms-gaya \
  --lesson=socialmon-5-2-u1-g17-three-kingdoms-gaya-life \
  --lesson=socialmon-5-2-u1-g04-unified-silla-balhae \
  --lesson=socialmon-5-2-u1-g05-goryeo-beginnings-society \
  --lesson=socialmon-5-2-u1-g06-goryeo-exchange-culture \
  --lesson=socialmon-5-2-u1-g18-goryeo-cultural-heritage-life
```

<!-- SOCIALMON_CURRENT_EVIDENCE:START -->
## 현재 전달 증거

| 입력 | SHA-256 |
|---|---|
| quiz.json | `5f90c894491e53d1e6f48a6ae9cd3208c7f056830531199d8bb6e98e3e52e9d3` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| 테마팩 | `1a00a30e229dd103bfa12bd5d09ef859b964849bffc804f438785c6392ca5071` |
| 실행 자산 | `1102fad4fb1c8d85c52b3924671cf3983599a808046c4ee48e1b0c12e6d58c5d` |
| 엔진 | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| 정책·스킬 | `a2ae8dab29af5ab8072bf6a191eb0e3e2f686068f15ec253aac3902e35cc9cab` |
| QA 하네스 | `83812a647d685adcf23b9ad8816b7dc9e827695f46c4eeed56181a0122a66589` |

- QA 생성 시각: `2026-08-12T17:50:33.812Z`
- 브라우저 QA: 4개 viewport, 120개 상태, 120개 PNG
- 실패 항목: text overflow 0, Stage 밖 0, critical overlap 0, small target 0
<!-- SOCIALMON_CURRENT_EVIDENCE:END -->

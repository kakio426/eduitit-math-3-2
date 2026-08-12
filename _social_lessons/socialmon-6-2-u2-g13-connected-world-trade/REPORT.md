# 소셜몬 무역으로 이어진 세계

## 완료 요약

`socialmon-6-2-u2-g13-connected-world-trade`를 profile-v2 / contract-v3 정식 단일 HTML로 완성했다. 무역을 통한 국가 간 상호 의존과 경쟁을 판단하는 6문제 퀴즈이며, 첫 문제는 자료를 보고 고르는 문항이다. 출판사 근거가 화면에 보이는 source-choice 3개와 관계형 문항을 포함하고, 학생 조작은 고르기·이어 보기·나누어 보기 3종만 사용한다. map-hotspots는 사용하지 않는다.

## 지도서·시각 근거 검증

원자료 `/Users/yubyeongju/Downloads/6_2_사회_2_지도서.pdf`의 SHA-256은 `61f3217ce221de1ba4682981d019f99febedd767da9abb384c58e883d76e039a`이다. 지도서 차시 17~20, PDF 123·124·128쪽(인쇄 242·243·247쪽)의 문항 근거를 원문과 대조했다.

각 source-choice의 실행 이미지는 질문을 눈으로 판단할 수 있는 근거 영역만 보이도록 잘랐고, 최종 브라우저 화면에서 사진·그래프·교과 삽화의 실제 내용과 `source.text`·`alt`를 다시 비교했다. 생성 이미지는 표지 문구에만 사용했으며 정답 근거로 쓰지 않았다. 세부 crop 범위와 출처는 [SOURCE_LEDGER.md](SOURCE_LEDGER.md)에 기록했다.

## Humanizer 학생 문구 QA

협력·상호 의존·경쟁의 뜻을 유지하며 q1~q3 질문과 보기를 짧게 줄였고, 국가 관계를 승패로 표현하지 않았다. 표지 목표, 문제, 보기, 피드백, 결과 및 aria-label을 6학년 학생이 소리 내어 읽는 기준으로 확인했으며, `힘`·`파워`·`토큰`·`이벤트`·`게이트` 같은 금지·제작자 문구는 없다. 세부 점검은 [HUMANIZER_QA.md](HUMANIZER_QA.md)에 남겼다.

## 빌드·정적 검사·브라우저 QA

현재 `index.html`과 [screenshots/qa-report.json](screenshots/qa-report.json)은 아래 입력 지문으로 다시 생성했다. QA 생성 시각(UTC)은 `2026-08-12T13:55:19.876Z`이다.

| 입력 | SHA-256 |
|---|---|
| quiz.json | `8334770d26b25aa683eceab6b339b81ad8e274248f96ea88ca43aad68b587357` |
| profile.json | `1390e406212f7f5fc01b9e2a1065106fccab593dfe1891cba4a24472e5164b84` |
| theme pack | `94f1445534a707c5c9fbe67d4cdd13c3216c425c8db55c71e371f348d2ce9654` |
| 실행 자산 (lessonAssetsSha256) | `90e5b1c5ddedb62aef80d2feec11fb90a3b3dcdb278cca35ac1c3bb432d1ce99` |
| engine | `f43e8af8a43a82b91162d9b7cfc71cf0a709a1af41761a864cf331c9db2fc776` |
| current policy | `65a701fc4ff38a39d14347f0d7a45a792b5695955b794ecfb23f9b8faa6fdcd9` |
| current QA harness | `509de366b3752aa54262b488d0968629425716e6521a030d669e973478e64300` |

실행 기록:

- `node scripts/build-social-quiz.mjs socialmon-6-2-u2-g13-connected-world-trade` — PASS
- `node scripts/check-social-quiz.mjs socialmon-6-2-u2-g13-connected-world-trade` — PASS
- `SOCIAL_QUIZ_BASE_URL=http://127.0.0.1:4175 node scripts/qa-social-quiz.mjs socialmon-6-2-u2-g13-connected-world-trade` — PASS

브라우저 QA는 등록된 4 viewport에서 전체 흐름 120 state audit과 120 PNG를 새로 검사했다. text overflow 0, Stage 밖 0, critical overlap 0, small target 0, browser error 0이다. QA 영수증에는 quiz/profile/theme/lesson assets/engine/policy/harness 현재 지문이 모두 들어 있다.

## 전달 게이트

최종 단일 명령:

```sh
node scripts/verify-socialmon-delivery.mjs --lesson=socialmon-6-2-u2-g13-connected-world-trade
```

이 작업에서는 커밋·푸시하지 않았다.

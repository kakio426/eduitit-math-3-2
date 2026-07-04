# 매스몬 상자런

에듀잇티 수학 게임 시리즈 1탄입니다.

- 대상: 3학년 2학기 1단원
- 학습: 받아올림 없는 세 자리 수 × 한 자리 수
- 문제 은행: 받아올림 없는 186개 후보 중 매 판 10개 랜덤 출제
- 콤보: 연속 정답이면 기본 정답 점수가 커짐
- 상자 등급: 일반, 반짝, 황금 상자에 따라 보상 기대감이 달라짐
- 결과 화면: 새 생성 배경 위에 매스몬 이름과 정답 수는 생성형 이미지로 크게 보여 주고, SVG 동적 레이어는 실제 점수값·버튼 표면만 보여 줌. 매스몬은 새 다양성 보상팩 WebP를 사용함
- 순위: 결과 뒤 `순위`를 누르면 이번 주 전국 상자 순위 화면으로 이동. API 주소가 설정된 경우 서버가 만든 기록 이름으로 점수를 제출하고 10위까지 보여 줌
- 소리: 낮은 볼륨의 기존 BGM과 Kenney CC0 샘플 기반 상황별 효과음 제공. 사용 팩은 Interface Sounds, Impact Sounds, RPG Audio, Digital Audio, Music Jingles이며, 소리 버튼으로 함께 켜고 끔
- 방식: 문제를 맞히고 상자를 열어 점수를 크게 바꾸는 짧은 반복 게임
- 실행: `index.html`을 브라우저에서 열기

## 설계 의도

`매스몬 상자런`에서 곱셈 문제는 단순히 맞히고 끝나는 과제가 아니라, 상자 보상과 최종 매스몬을 여는 행동 도구로 작동합니다. 학생은 계산을 통해 점수 변화의 기회를 얻고, 상자의 무작위 보상 때문에 매 판 다른 결과를 경험합니다. 이 구조는 반복 연습을 벌칙처럼 느끼게 하기보다, 예측 가능한 계산 성공과 예측 불가능한 보상을 결합해 `한 문제만 더` 풀고 싶은 동기를 만듭니다. 따라서 학생은 점수와 매스몬을 얻기 위해 자연스럽게 더 많은 문제를 풀며, 그 과정에서 받아올림 없는 세 자리 수 곱셈 절차를 반복적으로 확인하게 됩니다.

## 화면

![첫 화면](screenshots/01-cover.png)

## 문서

- [매스몬 상자런 설명 보고서](REPORT.md)
- [현재 보상 매스몬 모음](../_shared/mathmon/diversity-reward-pack/contact-sheets/diversity-reward-pack-contact-sheet.png)

## 파일 구성

- `index.html`: 게임 본문
- `cover-generated.webp`: 첫 화면 대표 커버 이미지(배포용 경량 포맷, PNG 원본은 작업실 보관)
- `result-generated-v3.webp`: 최종 결과 RasterStage 배경 이미지(배포용 경량 포맷, PNG 원본은 작업실 보관)
- `result-title-*-generated.webp`: 최종 매스몬 이름 생성형 타이틀 이미지
- `../_shared/result-count/result-correct-*-generated.webp`: 결과 정답 수 생성형 숫자 이미지
- `assets/mathmon/diversity-reward-pack/*.webp`: 현재 최종 점수로 얻는 매스몬 배포 이미지
- `mathmon-*.png`: 1단원 기본 10종 기준 이미지 보존본
- `eduitit-logo-mark.png`: 첫 화면 브랜딩 로고
- `assets/audio/*.wav`: Kenney CC0 기반 정답, 오답, 상자, 보상, 결과 효과음
- `../_shared/scoreboard/*`: 공통 전국 순위 배경, 생성형 타이틀 이미지, SVG UI, API 브리지
- `screenshots/`: 화면별 스크린샷과 다운로드 카드 예시
- `REPORT.md`: 게임 설명, 화면 흐름, 매스몬 설명

## 전국 순위 백엔드 연결

기본 파일만 열면 순위 기능은 꺼진 안내 상태로 동작합니다. 실제 서버를 붙일 때는 게임을 열기 전에 아래 값을 주입합니다.

```html
<script>
  window.MATHMON_SCOREBOARD_API_URL = "https://your-scoreboard-api.example.com";
</script>
```

연동 위치는 `index.html`의 `SCOREBOARD_API_URL`, `scoreboardBridge`, `scoreboardAnswers`, `scoreboardScreen`입니다. 자세한 업체 인계 문서는 `../scoreboard-api/docs/GAME_INTEGRATION.md`를 기준으로 합니다.

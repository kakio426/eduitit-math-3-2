# 소셜몬 우리 지역 문제 찾기

4학년 2학기 사회 2단원 1~3차시를 위한 6문제 소셜몬 퀴즈다. 여러 사람이 함께 겪는 지역문제를 자료에서 찾고, 개인의 일과 구분하며, 조사할 방법을 고른다.

## 실행

루트에서 정적 서버를 열고 다음 주소로 접속한다.

```bash
python3 -m http.server 4175
```

```text
http://127.0.0.1:4175/_social_lessons/socialmon-4-2-u2-g06-local-problems/
```

`index.html`은 공용 profile-v2, `socialmon-4-2-regional-problems-v1` 테마팩, 차시 `quiz.json`을 한 파일로 조립한 배포본이다.

## 화면과 조작

- 화면: 표지 → 방법 보기 → 문제 → 결과
- 문제 수: 6문제
- 학생 조작: 고르기, 나누어 보기, 이어 보기
- 보상: 문제마다 흔적 1개, 2·4문제 뒤 힌트, 마지막 소셜몬 공개
- 결과: 맞힌 문제 수, 오늘 만난 소셜몬, 오늘의 발견

## 자료와 생성 자산

- `assets/source-neighborhood-issues-v1.webp`: 지도서 PDF 12쪽의 교과서 61쪽 동네 그림 crop
- `assets/source-class-survey-table-v1.webp`: 지도서 PDF 18쪽의 교과서 65쪽 조사표 crop
- `assets/option-*.webp`: 선택지 뜻을 돕는 생성형 장식이며 정답 근거가 아니다.
- `assets/cover-copy-v1-generated.webp`: 시리즈명·제목·목표를 한 덩어리로 보여 주는 생성형 투명 문구 아트다.
- 사실과 crop 범위는 `SOURCE_LEDGER.md`에 기록했다.

## 파일

- `quiz.json`: 차시 원본
- `index.html`: 단일 실행본
- `PLAN.md`: 구현 계획과 계약
- `SOURCE_LEDGER.md`: PDF 근거와 이미지 원장
- `HUMANIZER_QA.md`: 학생 문구 점검
- `REPORT.md`: 정적·브라우저 검증 결과
- `screenshots/qa-report.json`: 현재 실행본의 브라우저 QA 영수증

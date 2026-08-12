# 소셜몬 세계 인구 지도

6학년 2학기 사회 3단원 1~3차시를 묶은 5~7분 퀴즈다. 학생은 세계 지도와 자료에서 사람이 모여 사는 곳, 사람이 적은 곳, 그 까닭을 찾아본다.

공용 `socialmon-quiz-lite-v1` 엔진과 `socialmon-quiz-lite-profile-v2`, `socialmon-quiz-lite-contract-v3` 계약을 사용한다. 표지는 세계 지도 테마 배경과 차시 전용 생성형 문구 아트를 조합한다. 지도서 자료 crop은 사실 근거로, 공용 선택지 그림은 글의 뜻을 돕는 장식으로만 쓴다.

## 실행

빌드 뒤 `index.html`을 브라우저에서 연다. 태블릿 가로와 컴퓨터 화면을 지원한다. 문항 근거와 PDF 해시는 `SOURCE_LEDGER.md`에서 확인할 수 있다.

## 문항 구성

- 자료 고르기 4문제
- 나누어 보기 1문제
- 이어 보기 1문제

q2와 q4는 승인된 `socialmon-source-choice-map-hotspots-v1`으로 출판사 인구 분포 지도의 위치를 직접 누른다. 3000×1240 지도 보드, 글만 있는 선택지 4개, 접근성 이름이 있는 지도 버튼 4개를 사용한다. 다른 문항에는 지도 버튼을 쓰지 않는다.

제작 잠금은 `PLAN.md`, 쪽별 근거는 `SOURCE_LEDGER.md`, 학생 문구 점검은 `HUMANIZER_QA.md`, 최종 검증 지문은 `REPORT.md`에 기록한다.

# 3-2-6-1 매스몬 자료 정리단 source

`mathmon-engine-v1`로 제작한 첫 신규 차시 파일럿입니다. 학생용 배포 폴더는 `3-2-6-1-mathmon-data-rangers/`이고, 실제 실행 파일 `index.html`은 빌드 결과입니다.

## 구성

- `lesson.json`: 문구, 보상, 결과, 생성 이미지, QA 계약
- `model.js`: 자료판 문제 생성과 정답 검증
- `view.js`: 자료표/그림그래프 조작판 렌더러
- `lesson.css`: 자료판 전용 스타일

## 빌드

```bash
node scripts/build-lesson.mjs 3-2-6-1-mathmon-data-rangers
```

## 학습 행동

- 가장 많은 줄 고르기
- 한 줄의 개수 읽기
- 가장 많은 줄과 가장 적은 줄의 차이 고르기

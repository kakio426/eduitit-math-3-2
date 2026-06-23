# 빌드·배포 검증 체크리스트

## 1. 게임 동작 (브라우저에서 index.html 열기)
- [ ] 5화면 흐름(첫→설명→문제→보상→결과) 1판(10문제) 완주
- [ ] 문제 은행이 전부 해당 차시 유형인지 표본 점검
- [ ] 각 단계 보기에 정답 + 대표 오답 등장
- [ ] 마지막 단계에서 최종 답 자동 완성 연출 동작
- [ ] 랜덤 보상(증가/감소/0/즉시완성/특별) 모두 발생 가능
- [ ] 중간 오답 시 "결함/누수" 처리(일부러 틀리기 차단)
- [ ] 결과 = 차시 자체 완결형 등급 + 정답 수 게이트, 등급 이미지 표시

## 2. 화면 계약 (SERIES_CONTRACT.md 대조)
- [ ] 첫 화면 3요소(제목·한 줄 목표·시작 버튼) 최우선
- [ ] 브랜드/단원/배움주제 배지 위치 동일
- [ ] 중심 보상 1개로 단일화, 문제·선택지가 항상 가장 큼
- [ ] 학생 화면에 내부 용어(AI Mart 등) 없음, 제목은 매스몬으로 시작

## 3. 설계 철학 (AGENTS.md/CLAUDE.md 점검 질문 6개)
- [ ] 행동의 도구 / 랜덤 유지 / 최고 등급 어렵게 / 정답≠유일통로 / 빈손 없음 / "다음엔 더 멀리"

## 4. 레이아웃·자산
- [ ] 태블릿 가로·데스크톱에서 긴 숫자·한글 이름·큰 텍스트가 칸 안에 맞음
- [ ] 생성 이미지: PNG 원본 작업실 보관, 배포는 WebP, index.html은 webp 참조

## 5. 코드·문서·등록
- [ ] `node --check index.html`에 들어가는 JS 점검(필요시 분리 검사)
- [ ] README.md / REPORT.md / screenshots(첫·설명·문제·보상·결과) 완비
- [ ] manifest.json에 차시 추가(id/folder/title/unit/lesson/learningGoal/entryFile)
- [ ] 루트 README.md 시리즈 표에 행 추가

## 6. 단일 레포 GitHub Pages 배포 (eduitit-main-release 병행)
- [ ] 별도 공개 레포를 만들지 않고, 이 작업실 레포의 Pages 설정으로만 공유
- [ ] 필요한 게임 폴더와 WebP/PNG 자산이 모두 git에 포함되어 있는지 `git status --short`로 확인
- [ ] 배포 후 공개 URL `curl -I -L <url>` HTTP 200, 주요 WebP 자산 200 확인
- [ ] Pages 실패 시 `gh run view <run-id> --log-failed`로 원인 확인, submodule gitlink(160000) 점검

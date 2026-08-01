# 3단원 3차시~6단원 4차시 전수감사

감사일: 2026-08-01

## 범위

- 대상: `3-2-3-3`부터 `3-2-6-4`까지 14개 차시
- 기준: `AGENTS.md`, `LESSON_COMMONS.md`, `eduitit-mathmon-lesson`, `eduitit-mathmon-assets`, Humanizer 학생 문구 QA
- 화면: 1280×800, 1024×768 및 차시별 등록 회귀 viewport
- 상태: 표지, 설정, 방법, 문제 대기, 대표 오답, 단계별 정답 확인, 완료, 닫힌 보상, 열린 보상, 결과

## 발견하고 고친 공통 결함

1. 문제 화면 진행 보상 설정이 없으면 기존 시각 계약과 브라우저 하네스가 검사를 건너뛰었습니다.
   - 이제 14개 차시는 `playProgressAudit` 또는 `playProgressDisposition` 중 정확히 하나가 없으면 실패합니다.
2. 3단원 3·4차시는 왼쪽 진행 장면이 없었습니다.
   - 각 차시에 생성형 진행 장면 6장, 생성 원본, 컨택시트, 결과 단계 1:1 연결, 고정 Stage 좌표와 브라우저 측정을 추가했습니다.
3. 공용 모달 보상이 공개 뒤 누적값처럼 `다리 힘 0` 등을 표시했습니다.
   - 모든 공용 엔진 차시는 `이번 변화 +N/-N/0`으로 표시합니다.
4. 5단원 1~3차시는 소스와 빌드 HTML이 어긋나 있었고 5단원 통합 하네스가 현재 선택지·모달 구조를 제대로 검사하지 못했습니다.
   - 현재 소스로 다시 빌드하고 오개념 선택, 닫힌/열린 모달, 독립 HTML 5-4 위임 검사를 고쳤습니다.
5. 5단원 3차시 저울은 대기 화면에서 기울어 답을 미리 보여 주었습니다.
   - 대기 때 수평, 정답 확인 뒤 실제 기울기 공개로 바꾸고 모델 회귀 테스트도 같은 계약으로 고쳤습니다.
6. 현재 빌드보다 오래된 스크린샷도 보고 증거로 남을 수 있었습니다.
   - `report-evidence-manifest.json`에 현재 `index.html`과 대표 상태 이미지 해시를 기록하고, 차시별 `report-contact-sheet.png`를 생성·검사합니다.

## 문제 화면 진행 보상 판정

| 차시 | 판정 | 근거 |
|---|---|---|
| 3-2-3-3 | 적용 | 수달몬+다리 6단계, 왼쪽 고정 패널 |
| 3-2-3-4 | 적용 | 무지개유니몬+원 무늬 6단계, 왼쪽 고정 패널 |
| 3-2-4-1~4 | 미적용 | 학습 영역 Stage 폭 90% 계약 유지 |
| 3-2-5-1~3 | 미적용 | 학습 영역 Stage 폭 90% 계약 유지 |
| 3-2-5-4 | 미적용 | 독립 전체 화면 계산 흐름 유지 |
| 3-2-6-1~4 | 미적용 | 학습 영역 Stage 폭 90% 계약 유지 |

## 최종 검증

- 차시 계약: 14개 PASS
- 시각 계약: 14개 PASS
- Stage 16:10 / 1280×800: 전체 24개 패키지 PASS
- 3·4단원 소스 QA: PASS
- 5단원 1~3차시 모델 30만 문제 + 독립 5-4 100만 문제: PASS
- 6단원 데이터 모델: 4개 차시 PASS
- 브라우저 전체 흐름: 대상 14개 PASS
- 랭킹 비활성화, 실행 무작위성, 규칙 일치: PASS
- 최신 증거 매니페스트: 대상 14개 PASS
- Humanizer 학생 문구 QA: 금지 우선어·번역투 0건, 새 문구 `지금 다리`, `지금 무늬`, `이번 변화` 의미 보존 확인

## 재실행 명령

```sh
node scripts/check-lesson-visual-contract.mjs 3-2-3-3-mathmon-double-bridge 3-2-3-4-mathmon-circle-pattern 3-2-4-1-mathmon-pizza-fraction 3-2-4-2-mathmon-fraction-scoop 3-2-4-3-mathmon-fraction-sorter 3-2-4-4-mathmon-fraction-tug 3-2-5-1-mathmon-water-fill 3-2-5-2-mathmon-drink-order 3-2-5-3-mathmon-scale-balance 3-2-5-4-mathmon-package-weight 3-2-6-1-mathmon-data-rangers 3-2-6-2-mathmon-picture-decoder 3-2-6-3-mathmon-picture-stamp 3-2-6-4-mathmon-data-detective
node scripts/check-lesson-report-evidence.mjs
node scripts/check-stage-ratio.mjs
node scripts/check-rule-consistency.mjs
node scripts/check-ranking-disabled.mjs
node scripts/check-run-randomness.mjs
```

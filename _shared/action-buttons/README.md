# 매스몬 공용 주요 행동 버튼 v1

- 공용 ID: `mathmon-primary-action-buttons-v1`
- 시각 기준: 밝은 금빛 가로 캡슐, 두꺼운 이중 테두리, 아래쪽 입체 그림자, 굵은 흰색 한글
- 보조 행동: `이전`만 같은 형태의 파란색 계열
- 실행 슬롯: 기본 `300×117px`, 큰 설명 버튼은 최대 `384×150px`
- 실제 클릭: 같은 경계의 HTML `button`; 보이는 글자는 자식 `img`만 담당

## 공용 항목

| 행동 | 배포 WebP | 용도 |
| --- | --- | --- |
| 다음 | `next-button-generated.webp` | 다음 설명·다음 문제 |
| 이전 | `previous-button-generated.webp` | 이전 설명 |
| 문제 시작 | `problem-start-button-generated.webp` | 설명 뒤 첫 문제 시작 |
| 결과 보기 | `result-view-button-generated.webp` | 마지막 보상 뒤 결과 이동 |

각 버튼은 `*-chromakey.png`, 투명 `*-generated.png`, 실행 `*-generated.webp`를 한 세트로 보관합니다. `다음`은 3-2-2-1에서 검증된 생성 자산을 변형 없이 공용으로 승격했고, 나머지는 같은 자산을 편집 기준으로 삼아 GPT Image로 생성했습니다.

전체 버튼의 글자·비율·가장자리 비교 증거는 `action-buttons-contact-sheet.png`입니다.

뜻이 같은 버튼은 차시 폴더에 복제하지 않고 이 폴더의 WebP를 직접 참조합니다. `문 열기`, `바람 보기`처럼 차시 소재에만 맞는 행동은 같은 시각 계열로 따로 생성하되 공용 항목으로 이름만 바꾸어 재사용하지 않습니다.

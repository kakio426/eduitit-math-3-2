# 결과판 내부 포함 계약

결과 화면을 새로 만들거나 크게 고칠 때 `result-panel-containment-v2`를 적용한다. 이 계약은 공통 중심축만 맞고 결과판 위·아래로 요소가 빠지는 화면을 차단한다.

## 자산 설계

1. 1280×800 결과 장면에서 결과판의 실제 안쪽 네 변을 먼저 정한다.
2. 결과판 안쪽 여백, 필수 요소 높이, 요소 사이 최소 간격을 합산한다.
3. `필요 높이 > 결과판 안전 영역 높이`면 CSS로 밀어 넣지 말고 결과 장면을 다시 생성한다.
4. 새 결과 화면은 완성 장면과 빈 결과판을 배경 이미지가 맡고, 결과명과 다시하기는 투명 배경의 생성형 이미지 자산으로 결과판 안에 둔다. 동적 값은 SVG/HTML이 맡는다.
5. 배경에 제목·버튼 표면을 구워 넣는 기존 호환 장면은 큰 수정 때 위 구조로 이관한다. 배경에 구운 요소는 DOM rect를 잴 수 없으므로 새 복제 기준으로 쓰지 않는다.

## lesson.json 계약

```json
{
  "standards": {
    "resultPanelContainment": "result-panel-containment-v2"
  },
  "qa": {
    "resultPanelContainmentAudit": {
      "standard": "result-panel-containment-v2",
      "sceneImage": "#resultBg",
      "panelDetector": "resultBoardAudit",
      "safeInsetPx": 20,
      "containmentTolerancePx": 1,
      "minimumVisibleGapPx": 8,
      "requiredNodes": {
        "title": "#resultDestinationSvg",
        "measure": "#resultMeasureSvg",
        "track": "#resultMeasureTrackSvg",
        "correct": "#resultCorrectArt",
        "next": "#resultNextSvg",
        "retry": "#restartButton"
      },
      "pairedNodes": {
        "retryVisual": ".result-retry-art",
        "retryHitbox": "#restartButton"
      },
      "visualHitboxTolerancePx": 1,
      "optionalWhenHidden": ["next"]
    }
  }
}
```

- `panelDetector`는 현재 `resultBoardAudit`만 허용한다. 검출기는 래스터 결과판의 `left/top/right/bottom`을 모두 반환해야 한다.
- `safeInsetPx`는 숫자 또는 `{ "top", "right", "bottom", "left" }` 객체로 선언한다.
- `requiredNodes`는 `title`, `measure`, `track`, `correct`, `next`, `retry`를 모두 포함한다.
- `pairedNodes`는 보이는 다시하기 아트와 실제 버튼 hitbox를 따로 가리키며, 네 변 차이는 `visualHitboxTolerancePx` 이하여야 한다.
- 숨김이 허용된 요소도 숨긴 상태에서는 computed `display:none`과 실제 rect `0×0`을 만족해야 한다.
- 보이는 SVG 텍스트는 호스트가 아니라 실제 글리프 rect를 잰다.

## 브라우저 판정

모든 결과 단계와 모든 `qa.viewports`에서 다음을 검사한다.

1. `resultBg`를 1280×800 canvas에 그려 결과판의 연속 픽셀 영역 네 변을 검출한다.
2. 검출한 원본 좌표를 실제 Stage rect로 변환한다.
3. 결과판 네 변에서 안전 여백을 뺀 `panelSafeRect`를 만든다.
4. 필수 요소의 실제 보이는 rect와 버튼 hitbox를 따로 잰다.
5. 모든 rect의 네 변이 `panelSafeRect` 안에 들어오는지 확인한다.
6. 필수 요소의 세로 순서, 최소 간격, 형제 교차 0px를 확인한다.
7. 결과 장면과 Stage 네 변, 버튼 아트와 hitbox 네 변 오차를 각각 1px 이하로 확인한다.

## 필수 실패 fixture

- `axis-correct-outside-panel`: 중심축은 맞지만 요소가 결과판 아래로 빠진다.
- `panel-too-short`: 슬롯 높이와 간격 합이 결과판 안전 높이보다 크다.
- `retry-hitbox-outside-panel`: 버튼 표면 또는 hitbox가 결과판 밖에 있다.
- `hidden-node-still-rendered`: 숨긴 다음 목표가 0×0이 아니다.
- `stage-cropped-at-user-viewport`: 사용자 제보 viewport에서 Stage가 viewport 밖으로 잘린다.

현재 실패 화면은 수정 전 증거로 `_archive/`에 보존하고, 같은 viewport·DPR·결과 단계에서 수정 뒤 캡처를 다시 만든다.

결과 자산이나 `lesson.json`의 `result/results`를 바꾼 브랜치는 배포 전에 아래 변경 감지 게이트도 통과한다. 기존 차시가 구형 계약이었다는 이유로 새 결과 변경이 검사를 생략할 수 없다.

```bash
node scripts/check-result-panel-adoption.mjs origin/main
```

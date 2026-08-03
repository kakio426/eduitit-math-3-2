# Result panel containment v2

최종 결과 화면은 생성 장면과 빈 결과판을 `#resultBg`에 두고, 결과명·정답 수·다시하기처럼 고정되는 시각 요소는 독립 래스터/WebP 레이어로 둔다. 넓은 범위의 현재 힘/진행값과 다음 목표만 동적 SVG/HTML 오버레이로 허용한다. 보이는 결과명·칭찬·버튼 면을 CSS 텍스트, CSS 그림자, HTML 텍스트로 다시 그리지 않는다.

## 선언

`lesson.json > qa.resultPanelContainmentAudit`는 결과가 있는 차시마다 필수다.

```json
{
  "standard": "result-panel-containment-v2",
  "stage": "1280x800",
  "sceneImage": "#resultBg",
  "safeInsetPx": 24,
  "panelDetector": {
    "standard": "raster-panel-bounds-v2",
    "mode": "dark|light",
    "searchRect": { "x": 0, "y": 0, "width": 1280, "height": 800 },
    "searchRectByTier": {},
    "threshold": {},
    "minRunWidth": 180
  },
  "elements": {
    "title": "#resultTitleArt",
    "measure": "#resultMeasureSvg",
    "track": "#resultMeasureTrackSvg",
    "correct": "#resultCorrectArt",
    "next": "#resultNextSvg",
    "retryArt": ".result-retry-art",
    "retryHitbox": "#restartButton"
  },
  "axisNodes": ["measure", "track", "correct", "next", "retryHitbox"],
  "axisTolerancePx": 1,
  "hitboxTolerancePx": 1,
  "elementContainment": true,
  "noIntersections": true,
  "samePanelSizeAcrossTiers": true,
  "sameSafeRectAcrossTiers": true,
  "hiddenNextMustBeZero": true,
  "viewportCropsStage": false,
  "fixtures": [
    "axis-correct-but-outside-panel",
    "panel-too-short",
    "retry-hitbox-outside-panel",
    "baked-title-outside-panel",
    "viewport-crops-stage",
    "stale-runtime-build"
  ],
  "runtimeMetadata": {
    "selector": "#mathmonRuntimeBuildMeta",
    "commitShaAttribute": "data-commit-sha",
    "lessonJsonShaAttribute": "data-lesson-json-sha256"
  }
}
```

## 검증 순서

1. 이미지 생성 전에 판의 사용 가능 영역과 필요한 콘텐츠 높이를 계산한다. 안쪽 여백 `24px` + 요소 높이 합 + 요소 사이 간격 합이 판 높이를 넘으면 CSS로 늘리지 말고 이미지를 다시 생성한다.
2. 하네스가 `#resultBg`의 실제 픽셀에서 판의 `left/top/right/bottom`을 검출하고 Stage 좌표로 변환한다.
3. 검출 판에서 안전 영역을 `24px`씩 줄여 `panelSafeRect`를 만든다.
4. 제목·진행값·막대·정답 수·다음 목표·다시하기 아트·다시하기 hitbox의 실제 보이는 rect를 측정한다. 모든 rect가 안전 영역 안에 있고 형제 교차가 `0px`인지 확인한다.
5. 동적 값 묶음의 공통 중심축 오차는 `1px`, 버튼 아트와 hitbox 네 변 오차는 `1px` 이하로 확인한다. 숨긴 다음 목표는 `display:none`과 `0×0`이어야 한다.
6. 모든 결과 단계와 등록 viewport를 반복한다. 단계마다 판 크기와 안전 영역이 달라지면 실패한다.
7. 실행 메타데이터의 커밋 SHA와 `lesson.json` SHA-256이 하네스가 검사하는 현재 파일과 같은지 확인한다. 화면에는 보이지 않는 `aria-hidden` 디버그 요소로만 둔다.

`result-dynamic-axis-v1`이나 가로 중심만 검사하는 예전 `resultBoardAudit`는 이 계약을 대신할 수 없다.

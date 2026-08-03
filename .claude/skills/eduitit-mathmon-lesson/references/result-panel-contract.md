# Result panel containment v2 + primary reward dominance v1

최종 결과 화면은 생성 장면과 빈 결과판을 `#resultBg`에 두고, 결과명·정답 수·다시하기처럼 고정되는 시각 요소는 독립 래스터/WebP 레이어로 둔다. 결과판 내부 포함만 맞으면 판이 화면 대부분을 차지하고 완성 보상물이 작아져도 통과하므로 `result-primary-reward-dominance-v1`을 함께 적용한다. 넓은 범위의 현재 힘/진행값은 결과 해석에 꼭 필요하다고 명시 승인한 경우만 동적 SVG/HTML 오버레이로 허용한다. 보이는 결과명·칭찬·버튼 면을 CSS 텍스트, CSS 그림자, HTML 텍스트로 다시 그리지 않는다.

## 보상물 우선 원칙

1. 학생이 완성한 보상물·세계가 첫 번째 주인공이고 결과판은 오른쪽 빈 공간의 보조물이다.
2. 모든 결과 단계의 주 보상물 경계를 1280×800 원본 좌표로 기록한다.
3. 주 보상물 폭은 Stage `60%` 이상, 면적은 `13%` 이상, 오른쪽 끝은 Stage `60%` 이상까지 도달해야 한다.
4. 결과판은 Stage `60%` 이후에 시작하고 폭 `38%`, 면적 `25%` 이하여야 한다.
5. `보상물 폭 / 결과판 폭`은 `1.45` 이상, 결과판이 가리는 보상물 면적은 `3%` 이하여야 한다.
6. 승인되지 않은 내부 값·막대 selector와 `힘 N` 문구는 computed style·rect·보이는 텍스트 검사에서 0건이어야 한다.

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

같은 차시의 `standards.resultRewardDominance`와 `qa.resultRewardDominanceAudit`는 아래처럼 선언한다.

```json
{
  "standard": "result-primary-reward-dominance-v1",
  "sceneImage": "#resultBg",
  "panelDetector": "resultBoardAudit",
  "primaryRewardBoundsByTier": {
    "tier-id": { "x": 0, "y": 350, "width": 800, "height": 250 }
  },
  "minimumPrimaryRewardWidthRatio": 0.6,
  "minimumPrimaryRewardAreaRatio": 0.13,
  "minimumRewardRightEdgeRatio": 0.6,
  "minimumPanelLeftRatio": 0.6,
  "maximumPanelWidthRatio": 0.38,
  "maximumPanelAreaRatio": 0.25,
  "minimumRewardToPanelWidthRatio": 1.45,
  "maximumRewardPanelOverlapRatio": 0.03,
  "forbiddenVisibleSelectors": ["#resultMeasureSvg", "#resultMeasureTrackSvg"],
  "forbiddenVisibleTextPatterns": ["힘\\s*\\d+"],
  "informationSelectors": ["#resultTitleArt", "#resultCorrectArt", "#resultNextSvg", "#restartButton"],
  "maximumVisibleInformationNodes": 4
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
8. 실제 검출 결과판과 단계별 주 보상물 경계로 위 비율을 계산하고, 금지 selector·문구와 보이는 정보 노드 수를 검사한다.

`result-dynamic-axis-v1`이나 가로 중심만 검사하는 예전 `resultBoardAudit`는 이 계약을 대신할 수 없다.

필수 회귀 fixture는 `oversized-panel-tiny-reward`, `internal-metric-leak`, `reward-hidden-by-panel`이며 `node scripts/test-result-reward-dominance.mjs`로 실행한다. 결과 자산·설정을 바꾼 브랜치는 `node scripts/check-result-panel-adoption.mjs <base>`로 두 계약 선언을 모두 확인한다.

export const RESULT_REWARD_DOMINANCE_STANDARD = "result-primary-reward-dominance-v1";

function area(rect) {
  return Math.max(0, rect.width) * Math.max(0, rect.height);
}

function intersectionArea(a, b) {
  const left = Math.max(a.x, b.x);
  const top = Math.max(a.y, b.y);
  const right = Math.min(a.x + a.width, b.x + b.width);
  const bottom = Math.min(a.y + a.height, b.y + b.height);
  return Math.max(0, right - left) * Math.max(0, bottom - top);
}

export function validateResultRewardDominance(input) {
  const {
    canvas,
    reward,
    panel,
    thresholds,
    forbiddenVisibleSelectors = [],
    forbiddenVisibleText = [],
    visibleInformationCount = 0,
  } = input;
  const panelRect = {
    x:panel.left,
    y:panel.top,
    width:panel.right - panel.left,
    height:panel.bottom - panel.top,
  };
  const canvasArea = canvas.width * canvas.height;
  const rewardArea = area(reward);
  const panelArea = area(panelRect);
  const rewardWidthRatio = reward.width / canvas.width;
  const rewardAreaRatio = rewardArea / canvasArea;
  const rewardRightEdgeRatio = (reward.x + reward.width) / canvas.width;
  const panelLeftRatio = panelRect.x / canvas.width;
  const panelWidthRatio = panelRect.width / canvas.width;
  const panelAreaRatio = panelArea / canvasArea;
  const rewardToPanelWidthRatio = reward.width / panelRect.width;
  const rewardPanelOverlapRatio = intersectionArea(reward, panelRect) / rewardArea;
  const failures = [];

  if (rewardWidthRatio < thresholds.minimumPrimaryRewardWidthRatio) failures.push("primary reward is too narrow");
  if (rewardAreaRatio < thresholds.minimumPrimaryRewardAreaRatio) failures.push("primary reward is too small");
  if (rewardRightEdgeRatio < thresholds.minimumRewardRightEdgeRatio) failures.push("primary reward does not cross the stage midpoint");
  if (panelLeftRatio < thresholds.minimumPanelLeftRatio) failures.push("result panel is not secondary on the right");
  if (panelWidthRatio > thresholds.maximumPanelWidthRatio) failures.push("result panel is too wide");
  if (panelAreaRatio > thresholds.maximumPanelAreaRatio) failures.push("result panel is too large");
  if (rewardToPanelWidthRatio < thresholds.minimumRewardToPanelWidthRatio) failures.push("result panel overpowers the primary reward");
  if (rewardPanelOverlapRatio > thresholds.maximumRewardPanelOverlapRatio) failures.push("result panel covers the primary reward");
  if (forbiddenVisibleSelectors.length) failures.push("forbidden internal metric selector is visible");
  if (forbiddenVisibleText.length) failures.push("forbidden internal metric text is visible");
  if (visibleInformationCount > thresholds.maximumVisibleInformationNodes) failures.push("result panel has too many visible information nodes");

  return {
    failures,
    measurements:{
      rewardWidthRatio,
      rewardAreaRatio,
      rewardRightEdgeRatio,
      panelLeftRatio,
      panelWidthRatio,
      panelAreaRatio,
      rewardToPanelWidthRatio,
      rewardPanelOverlapRatio,
      visibleInformationCount,
    },
  };
}

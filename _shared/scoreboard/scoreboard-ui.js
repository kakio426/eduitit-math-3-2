(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const ROW_Y = [422, 476, 530, 584];
  const ROW_HEIGHT = 48;
  const ROW_STEP = 54;
  const VISIBLE_ROWS = ROW_Y.length;

  function text(root, selector, value) {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  }

  function clearList(root) {
    const list = root.querySelector("[data-scoreboard-list]");
    if (list) list.textContent = "";
    return list;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function truncate(value, maxLength) {
    const textValue = String(value);
    if (textValue.length <= maxLength) return textValue;
    return `${textValue.slice(0, maxLength - 1)}…`;
  }

  function svgElement(tagName, attributes = {}) {
    const element = document.createElementNS(SVG_NS, tagName);
    Object.entries(attributes).forEach(([name, value]) => {
      element.setAttribute(name, String(value));
    });
    return element;
  }

  function appendSvgText(parent, className, x, y, value, maxLength) {
    const element = svgElement("text", { class: className, x, y });
    element.textContent = maxLength ? truncate(value, maxLength) : String(value);
    parent.appendChild(element);
    return element;
  }

  function appendEmpty(list, message) {
    appendSvgText(list, "mathmon-scoreboard-empty", 640, 506, message, 34);
  }

  function appendEntry(list, entry, myRank, totalQuestions, rowIndex) {
    const group = svgElement("g", { class: "mathmon-scoreboard-row" });
    const y = ROW_Y[rowIndex];
    if (entry.rank === myRank) {
      group.classList.add("is-mine");
      group.appendChild(svgElement("rect", {
        class: "mathmon-scoreboard-row-highlight",
        x: 190,
        y: y - ROW_HEIGHT / 2,
        width: 900,
        height: ROW_HEIGHT,
        rx: 17
      }));
    }

    appendSvgText(group, "mathmon-scoreboard-rank", 238, y, entry.rank);
    appendSvgText(group, "mathmon-scoreboard-name", 300, y, entry.nickname, 12);
    appendSvgText(group, "mathmon-scoreboard-score", 952, y, `${entry.score}점`);
    appendSvgText(group, "mathmon-scoreboard-correct", 1052, y, `${entry.correctCount}/${totalQuestions}`);

    list.appendChild(group);
  }

  function statusText(state) {
    if (!state.apiEnabled) return "선생님이 순위 기능을 켜면 전국 순위를 볼 수 있어요.";
    if (state.loading) return "기록을 보내고 순위를 불러오고 있어요.";
    if (state.error) return "순위를 불러오지 못했어요. 조금 뒤 다시 눌러요.";
    if (state.submission) return `${state.submission.nickname} 이름으로 기록했어요.`;
    if (state.session) return "이름이 정해졌어요. 결과를 보내면 순위가 보여요.";
    return "이름 정하는 중이에요.";
  }

  function emptyText(state) {
    if (!state.apiEnabled) return "순위 기능이 켜지면 여기에 10위까지 보여요.";
    if (state.loading) return "순위를 불러오고 있어요.";
    if (state.error) return "지금은 순위를 볼 수 없어요.";
    return "이번 주 기록이 아직 없어요.";
  }

  function getMaxOffset(entryCount) {
    return Math.max(0, entryCount - VISIBLE_ROWS);
  }

  function getOffset(root, entryCount) {
    const offset = Number.parseInt(root.dataset.scoreboardListOffset || "0", 10);
    return clamp(Number.isFinite(offset) ? offset : 0, 0, getMaxOffset(entryCount));
  }

  function setOffset(root, entryCount, offset) {
    root.dataset.scoreboardListOffset = String(clamp(offset, 0, getMaxOffset(entryCount)));
  }

  function installListControls(root) {
    if (root.dataset.scoreboardListControls === "ready") return;
    const viewport = root.querySelector("[data-scoreboard-list-viewport]");
    if (!viewport) return;
    root.dataset.scoreboardListControls = "ready";

    viewport.addEventListener("wheel", (event) => {
      const state = root.__mathmonScoreboardState;
      if (!state) return;
      const entryCount = state.entries.slice(0, 10).length;
      if (entryCount <= VISIBLE_ROWS) return;
      event.preventDefault();
      const direction = event.deltaY > 0 ? 1 : -1;
      setOffset(root, entryCount, getOffset(root, entryCount) + direction);
      render(state);
    }, { passive: false });

    let dragStartY = null;
    let dragStartOffset = 0;
    viewport.addEventListener("pointerdown", (event) => {
      const state = root.__mathmonScoreboardState;
      if (!state) return;
      const entryCount = state.entries.slice(0, 10).length;
      if (entryCount <= VISIBLE_ROWS) return;
      dragStartY = event.clientY;
      dragStartOffset = getOffset(root, entryCount);
      viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener("pointermove", (event) => {
      const state = root.__mathmonScoreboardState;
      if (!state || dragStartY === null) return;
      const entryCount = state.entries.slice(0, 10).length;
      const deltaRows = Math.round((dragStartY - event.clientY) / ROW_STEP);
      setOffset(root, entryCount, dragStartOffset + deltaRows);
      render(state);
    });
    viewport.addEventListener("pointerup", () => {
      dragStartY = null;
    });
    viewport.addEventListener("pointercancel", () => {
      dragStartY = null;
    });
  }

  function render(state) {
    const root = state.root;
    root.__mathmonScoreboardState = state;
    installListControls(root);
    if (new URLSearchParams(window.location.search).has("scoreboardDebug")) {
      root.dataset.layoutDebug = "true";
    }
    const entries = state.entries.slice(0, 10);
    const list = clearList(root);
    const myRank = state.myEntry ? state.myEntry.rank : null;
    const rankLabel = state.myEntry ? `${state.myEntry.rank}위` : state.submission ? "100위 밖" : "기록 전";

    text(root, "[data-scoreboard-status]", truncate(statusText(state), 34));
    text(root, "[data-scoreboard-nickname]", truncate(state.session ? state.session.nickname : "준비 중", 9));
    text(root, "[data-scoreboard-score]", String(state.score));
    text(root, "[data-scoreboard-rank]", rankLabel);
    text(root, "[data-scoreboard-week]", truncate(state.weekLabel, 12));

    const refresh = root.querySelector("[data-scoreboard-refresh]");
    if (refresh) refresh.disabled = state.loading || !state.apiEnabled;

    if (!list) return;
    if (!state.apiEnabled || state.loading || state.error || entries.length === 0) {
      setOffset(root, 0, 0);
      appendEmpty(list, emptyText(state));
      return;
    }

    const offset = getOffset(root, entries.length);
    setOffset(root, entries.length, offset);
    entries
      .slice(offset, offset + VISIBLE_ROWS)
      .forEach((entry, rowIndex) => appendEntry(list, entry, myRank, state.totalQuestions, rowIndex));
  }

  window.MathmonScoreboard = Object.freeze({ render });
})();

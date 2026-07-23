function renderProblemVisual(problem) {
      ui.visualArea.innerHTML = "";
      const visual = problem.visual || {};
      const wrapper = document.createElement("div");
      wrapper.className = "data-visual";
      if (visual.kind === "dataBoard") {
        const board = document.createElement("div");
        board.className = "data-board";
        if (visual.mode === "graph") board.classList.add("is-graph");
        const title = document.createElement("div");
        title.className = "data-board-title";
        title.textContent = visual.title || "자료판";
        board.append(title);
        const rows = document.createElement("div");
        rows.className = "data-rows";
        (visual.rows || []).forEach((row) => {
          const item = document.createElement("div");
          item.className = "data-row";
          const label = document.createElement("div");
          label.className = "data-label";
          label.textContent = row.label;
          const dots = document.createElement("div");
          dots.className = "data-dots";
          dots.style.setProperty("--dot-color", row.color || "#35d9b2");
          for (let index = 0; index < row.count; index += 1) {
            const dot = document.createElement("span");
            dot.className = "data-dot";
            dots.append(dot);
          }
          item.append(label, dots);
          rows.append(item);
        });
        board.append(rows);
        wrapper.append(board);
      }
      ui.visualArea.append(wrapper);
    }

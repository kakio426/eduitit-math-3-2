const screens = { cover: document.getElementById('screen-cover'), tutorial: document.getElementById('screen-tutorial'), play: document.getElementById('screen-play'), reward: document.getElementById('screen-reward'), result: document.getElementById('screen-result') };
    const ui = {
      stageShell: document.querySelector('.stage-shell'), startButton: document.getElementById('startButton'), tutorialTitle: document.getElementById('tutorialTitle'), tutorialCards: document.querySelector('.tutorial-cards'), tutorialStartButton: document.getElementById('tutorialStartButton'), settingsButton: document.getElementById('settingsButton'), settingsBackdrop: document.getElementById('settingsBackdrop'), settingsModal: document.getElementById('settingsModal'), settingsMenu: document.getElementById('settingsMenu'), settingsRestartConfirm: document.getElementById('settingsRestartConfirm'), settingsBgmToggle: document.getElementById('settingsBgmToggle'), settingsSfxToggle: document.getElementById('settingsSfxToggle'), settingsMethodButton: document.getElementById('settingsMethodButton'), settingsRestartButton: document.getElementById('settingsRestartButton'), settingsCloseButton: document.getElementById('settingsCloseButton'), settingsRestartConfirmButton: document.getElementById('settingsRestartConfirmButton'), settingsRestartCancelButton: document.getElementById('settingsRestartCancelButton'), problemCounter: document.getElementById('problemCounter'), runProgress: document.getElementById('runProgress'), runProgressText: document.getElementById('runProgressText'), problemKind: document.getElementById('problemKind'), problemTitle: document.getElementById('problemTitle'), visualArea: document.getElementById('visualArea'), stepChips: document.getElementById('stepChips'), stepInstruction: document.getElementById('stepInstruction'), answerSlot: document.getElementById('answerSlot'), feedbackLine: document.getElementById('feedbackLine'), choicesPanel: document.getElementById('choicesPanel'), completePanel: document.getElementById('completePanel'), completeExpression: document.getElementById('completeExpression'), rewardButton: document.getElementById('rewardButton'), rewardLiquid: document.getElementById('rewardLiquid'), rewardTitle: document.getElementById('rewardTitle'), rewardStageText: document.getElementById('rewardStageText'), rewardChange: document.getElementById('rewardChange'), rewardNextButton: document.getElementById('rewardNextButton'), resultBg: document.getElementById('resultBg'), resultTitleArt: document.getElementById('resultTitleArt'), resultCorrectArt: document.getElementById('resultCorrectArt'), resultTitle: document.getElementById('resultTitle'), resultSummary: document.getElementById('resultSummary'), resultNext: document.getElementById('resultNext'), retryButton: document.getElementById('retryButton')
    };
    const AUDIO_PREF_KEYS = Object.freeze({ bgm: 'mathmon-audio-bgm-enabled', sfx: 'mathmon-audio-sfx-enabled' });
    function loadAudioPreference(key) { try { const value = localStorage.getItem(key); return value === null ? true : value === 'true'; } catch { return true; } }
    function saveAudioPreference(key, enabled) { try { localStorage.setItem(key, String(enabled)); } catch {} }
    const params = new URLSearchParams(window.location.search); const seedParam = params.get('seed'); const seedFromUrl = Number(seedParam); const hasExplicitSeed = seedParam !== null && Number.isInteger(seedFromUrl);
    let state = createInitialState(createRunSeed());
    function createRunSeed() { if (hasExplicitSeed) return seedFromUrl; if (window.crypto && window.crypto.getRandomValues) { const values = new Uint32Array(1); window.crypto.getRandomValues(values); return values[0]; } return Math.floor((Date.now() + Math.random() * 0xffffffff) % 0xffffffff); }
    function createInitialState(seed) { return { screen: 'cover', seed, rng: {{MODEL_NAME}}.createRng((seed + 0x9e3779b9) >>> 0), problems: {{MODEL_NAME}}.generateRun(seed), problemIndex: 0, stepIndex: 0, mistakeTouched: false, power: 0, correctFirstTry: 0, specialSeen: false, latestReward: null, rewardAppliedProblemIndex: -1, rewardAdvancedProblemIndex: -1, tutorialPage: 0, tutorialReviewMode: false, reviewReturnScreen: 'cover', bgmEnabled: loadAudioPreference(AUDIO_PREF_KEYS.bgm), sfxEnabled: loadAudioPreference(AUDIO_PREF_KEYS.sfx), sfxLog: [] }; }
    function showScreen(name) { Object.values(screens).forEach(screen => screen.classList.remove('is-active')); screens[name].classList.add('is-active'); state.screen = name; ui.stageShell.dataset.activeScreen = name; }
    function setButtonDisabled(button, disabled) { button.disabled = disabled; button.setAttribute('aria-disabled', String(disabled)); }
    function currentProblem() { return state.problems[state.problemIndex]; }
    function currentStep() { return currentProblem().steps[state.stepIndex]; }
    function setDisplayText(element, text) { element.textContent = String(text).replace(/(\d+L) (\d+mL)/g, '$1 $2').replace(/(\d+kg) (\d+g)/g, '$1 $2').replace(/(\d+t) (\d+kg)/g, '$1 $2'); }
    function getCurrentResult() { return {{MODEL_NAME}}.getResult(state.power, state.correctFirstTry, state.specialSeen); }
    function renderProgress() { const result = getCurrentResult(); const percent = {{MODEL_NAME}}.clamp(state.power, 0, 100); ui.runProgress.style.width = percent + '%'; ui.runProgressText.textContent = result.name; }
    function renderProblem() { const problem = currentProblem(); state.stepIndex = 0; state.mistakeTouched = false; ui.problemCounter.textContent = String(state.problemIndex + 1) + '/10'; ui.problemKind.textContent = problem.kind; ui.problemTitle.textContent = problem.prompt; renderProblemVisual(problem); document.querySelector('.problem-grid').classList.remove('is-complete'); ui.completePanel.classList.remove('is-visible'); setButtonDisabled(ui.rewardButton, true); renderProgress(); renderStep(); showScreen('play'); }
    function renderStep() { const problem = currentProblem(); const step = currentStep(); ui.stepChips.innerHTML = ''; problem.steps.forEach((item, index) => { const chip = document.createElement('span'); chip.className = 'step-chip'; if (index < state.stepIndex) chip.classList.add('is-done'); if (index === state.stepIndex) chip.classList.add('is-current'); setDisplayText(chip, index < state.stepIndex ? String(index + 1) + ' ' + problem.steps[index].correct : String(index + 1) + ' ' + (index === state.stepIndex ? item.slot : '?')); ui.stepChips.append(chip); }); ui.stepInstruction.textContent = step.prompt; ui.answerSlot.textContent = '?'; ui.answerSlot.classList.remove('is-filled'); ui.feedbackLine.textContent = ''; ui.feedbackLine.className = 'feedback-line'; ui.choicesPanel.innerHTML = ''; step.choices.forEach(choice => { const button = document.createElement('button'); button.className = 'choice-button'; button.type = 'button'; setDisplayText(button, choice); button.dataset.choice = choice; button.dataset.correct = String({{MODEL_NAME}}.validateChoice(step, choice)); button.addEventListener('click', () => handleChoice(button, choice)); ui.choicesPanel.append(button); }); }
    function setChoicesDisabled(disabled) { ui.choicesPanel.querySelectorAll('button').forEach(button => { button.disabled = disabled; }); }
    function playSample(cue) { if (!state.sfxEnabled) return; state.sfxLog.push(cue); if (state.sfxLog.length > 80) state.sfxLog.shift(); }
    function handleChoice(button, choice) { const step = currentStep(); const correct = {{MODEL_NAME}}.validateChoice(step, choice); if (!correct) { state.mistakeTouched = true; button.classList.add('is-wrong'); button.disabled = true; ui.feedbackLine.textContent = '다시 골라요.'; ui.feedbackLine.className = 'feedback-line is-wrong'; playSample('wrong'); return; } setChoicesDisabled(true); button.classList.add('is-correct'); setDisplayText(ui.answerSlot, choice); ui.answerSlot.classList.add('is-filled'); setDisplayText(ui.feedbackLine, step.confirm); ui.feedbackLine.className = 'feedback-line is-good'; playSample('correct'); const isLastStep = state.stepIndex === currentProblem().steps.length - 1; if (isLastStep) { window.setTimeout(showCompletePanel, 560); return; } window.setTimeout(() => { state.stepIndex += 1; renderStep(); }, 980); }
    function showCompletePanel() { const problem = currentProblem(); setDisplayText(ui.completeExpression, problem.expression); document.querySelector('.problem-grid').classList.add('is-complete'); ui.completePanel.classList.add('is-visible'); setButtonDisabled(ui.rewardButton, false); ui.rewardButton.focus({ preventScroll: true }); }
    function formatRewardMessage(movement) { if (movement <= 2) return LESSON_CONFIG.rewardSmall; if (movement >= 28) return LESSON_CONFIG.rewardBig; return LESSON_CONFIG.rewardComplete; }
    function showReward() { const canShow = screens.play.classList.contains('is-active') && ui.completePanel.classList.contains('is-visible') && state.rewardAppliedProblemIndex !== state.problemIndex; if (!canShow) return; state.rewardAppliedProblemIndex = state.problemIndex; setButtonDisabled(ui.rewardButton, true); const firstTry = !state.mistakeTouched; const event = {{MODEL_NAME}}.pickRewardEvent(state.rng, state.mistakeTouched); const result = {{MODEL_NAME}}.applyReward({ power: state.power, correctFirstTry: state.correctFirstTry, specialSeen: state.specialSeen }, event, firstTry); state.power = result.power; state.correctFirstTry = result.correctFirstTry; state.specialSeen = result.specialSeen; state.latestReward = result; const current = getCurrentResult(); ui.rewardTitle.textContent = event.text; ui.rewardStageText.textContent = current.name; ui.rewardChange.textContent = formatRewardMessage(result.power - result.before); ui.rewardLiquid.style.setProperty('--fill', {{MODEL_NAME}}.clamp(state.power, 0, 100) + '%'); ui.rewardNextButton.textContent = state.problemIndex === state.problems.length - 1 ? '보기' : '다음'; setButtonDisabled(ui.rewardNextButton, false); playSample('reward'); showScreen('reward'); }
    function advanceAfterReward() { const canAdvance = screens.reward.classList.contains('is-active') && state.latestReward && state.rewardAppliedProblemIndex === state.problemIndex && state.rewardAdvancedProblemIndex !== state.problemIndex; if (!canAdvance) return; state.rewardAdvancedProblemIndex = state.problemIndex; setButtonDisabled(ui.rewardNextButton, true); if (state.problemIndex === state.problems.length - 1) { showResult(); return; } state.problemIndex += 1; renderProblem(); }
    function getResultCorrectArtSrc(correctCount) {
      const total = typeof TOTAL_QUESTIONS === "number" ? TOTAL_QUESTIONS : (typeof TOTAL_PROBLEMS === "number" ? TOTAL_PROBLEMS : 10);
      const value = Math.max(0, Math.min(total, Math.round(Number(correctCount) || 0)));
      return `../_shared/result-count/result-correct-${value}-generated.webp`;
    }

    function showResult() { const result = {{MODEL_NAME}}.getResult(state.power, state.correctFirstTry, state.specialSeen); const next = {{MODEL_NAME}}.getNextResult(result); screens.result.dataset.resultTier = result.id; ui.resultBg.src = result.image; ui.resultTitleArt.src = result.titleImage; ui.resultTitle.textContent = result.name; ui.resultCorrectArt.src = getResultCorrectArtSrc(state.correctFirstTry); ui.resultSummary.textContent = '정답 ' + state.correctFirstTry + '/10'; ui.resultNext.textContent = result.id === next.id ? '최고 결과예요. 다시 해 볼까요?' : '다음엔 ' + next.name; playSample('result'); showScreen('result'); }
    function startGame() { state = createInitialState(createRunSeed()); syncSettingsUi(); renderProblem(); }
    function syncSettingsUi() { ui.settingsBgmToggle.setAttribute('aria-checked', String(state.bgmEnabled)); ui.settingsSfxToggle.setAttribute('aria-checked', String(state.sfxEnabled)); ui.settingsButton.setAttribute('aria-expanded', String(!ui.settingsBackdrop.hidden)); }
    function setBgmEnabled(enabled) { state.bgmEnabled = enabled; saveAudioPreference(AUDIO_PREF_KEYS.bgm, enabled); syncSettingsUi(); }
    function setSfxEnabled(enabled) { state.sfxEnabled = enabled; saveAudioPreference(AUDIO_PREF_KEYS.sfx, enabled); syncSettingsUi(); }
    function getFocusableSettings() { return Array.from(ui.settingsModal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')).filter(element => !element.disabled && !element.hidden && element.offsetParent !== null); }
    function setRestartConfirm(confirming) { ui.settingsMenu.hidden = confirming; ui.settingsRestartConfirm.hidden = !confirming; window.requestAnimationFrame(() => (confirming ? ui.settingsRestartCancelButton : ui.settingsBgmToggle).focus()); }
    function openSettings() { ui.settingsBackdrop.hidden = false; setRestartConfirm(false); syncSettingsUi(); window.requestAnimationFrame(() => ui.settingsBgmToggle.focus()); }
    function closeSettings(options = {}) { ui.settingsBackdrop.hidden = true; setRestartConfirm(false); syncSettingsUi(); if (options.restoreFocus !== false) ui.settingsButton.focus(); }
    function handleSettingsKeydown(event) { if (event.key === 'Escape') { closeSettings(); return; } if (event.key !== 'Tab') return; const focusable = getFocusableSettings(); if (!focusable.length) return; const first = focusable[0]; const last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
    function getTutorialPage(page) {
      if (page === 0) return { title: LESSON_CONFIG.tutorialTitle, button: '다음', cards: LESSON_CONFIG.tutorialCards };
      const topResult = LESSON_CONFIG.results[LESSON_CONFIG.results.length - 1].name;
      return { title: LESSON_CONFIG.rewardScreenTitle + '도 봐요', button: LESSON_CONFIG.tutorialButton, cards: [['1', '문제를 맞히면 힘이 올라요.', LESSON_CONFIG.rewardComplete], ['2', '가끔 더 크게 올라요.', '운이 좋으면 한 번에 쑥 올라요.'], ['3', topResult + '까지 도전해요.', '마지막에 오늘 결과를 봐요.']] };
    }
    function renderTutorialPage(page) {
      state.tutorialPage = page;
      const view = getTutorialPage(page);
      ui.tutorialTitle.textContent = view.title;
      ui.tutorialStartButton.textContent = view.button;
      ui.tutorialCards.innerHTML = '';
      view.cards.forEach(card => {
        const item = document.createElement('div');
        item.className = 'tutorial-card';
        const mark = document.createElement('div');
        mark.className = 'card-mark';
        mark.textContent = card[0];
        const title = document.createElement('strong');
        title.textContent = card[1];
        const body = document.createElement('p');
        body.textContent = card[2];
        item.append(mark, title, body);
        ui.tutorialCards.append(item);
      });
    }
    function openTutorial(reviewMode) {
      state.tutorialReviewMode = Boolean(reviewMode);
      renderTutorialPage(0);
      if (state.tutorialReviewMode) ui.tutorialStartButton.textContent = '계속하기';
      showScreen('tutorial');
    }
    function reviewTutorial() { state.reviewReturnScreen = state.screen || 'cover'; closeSettings({ restoreFocus: false }); openTutorial(true); }
    function continueAfterTutorial() { if (state.tutorialReviewMode) { state.tutorialReviewMode = false; showScreen(state.reviewReturnScreen || 'cover'); return; } if (state.tutorialPage === 0) { renderTutorialPage(1); return; } startGame(); }
    function restartFromSettings() { closeSettings({ restoreFocus: false }); state = createInitialState(createRunSeed()); showScreen('cover'); }
    ui.startButton.addEventListener('click', () => openTutorial(false));
    ui.tutorialStartButton.addEventListener('click', continueAfterTutorial);
    ui.rewardButton.addEventListener('click', showReward);
    ui.rewardNextButton.addEventListener('click', advanceAfterReward);
    ui.retryButton.addEventListener('click', startGame);
    ui.settingsButton.addEventListener('click', openSettings);
    ui.settingsBackdrop.addEventListener('click', event => { if (event.target === ui.settingsBackdrop) closeSettings(); });
    ui.settingsModal.addEventListener('keydown', handleSettingsKeydown);
    ui.settingsBgmToggle.addEventListener('click', () => setBgmEnabled(!state.bgmEnabled));
    ui.settingsSfxToggle.addEventListener('click', () => setSfxEnabled(!state.sfxEnabled));
    ui.settingsMethodButton.addEventListener('click', reviewTutorial);
    ui.settingsRestartButton.addEventListener('click', () => setRestartConfirm(true));
    ui.settingsRestartConfirmButton.addEventListener('click', restartFromSettings);
    ui.settingsRestartCancelButton.addEventListener('click', () => setRestartConfirm(false));
    ui.settingsCloseButton.addEventListener('click', () => closeSettings());
    window.__mathmonAudioQa = { getPrefs: () => ({ bgmEnabled: state.bgmEnabled, sfxEnabled: state.sfxEnabled, settingsOpen: !ui.settingsBackdrop.hidden }), setPrefs: prefs => { if (typeof prefs.bgmEnabled === 'boolean') setBgmEnabled(prefs.bgmEnabled); if (typeof prefs.sfxEnabled === 'boolean') setSfxEnabled(prefs.sfxEnabled); }, getLog: () => state.sfxLog.slice(), clearLog: () => { state.sfxLog = []; } };

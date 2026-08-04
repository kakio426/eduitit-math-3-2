(function installMathmonAudio(global) {
  "use strict";

  if (global.MathmonAudio?.version === "mathmon-audio-v1") return;

  const VERSION = "mathmon-audio-v1";
  const PREF_KEYS = Object.freeze({
    bgm: "mathmon-audio-bgm-enabled",
    sfx: "mathmon-audio-sfx-enabled",
  });
  const currentScript = document.currentScript;
  const scriptUrl = currentScript?.dataset.mathmonAudioBase
    ? new URL(currentScript.dataset.mathmonAudioBase, global.location.href).href
    : currentScript?.src || new URL("../_shared/audio/", global.location.href).href;
  const BGM_TRACK = Object.freeze({
    src: new URL(
      "music/tallbeard/sketchbook-2025-11-26/sketchbook-2025-11-26.ogg?v=20260803-audio-v1",
      scriptUrl,
    ).href,
    gain: 0.025,
    duckGain: 0.008,
    fadeSeconds: 1.2,
  });
  const SFX_PLANS = Object.freeze({
    start: Object.freeze([260, 330, 392]),
    correct: Object.freeze([392, 494, 659]),
    try: Object.freeze([220, 196]),
    reward: Object.freeze([392, 523, 784]),
    next: Object.freeze([330, 392]),
    scan: Object.freeze([180, 240, 300]),
    measure: Object.freeze([330, 440, 554]),
    finish: Object.freeze([392, 523, 659, 784]),
  });
  const DUCK_SECONDS = Object.freeze({
    correct: 0.6,
    reward: 1.1,
    scan: 0.8,
    measure: 0.8,
    finish: 1.35,
  });
  const CUE_ALIASES = Object.freeze({
    start: "start",
    uiStart: "start",
    correct: "correct",
    success: "correct",
    "step-correct": "correct",
    answerCorrect: "correct",
    "problem-complete": "correct",
    try: "try",
    error: "try",
    wrong: "try",
    "step-wrong": "try",
    answerWrongSoft: "try",
    fuelLoss: "try",
    reward: "reward",
    "reward-open": "reward",
    "reward-rare": "reward",
    "reward-legend": "reward",
    rewardPositive: "reward",
    rewardMega: "reward",
    rewardRainbow: "reward",
    rewardLaunch: "reward",
    fuelPositive: "reward",
    fuelMega: "reward",
    fuelRainbow: "reward",
    fuelLaunch: "reward",
    rewardTransfer: "measure",
    measure: "measure",
    scan: "scan",
    measureScan: "scan",
    next: "next",
    uiNext: "next",
    fuelEmpty: "next",
    rewardEmpty: "next",
    scoreboard: "next",
    finish: "finish",
    result: "finish",
    resultLow: "finish",
    resultMid: "finish",
    resultHigh: "finish",
    resultRare: "finish",
  });

  const state = {
    bgmEnabled: readPreference(PREF_KEYS.bgm, true),
    sfxEnabled: readPreference(PREF_KEYS.sfx, true),
    context: null,
    bgmGain: null,
    bgmBuffer: null,
    bgmBufferPromise: null,
    bgmSource: null,
    bgmStartCount: 0,
    bgmStopCount: 0,
    unlocked: false,
    sfxLog: [],
    legacyQa: null,
    controlsBound: false,
  };

  writePreference(PREF_KEYS.bgm, state.bgmEnabled);
  writePreference(PREF_KEYS.sfx, state.sfxEnabled);

  function parsePreference(value, fallback) {
    if (value == null) return fallback;
    if (value === true || value === "true" || value === "on" || value === "1") return true;
    if (value === false || value === "false" || value === "off" || value === "0") return false;
    return fallback;
  }

  function readPreference(key, fallback) {
    try {
      return parsePreference(global.localStorage.getItem(key), fallback);
    } catch (error) {
      return fallback;
    }
  }

  function writePreference(key, enabled) {
    try {
      global.localStorage.setItem(key, String(Boolean(enabled)));
    } catch (error) {
      // Some embedded browsers block localStorage. Audio still works for this session.
    }
  }

  function ensureContext() {
    if (state.context) return state.context;
    const AudioContext = global.AudioContext || global.webkitAudioContext;
    if (!AudioContext) return null;
    state.context = new AudioContext();
    state.bgmGain = state.context.createGain();
    state.bgmGain.gain.value = 0.0001;
    state.bgmGain.connect(state.context.destination);
    return state.context;
  }

  async function unlock() {
    const context = ensureContext();
    if (!context) return false;
    if (context.state === "suspended") {
      try {
        await context.resume();
      } catch (error) {
        return false;
      }
    }
    state.unlocked = context.state === "running";
    return state.unlocked;
  }

  function holdAudioParam(param, time) {
    if (typeof param.cancelAndHoldAtTime === "function") {
      param.cancelAndHoldAtTime(time);
      return;
    }
    const value = Math.max(0.0001, Number(param.value) || 0.0001);
    param.cancelScheduledValues(time);
    param.setValueAtTime(value, time);
  }

  function loadBgmBuffer() {
    if (state.bgmBuffer) return Promise.resolve(state.bgmBuffer);
    if (state.bgmBufferPromise) return state.bgmBufferPromise;
    const context = ensureContext();
    if (!context) return Promise.resolve(null);
    state.bgmBufferPromise = fetch(BGM_TRACK.src)
      .then((response) => {
        if (!response.ok) throw new Error(`BGM load failed: ${response.status}`);
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((buffer) => {
        state.bgmBuffer = buffer;
        return buffer;
      })
      .catch((error) => {
        console.warn("Background music could not be loaded.", error);
        state.bgmBufferPromise = null;
        return null;
      });
    return state.bgmBufferPromise;
  }

  async function startBgm() {
    if (!state.bgmEnabled || document.hidden || state.bgmSource) return false;
    if (!(await unlock())) return false;
    const buffer = await loadBgmBuffer();
    if (!buffer || !state.bgmEnabled || document.hidden || state.bgmSource) return false;
    const source = state.context.createBufferSource();
    const now = state.context.currentTime;
    source.buffer = buffer;
    source.loop = true;
    source.connect(state.bgmGain);
    holdAudioParam(state.bgmGain.gain, now);
    state.bgmGain.gain.exponentialRampToValueAtTime(BGM_TRACK.gain, now + BGM_TRACK.fadeSeconds);
    source.onended = () => {
      if (state.bgmSource === source) state.bgmSource = null;
    };
    state.bgmSource = source;
    state.bgmStartCount += 1;
    source.start(now);
    return true;
  }

  function stopBgm(options = {}) {
    const immediate = Boolean(options.immediate);
    const source = state.bgmSource;
    if (!source || !state.context || !state.bgmGain) return false;
    state.bgmSource = null;
    state.bgmStopCount += 1;
    const now = state.context.currentTime;
    if (immediate) {
      try {
        source.stop(now);
      } catch (error) {
        // The source may already have ended.
      }
      state.bgmGain.gain.cancelScheduledValues(now);
      state.bgmGain.gain.setValueAtTime(0.0001, now);
      return true;
    }
    holdAudioParam(state.bgmGain.gain, now);
    state.bgmGain.gain.exponentialRampToValueAtTime(0.0001, now + BGM_TRACK.fadeSeconds);
    try {
      source.stop(now + BGM_TRACK.fadeSeconds + 0.05);
    } catch (error) {
      // The source may already have ended.
    }
    return true;
  }

  function duckBgm(seconds) {
    if (!state.bgmSource || !state.context || !state.bgmGain) return;
    const now = state.context.currentTime;
    holdAudioParam(state.bgmGain.gain, now);
    state.bgmGain.gain.exponentialRampToValueAtTime(BGM_TRACK.duckGain, now + 0.08);
    state.bgmGain.gain.exponentialRampToValueAtTime(BGM_TRACK.gain, now + Math.max(0.12, Number(seconds) || 0.6));
  }

  function normalizeCue(cue) {
    return CUE_ALIASES[cue] || (SFX_PLANS[cue] ? cue : "next");
  }

  async function play(cue = "next") {
    if (!state.sfxEnabled) return false;
    if (!(await unlock())) return false;
    const normalizedCue = normalizeCue(cue);
    const duckSeconds = DUCK_SECONDS[normalizedCue];
    if (duckSeconds) duckBgm(duckSeconds);
    const now = state.context.currentTime;
    SFX_PLANS[normalizedCue].forEach((frequency, index) => {
      const at = now + index * 0.08;
      const oscillator = state.context.createOscillator();
      const gain = state.context.createGain();
      oscillator.frequency.value = frequency;
      oscillator.type = normalizedCue === "try" ? "triangle" : "sine";
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.045, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
      oscillator.connect(gain).connect(state.context.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.18);
    });
    state.sfxLog.push(String(cue));
    if (state.sfxLog.length > 80) state.sfxLog.shift();
    return true;
  }

  function syncControls() {
    const bgmToggle = document.getElementById("settingsBgmToggle");
    const sfxToggle = document.getElementById("settingsSfxToggle");
    if (bgmToggle) bgmToggle.setAttribute("aria-checked", String(state.bgmEnabled));
    if (sfxToggle) sfxToggle.setAttribute("aria-checked", String(state.sfxEnabled));
  }

  function setPreference(kind, enabled, options = {}) {
    const value = Boolean(enabled);
    if (kind === "bgm") {
      state.bgmEnabled = value;
      writePreference(PREF_KEYS.bgm, value);
      if (value && options.start !== false) startBgm();
      if (!value) stopBgm({ immediate: true });
    } else if (kind === "sfx") {
      state.sfxEnabled = value;
      writePreference(PREF_KEYS.sfx, value);
    }
    if (options.syncControls !== false) syncControls();
  }

  function setPrefs(prefs = {}, options = {}) {
    if (typeof prefs.bgmEnabled === "boolean") {
      setPreference("bgm", prefs.bgmEnabled, options);
    }
    if (typeof prefs.sfxEnabled === "boolean") {
      setPreference("sfx", prefs.sfxEnabled, options);
    }
    return getPrefs();
  }

  function activeScreenName() {
    const screen = document.querySelector(".screen.is-active, [data-screen].is-active");
    return screen?.dataset.screen || screen?.id || "";
  }

  function getPrefs() {
    const settingsBackdrop = document.getElementById("settingsBackdrop");
    return {
      version: VERSION,
      bgmEnabled: state.bgmEnabled,
      sfxEnabled: state.sfxEnabled,
      bgmPlaying: Boolean(state.bgmSource),
      bgmLoaded: Boolean(state.bgmBuffer),
      bgmDuration: state.bgmBuffer?.duration || 0,
      bgmTrack: BGM_TRACK.src,
      bgmStartCount: state.bgmStartCount,
      bgmStopCount: state.bgmStopCount,
      settingsOpen: Boolean(settingsBackdrop && !settingsBackdrop.hidden),
      screen: activeScreenName(),
    };
  }

  function setLegacyPrefs(prefs) {
    const legacy = state.legacyQa;
    if (legacy && typeof legacy.setPrefs === "function") {
      try {
        legacy.setPrefs(prefs);
        return;
      } catch (error) {
        console.warn("Lesson audio settings could not be synchronized.", error);
      }
    }
    const pairs = [
      ["bgmEnabled", "settingsBgmToggle"],
      ["sfxEnabled", "settingsSfxToggle"],
    ];
    pairs.forEach(([key, id]) => {
      if (typeof prefs[key] !== "boolean") return;
      const toggle = document.getElementById(id);
      if (!toggle) return;
      const current = toggle.getAttribute("aria-checked") === "true";
      if (current !== prefs[key]) toggle.click();
    });
  }

  function installQaHook() {
    state.legacyQa = global.__mathmonAudioQa || null;
    global.__mathmonAudioQa = {
      version: VERSION,
      keys: PREF_KEYS,
      cues: SFX_PLANS,
      getLog: () => [...state.sfxLog],
      clearLog: () => {
        state.sfxLog = [];
      },
      getPrefs,
      setPrefs: (prefs = {}) => {
        setLegacyPrefs(prefs);
        return setPrefs(prefs);
      },
      play,
      startBgm,
      stopBgm,
    };
  }

  function bindControls() {
    if (state.controlsBound) return;
    state.controlsBound = true;
    document.querySelector("main.game")?.setAttribute("data-audio-standard", VERSION);
    syncControls();
    const bgmToggle = document.getElementById("settingsBgmToggle");
    const sfxToggle = document.getElementById("settingsSfxToggle");
    bgmToggle?.addEventListener("click", () => {
      const enabled = bgmToggle.getAttribute("aria-checked") === "true";
      setPreference("bgm", enabled);
    });
    sfxToggle?.addEventListener("click", () => {
      const enabled = sfxToggle.getAttribute("aria-checked") === "true";
      setPreference("sfx", enabled);
    });
    installQaHook();
  }

  function handleFirstInteraction() {
    unlock().then(() => {
      if (state.bgmEnabled) startBgm();
    });
  }

  document.addEventListener("pointerdown", handleFirstInteraction, { capture: true, once: true });
  document.addEventListener("keydown", handleFirstInteraction, { capture: true, once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopBgm({ immediate: true });
    else if (state.bgmEnabled && state.unlocked) startBgm();
  });
  global.addEventListener("pagehide", () => stopBgm({ immediate: true }));

  global.MathmonAudio = Object.freeze({
    version: VERSION,
    keys: PREF_KEYS,
    track: BGM_TRACK,
    plans: SFX_PLANS,
    play,
    unlock,
    startBgm,
    stopBgm,
    duckBgm,
    getPrefs,
    setPrefs,
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindControls, { once: true });
  } else {
    bindControls();
  }
})(window);

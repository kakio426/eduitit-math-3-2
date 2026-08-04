#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const lesson = process.argv[2];
if (!lesson) {
  console.error("Usage: node scripts/sync-lesson-report-evidence.mjs <lesson-folder>");
  process.exit(1);
}

const lessonDir = path.join(ROOT, lesson);
const reportPath = path.join(lessonDir, "REPORT.md");
const manifestPath = path.join(lessonDir, "screenshots", "report-evidence-manifest.json");
const report = await readFile(reportPath, "utf8");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const config = JSON.parse(await readFile(path.join(ROOT, "_lessons", lesson, "lesson.json"), "utf8"));
const startMarker = "<!-- REPORT-EVIDENCE-ALL:START -->";
const endMarker = "<!-- REPORT-EVIDENCE-ALL:END -->";

function stateId(screenshotPath, viewportName) {
  return path.basename(screenshotPath)
    .replace(`engine-flow-${viewportName}-`, "")
    .replace(/\.png$/u, "");
}

function tierName(id) {
  return ({
    log: "외나무다리",
    small: "작은 다리",
    bridge: "튼튼한 다리",
    big: "큰 다리",
    grand: "황금 다리",
    rainbow: "무지개 다리",
  })[id] || id;
}

function misconceptionName(state) {
  const phase = state.match(/05m-p(\d)-/u)?.[1] || "?";
  const kind = state.replace(/^05m-p\d-/u, "");
  const label = ({
    "diameter-not-doubled": "반지름을 두 배 하지 않은 오답",
    "diameter-one-short": "지름보다 1 cm 짧은 오답",
    "diameter-too-long": "지름보다 긴 오답",
    "radius-not-halved": "지름을 반으로 나누지 않은 오답",
    "radius-too-long": "반지름보다 긴 오답",
    "radius-too-short": "반지름보다 짧은 오답",
  })[kind] || kind;
  return `${phase}번 문제 유형 · ${label}`;
}

function describe(state) {
  if (state === "01-cover") return {
    title: "시작 화면",
    seeing: "수달몬과 계곡 다리, 게임 제목, 한 줄 목표, 시작 버튼을 봅니다.",
    action: "게임을 시작할 준비가 되면 시작을 누릅니다.",
    math: "반지름 두 개를 이으면 지름이 된다는 배움 방향을 먼저 확인합니다.",
    next: "다리를 잇는 방법을 확인하는 설명 화면으로 이동합니다.",
  };
  if (state === "02-settings") return {
    title: "설정 화면",
    seeing: "배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.",
    action: "필요한 소리나 이동 행동 하나를 고릅니다.",
    math: "수학 문제는 바꾸지 않고 게임 조작만 설정합니다.",
    next: "설정을 마치면 열기 전 화면으로 돌아갑니다.",
  };
  if (state === "03-tutorial-1") return {
    title: "설명 1 · 풀이 방법",
    seeing: "두 반지름을 이어 하나의 지름을 만드는 예를 봅니다.",
    action: "반지름 두 개가 지름 하나가 되는 모습을 확인하고 다음을 누릅니다.",
    math: "반지름 + 반지름 = 지름 관계를 확인합니다.",
    next: "문제 수와 다리 목표를 보는 설명 2로 이동합니다.",
  };
  if (state === "04-tutorial-2") return {
    title: "설명 2 · 보상과 목표",
    seeing: "10문제와 여섯 다리 단계, 마지막 결과 흐름을 봅니다.",
    action: "게임 목표를 확인하고 문제 시작을 누릅니다.",
    math: "문제에서 고른 길이가 다리 단계 변화로 이어짐을 확인합니다.",
    next: "첫 번째 반지름·지름 문제로 이동합니다.",
  };
  if (state === "05-play-step1") return {
    title: "문제 대기",
    seeing: "왼쪽 현재 다리와 오른쪽 원의 길이 관계, 네 선택지를 봅니다.",
    action: "주어진 지름 또는 반지름에 맞는 길이 하나를 고릅니다.",
    math: "지름은 반지름의 두 배이고 반지름은 지름의 반임을 판단합니다.",
    next: "고른 길이에 따라 오답 또는 정답 확인 상태로 이동합니다.",
  };
  if (state === "05c-correct-effect") return {
    title: "정답 선택 효과",
    seeing: "고른 정답이 원과 길이 그림에 들어가는 짧은 효과를 봅니다.",
    action: "별도 입력 없이 자신이 고른 길이가 적용되는 모습을 확인합니다.",
    math: "선택한 길이가 반지름·지름 관계를 정확히 완성합니다.",
    next: "완성식과 점수 보기 버튼이 있는 정답 확인으로 이어집니다.",
  };
  if (state.startsWith("05m-")) return {
    title: misconceptionName(state),
    seeing: "고른 길이와 목표 길이가 맞지 않는 원 그림과 오답 표시를 봅니다.",
    action: "길이가 짧은지, 긴지, 두 배나 반으로 계산하지 않았는지 확인합니다.",
    math: "반지름 두 개의 합 또는 지름의 반과 고른 길이가 같지 않음을 확인합니다.",
    next: "같은 문제에서 다른 길이를 다시 고릅니다.",
  };
  if (state === "05b-play-wrong") return {
    title: "대표 오답",
    seeing: "고른 길이와 정답 길이의 차이, 완성되지 않은 관계를 봅니다.",
    action: "오답 이유를 그림으로 확인하고 다른 선택지를 고릅니다.",
    math: "두 반지름의 합이나 지름의 반과 고른 길이가 같지 않음을 봅니다.",
    next: "관계가 맞을 때까지 같은 문제에서 다시 판단합니다.",
  };
  if (state === "06-confirm") return {
    title: "정답 확인",
    seeing: "원 안에 들어간 정답 길이와 완성식, 점수 보기 버튼을 봅니다.",
    action: "완성된 관계를 읽은 뒤 점수 보기를 누릅니다.",
    math: "반지름 + 반지름 = 지름 또는 지름 ÷ 2 = 반지름을 확인합니다.",
    next: "수학 관계를 확인한 뒤 닫힌 보상으로 이동합니다.",
  };
  if (state === "07-reward-closed") return {
    title: "닫힌 보상",
    seeing: "결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.",
    action: "이번 점수를 확인하기 위해 열기를 누릅니다.",
    math: "뒤 문제 화면에는 방금 완성한 반지름·지름 관계가 그대로 남습니다.",
    next: "학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.",
  };
  if (state === "07b-reward-open") return {
    title: "열린 보상",
    seeing: "보상 사건 그림과 이번 점수 변화, 다음 버튼을 봅니다.",
    action: "이번 변화를 확인하고 다음을 누릅니다.",
    math: "정답 계산과 무작위 점수가 서로 분리되어 있음을 확인합니다.",
    next: "모달을 먼저 닫고 다리 세계의 실제 변화를 보여 줍니다.",
  };
  if (state === "07c-reward-impact") return {
    title: "모달 종료 뒤 다리 변화",
    seeing: "모달이 닫힌 뒤 왼쪽 다리가 바뀌고 Stage에 번지는 빛 효과를 봅니다.",
    action: "별도 입력 없이 이번 보상이 다리 단계를 바꾸는 모습을 확인합니다.",
    math: "한 문제의 보상이 현재 다리 단계에 정확히 한 번 반영됩니다.",
    next: "효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.",
  };
  if (state === "08-result") return {
    title: "실제 결과",
    seeing: "완성한 다리와 수달몬, 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.",
    action: "현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.",
    math: "10문제의 정답 수와 누적 보상이 하나의 다리 단계로 정리됩니다.",
    next: "다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.",
  };
  const resultMatch = state.match(/^08([cde])-result-(?:cohesion-|panel-|reward-dominance-)(.+)$/u);
  if (resultMatch) {
    const audit = ({ c: "결과 결속", d: "결과판 포함", e: "다리 보상 우선" })[resultMatch[1]];
    const tier = tierName(resultMatch[2]);
    return {
      title: `${audit} · ${tier}`,
      seeing: `${tier} 완성 장면과 결과판 안의 결과 이름·정답 수·다시 버튼을 봅니다.`,
      action: "결과 요소가 한 결과판 안에 모이고 다리가 주인공으로 보이는지 확인합니다.",
      math: "같은 정답·보상 기준이 해당 다리 단계 장면으로 연결됩니다.",
      next: "이 화면은 결과 단계별 레이아웃 회귀 증거로 남습니다.",
    };
  }
  return {
    title: state,
    seeing: "현재 게임 상태의 모든 보이는 요소를 확인합니다.",
    action: "이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.",
    math: "반지름과 지름의 관계가 화면 상태에 맞게 유지되는지 확인합니다.",
    next: "정해진 게임 흐름의 다음 상태로 이동합니다.",
  };
}

function genericStateTitle(state) {
  if (state === "01-cover") return "시작 화면";
  if (state === "02-settings") return "설정 화면";
  if (state === "03-tutorial-1") return "설명 1 · 풀이 방법";
  if (state === "04-tutorial-2") return "설명 2 · 보상과 목표";
  if (state.startsWith("05m-")) return `오개념 확인 · ${state.replace(/^05m-/u, "")}`;
  if (/wrong|too-low|too-high|missing|over|under/u.test(state)) return `오답 확인 · ${state}`;
  if (/confirm|correct|complete/u.test(state) && state.startsWith("05")) return `정답 확인 · ${state}`;
  if (state.startsWith("05")) return `문제 상태 · ${state}`;
  if (state.startsWith("06")) return `마지막 확인 · ${state}`;
  if (state === "07-reward-closed" || state === "07d-final-reward-closed") return "닫힌 보상";
  if (state === "07b-reward-open" || state === "07e-final-reward-open" || state === "07-reward-immediate") return "열린 보상";
  if (state.startsWith("07c-")) return `보상 뒤 변화 · ${state}`;
  if (state.startsWith("07")) return `보상 상태 · ${state}`;
  if (state === "08-result") return "실제 결과";
  if (state.startsWith("08a-")) return `결과 단계 · ${state.replace(/^08a-result-/u, "")}`;
  if (state.startsWith("08c-")) return `결과 결속 · ${state.replace(/^08c-result-cohesion-/u, "")}`;
  if (state.startsWith("08d-")) return `결과판 포함 · ${state.replace(/^08d-result-panel-/u, "")}`;
  if (state.startsWith("08e-")) return `중심 보상 우선 · ${state.replace(/^08e-result-reward-dominance-/u, "")}`;
  if (state.startsWith("08")) return `결과 상태 · ${state}`;
  return state;
}

function describeGeneric(state) {
  const lessonTitle = config.shortTitle || config.title || lesson;
  const mathTopic = config.topic || config.goal || "현재 차시의 수학 관계";
  const rewardUnit = config.reward?.unitLabel || config.progressLabel || "점수";
  const title = genericStateTitle(state);
  if (state === "01-cover") return {
    title,
    seeing: `${lessonTitle} 제목과 한 줄 목표, 시작 버튼을 봅니다.`,
    action: "게임을 시작할 준비가 되면 시작을 누릅니다.",
    math: `${mathTopic}을 배우는 차시임을 확인합니다.`,
    next: "문제를 푸는 방법을 보는 설명 화면으로 이동합니다.",
  };
  if (state === "02-settings") return {
    title,
    seeing: "배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.",
    action: "필요한 소리나 이동 행동 하나를 고릅니다.",
    math: "수학 문제는 바꾸지 않고 게임 조작만 설정합니다.",
    next: "설정을 마치면 열기 전 화면으로 돌아갑니다.",
  };
  if (state === "03-tutorial-1" || state === "04-tutorial-2") return {
    title,
    seeing: `${mathTopic} 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.`,
    action: "그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.",
    math: `${mathTopic}에서 무엇을 비교하거나 계산하는지 확인합니다.`,
    next: state === "03-tutorial-1" ? "다음 설명으로 이동합니다." : "첫 문제로 이동합니다.",
  };
  if (state.startsWith("05m-") || /wrong|too-low|too-high|missing|over|under/u.test(state)) return {
    title,
    seeing: "고른 답이 계산판이나 물건에 들어간 모습과 짧은 오답 피드백을 봅니다.",
    action: "어디가 맞지 않는지 확인하고 같은 문제에서 다른 답을 고릅니다.",
    math: `${mathTopic}의 관계와 고른 답이 왜 맞지 않는지 확인합니다.`,
    next: "같은 문제에서 다시 판단할 수 있는 상태로 돌아갑니다.",
  };
  if (state.startsWith("05") && /confirm|correct|complete/u.test(state)) return {
    title,
    seeing: "고른 정답이 현재 계산판이나 물건에 들어가 완성된 모습을 봅니다.",
    action: "완성값과 짧은 확인 문구를 읽습니다.",
    math: `${mathTopic}의 정답 관계가 화면에 완성되었음을 확인합니다.`,
    next: "다음 계산 단계나 보상 확인으로 이동합니다.",
  };
  if (state.startsWith("05")) return {
    title,
    seeing: "현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.",
    action: "문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.",
    math: `${mathTopic}을 이용해 선택지를 판단합니다.`,
    next: "고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.",
  };
  if (state.startsWith("06")) return {
    title,
    seeing: "마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.",
    action: "완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.",
    math: `${mathTopic}의 완성값을 보상 화면 전에 다시 확인합니다.`,
    next: "수학 관계를 확인한 뒤 보상 상태로 이동합니다.",
  };
  if (state === "07-reward-closed" || state === "07d-final-reward-closed") return {
    title,
    seeing: "결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.",
    action: `이번 ${rewardUnit} 변화를 확인하기 위해 열기를 누릅니다.`,
    math: "뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.",
    next: "학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.",
  };
  if (state === "07b-reward-open" || state === "07e-final-reward-open" || state === "07-reward-immediate") return {
    title,
    seeing: `보상 사건 그림과 이번 ${rewardUnit} 변화, 다음 행동 버튼을 봅니다.`,
    action: "이번 변화를 확인하고 다음을 누릅니다.",
    math: "수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.",
    next: "현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.",
  };
  if (state.startsWith("07")) return {
    title,
    seeing: `보상 모달이 닫힌 뒤 현재 진행 장면과 ${rewardUnit} 변화가 반영되는 모습을 봅니다.`,
    action: "별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.",
    math: "한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.",
    next: "효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.",
  };
  if (state.startsWith("08")) return {
    title,
    seeing: "완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.",
    action: "현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.",
    math: `한 판의 정답과 ${rewardUnit} 변화가 하나의 결과 단계로 정리됩니다.`,
    next: "다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.",
  };
  return {
    title,
    seeing: "현재 게임 상태의 모든 보이는 요소를 확인합니다.",
    action: "이 상태에서 요구되는 한 가지 행동이나 자동 전환을 확인합니다.",
    math: `${mathTopic}이 현재 화면 상태에 맞게 유지되는지 확인합니다.`,
    next: "정해진 게임 흐름의 다음 상태로 이동합니다.",
  };
}

function buildSection() {
  const lines = [
    startMarker,
    "",
    "## 2026-08-04 최신 원본 스크린샷 전수",
    "",
    `- 실행본 SHA-256: \`${manifest.indexSha256}\``,
    `- 생성 시각: \`${manifest.generatedAt}\``,
    `- 등록 화면 크기: \`${manifest.viewports.length}개\``,
    `- 아래에 직접 삽입한 원본 캡처: \`${manifest.viewports.reduce((sum, viewport) => sum + viewport.screenshotCount, 0)}장\``,
    "- 컨택시트만으로 대신하지 않고 manifest에 기록된 원본 캡처를 한 장씩 모두 연결했습니다.",
    "",
  ];

  for (const viewport of manifest.viewports) {
    lines.push(
      `### ${viewport.name} · ${viewport.width}×${viewport.height} · DPR ${viewport.dpr} · ${viewport.screenshotCount}장`,
      "",
      `![${viewport.name} 전체 상태 컨택시트](${viewport.sheet})`,
      "",
    );
    for (const screenshot of viewport.screenshots) {
      const state = stateId(screenshot.path, viewport.name);
      const description = lesson === "3-2-3-3-mathmon-double-bridge"
        ? describe(state)
        : describeGeneric(state);
      lines.push(
        `#### ${description.title} · \`${path.basename(screenshot.path)}\``,
        "",
        `![${viewport.name} ${description.title}](${screenshot.path})`,
        "",
        `- 학생이 보는 것: ${description.seeing}`,
        `- 판단하거나 누르는 것: ${description.action}`,
        `- 화면에서 확인되는 수학 관계: ${description.math}`,
        `- 다음 상태로 넘어가는 이유: ${description.next}`,
        "",
      );
    }
  }
  lines.push(endMarker, "");
  return lines.join("\n");
}

const section = buildSection();
const start = report.indexOf(startMarker);
const end = report.indexOf(endMarker);
let nextReport;
if (start >= 0 || end >= 0) {
  if (start < 0 || end < 0 || end < start) throw new Error("REPORT evidence markers are incomplete");
  const suffix = report.slice(end + endMarker.length).replace(/^\n*/u, "");
  nextReport = `${report.slice(0, start)}${section}${suffix ? `\n${suffix}` : ""}`;
} else {
  nextReport = `${report.trimEnd()}\n\n${section}`;
}
await writeFile(reportPath, nextReport);
console.log(`SYNC_LESSON_REPORT_EVIDENCE: PASS (${manifest.viewports.length} viewports, ${manifest.viewports.reduce((sum, viewport) => sum + viewport.screenshotCount, 0)} screenshots)`);

# 2단원 매스몬 동행 통일 지침 (래스터 재생성)

> 작성 2026-06-24. 2단원 완성도 폴리시 패스에서 미룬 **이미지 생성 작업**을 나중에 진행할 때 쓰는 지침.
> 실제 매스몬 생성·후처리·연결 공정의 단일 기준은 `.claude/skills/eduitit-mathmon-assets/SKILL.md`와
> `_shared/mathmon/MATHMON_ASSET_CONTRACT.md`다. 이 문서는 "2단원에서 무엇을, 왜, 어디에" 하면 되는지만 정리한다.

## 왜 필요한가

시리즈 정체성은 "모든 차시가 같은 공용 매스몬(base-pack) 동행을 보여 준다"이다. 그런데 2단원 현재 상태는 차시마다 다르다:

- **2-3 별 줍기** — base-pack `mathmon-8-unicornmon`을 결과 동행으로 사용. ✅ 이미 통일됨.
- **2-4 검산 자물쇠** — 완성도 패스에서 base-pack `mathmon-9-kingdragonmon`을 cover+result에 오버레이로 연결. 단, **생성 래스터(cover/result/board)에 "해 모양" 캐릭터가 박혀 있어** 매스몬으로 가렸지만 일부가 비친다.
- **2-1 농장 / 2-2 엘리베이터** — 생성 래스터에 **generic 몬스터 동행이 이미 그려져 있어** base-pack 매스몬을 얹으면 두 마리가 겹친다. 그래서 현재는 오버레이를 쓰지 않았다(베이크된 동행을 그대로 둠).

즉 2단원을 base-pack 매스몬으로 완전히 통일하려면 **래스터를 "캐릭터 없는 배경"으로 재생성**한 뒤 base-pack 매스몬을 오버레이해야 한다.

## 먼저 정할 것 (사용자 결정 1개)

| 선택 | 결과 | 추천 |
|---|---|---|
| **A. base-pack로 통일** | 2-1·2-2·2-4 래스터를 캐릭터 없는 배경으로 재생성 + base-pack 매스몬 오버레이. 4차시가 동일한 공용 매스몬으로 보임 | 시리즈 일관성 우선이면 ◎ |
| **B. 현 상태 유지** | 2-1·2-2는 베이크된 동행 유지, 2-4만 오버레이. 추가 이미지 작업 없음 | 베이크된 캐릭터가 충분히 귀엽고 빠르게 끝내고 싶으면 ○ |

> B를 택해도 **2-4의 "해 캐릭터"만큼은 재생성 권장**한다(동물/판타지 생물 규칙 위반 + 오버레이와 겹쳐 비침).

## 재생성 대상과 연결 맵 (선택 A 기준)

각 차시 폴더 `assets/mathmon/base-pack/`에 해당 WebP만 복사하고, 아래 표의 위치에 연결한다.
HTML 연결 지점은 이미 폴리시 패스에서 잡혀 있거나(2-4) 비어 있다(2-1·2-2의 `cover-space`/`cover-safe-zone`/`arrival-visual`).

| 차시 | 재생성할 래스터 | 목표 | 권장 base-pack 매스몬 | HTML 연결 지점 |
|---|---|---|---|---|
| 2-1 농장 | `cover-generated`, `result-tier-*` | 보라/파랑 몬스터 제거, 밝은 농장 배경만 | `mathmon-2-foxmon` (또는 `mathmon-1-ppiyakmon`) | cover `.cover-space`, result 등급 장면 |
| 2-2 엘리베이터 | `cover-generated`, `result-*-generated` | 청록 몬스터 제거, 엘리베이터 배경만 | `mathmon-5-eaglemon` (위로 오르는 테마) | cover `.cover-space`, result `.arrival-visual` |
| 2-4 검산 자물쇠 | `cover-generated`, `result-*-generated`, `board-vault-generated` | "해 캐릭터" 제거, 어두운 금고 배경만 | `mathmon-9-kingdragonmon` (이미 연결됨) | cover `.cover-safe-zone`, result `.result-visual-space` |
| 2-3 별 줍기 | — | 변경 없음 | `mathmon-8-unicornmon` (유지) | 이미 연결됨 |

## 공정 (eduitit-mathmon-assets 스킬 따름)

1. 시작 규칙대로 `MATHMON_ASSET_CONTRACT.md`, `catalog.json`, `STYLE_GUIDE.md`, base-pack `manifest.json`, contact sheet를 먼저 읽는다.
2. **새 매스몬은 만들지 않는다.** base-pack 10종으로 충분하므로 위 표의 기존 WebP를 재사용한다(생성은 "배경 래스터"에만 해당).
3. 배경 래스터 재생성: `STYLE_GUIDE.md`의 V1 밝은 2D 애니/스티커 톤 기준, **동행 캐릭터 없이** 장면만 만든다. RasterStage는 `1280×800` 16:10 안에서 설계.
4. 후처리: PNG 원본은 `_shared/mathmon/` 또는 차시 작업실에 보관, 배포는 WebP(quality 82~86).
5. 연결: 차시 폴더 `assets/mathmon/base-pack/`에 매스몬 WebP 복사 후 위 표의 HTML 지점에 `<img>` 오버레이(2-4의 `.cover-mathmon`/`.result-mathmon` 패턴 참고).
6. 등록: `_shared/mathmon/catalog.json` `base-pack.usedBy`에 해당 차시(`3-2-2-1`,`3-2-2-2`) 추가, 사유 메모 갱신.

## 완료 기준 (검증)

- [ ] `node scripts/check-stage-ratio.mjs` 통과 (16:10 / 1280×800).
- [ ] 각 차시 cover·result 화면에 **매스몬이 한 마리만** 보인다(베이크된 캐릭터와 겹치지 않음).
- [ ] 매스몬 본체가 동물/판타지 생물이고, 차시 테마는 소품·포즈로만 표현된다.
- [ ] 배포 WebP 200 로드, 학생용 `index.html`은 WebP 참조.
- [ ] 각 차시 `README.md`/`REPORT.md`에 사용 매스몬·연결 지점 기록.

## 참고

- 연결 패턴 실제 예: `3-2-2-4-mathmon-check-lock/index.html`의 `.cover-mathmon` / `.result-mathmon` (이미 적용됨).
- 표본: `3-2-1-2-mathmon-rocket-charge`의 `cover-mathmon`(base-pack `mathmon-3-babydragonmon`) 오버레이.

#!/usr/bin/env python3
"""Build labeled QA contact sheets for the four Unit 6 data lessons."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
FONT_CANDIDATES = [
    Path("/System/Library/Fonts/AppleSDGothicNeo.ttc"),
    Path("/System/Library/Fonts/AppleGothic.ttf"),
]
FONT_PATH = next((path for path in FONT_CANDIDATES if path.exists()), None)

LESSONS = {
    "3-2-6-1-mathmon-data-rangers": [
        "첫 조사표",
        "완성 조사표",
        "반짝 조사판",
        "조사 게시판",
        "자료 연구실",
        "무지개 자료관",
    ],
    "3-2-6-2-mathmon-picture-decoder": [
        "첫 그림표",
        "반짝 돋보기",
        "그림 해독판",
        "해독 책상",
        "자료 해독실",
        "무지개 해독탑",
    ],
    "3-2-6-3-mathmon-picture-stamp": [
        "첫 도장판",
        "알록 도장판",
        "그림그래프판",
        "그래프 전시대",
        "그래프 전시실",
        "무지개 그래프탑",
    ],
    "3-2-6-4-mathmon-data-detective": [
        "첫 단서",
        "단서 수첩",
        "해결 배지",
        "탐정 책상",
        "사건 해결실",
        "무지개 탐정본부",
    ],
}

REWARDS = [
    ("normal", "일반 +4~8"),
    ("loss", "감소 -10~-5"),
    ("mega", "큰 증가 +12~20"),
    ("complete", "한 번에 도약"),
    ("empty", "그대로"),
    ("rainbow", "무지개 특별"),
]


def font(size: int):
    if FONT_PATH:
        return ImageFont.truetype(str(FONT_PATH), size)
    return ImageFont.load_default()


def labeled_sheet(items, output: Path, cell_size, image_box, background="#f4f1e8"):
    columns = 3
    rows = 2
    sheet = Image.new("RGB", (cell_size[0] * columns, cell_size[1] * rows), background)
    draw = ImageDraw.Draw(sheet)
    title_font = font(24)
    meta_font = font(16)

    for index, (image_path, state_name) in enumerate(items):
        source = Image.open(image_path).convert("RGBA")
        source_size = source.size
        fitted = ImageOps.contain(source, image_box, Image.Resampling.LANCZOS)
        cell_x = (index % columns) * cell_size[0]
        cell_y = (index // columns) * cell_size[1]
        image_x = cell_x + (cell_size[0] - fitted.width) // 2
        image_y = cell_y + 12 + (image_box[1] - fitted.height) // 2

        checker = Image.new("RGBA", fitted.size, "#ffffff")
        checker.alpha_composite(fitted)
        sheet.paste(checker.convert("RGB"), (image_x, image_y))

        label_y = cell_y + image_box[1] + 22
        draw.text((cell_x + 14, label_y), state_name, fill="#2b241c", font=title_font)
        draw.text(
            (cell_x + 14, label_y + 32),
            f"{image_path.name} · {source_size[0]}×{source_size[1]}",
            fill="#665a4b",
            font=meta_font,
        )
        draw.rounded_rectangle(
            (cell_x + 4, cell_y + 4, cell_x + cell_size[0] - 4, cell_y + cell_size[1] - 4),
            radius=12,
            outline="#b8ab97",
            width=2,
        )

    sheet.save(output)
    print(f"WROTE {output.relative_to(ROOT)} {sheet.width}x{sheet.height}")


for lesson, result_names in LESSONS.items():
    folder = ROOT / lesson
    labeled_sheet(
        [
            (folder / f"result-scene-{index}-generated.png", state)
            for index, state in enumerate(result_names, start=1)
        ],
        folder / "result-scenes-contact-sheet.png",
        (430, 330),
        (402, 250),
    )
    labeled_sheet(
        [
            (folder / f"result-title-{index}-generated.png", state)
            for index, state in enumerate(result_names, start=1)
        ],
        folder / "result-titles-contact-sheet.png",
        (430, 430),
        (380, 350),
        background="#dfe8ef",
    )
    labeled_sheet(
        [
            (folder / f"reward-{reward_id}-generated.png", state)
            for reward_id, state in REWARDS
        ],
        folder / "reward-contact-sheet.png",
        (430, 430),
        (360, 350),
    )

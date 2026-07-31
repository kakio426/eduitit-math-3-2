#!/usr/bin/env python3
"""Build labeled contact sheets for the Unit 5 reward sprite sets."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
LESSONS = {
    "3-2-5-1-mathmon-water-fill": [
        "closed",
        "smallFlow",
        "bigFlow",
        "shineFlow",
        "smallOnly",
        "specialFlow",
        "repair",
    ],
    "3-2-5-2-mathmon-drink-order": [
        "closed",
        "smallOrder",
        "bigOrder",
        "styleOrder",
        "smallOnly",
        "specialOrder",
        "repair",
    ],
    "3-2-5-3-mathmon-scale-balance": [
        "closed",
        "smallBalance",
        "bigBalance",
        "shineBalance",
        "smallOnly",
        "specialBalance",
        "repair",
    ],
}

TILE = 360
LABEL = 52
COLS = 4
ROWS = 2


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = (
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
    )
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()


def main() -> None:
    label_font = font(18)
    for folder, states in LESSONS.items():
        lesson = ROOT / folder
        closed = Image.open(lesson / "reward-event-closed-v2-generated.png").convert("RGB")
        sprite = Image.open(lesson / "reward-events-v2-source.png").convert("RGB")
        if closed.size != (512, 512):
            raise ValueError(f"{folder}: closed image must be 512x512, got {closed.size}")
        if sprite.size != (1536, 1024):
            raise ValueError(f"{folder}: sprite image must be 1536x1024, got {sprite.size}")

        panels = [closed]
        for index in range(6):
            left = (index % 3) * 512
            top = (index // 3) * 512
            panels.append(sprite.crop((left, top, left + 512, top + 512)))

        sheet = Image.new("RGB", (COLS * TILE, ROWS * (TILE + LABEL)), "#0d1424")
        draw = ImageDraw.Draw(sheet)
        for index, (state, panel) in enumerate(zip(states, panels, strict=True)):
            x = (index % COLS) * TILE
            y = (index // COLS) * (TILE + LABEL)
            sheet.paste(panel.resize((TILE, TILE), Image.Resampling.LANCZOS), (x, y))
            source = (
                "reward-event-closed-v2-generated.webp"
                if index == 0
                else f"reward-events-v2-generated.webp [{(index - 1) % 3},{(index - 1) // 3}]"
            )
            draw.rectangle((x, y + TILE, x + TILE, y + TILE + LABEL), fill="#101a2d")
            draw.text(
                (x + 10, y + TILE + 8),
                f"{state} · 512x512\n{source}",
                fill="#f5f7ff",
                font=label_font,
                spacing=2,
            )

        output = lesson / "reward-events-v2-contact-sheet.png"
        sheet.save(output, optimize=True)
        print(f"built {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

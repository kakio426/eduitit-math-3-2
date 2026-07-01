import { describe, expect, test } from "bun:test"

import { createNicknameGenerator, isApprovedNickname } from "../src/domain/nickname"

describe("safe nickname policy", () => {
  test("Given the generator When creating names Then every name is approved", () => {
    const generateNickname = createNicknameGenerator(() => 0.42)

    const nickname = generateNickname()

    expect(isApprovedNickname(nickname)).toBe(true)
    expect(nickname).toBe("튼튼 로켓 43")
  })

  test("Given free text When checking approval Then the nickname is rejected", () => {
    expect(isApprovedNickname("우리학교 3학년 김민수")).toBe(false)
    expect(isApprovedNickname("반짝 매스몬 27")).toBe(true)
  })
})

const ADJECTIVES = ["반짝", "씩씩", "튼튼", "초록", "깡충"] as const
const NOUNS = ["매스몬", "상자", "로켓", "점프", "로봇"] as const

type RandomSource = () => number

const pickIndex = (random: RandomSource, length: number): number =>
  Math.min(Math.floor(random() * length), length - 1)

export const createNicknameGenerator =
  (random: RandomSource): (() => string) =>
  () => {
    const adjective = ADJECTIVES[pickIndex(random, ADJECTIVES.length)]
    const noun = NOUNS[pickIndex(random, NOUNS.length)]
    const number = Math.min(Math.floor(random() * 100) + 1, 100)

    return `${adjective} ${noun} ${number}`
  }

export const isApprovedNickname = (nickname: string): boolean => {
  const parts = nickname.trim().split(" ")
  if (parts.length !== 3) return false

  const [adjective, noun, numberText] = parts
  if (!adjective || !noun || !numberText) return false
  if (!ADJECTIVES.some((item) => item === adjective)) return false
  if (!NOUNS.some((item) => item === noun)) return false

  const number = Number(numberText)
  return Number.isInteger(number) && number >= 1 && number <= 100 && String(number) === numberText
}

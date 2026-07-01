export const addMinutes = (date: Date, minutes: number): Date =>
  new Date(date.getTime() + minutes * 60 * 1000)

export const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10)

export const getUtcWeekStart = (date: Date): Date => {
  const day = date.getUTCDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const weekStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  weekStart.setUTCDate(weekStart.getUTCDate() + diffToMonday)
  return weekStart
}

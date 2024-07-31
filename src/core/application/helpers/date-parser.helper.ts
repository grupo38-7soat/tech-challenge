export function formatDateWithTimezone(date: Date, offset: number = -3) {
  const offsetMs = offset * 60 * 60 * 1000
  const localDate = new Date(date.getTime() + offsetMs)
  const isoString = localDate.toISOString().slice(0, -1)
  const offsetHours = Math.floor(Math.abs(offset))
  const offsetMinutes = (Math.abs(offset) * 60) % 60
  const sign = offset >= 0 ? '+' : '-'
  const pad = (num: number) => String(num).padStart(2, '0')
  const timezoneOffset = `${sign}${pad(offsetHours)}:${pad(offsetMinutes)}`
  return `${isoString}${timezoneOffset}`
}

export function getMinutesInterval(firstDate: Date, secondDate: Date): number {
  const firstTime = firstDate.getTime()
  const secondTime = secondDate.getTime()
  const diffInMilliseconds = Math.abs(secondTime - firstTime)
  const diffInMinutes = diffInMilliseconds / (1000 * 60)
  return Math.round(diffInMinutes)
}

export function increaseTimeToDate(minutes: number): string {
  const currentDatetime = new Date().getTime()
  const expireDatetime = currentDatetime + minutes * 60000
  return formatDateWithTimezone(new Date(expireDatetime))
}

export function decreaseTimeToDate(minutes: number): string {
  const currentDatetime = new Date().getTime()
  const expireDatetime = currentDatetime + minutes * 60000 * -1
  return formatDateWithTimezone(new Date(expireDatetime))
}

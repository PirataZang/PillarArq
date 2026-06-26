import { DateTime } from 'luxon'

export function parseSqlDate(value: Date | string | null | undefined): DateTime | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  if (value instanceof Date) {
    const date = DateTime.fromJSDate(value)
    return date.isValid ? DateTime.fromISO(date.toISODate()!) : null
  }

  const isoDate = value.length >= 10 ? value.slice(0, 10) : value
  const date = DateTime.fromISO(isoDate)

  return date.isValid ? date : null
}

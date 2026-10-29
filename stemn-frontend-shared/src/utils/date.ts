/**
 * The one place dayjs is configured. Import `dayjs` and the helpers from here, never from 'dayjs'.
 *
 * Plugins: localizedFormat (`L`, `LT`, `LLLL`), advancedFormat (`Do`), weekday (locale-aware
 * `weekday()` for the calendar grid). `fromNow` and `calendar` are implemented here rather than
 * with dayjs's relativeTime/calendar plugins so their thresholds and strings stay exactly the
 * ones the app has always shown (dayjs's relativeTime measures months differently).
 */
import dayjs from 'dayjs'
import type { ConfigType, Dayjs } from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import weekday from 'dayjs/plugin/weekday'
import enGb from 'dayjs/locale/en-gb'

dayjs.extend(advancedFormat)
dayjs.extend(localizedFormat)
dayjs.extend(weekday)
// Registered on this instance explicitly (without switching to it) so it can't miss a duplicate copy
dayjs.locale(enGb, undefined, true)

export { dayjs }
export type { ConfigType, Dayjs }
export default dayjs

export type DateLocale = 'en' | 'en-gb'

/** Sets the global locale (website: 'en', the default; desktop: 'en-gb'). */
export const setDateLocale = (locale: DateLocale) => {
  dayjs.locale(locale)
}

export const INVALID_DATE = 'Invalid date'

/** `dayjs(date).format(fmt)`, with 'Invalid date' for unparseable input. */
export const formatDate = (date?: ConfigType, fmt?: string): string => {
  const d = dayjs(date)
  return d.isValid() ? d.format(fmt) : INVALID_DATE
}

const relativeStrings = {
  future: 'in %s',
  past: '%s ago',
  s: 'a few seconds',
  ss: '%d seconds',
  m: 'a minute',
  mm: '%d minutes',
  h: 'an hour',
  hh: '%d hours',
  d: 'a day',
  dd: '%d days',
  M: 'a month',
  MM: '%d months',
  y: 'a year',
  yy: '%d years',
}

type RelativeKey = Exclude<keyof typeof relativeStrings, 'future' | 'past'>

// Upper bounds of each unit, in rounded units of that size
const thresholds = { ss: 44, s: 45, m: 45, h: 22, d: 26, M: 11 }

const MS_PER_DAY = 864e5
const monthsToDays = (months: number) => (months * 146097) / 4800
const daysToMonths = (days: number) => (days * 4800) / 146097

/**
 * `date` plus (or minus) whole months, clamped to the end of the target month. Done on a Date
 * directly: dayjs's add(n, 'month') detours through the 1st of the month, which can move the time
 * by an hour when that detour lands in a DST gap or overlap.
 */
export const addMonths = (date: ConfigType, months: number): Dayjs => {
  const d = dayjs(date).toDate()
  if (!months) return dayjs(d)
  const month = d.getMonth() + months
  const day = d.getDate()
  d.setMonth(month, day < 29 ? day : Math.min(day, new Date(d.getFullYear(), month + 1, 0).getDate()))
  return dayjs(d)
}

/** Whole calendar months from `base` to `later` (>= base), and the milliseconds left over. */
const positiveDifference = (base: Dayjs, later: Dayjs) => {
  let months = later.month() - base.month() + (later.year() - base.year()) * 12
  if (addMonths(base, months).valueOf() > later.valueOf()) months -= 1
  return { months, milliseconds: later.valueOf() - addMonths(base, months).valueOf() }
}

/** Relative time from now: 'a few seconds ago', 'in 3 hours', '2 months ago', ... */
export const fromNow = (date?: ConfigType): string => {
  const target = dayjs(date)
  if (!target.isValid()) return INVALID_DATE
  const now = dayjs()
  const isFuture = target.valueOf() > now.valueOf()
  const { months, milliseconds } = isFuture ? positiveDifference(now, target) : positiveDifference(target, now)

  // Wholes are rounded per unit; months count as their average length for the smaller units
  const monthDays = Math.round(monthsToDays(months))
  const seconds = Math.round(monthDays * 86400 + milliseconds / 1000)
  const minutes = Math.round(monthDays * 1440 + milliseconds / 6e4)
  const hours = Math.round(monthDays * 24 + milliseconds / 36e5)
  const days = Math.round(monthDays + milliseconds / MS_PER_DAY)
  const exactMonths = months + daysToMonths(milliseconds / MS_PER_DAY)
  const monthCount = Math.round(exactMonths)
  const years = Math.round(exactMonths / 12)

  const [key, count]: [RelativeKey, number] =
    seconds <= thresholds.ss
      ? ['s', seconds]
      : seconds < thresholds.s
        ? ['ss', seconds]
        : minutes <= 1
          ? ['m', 1]
          : minutes < thresholds.m
            ? ['mm', minutes]
            : hours <= 1
              ? ['h', 1]
              : hours < thresholds.h
                ? ['hh', hours]
                : days <= 1
                  ? ['d', 1]
                  : days < thresholds.d
                    ? ['dd', days]
                    : monthCount <= 1
                      ? ['M', 1]
                      : monthCount < thresholds.M
                        ? ['MM', monthCount]
                        : years <= 1
                          ? ['y', 1]
                          : ['yy', years]

  const amount = relativeStrings[key].replace('%d', String(count || 1))
  return relativeStrings[isFuture ? 'future' : 'past'].replace('%s', amount)
}

const calendarFormats = {
  sameDay: '[Today at] LT',
  nextDay: '[Tomorrow at] LT',
  nextWeek: 'dddd [at] LT',
  lastDay: '[Yesterday at] LT',
  lastWeek: '[Last] dddd [at] LT',
  sameElse: 'L',
}

/** Calendar time relative to today: 'Today at 3:00 PM', 'Last Monday at ...', or the date (`L`). */
export const calendar = (date?: ConfigType): string => {
  const d = dayjs(date)
  if (!d.isValid()) return INVALID_DATE
  const diff = d.diff(dayjs().startOf('day'), 'day', true)
  const key: keyof typeof calendarFormats =
    diff < -6
      ? 'sameElse'
      : diff < -1
        ? 'lastWeek'
        : diff < 0
          ? 'lastDay'
          : diff < 1
            ? 'sameDay'
            : diff < 2
              ? 'nextDay'
              : diff < 7
                ? 'nextWeek'
                : 'sameElse'
  return d.format(calendarFormats[key])
}

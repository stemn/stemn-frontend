import { dayjs } from 'stemn-shared/utils/date'

const prefixZero = (num) => (num < 10 ? `0${num}` : num)

// Truncates towards zero (and never returns -0)
const absFloor = (num) => (num < 0 ? Math.ceil(num) || 0 : Math.floor(num))

export const diffTimes = (start, end) => {
  const milliseconds = dayjs(end).diff(dayjs(start))
  const minutes = absFloor(milliseconds / 6e4) % 60
  const seconds = absFloor(milliseconds / 1e3) % 60
  return `${prefixZero(minutes)}:${prefixZero(seconds)}s`
}

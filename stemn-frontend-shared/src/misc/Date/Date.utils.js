import moment from 'moment'

const prefixZero = num => (num < 10 ? `0${num}` : num)

export const diffTimes = (start, end) => {
  const duration = moment.duration(moment(end).diff(moment(start)))
  return `${prefixZero(duration.minutes())}:${prefixZero(duration.seconds())}s`
}
import { dayjs } from 'stemn-shared/utils/date'
import { keyBy, values } from 'lodash'

export const fillRange = (from, to, keyName) => (data) => {
  const dataObject = keyBy(data, keyName)

  // Create the range: every day from `from` to `to`, inclusive
  const start = dayjs(from)
  const days = Math.abs(start.diff(to, 'day'))
  const rangeArray = Array.from({ length: days + 1 }, (_, day) => ({
    [keyName]: start.add(day, 'day').format('YYYY-MM-DD'),
  }))
  const rangeObject = keyBy(rangeArray, keyName)

  // Merge the data into the range object
  const filledObject = Object.assign({}, rangeObject, dataObject)

  // Get the values to produce the array
  return values(filledObject)
}

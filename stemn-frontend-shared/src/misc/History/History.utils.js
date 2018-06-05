import Moment from 'moment'
import { keyBy, values } from 'lodash'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

export const fillRange = (from, to, keyName) => (data) => {
  const dataObject = keyBy(data, keyName)

  // Create the range
  const range = moment.range(from, to)
  const rangeArray = Array.from(range.by('day', { step: 1 })).map(date => ({
    [keyName]: date.format('YYYY-MM-DD'),
  }))
  const rangeObject = keyBy(rangeArray, keyName)

  // Merge the data into the range object
  const filledObject = Object.assign({}, rangeObject, dataObject)

  // Get the values to produce the array
  return values(filledObject)
}

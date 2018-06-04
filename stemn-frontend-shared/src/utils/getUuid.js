import { sampleSize } from 'lodash'

export default () => {
  const possible = 'abcdef0123456789abcdef0123456789'
  return sampleSize(possible, 24).join('')
}

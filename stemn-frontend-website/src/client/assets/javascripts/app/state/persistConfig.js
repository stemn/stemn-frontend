import { pick } from 'lodash'

const authKeysToPersist = ['authToken', 'user']
const persistFn = state => pick(state, authKeysToPersist)

const transform = {
  in: persistFn,
  out: persistFn,
}

export default {
  whitelist: ['auth'],
  transforms: [transform],
}
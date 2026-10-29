import http from 'axios'
import { legacyParamsSerializer } from 'stemn-shared/utils/legacyParamsSerializer'

/**
 * axios defaults shared by the main process and the renderers.
 * `getToken` returns the current auth token (once the store exists).
 */
export default (getToken = () => undefined) => {
  http.defaults.baseURL = `${GLOBAL_ENV.API_SERVER}/`
  // Keep the axios 0.x query string format the API was written against
  http.defaults.paramsSerializer = { serialize: legacyParamsSerializer }
  http.interceptors.request.use((config) => {
    const token = getToken()
    const authorization = config.headers.get('Authorization')
    if (authorization === null) {
      // Authorization set to null bypasses the token
      config.headers.delete('Authorization')
    } else if (!authorization && token) {
      config.headers.set('Authorization', `bearer ${token}`)
    }
    return config
  })
}

import http from 'axios'
import { legacyParamsSerializer } from 'stemn-shared/utils/legacyParamsSerializer'

export default (store) => {
  // Setup the http interceptor
  http.interceptors.request.use((config) => {
    const token = store.getState().auth.authToken
    // axios 1.x: config.headers is an AxiosHeaders instance
    const authorization = config.headers.get('Authorization')

    if (authorization === null) { // We set Authorization to null to bypass
      config.headers.delete('Authorization')
    } else if (!authorization) {
      config.headers.set('Authorization', token ? `bearer ${token}` : '')
    }
    return config
  })
  http.defaults.baseURL = `${GLOBAL_ENV.API_SERVER}/`
  // Keep the axios 0.x query string format the API was written against
  http.defaults.paramsSerializer = { serialize: legacyParamsSerializer }
}

/**
 * Query string serializer matching axios 0.x `buildURL`, which the Stemn API expects:
 *  - arrays become repeated `key[]=value` pairs
 *  - plain objects (e.g. `criteria`) are JSON encoded: `criteria={"private":"all"}`
 *  - Dates are ISO strings, null/undefined values are dropped
 * axios 1.x would instead send `criteria[private]=all`, which the API rejects.
 */
const encode = val => encodeURIComponent(val)
  .replace(/%3A/gi, ':')
  .replace(/%24/g, '$')
  .replace(/%2C/gi, ',')
  .replace(/%20/g, '+')
  .replace(/%5B/gi, '[')
  .replace(/%5D/gi, ']')

export const legacyParamsSerializer = (params) => {
  if (!params) return ''
  if (typeof URLSearchParams !== 'undefined' && params instanceof URLSearchParams) return params.toString()
  const parts = []
  Object.keys(params).forEach((originalKey) => {
    let key = originalKey
    let values = params[originalKey]
    if (values === null || typeof values === 'undefined') return
    if (Array.isArray(values)) {
      key = `${key}[]`
    } else {
      values = [values]
    }
    values.forEach((value) => {
      let v = value
      if (v instanceof Date) {
        v = v.toISOString()
      } else if (v !== null && typeof v === 'object') {
        v = JSON.stringify(v)
      }
      parts.push(`${encode(key)}=${encode(v)}`)
    })
  })
  return parts.join('&')
}

export default legacyParamsSerializer

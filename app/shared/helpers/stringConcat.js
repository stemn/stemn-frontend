export const end = (string, chars) => {
  return string.length >= chars ? string.substring(0, chars)+'...' : string
}

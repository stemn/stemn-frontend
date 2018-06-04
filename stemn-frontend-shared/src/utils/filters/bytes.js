export default (bytes, precision) => {
  if (bytes === '0' || bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-'
  if (typeof precision === 'undefined') precision = 1
  let units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'],
    number = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, Math.floor(number))).toFixed(precision)} ${units[number]}`
}

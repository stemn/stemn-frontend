export default (bytes, decimals) => {
  if (bytes === 0) return '0 Byte'
  const k = 1024 // or 1024 for binary
  const dm = decimals + 1 || 1
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

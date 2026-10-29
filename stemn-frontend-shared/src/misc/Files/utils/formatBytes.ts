/** `1536` -> `'1.5 KB'`. `bytes` may be a numeric string (IFile.size is one) */
export default (bytes: number | string, decimals?: number) => {
  if (bytes === 0) return '0 Byte'
  const k = 1024 // or 1024 for binary
  // `decimals + 1 || 1`: 1 when decimals is undefined (NaN) or -1
  const dm = decimals === undefined ? 1 : decimals + 1 || 1
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(Number(bytes)) / Math.log(k))
  return `${parseFloat((Number(bytes) / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

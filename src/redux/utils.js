export const shouldDownload = (requestedSize, existingSize) => {
  if (requestedSize === existingSize) {
    return false
  }

  if (requestedSize === 'sm' && (existingSize === 'md' || existingSize === 'lg')) {
    return false
  }

  if (requestedSize === 'md' && existingSize === 'lg') {
    return false
  }

  // we don't have the requested data locally, we should download
  return true
}

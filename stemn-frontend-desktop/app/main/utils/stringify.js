export default (object) => {
  // http://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json
  const cache = []
  return JSON.stringify(object, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.includes(value)) {
        // Circular reference found, discard key
        return
      }
      // Store value in our collection
      cache.push(value)
    }
    return value
  })
}
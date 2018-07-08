export const end = (string, chars) => (string.length >= chars ? `${string.substring(0, chars)}...` : string)

// This will concat a string in the middle (or the position described by the ratio)
export const middle = (string, chars, ratio) => {
  ratio = ratio || 0.5


  if (string && string.length > chars) {
    // Get all the spaces in the string
    const indices   = getWordBreaks(string)
    const startIndex = closest(chars * ratio, indices)
    const endIndex   = closest(string.length - chars * (1 - ratio), indices)

    return `${string.substr(0, startIndex)} ...${string.substr(endIndex, string.length)}`
  }
  return string
}

function closest(num, arr) {
  let curr = arr[0]
  let diff = Math.abs(num - curr)
  for (let val = 0; val < arr.length; val++) {
    const newdiff = Math.abs(num - arr[val])
    if (newdiff < diff) {
      diff = newdiff
      curr = arr[val]
    }
  }
  return curr
}

function getWordBreaks(string) {
  return string.split('').reduce((accumulator, currentLetter, currentIndex) => {
    if ([' ', '/', '-', '_'].includes(currentLetter)) {
      accumulator.push(currentIndex)
    }
    return accumulator
  }, [])
}

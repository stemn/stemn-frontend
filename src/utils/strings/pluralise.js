export default (number, thing, noNumber) => {
  // takes in thing(singular)
  // adds an 's' if 0 || > 1, adds 'ies' if ends in 'y'

  let end = ''

  // Special Cases
  if (thing === 'People') {
    if (number === 1) {
      end = 'Person'
    } else {
      end = 'People'
    }
    return noNumber ? end : `${number} ${end}`
  }
  // Normal cases
  const lastLetter = thing[thing.length]
  if (number === 1) {
    end = thing
  } else if (lastLetter === 'y') {
    end = `${thing.substring(0, thing.length - 1)}ies`
  } else {
    end = `${thing}s`
  }
  return noNumber ? end : `${number} ${end}`
}

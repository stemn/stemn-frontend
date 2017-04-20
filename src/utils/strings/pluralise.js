export default (number, thing) => {
  // takes in thing(singular)
  // adds an 's' if 0 || > 1, adds 'ies' if ends in 'y'

  // Special Cases
  if (thing === 'People') {
    if (number === 1) {
      return `${number} Person`
    } else {
      return `${number} People`
    }
  }
  // Normal cases
  const lastLetter = thing[thing.length]
  if (number === 1) {
    return `${number} ${thing}`
  } else {
    if (lastLetter === 'y') {
      return `${number} ${thing.substring(0, thing.length - 1)}ies`
    } else {
      return `${number} ${thing}s`
    }
  }
}

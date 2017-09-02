/** *************************************************
This takes in 2 numbers and 2 nouns and returns
how many.

Example:
query  : howMany({
  count: 1,
  adj: 'sad',
},{
  count: 3,
  adj: 'happy',
}, 'dog')
result : '1 sad and 3 happy dogs.'

************************************************** */

export default (item1, item2, noun) => {
  let string = ''
  string += item1.count > 0                      ? `${item1.count} ${item1.adj}` : ''
  string += (item1.count > 0 && item2.count > 0) ? ' and ' : ''
  string += item2.count > 0                      ? `${item2.count} ${item2.adj}` : ''
  string += (item1.count > 0 || item2.count > 0) ? ` ${noun}${(item2.count > 1 || (item2.count == 0 && item1.count > 1)) ? 's' : ''}.` : ''
  return string
}

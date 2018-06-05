// https://github.com/tnrich/string-splice/blob/master/spliceString.js
export default (str, index, count, add) => str.slice(0, index) + (add || '') + str.slice(index + count)

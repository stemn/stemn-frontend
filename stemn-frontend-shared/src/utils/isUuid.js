export default string => (!!(string.length == 24 && /^[a-f0-9]+$/.test(string)))

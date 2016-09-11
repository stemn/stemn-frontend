export default (string) => {
  return string.length == 24 && /^[a-f0-9]+$/.test(string) ? true : false
};

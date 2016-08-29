export const end = (string, chars) => {
  return string.length >= chars ? string.substring(0, chars)+'...' : string
}

// This will concat a string in the middle (or the position described by the ratio)
export const middle = (string, chars, ratio) => {
  ratio = ratio || 0.5;

  // Get all the spaces in the string
  const indices   = getSpaces(string);
  const startIndex = closest( chars * ratio, indices);
  const endIndex   = closest( string.length - chars * (1-ratio), indices)

  if (string.length > chars * ratio) {
    return string.substr(0, startIndex) + ' ...' + string.substr(endIndex, string.length);
  }
  return string;
}
function closest (num, arr) {
    var curr = arr[0];
    var diff = Math.abs (num - curr);
    for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs (num - arr[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
        }
    }
    return curr;
}

function getSpaces (string){
  let indices = [];
  for(var i=0; i<string.length;i++) {
    if (string[i] === " ") indices.push(i);
  }
  return indices;
}

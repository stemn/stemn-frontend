export const formatBytes = (bytes, decimals) => {
   if(bytes == 0) return '0 Byte';
   var k = 1024; // or 1024 for binary
   var dm = decimals + 1 || 1;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
export const getToggleAllStatus = (groupedChanges, checkedObject) => {
  if(groupedChanges && groupedChanges.length > 0){
    return groupedChanges.reduce((prev, currentGroup, index) => {
      const current = checkedObject ? checkedObject[currentGroup.data.fileId] : false;
      return index == 0 ? current : (current == prev ? current : 'other')
    }, 'other'); // true || false || 'other'
  }
  else{
    return false
  }
}

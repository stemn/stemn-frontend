export const getToggleAllStatus = (groupedChanges, checkedObject) => {
  return groupedChanges.reduce((prev, currentGroup, index) => {
    const current = checkedObject ? checkedObject[currentGroup.data.fileId] : false;
    return index == 0 ? current : (current == prev ? current : null)
  }, null); // true || false || null
}

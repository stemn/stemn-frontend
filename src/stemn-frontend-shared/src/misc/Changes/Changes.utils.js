import { pickBy } from 'lodash'

export const filterSelectedChangesByPossible = (groupedChanges, selectedChanges) => {
  // Sometimes the selectedChanges contains files that are not in grouped changes...
  // This is some bug that occurs after items are commited?? Maybe.. I dunno...
  // This function is used to filter the selectedChanges by the ones which are possible
  // i.e. the ones in the groupedChanges array
  const possibleFiles = groupedChanges.map(item => item.data.fileId)
  return pickBy(selectedChanges, (val, key) => possibleFiles.includes(key))
}

export const getToggleAllStatus = (groupedChanges, selectedChanges) => {
  if (groupedChanges && groupedChanges.length > 0) {
    return groupedChanges.reduce((prev, currentGroup, index) => {
      const current = selectedChanges ? selectedChanges[currentGroup.data.fileId] : false
      return index === 0 ? current : (current === prev ? current : 'other')
    }, 'other') // true || false || 'other'
  }
  
  return false
}

import { uniqBy } from 'lodash'

export const getRevisions = (syncTimeline) => {
  // syncTimeline contains revision and commit events
  // This will look inside commits and create an array of revisions.
  const result = []
  
  syncTimeline.forEach((item) => {
    if (item.event === 'revision') {
      result.push(item)
    } else if (item.event === 'commit') {
      item.data.items.forEach((subItem) => {
        result.push(subItem)
      })
    }
  })
  
  return uniqBy(result, '_id')
}
import { groupBy, values, sortBy, orderBy } from 'lodash'

export const groupRevisions = (revisions) => {
  // Group revisions by FileId - add the other revisions to an array
  const grouped = values(groupBy(revisions, 'data.fileId')).map(file => Object.assign({}, file[0], { revisions: file }))
  // Sort by path - items not in folders should appear first
  return sortBy(grouped, [item => (item.data.path.split('/').length === 1 ? 1 : 2), 'data.path'])
}

export const orderByTime = items => orderBy(items, [
  item => (new Date(item.timestamp)).getTime(),
  item => item.data.revisionNumber,
], ['desc', 'desc'])
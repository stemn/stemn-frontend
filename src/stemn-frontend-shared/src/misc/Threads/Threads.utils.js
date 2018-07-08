import i from 'icepick'
import { escapeRegExp, difference } from 'lodash'

const isThreadPartOfFilter = (thread, filterObject) => {
  const threadData = thread && thread.data
  if (!threadData) return true // Return true if we don't have data for this task
  /** **************************************************
  This is the main query function. It takes in a filter object
  and will return true of the thread matches the filter object

  supports:
    groups: 'array',
    labels: 'array',
    user: 'string',
    status: 'string',
    query: 'main',

  *************************************************** */
  const groupsValid = filterObject.groups && filterObject.groups.length > 0
    ? filterObject.groups.includes(threadData.group)
    : true
  const labelsValid = filterObject.labels && filterObject.labels.length > 0
    ? difference(filterObject.labels, threadData.labels).length === 0
    : true
  const userValid = filterObject.user
    ? threadData.users.find(user => user._id === filterObject.user)
    : true
  const statusValid = filterObject.status
    ? ((filterObject.status === 'open' && !threadData.complete) || (filterObject.status === 'closed' && threadData.complete))
    : true
  const queryValid = filterObject.query && filterObject.query.length > 0
    ? new RegExp(escapeRegExp(filterObject.query), 'i').test(threadData.name)
    : true

  return groupsValid && labelsValid && userValid && statusValid && queryValid
}

export const filterBoard = (board, threads, filterObject = {}) => i.updateIn(board, ['data', 'groups'], groups => 
  // For each group...
  groups.map(group => i.updateIn(group, ['threads'], threadIds => 
    // Filter the items in the group.
    threadIds.filter(threadId => isThreadPartOfFilter(threads[threadId], filterObject)),
  )),
)

export const getAllThreads = (boardGroups) => {
  let threads = []
  boardGroups.forEach(group => threads = threads.concat(group.threads))
  return threads
}

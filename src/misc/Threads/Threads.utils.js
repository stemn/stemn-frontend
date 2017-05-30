import i from 'icepick';
import { every, escapeRegExp } from 'lodash';

export const filterBoard = (board, threads, searchString) => {
  // This will filter the board by the the search string
  const queryStringArray = searchString ? searchString.split(' ') : [];
  return i.updateIn(board, ['data', 'groups'], groups =>
    filterGroups({groups, threads, filterFn: (thread) => {
      return thread && thread.data ? every(queryStringArray, queryString => queryByString(thread, queryString)) : true;
    }})
  )
};

export const getAllThreads = (boardGroups) =>{
  let threads = [];
  boardGroups.forEach(group => threads = threads.concat(group.threads))
  return threads;
};

function queryByString(item, queryString){
  /****************************************************
  This is the main query function. It takes in a string
  and will filter the thread by this string in some way
  ****************************************************/
  if     (queryString == 'is:complete' || queryString == 'is:!complete'){
    return item.data.complete
  }
  else if(queryString == 'is:incomplete'){
    return !item.data.complete
  }
  // Assignee Query
  else if(queryString.startsWith('assignee:')){
    const assignee = queryString.replace('assignee:', '');
    return item.data.users.find(user => user.stub == assignee);
  }
  // Filter by the string itself (case independent)
  else if(queryString && queryString.length > 0){
    return new RegExp(escapeRegExp(queryString), 'i').test(item.data.name)
  }
  else{
    return true;
  }
}

function filterGroups({groups, threads, filterFn}){
  return groups ? groups.map(group => {
    return i.updateIn(group, ['threads'], threadIds => {
      return threadIds.filter(threadId => filterFn(threads[threadId]))
    })
  }) : [];
}

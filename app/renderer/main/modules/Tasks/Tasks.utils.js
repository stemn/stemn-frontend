import i from 'icepick';
import { every } from 'lodash';

export const filterBoard = (board, tasks, searchString) => {
  // This will filter the board by the the search string
  const queryStringArray = searchString ? searchString.split(' ') : [];
  return i.updateIn(board, ['data', 'groups'], groups =>
    filterGroups({groups, tasks, filterFn: (task) => {
      return task && task.data ? every(queryStringArray, queryString => queryByString(task, queryString)) : true;
    }})
  )
};

export const getAllTasks = (boardGroups) =>{
  let tasks = [];
  boardGroups.forEach(group => tasks = tasks.concat(group.tasks))
  return tasks;
};

function queryByString(item, queryString){
  /****************************************************
  This is the main query function. It takes in a string
  and will filter the task by this string in some way
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
    return new RegExp(queryString, 'i').test(item.data.name)
  }
  else{
    return true;
  }
}

function filterGroups({groups, tasks, filterFn}){
  return groups ? groups.map(group => {
    return i.updateIn(group, ['tasks'], taskIds => {
      return taskIds.filter(taskId => filterFn(tasks[taskId]))
    })
  }) : [];
}

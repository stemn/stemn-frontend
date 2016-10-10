import i from 'icepick';
import { actions } from 'react-redux-form';
import { every } from 'lodash';

export const filterBoard = (board, tasks, searchString) => {
  // This will filter the board by the the search string
  const queryStringArray = searchString ? searchString.split(' ') : [];
  return i.updateIn(board, ['data', 'groups'], groups =>
    filterGroups({groups, tasks, filterFn: (task) => {
      return task && task.data ? queryByStrings(task, queryStringArray) : true;
    }})
  )
};

export const isFilterActive = (filterArray, filterString, searchString) =>{
  if(filterString == ''){
    // If none of the other keys in this filter are active, set this one to active
    return filterArray.findIndex(filterObject => filterObject.value != '' ? stringContainsWord(searchString, filterObject.value) : false) == -1;
  }
  else{
    // Check if the search string contains the filterString
    return stringContainsWord(searchString, filterString)
  }
};

export const getAllTasks = (boardGroups) =>{
  let tasks = [];
  boardGroups.forEach(group => tasks = tasks.concat(group.tasks))
  return tasks;
};

export const addFilter = ({dispatch, model, value, filterArray, filterString}) => {
  /****************************************************
  This will add the filterString to the model. It will
  remove the strings in the filter Array which are not
  active.

  model: the search string model
  value: the search string value
  filterArray: the array of filter options:
    [{
      text: 'Status: Complete',
      value: 'is:complete',
    },{
      text: 'Status: Incomplete',
      value: 'is:incomplete',
    },{
      text: 'Status: All',
      value: ''
    }];
  filterString: the selected string:
    Status: Complete

  ****************************************************/
  let newSearchString = value;
  filterArray.forEach(filterObject => { newSearchString = replaceWord(newSearchString, filterObject.value, '') }); // Clear the search string
  newSearchString = filterString ? `${newSearchString} ${filterString}` : newSearchString;                         // Add the new filterString
  dispatch(actions.change(model, newSearchString))
};

//////////////////////////////////////////////////////////////////////////////////

function queryByStrings(item, queryStringArray){
  return every(queryStringArray, queryString => queryByString(item, queryString))
}

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
  // Filter by the string itself (case independent)
  else if(queryString && queryString.length > 0){
    return new RegExp(queryString, 'i').test(item.data.name)
  }
  else{
    return true;
  }
}

function filterGroups({groups, tasks, filterFn}){
  return groups.map(group => {
    return i.updateIn(group, ['tasks'], taskIds => {
      return taskIds.filter(taskId => filterFn(tasks[taskId]))
    })
  })
}


function stringContainsWord(fullString, word){
  return fullString && fullString.length > 0 ? fullString.match(new RegExp('(^|\\s+)'+word+'(\\s+|$)')) : false;
}
function replaceWord(fullString, word, newWord){
  return fullString && fullString.length > 0 ? fullString.replace(new RegExp('(^|\\s+)'+word), newWord) : fullString;
}

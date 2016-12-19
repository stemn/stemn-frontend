import { actions } from 'react-redux-form';

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
  // Add the new filterString
  if(newSearchString){
    newSearchString = filterString ? `${newSearchString} ${filterString}` : newSearchString;
  }else if(filterString){
    newSearchString = filterString;
  }
  dispatch(actions.change(model, newSearchString))
};

function stringContainsWord(fullString, word){
  return fullString && fullString.length > 0 ? fullString.match(new RegExp('(^|\\s+)'+word+'(\\s+|$)')) : false;
}
function replaceWord(fullString, word, newWord){
  return fullString && fullString.length > 0 ? fullString.replace(new RegExp('(^|\\s+)'+word), newWord) : fullString;
}

import { actions } from 'react-redux-form';
import { pick, findKey } from 'lodash'

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

// New functions
export const createFilterString = (filterObject, filterModel) => {
  let filterString = ''
  Object.keys(filterObject).forEach((key) => {
    const value = filterObject[key]

    // If this is the 'main' filter item, append directly
    if (filterModel[key] === 'main') {
      filterString = `${filterString}${value} `
    } else {
      // Replace all spaces with _
      const valueNoSpaces = typeof value === 'string'
        ? value.replace(' ', '_')
        : value
      filterString = `${filterString}${key}:${valueNoSpaces} `
    }
  })
  return filterString
}

export const parseFilterString = (filterString, filterModel) => {
  const filterObject = {}
  // Get all the items in the filterString
  const allItems = filterString.split(' ')

  // The ones that contain : are filter items
  const filterItems = allItems.filter(item => item.includes(':'))
  // Parse the filter items
  filterItems.forEach((item) => {
    const [ key, value ] = item.split(':')
    const valueWithSpaces = value.replace('_', ' ')

    const type = filterModel[key]
    // Create cases for each model type
    const cases = {
      bool: () => {
        filterObject[key] = valueWithSpaces === 'true'
      },
      array: () => {
        filterObject[key] = valueWithSpaces.split(',')
      },
      string: () => {
        filterObject[key] = valueWithSpaces
      },
    }
    if (cases[type]) {
      cases[type]()
    } else {
      console.info('Valid filter model not found for:', key, type);
    }
  })

  // The other items are part of the 'main' filter item
  const otherItems = allItems.filter(item => !item.includes(':'))
  const mainFilterItemKey = findKey(filterModel, item => item === 'main')
  filterObject[mainFilterItemKey] = otherItems.join(' ')

  return filterObject
}

export const getFilter = (filterDefaults, filterModel, queryParams) => {
  const validQueryParams = Object.keys(filterModel)
  // Extend the defaults by the valid query params
  const filterObject = Object.assign({}, filterDefaults, pick(queryParams, validQueryParams))
  return {
    object: filterObject,
    string: createFilterString(filterObject, filterModel),
  }
}

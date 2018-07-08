import { get, pick, findKey } from 'lodash'

// export const isFilterActive = (filterArray, filterString, searchString) =>{
//  if(filterString === ''){
//    // If none of the other keys in this filter are active, set this one to active
//    return filterArray.findIndex(filterObject => filterObject.value !== '' ? stringContainsWord(searchString, filterObject.value) : false) === -1;
//  }
//  else{
//    // Check if the search string contains the filterString
//    return stringContainsWord(searchString, filterString)
//  }
// };
//
// export const addFilter = ({dispatch, model, value, filterArray, filterString}) => {
//  /****************************************************
//  This will add the filterString to the model. It will
//  remove the strings in the filter Array which are not
//  active.
//
//  model: the search string model
//  value: the search string value
//  filterArray: the array of filter options:
//    [{
//      text: 'Status: Complete',
//      value: 'is:complete',
//    },{
//      text: 'Status: Incomplete',
//      value: 'is:incomplete',
//    },{
//      text: 'Status: All',
//      value: ''
//    }];
//  filterString: the selected string:
//    Status: Complete
//
//  ****************************************************/
//  let newSearchString = value;
//  filterArray.forEach(filterObject => { newSearchString = replaceWord(newSearchString, filterObject.value, '') }); // Clear the search string
//  // Add the new filterString
//  if(newSearchString){
//    newSearchString = filterString ? `${newSearchString} ${filterString}` : newSearchString;
//  }else if(filterString){
//    newSearchString = filterString;
//  }
//  dispatch(storeChange(model, newSearchString))
// };
//
// function stringContainsWord(fullString, word){
//  return fullString && fullString.length > 0 ? fullString.match(new RegExp('(^|\\s+)'+word+'(\\s+|$)')) : false;
// }
// function replaceWord(fullString, word, newWord){
//  return fullString && fullString.length > 0 ? fullString.replace(new RegExp('(^|\\s+)'+word), newWord) : fullString;
// }

// New functions
export const createFilterString = (filterObject = {}, filterModel) => {
  let filterString = ''
  Object.keys(filterObject).forEach((key) => {
    const value = filterObject[key]
    const type = filterModel[key].type

    // If there is no value,
    // or if is an array with no value, stop
    if (!value || value.length === 0 || (value && value.join && value.join().length === 0)) {
      return
    }

    // If this is the 'main' filter item, append directly
    if (type === 'main') {
      filterString = `${filterString}${value} `
    } else if (type === 'array') {
      const valueNoSpaces = value.join(',').replace(' ', '_')
      filterString = `${filterString}${key}:${valueNoSpaces} `
    } else if (type === 'bool') {
      filterString = `${filterString}${key}:${value} `
    } else {
      const valueNoSpaces = value.replace(' ', '_')
      filterString = `${filterString}${key}:${valueNoSpaces} `
    }
  })
  return filterString
}

export const parseObject = (object = {}, filterModel) => {
  const newObject = {}
  Object.keys(object).forEach((key) => {
    const value = object[key]
    // Replace _ with spaces
    const valueWithSpaces = value.replace('_', ' ')
    // Get the type, bool, array or string
    const type = filterModel[key].type
    // Create cases for each model type
    const cases = {
      bool: () => {
        newObject[key] = valueWithSpaces === 'true'
      },
      array: () => {
        newObject[key] = valueWithSpaces.split(',')
      },
      string: () => {
        newObject[key] = valueWithSpaces
      },
      main: () => {
        newObject[key] = valueWithSpaces
      },
    }
    if (cases[type]) {
      cases[type]()
    } else {
      console.info('Valid filter model not found for:', key, type)
    }
  })
  return newObject
}

export const parseFilterString = (filterString, filterModel) => {
  // Get all the items in the filterString
  const allItems = filterString.split(' ')

  // The ones that contain : are filter items
  const filterItems = allItems.filter(item => item.includes(':'))

  // Split the items and create an object
  const filterItemsObject = filterItems.reduce((accum, item) => {
    const [key, value] = item.split(':')
    accum[key] = value
    return accum
  }, {})

  // The other items are part of the 'main' filter item
  const otherItems = allItems.filter(item => !item.includes(':'))
  const mainFilterItemKey = findKey(filterModel, item => item.type === 'main')
  filterItemsObject[mainFilterItemKey] = otherItems.join(' ')
  const filterObject = parseObject(filterItemsObject, filterModel)
  return filterObject
}

export const parseFilterStringWithPositions = (filterString, filterModel) => {
  // Get all the items in the filterString
  const allItems = filterString.split(' ')

  // We create an array which contains the from/to indexes
  const allItemsWithPosition = allItems.reduce((accum, item, idx) => {
    // We get idx where the last item ended. We add 1 to account for the space
    const prevTo = get(accum, [idx - 1, 'to', 'ch'], -1) + 1
    const [key, value] = item.split(':')
    accum.push({
      key,
      value,
      string: item,
      from: {
        line: 0,
        ch: prevTo,
      },
      to: {
        line: 0,
        ch: prevTo + (item.length === 0 ? 1 : item.length),
      },
    })
    return accum
  }, [])

  // Filter by items without a key
  const filteredItems = allItemsWithPosition.filter((item) => {
    const validationFn = get(filterModel, [item.key, 'validation'])
    if (validationFn) {
      // If we find a validation function on the filterModel, use it
      return validationFn(item.value)
    } 
    // Othwerwise, this is an invalid item
    return false
  })

  // Transform the value
  const itemsWithTransformedValue = filteredItems.map((item) => {
    const transformFn = get(filterModel, [item.key, 'transform'])
    return {
      ...item,
      transformedValue: transformFn ? transformFn(item.value) : item.value,
    }
  })

  return itemsWithTransformedValue
}

export const getFilter = (filterDefaults, filterModel, queryParams) => {
  const validQueryParams = Object.keys(filterModel)
  // Extend the defaults by the valid query params
  const filterObject = Object.assign({}, filterDefaults, pick(queryParams, validQueryParams))
  const filterObjectParsed = parseObject(filterObject, filterModel)
  return {
    object: filterObjectParsed,
    string: createFilterString(filterObjectParsed, filterModel),
  }
}

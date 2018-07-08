export const toggle = ({ cacheKey, value }) => (dispatch, getState) => {
  const currentValue = getState().togglePanel[cacheKey]
    
  // If value == null - we toggle.
  // Otherwise, we set it to the value.
    
  dispatch({
    type: 'TOGGLE_PANEL/TOGGLE',
    payload: {
      cacheKey,
      value: value === null ? !currentValue : value,
    },
  })
}
export const toggleMulti = ({ cacheKeys }) => (dispatch, getState) => {
  const newValue = cacheKeys && cacheKeys[0] ? !getState().togglePanel[cacheKeys[0]] : false
  dispatch({
    type: 'TOGGLE_PANEL/TOGGLE_MULTI',
    payload: {
      cacheKeys,
      value: newValue,
    },
  })
}

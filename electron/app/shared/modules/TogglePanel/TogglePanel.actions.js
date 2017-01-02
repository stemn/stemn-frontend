export const toggle = ({cacheKey, value}) => {
  return (dispatch, getState) => {
    const currentValue = getState().togglePanel[cacheKey];
    
    // If value == null - we toggle.
    // Otherwise, we set it to the value.
    
    dispatch({
      type: 'TOGGLE_PANEL/TOGGLE',
      payload: {
        cacheKey,
        value: value === null ? !currentValue : value
      }
    })
  }
}
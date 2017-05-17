export const ctrlEnterHandler = (element, handler) => {
  element.addEventListener('keydown', (e) => {
    if(e.keyCode===13 && e.ctrlKey) {
      handler()
    }
  });
}

export const modeled = (reducer, reducerKey) => (state, action) => {
  return reducer(state, action)
}

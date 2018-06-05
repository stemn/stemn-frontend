export const storeChange = (model, value) => ({
  type: 'STORE/CHANGE',
  payload: {
    model,
    value,
  },
})

export const storeLoad = (model, value) => ({
  type: 'STORE/LOAD',
  payload: {
    model,
    value,
  },
})

export const storePush = (model, item) => ({
  type: 'STORE/PUSH',
  payload: {
    model,
    item,
  },
})

export const storeToggle = model => ({
  type: 'STORE/TOGGLE',
  payload: {
    model,
  },
})

export const storeRemove = (model, index) => ({
  type: 'STORE/REMOVE',
  payload: {
    model,
    index,
  },
})
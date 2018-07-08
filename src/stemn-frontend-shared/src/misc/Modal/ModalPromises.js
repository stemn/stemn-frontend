export const promises = {

}

export const getPromise = (modalId) => {
  if (promises[modalId]) {
    return promises[modalId]
  } 
  console.error('Promise not found')
}

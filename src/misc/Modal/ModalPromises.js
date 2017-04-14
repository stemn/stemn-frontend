export const promises = {

}

export const getPromise = (modalId) => {
  if (promises[modalId]) {
    return promises[modalId]
  } else {
    console.error('Promise not found');
  }
}

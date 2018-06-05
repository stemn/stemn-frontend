export const loadCode = (systemImport, cacheKey) => ({
  type: 'CODE_SPLITTING/LOAD',
  payload: systemImport.then(response => 'success'),
  meta: {
    cacheKey,
  },
})

export const loading = cacheKey => ({
  type: 'CODE_SPLITTING/LOADING',
  meta: {
    cacheKey,
  },
})
export const complete = cacheKey => ({
  type: 'CODE_SPLITTING/COMPLETE',
  meta: {
    cacheKey,
  },
})

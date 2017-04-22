export const loadCode = (systemImport, cacheKey) => ({
  type: 'CODE_SPLITTING/LOAD',
  payload: systemImport.then(response => 'success'),
  meta: {
    cacheKey,
  },
})

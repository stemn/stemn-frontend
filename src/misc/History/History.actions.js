export const getHistory = ({ entityType, entityId, parentType, parentId, cacheKey, from, to }) => ({
  type: 'HISTORY/GET_HISTORY',
  http: true,
  payload: {
    url: 'api/v1/history',
    params: {
      entityType,
      entityId,
      parentType,
      parentId,
      transform: true,
      from,
      to,
    },
  },
  meta: {
    cacheKey,
  },
})

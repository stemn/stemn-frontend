export const getHistory = ({
  cacheKey,
  entityId,
  entityType,
  from,
  parentId,
  parentType,
  to,
  types,
}) => ({
  type: 'HISTORY/GET_HISTORY',
  http: true,
  payload: {
    url: 'api/v1/history',
    params: {
      entityId,
      entityType,
      from,
      parentId,
      parentType,
      to,
      types,
    },
  },
  meta: {
    cacheKey,
  },
})

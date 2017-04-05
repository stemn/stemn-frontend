export const like = (entityId) => ({
  type: 'LIKES/LIKE',
  payload: entityId,
})
export const unlike = (entityId) => ({
  type: 'LIKES/UN_LIKE',
  payload: entityId,
})
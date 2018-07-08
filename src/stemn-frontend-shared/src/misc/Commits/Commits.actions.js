import http from 'axios'

export const getCommit = ({ commitId }) => ({
  type: 'COMMITS/GET_COMMIT',
  payload: http(`api/v1/commits/${commitId}`),
  meta: {
    cacheKey: commitId,
  },
})
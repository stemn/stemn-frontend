import http from 'axios';

export const getLatest = () => ({
  type: 'DESKTOP_RELEASES/GET_LATEST',
  payload: http({
    method: 'GET',
    url: '/api/v1/frontend/latest',
    headers: {
      Authorization: null,
    },
  }),
})

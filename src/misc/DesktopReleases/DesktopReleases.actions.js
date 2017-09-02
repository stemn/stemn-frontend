import http from 'axios'

const repoOwner = 'stemn'
const repoName = 'Stemn-Desktop'

export const getLatest = () => ({
  type: 'DESKTOP_RELEASES/GET_LATEST',
  payload: http({
    method: 'GET',
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`,
    headers: {
      Authorization: null,
    },
  }),
})

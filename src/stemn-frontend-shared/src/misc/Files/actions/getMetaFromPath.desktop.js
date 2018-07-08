export default ({ path, cacheKey }) => (dispatch, getState) => {
  const providerPaths = getState().system.providerPath
  const provider = Object.keys(providerPaths).find(provider => path.startsWith(providerPaths[provider]))
  const shortPath = path.replace(providerPaths[provider], '').replace('\\', '/')
  const pathNoSlash = shortPath[0] === '/' ? shortPath.substring(1) : shortPath
  if (provider && shortPath) {
    dispatch({
      type: 'FILES/GET_META_FROM_PATH',
      http: true,
      payload: {
        method: 'GET',
        url: `/api/v1/remote/pathToId/${provider}/${pathNoSlash}`,
      },
      meta: {
        cacheKey,
      },
    })
  }
}

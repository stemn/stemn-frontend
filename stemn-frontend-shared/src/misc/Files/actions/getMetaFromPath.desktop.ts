import type { StemnThunk } from 'stemn-shared/redux/types'
import type { IDesktopPathState } from './getFullPath.desktop'

/** Finds the file at a local path: the provider is the one whose local folder contains it */
export const getMetaFromPath =
  ({ path, cacheKey }: { path: string; cacheKey: string }): StemnThunk<void, Pick<IDesktopPathState, 'system'>> =>
  (dispatch, getState) => {
    const providerPaths = getState().system.providerPath
    const provider = Object.keys(providerPaths).find((prov) => path.startsWith(providerPaths[prov]))
    if (provider) {
      const shortPath = path.replace(providerPaths[provider], '').replaceAll('\\', '/')
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
    } else {
      console.error('Provider not found')
    }
  }

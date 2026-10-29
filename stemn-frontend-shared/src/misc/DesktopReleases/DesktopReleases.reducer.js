import { produce } from 'immer'

const initialState = {
  latest: {
    version: '',
    windows: {},
    linux: {},
    mac: {},
  },
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'DESKTOP_RELEASES/GET_LATEST_FULFILLED':
      return produce(state, (draft) => {
        draft.latest = {
          version: action.payload.data.name,
          windows: action.payload.data.assets.find((asset) => asset.name.endsWith('.exe')),
          linux: action.payload.data.assets.find((asset) => asset.name.endsWith('.AppImage')),
          mac: action.payload.data.assets.find((asset) => asset.name.endsWith('.dmg')),
        }
      })

    default:
      return state
  }
}

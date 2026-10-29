import { LOCATION_CHANGE } from './actions'
import { LegacyLocation } from './query'

export interface IRoutingState {
  locationBeforeTransitions: LegacyLocation | null,
}

const initialState: IRoutingState = {
  locationBeforeTransitions: null,
}

/**
 * Replacement for react-router-redux's routerReducer.
 * Stores the current location (with a parsed `query`) under `locationBeforeTransitions`.
 */
export const routerReducer = (state: IRoutingState = initialState, action: any): IRoutingState => {
  if (action.type === LOCATION_CHANGE) {
    return { ...state, locationBeforeTransitions: action.payload }
  }
  return state
}

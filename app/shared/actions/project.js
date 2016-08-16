import { push } from 'react-router-redux'

export const SET_ACTIVE_PROJECT = 'PROJECT/SET_ACTIVE_PROJECT';

export function setActiveProject({stub}) {
  return {
    type: SET_ACTIVE_PROJECT,
    payload: {stub}
  }
}

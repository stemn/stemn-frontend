import { push } from 'react-router-redux'

export const SET_ACTIVE_PROJECT = 'PROJECT/SET_ACTIVE_PROJECT';

export function setActiveProject({stub}) {
  return (dispatch) => {
    dispatch({
      type: SET_ACTIVE_PROJECT,
      payload: {stub}
    })
    setTimeout(()=>{
      console.log('here');
      dispatch(push({
        pathname: `/project/${stub}/changes`,
        state: {
          meta: {scope: 'menubarRenderer'}
        }
      }))
    }, 1)
  }
}

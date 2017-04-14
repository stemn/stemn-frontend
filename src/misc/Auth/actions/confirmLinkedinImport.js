import { showConfirm } from 'stemn-shared/misc/Modal/Modal.actions.js'
import authenticate from './Authenticate'

export default () => (dispatch) => {
  return dispatch(showConfirm({
    message: `
      This will <strong>overwrite</strong> parts of your Stemn user profile using information from your Linkedin profile.
      <br /><br />
      If you are unsure, you should make a copy of your Stemn profile's summary and education sections.
    `,
  })).then((result) => {
    dispatch(authenticate('linkedin'))
  })
}



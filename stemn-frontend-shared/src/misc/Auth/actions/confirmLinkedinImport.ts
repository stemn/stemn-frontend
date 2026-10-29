import { showConfirm } from 'stemn-shared/misc/Modal/Modal.actions'
import authenticate from './authenticate'
import { getUser } from 'stemn-shared/misc/Users/Users.actions'
import type { StemnThunk } from 'stemn-shared/redux/types'

/** Website only: re-authenticates with Linkedin, which imports the Linkedin profile into the user */
export default (): StemnThunk<Promise<void>> => (dispatch, getState) =>
  dispatch(
    showConfirm({
      message: `
      This will <strong>overwrite</strong> parts of your Stemn user profile using information from your Linkedin profile.
      <br /><br />
      If you are unsure, you should make a copy of your Stemn profile's summary and education sections.
    `,
    }),
  ).then((result: unknown) => {
    // The website's authenticate returns the OAuth promise (the desktop variant returns the plain action)
    ;(dispatch(authenticate('linkedin')) as Promise<unknown>).then((response) =>
      // We get the new user data
      dispatch(
        getUser({
          userId: getState().auth.user._id,
          size: 'lg',
          force: true,
        }),
      ),
    )
  })

import { parseQuery, stringifyQuery } from 'stemn-shared/routing/query'

import { oauthCreds } from '../Auth.config'
import sendAuthToken from './sendAuthToken'
import type { Authenticate, IOAuthCallbackQuery } from './types'

const getPosition = (w: number, h: number) => ({
  left: screen.width / 2 - w / 2,
  top: screen.height / 2 - h / 2,
})

const popOauth = (url: string) =>
  new Promise<IOAuthCallbackQuery>((resolve, reject) => {
    const interval = 500
    const width = 780
    const height = 410
    const position = getPosition(width, height)
    const options = `width=${width},height=${height},toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0,left=${position.left},top=${position.top}`
    // null when the browser blocks the popup: `focus()` below then throws and the promise rejects
    const signinWin = window.open(url, 'SignIn', options) as Window

    const check = () => {
      // if you access signinWin.location.search directly, chrome will throw CORS error
      // so get the keys and check for the existance of search before accessing it
      const query = Object.keys(signinWin.location).includes('search') ? signinWin.location.search.substr(1) : ''

      const queryParams = parseQuery(query)
      if (queryParams.code) {
        // The provider redirects with a single `code`
        resolve(queryParams as IOAuthCallbackQuery)
        signinWin.close()
      } else if (signinWin.closed) {
        reject('Window Closed')
      } else {
        setTimeout(check, interval)
      }
    }

    setTimeout(check, interval)
    signinWin.focus()
  })

const authenticate: Authenticate = (provider) => (dispatch) => {
  if (oauthCreds[provider]) {
    const url = `${oauthCreds[provider].url}${stringifyQuery(oauthCreds[provider].params)}`

    return dispatch({
      type: 'AUTH/AUTHENTICATE',
      payload: popOauth(url),
    }).then(({ value: { code } }) =>
      dispatch(
        sendAuthToken({
          provider,
          code,
        }),
      ),
    )
  }
}

export default authenticate

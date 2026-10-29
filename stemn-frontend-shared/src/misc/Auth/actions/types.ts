import type { StemnThunk } from 'stemn-shared/redux/types'
import type { OAuthProvider } from '../Auth.types'

/** The query the OAuth provider redirects back with */
export interface IOAuthCallbackQuery {
  code: string
  [param: string]: string | string[]
}

export interface IAuthenticateAction {
  type: 'AUTH/AUTHENTICATE'
  /** Website: the OAuth popup. Desktop: `{}` (the system browser redirects to the app's local API server) */
  payload: Promise<IOAuthCallbackQuery> | Record<string, never>
}

export interface ISendAuthTokenInput {
  provider: OAuthProvider
  /** The authorization code from the OAuth redirect */
  code: string
}

// The contracts both platform variants (`X.web.ts`, `X.desktop.ts`) implement, so shared code that imports
// `./X` sees the same API on both platforms.

/**
 * Website: OAuth popup, then sendAuthToken (returns that promise). Desktop: opens the system browser and returns
 * the AUTH/AUTHENTICATE action. Undefined for an unknown provider.
 */
export type Authenticate = (provider: OAuthProvider) => StemnThunk<Promise<unknown> | IAuthenticateAction | undefined>

/** Exchanges the authorization code for a token (AUTH/POST_AUTHENTICATE), then loads the session */
export type SendAuthToken = (input: ISendAuthTokenInput) => StemnThunk<Promise<void> | undefined>

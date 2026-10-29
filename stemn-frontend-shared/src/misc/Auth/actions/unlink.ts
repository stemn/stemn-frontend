import http from 'axios'
import type { IAuthUser, OAuthProvider } from '../Auth.types'

/** Unlinks a provider account; the response holds the remaining accounts */
export default (provider: OAuthProvider) => ({
  type: 'AUTH/UNLINK' as const,
  payload: http<Pick<IAuthUser, 'accounts'>>({
    url: `/api/v1/auth/unlink/${provider}`,
    method: 'POST',
  }),
})

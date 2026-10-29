import type { PermissionRole } from './Auth.utils'

/** The OAuth providers the app can authenticate (and link accounts) with */
export type OAuthProvider = 'facebook' | 'google' | 'linkedin' | 'dropbox'

/** A linked account of the user (`user.accounts.<provider>`) */
export interface IAuthAccount {
  id?: string
  email?: string
  [field: string]: unknown
}

/** The logged in user (`GET /api/v1/me`). The store holds a Partial<IAuthUser>: `{}` until it is loaded */
export interface IAuthUser {
  _id: string
  name?: string
  firstname?: string
  lastname?: string
  email?: string
  picture?: string
  beta?: boolean
  accounts?: Partial<Record<OAuthProvider | 'local', IAuthAccount>>
  [field: string]: unknown
}

/** A member of a project team, as the permission helpers read it */
export interface ITeamMember {
  _id: string
  permissions?: { role: PermissionRole }
}

/** `{ token }`: the body of the login, register, OAuth, token and password responses */
export interface ITokenResponse {
  token: string
}

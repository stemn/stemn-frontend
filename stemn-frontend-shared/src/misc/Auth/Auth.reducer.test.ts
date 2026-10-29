import { describe, expect, it } from 'vitest'
import reducer from './Auth.reducer'

const user = { _id: 'user1', name: 'Ada', accounts: { google: { id: 'g1' }, dropbox: { id: 'd1' } } }

const makeState = (): any => ({
  authLoading: false,
  userLoading: false,
  emailUpdatePending: false,
  updatePasswordPending: false,
  authToken: 'token-1',
  projects: { loading: false, data: null },
  user,
  login: { email: 'ada@example.com', password: '', firstname: '', lastname: '' },
  passwordLost: { email: '' },
  passwordSet: { password1: 'a', password2: 'a', oldPassword: 'b' },
  forms: {},
  background: 3,
  hydrated: true,
})

describe('Auth reducer', () => {
  const prev = makeState()

  it('hydrates a persisted state with the initial keys', () => {
    const next = reducer({ authToken: 'persisted' }, { type: 'OTHER' })
    expect(next).toMatchObject({ authToken: 'persisted', authLoading: false, user: {}, hydrated: true })
  })

  it.each([
    ['AUTH/LOAD_USER_DATA_PENDING', {}, { userLoading: true }],
    ['AUTH/LOAD_USER_DATA_REJECTED', {}, { userLoading: false }],
    ['AUTH/SET_AUTH_TOKEN', { payload: 'token-2' }, { authToken: 'token-2' }],
    ['AUTH/REMOVE_AUTH_TOKEN', {}, { authToken: null }],
    ['AUTH/POST_AUTHENTICATE_PENDING', {}, { authLoading: true }],
    [
      'AUTH/POST_AUTHENTICATE_FULFILLED',
      { payload: { data: { token: 'token-3' } } },
      { authToken: 'token-3', authLoading: false },
    ],
    ['AUTH/POST_AUTHENTICATE_REJECTED', {}, { authLoading: false }],
    ['AUTH/GET_TOKEN_FULFILLED', { payload: { data: { token: 'token-4' } } }, { authToken: 'token-4' }],
    ['AUTH/LOGIN_PENDING', {}, { authLoading: true }],
    ['AUTH/LOGIN_FULFILLED', { payload: { data: { token: 'token-5' } } }, { authToken: 'token-5', authLoading: false }],
    ['AUTH/LOGIN_REJECTED', {}, { authLoading: false }],
    ['AUTH/UPDATE_EMAIL_PENDING', {}, { emailUpdatePending: true }],
    ['AUTH/UPDATE_EMAIL_FULFILLED', {}, { emailUpdatePending: false }],
    ['AUTH/UPDATE_EMAIL_REJECTED', {}, { emailUpdatePending: false }],
    ['AUTH/PASSWORD_UPDATE_PENDING', {}, { updatePasswordPending: true }],
    ['AUTH/PASSWORD_UPDATE_REJECTED', {}, { updatePasswordPending: false }],
    ['AUTH/REGISTER_PENDING', {}, { authLoading: true }],
    [
      'AUTH/REGISTER_FULFILLED',
      { payload: { data: { token: 'token-6' } } },
      { authToken: 'token-6', authLoading: false },
    ],
    ['AUTH/REGISTER_REJECTED', {}, { authLoading: false }],
  ])('%s updates the flags and keeps the other branches', (type, extra, changes) => {
    const next = reducer(prev, { type, ...extra })
    expect(next).toEqual({ ...prev, ...changes })
    expect(next.user).toBe(prev.user)
    expect(next.login).toBe(prev.login)
  })

  it('AUTH/LOAD_USER_DATA_FULFILLED and AUTH/UPDATE_USER store the user', () => {
    const newUser = { _id: 'user1', name: 'Ada L.' }
    const loaded = reducer(prev, { type: 'AUTH/LOAD_USER_DATA_FULFILLED', payload: { data: newUser } })
    expect(loaded.user).toBe(newUser)
    expect(loaded.userLoading).toBe(false)
    const updated = reducer(prev, { type: 'AUTH/UPDATE_USER', payload: { user: newUser } })
    expect(updated.user).toBe(newUser)
    expect(updated.login).toBe(prev.login)
  })

  it('AUTH/PASSWORD_UPDATE_FULFILLED stores the token and clears the password form', () => {
    const next = reducer(prev, { type: 'AUTH/PASSWORD_UPDATE_FULFILLED', payload: { data: { token: 'token-7' } } })
    expect(next.authToken).toBe('token-7')
    expect(next.passwordSet).toEqual({ password1: '', password2: '', oldPassword: '' })
    expect(next.user).toBe(prev.user)
  })

  it('AUTH/UNLINK_FULFILLED replaces the user accounts', () => {
    const accounts = { google: { id: 'g1' } }
    const next = reducer(prev, { type: 'AUTH/UNLINK_FULFILLED', payload: { data: { accounts } } })
    expect(next.user).toEqual({ ...user, accounts })
    expect(next.user.accounts).toBe(accounts)
    expect(next.login).toBe(prev.login)
    expect(next.projects).toBe(prev.projects)
  })

  it('AUTH/NEXT_BACKGROUND cycles through the backgrounds', () => {
    const next = reducer(prev, { type: 'AUTH/NEXT_BACKGROUND' })
    expect(next.background).toBe(4)
    expect(next.user).toBe(prev.user)
    expect(reducer({ ...prev, background: 8 }, { type: 'AUTH/NEXT_BACKGROUND' }).background).toBe(1)
  })

  it('AUTH/LOGOUT resets to the initial state', () => {
    const next = reducer(prev, { type: 'AUTH/LOGOUT' })
    expect(next).toMatchObject({ authToken: null, user: {}, login: { email: '' }, hydrated: true })
  })

  it('returns the same state when nothing changes', () => {
    expect(reducer(prev, { type: 'AUTH/INIT_HTTP_HEADER' })).toBe(prev)
    expect(reducer(prev, { type: 'AUTH/UNLINK_FULFILLED', payload: { data: { accounts: user.accounts } } })).toBe(prev)
    expect(reducer(prev, { type: 'OTHER' })).toBe(prev)
  })
})

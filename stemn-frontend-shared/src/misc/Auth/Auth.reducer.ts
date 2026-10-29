import { produce } from 'immer'
import type { UnknownAction } from 'redux'
import { setIn } from 'stemn-shared/redux/draft'
import type { HttpLifecycleActions } from 'stemn-shared/redux/types'
import type { IAuthAccount, IAuthUser, ITokenResponse, OAuthProvider } from './Auth.types'

const numBackgrounds = 8

export interface IAuthState {
  authLoading: boolean
  userLoading: boolean
  emailUpdatePending: boolean
  updatePasswordPending: boolean
  authToken: string | null

  /** Not written by any action (legacy) */
  projects: {
    loading: boolean
    data: unknown
  }

  /** `{}` until the user is loaded, and after a logout */
  user: Partial<IAuthUser>
  login: {
    email: string
    password: string
    firstname: string
    lastname: string
  }
  passwordLost: {
    email: string
  }
  passwordSet: {
    password1: string
    password2: string
    oldPassword: string
  }
  /** Temporary form values written through STORE/CHANGE, e.g. `newEmail` */
  forms: Record<string, unknown>
  /** The login/register page background, 1 to 8 */
  background: number
  /** Set once a persisted (redux-persist) state has been merged with the initial state */
  hydrated?: boolean
}

const initialState: IAuthState = {
  authLoading: false,
  userLoading: false,
  emailUpdatePending: false,
  updatePasswordPending: false,
  authToken: null,

  projects: {
    loading: false,
    data: null,
  },

  user: {},
  login: {
    email: '',
    password: '',
    firstname: '',
    lastname: '',
  },
  passwordLost: {
    email: '',
  },
  passwordSet: {
    password1: '',
    password2: '',
    oldPassword: '',
  },
  forms: {
    // Some forms for temp data
  },
  background: Math.floor(Math.random() * numBackgrounds) + 1, // We init a random number between 1 and 8 to use as the background
}

/** The actions this reducer handles */
export type AuthAction =
  | { type: 'AUTH/INIT_HTTP_HEADER' }
  | HttpLifecycleActions<'AUTH/LOAD_USER_DATA', IAuthUser>
  | { type: 'AUTH/SET_AUTH_TOKEN'; payload: string }
  | { type: 'AUTH/REMOVE_AUTH_TOKEN' }
  | HttpLifecycleActions<'AUTH/POST_AUTHENTICATE', ITokenResponse>
  | HttpLifecycleActions<'AUTH/GET_TOKEN', ITokenResponse>
  | HttpLifecycleActions<'AUTH/UNLINK', { accounts: Partial<Record<OAuthProvider | 'local', IAuthAccount>> }>
  | HttpLifecycleActions<'AUTH/LOGIN', ITokenResponse>
  | HttpLifecycleActions<'AUTH/UPDATE_EMAIL', unknown>
  | HttpLifecycleActions<'AUTH/PASSWORD_UPDATE', ITokenResponse>
  | HttpLifecycleActions<'AUTH/REGISTER', ITokenResponse>
  | { type: 'AUTH/UPDATE_USER'; payload: { user: IAuthUser } }
  | { type: 'AUTH/NEXT_BACKGROUND'; payload?: object }
  | { type: 'AUTH/LOGOUT' }

const mainReducer = (state: IAuthState, action: AuthAction): IAuthState => {
  switch (action.type) {
    case 'AUTH/INIT_HTTP_HEADER':
      return state
    case 'AUTH/LOAD_USER_DATA_PENDING':
      return { ...state, userLoading: true }
    case 'AUTH/LOAD_USER_DATA_FULFILLED':
      return { ...state, userLoading: false, user: action.payload.data }
    case 'AUTH/LOAD_USER_DATA_REJECTED':
      return { ...state, userLoading: false }

    case 'AUTH/SET_AUTH_TOKEN':
      return { ...state, authToken: action.payload }
    case 'AUTH/REMOVE_AUTH_TOKEN':
      return { ...state, authToken: null }

    case 'AUTH/POST_AUTHENTICATE_PENDING':
      return { ...state, authLoading: true }
    case 'AUTH/POST_AUTHENTICATE_FULFILLED':
      return { ...state, authToken: action.payload.data.token, authLoading: false }
    case 'AUTH/POST_AUTHENTICATE_REJECTED':
      return { ...state, authLoading: false }

    case 'AUTH/GET_TOKEN_FULFILLED':
      return { ...state, authToken: action.payload.data.token }

    case 'AUTH/UNLINK_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['user', 'accounts'], action.payload.data.accounts)
      })

    case 'AUTH/LOGIN_PENDING':
      return { ...state, authLoading: true }
    case 'AUTH/LOGIN_FULFILLED':
      return { ...state, authLoading: false, authToken: action.payload.data.token }
    case 'AUTH/LOGIN_REJECTED':
      return { ...state, authLoading: false }

    case 'AUTH/UPDATE_EMAIL_PENDING':
      return { ...state, emailUpdatePending: true }
    case 'AUTH/UPDATE_EMAIL_FULFILLED':
      return { ...state, emailUpdatePending: false }
    case 'AUTH/UPDATE_EMAIL_REJECTED':
      return { ...state, emailUpdatePending: false }

    case 'AUTH/PASSWORD_UPDATE_PENDING':
      return { ...state, updatePasswordPending: true }
    case 'AUTH/PASSWORD_UPDATE_FULFILLED':
      return {
        ...state,
        updatePasswordPending: false,
        authToken: action.payload.data.token,
        passwordSet: {
          password1: '',
          password2: '',
          oldPassword: '',
        },
      }
    case 'AUTH/PASSWORD_UPDATE_REJECTED':
      return { ...state, updatePasswordPending: false }

    case 'AUTH/REGISTER_PENDING':
      return { ...state, authLoading: true }
    case 'AUTH/REGISTER_FULFILLED':
      return { ...state, authLoading: false, authToken: action.payload.data.token }
    case 'AUTH/REGISTER_REJECTED':
      return { ...state, authLoading: false }
    case 'AUTH/UPDATE_USER':
      return { ...state, user: action.payload.user }

    case 'AUTH/NEXT_BACKGROUND':
      return produce(state, (draft) => {
        draft.background = state.background + 1 <= numBackgrounds ? state.background + 1 : 1
      })

    case 'AUTH/LOGOUT':
      return Object.assign({}, state, initialState)

    default:
      return state
  }
}

/** `state` may be a partial persisted state (redux-persist), merged with the initial state once */
export default function (state: Partial<IAuthState> = initialState, action: AuthAction | UnknownAction): IAuthState {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true }
  }
  // A hydrated state has every key (it was merged with the initial state above, on an earlier call).
  // Every action of the app comes through here; the switch only reads the ones it knows.
  return mainReducer(state as IAuthState, action as AuthAction)
}

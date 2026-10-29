import type { IAuthUser } from '../Auth.types'

export default ({ user }: { user: IAuthUser }) => ({
  type: 'AUTH/UPDATE_USER' as const,
  payload: {
    user,
  },
})

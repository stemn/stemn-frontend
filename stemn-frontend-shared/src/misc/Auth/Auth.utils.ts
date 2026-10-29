import { get } from 'lodash'
import type { IAuthUser, ITeamMember } from './Auth.types'

// These are in order
const permissionLevels = {
  public: 1,
  user: 2,
  viewer: 3,
  collaborator: 4,
  admin: 5,
  superAdmin: 6,
}

export type PermissionRole = keyof typeof permissionLevels

export const permissionsGetLevel = (role: PermissionRole) => permissionLevels[role]

export const permissionsIsMin = (role: PermissionRole, minRole: PermissionRole) =>
  permissionsGetLevel(role) >= permissionsGetLevel(minRole)

/** The current user owns the entity, or has at least `minRole` in its team */
export const getCanEdit = (
  currentUser: Partial<IAuthUser>,
  owner: { _id: string } | undefined,
  team: ITeamMember[] | undefined,
  minRole: PermissionRole,
) => {
  const isOwner = owner && owner._id === currentUser._id
  const currentUserRole =
    team &&
    get(
      team.find((member) => member._id === currentUser._id),
      'permissions.role',
    )
  const isMinRole = currentUserRole && permissionsIsMin(currentUserRole, minRole)
  return isOwner || isMinRole
}

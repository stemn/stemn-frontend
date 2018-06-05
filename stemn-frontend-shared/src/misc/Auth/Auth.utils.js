import { get } from 'lodash'
// These are in order
const permissionLevels = {
  public: 1,
  user: 2,
  viewer: 3,
  collaborator: 4,
  admin: 5,
  superAdmin: 6,
}

export const permissionsGetLevel = role => permissionLevels[role]

export const permissionsIsMin = (role, minRole) => permissionsGetLevel(role) >= permissionsGetLevel(minRole)

export const getCanEdit = (currentUser, owner, team, minRole) => {
  const isOwner = owner && owner._id === currentUser._id
  const currentUserRole = team && get(team.find(member => member._id === currentUser._id), 'permissions.role')
  const isMinRole = currentUserRole && permissionsIsMin(currentUserRole, minRole)
  return isOwner || isMinRole
}

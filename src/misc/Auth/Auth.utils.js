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

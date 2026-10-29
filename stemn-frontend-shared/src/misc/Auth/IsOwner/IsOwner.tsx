import { Component, type ReactNode } from 'react'
import { connect } from 'react-redux'
import { permissionsIsMin, type PermissionRole } from 'stemn-shared/misc/Auth/Auth.utils'
import type { ITeamMember } from 'stemn-shared/misc/Auth/Auth.types'
import type { ISharedStoreState } from 'stemn-shared/redux/types'

export interface IIsOwnerProps {
  /** Show the children to this user... */
  ownerId?: string
  /** ...or to the team members with at least `minRole` */
  team?: ITeamMember[]
  minRole?: PermissionRole
  children?: ReactNode
}

/** Renders its children only for the owner, or a team member with the minimum role */
class IsOwner extends Component<IIsOwnerProps & { userId?: string }> {
  render() {
    const { userId, minRole, team, ownerId, children } = this.props
    let template: ReactNode = null

    if (ownerId && ownerId === userId) {
      // If we are just checking owner... Do it
      template = children
    } else if (team) {
      // If we are checking team permissions...
      const userInfo = team.find((member) => member._id === userId)
      // (without a minRole no role is enough, as before: the level comparison with undefined is false)
      if (
        userInfo &&
        userInfo.permissions &&
        minRole !== undefined &&
        permissionsIsMin(userInfo.permissions.role, minRole)
      ) {
        template = children
      }
    }

    return template
  }
}

const mapStateToProps = ({ auth }: Pick<ISharedStoreState, 'auth'>) => ({
  userId: auth.user._id,
})

export default connect(mapStateToProps)(IsOwner)

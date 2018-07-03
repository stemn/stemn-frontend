import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { permissionsIsMin } from 'stemn-shared/misc/Auth/Auth.utils'

class IsOwner extends Component {
  static propTypes = {
    ownerId: PropTypes.string,
    team: PropTypes.array,
    userId: PropTypes.string,
    children: PropTypes.node.isRequired,
    minRole: PropTypes.string,
  }
  render() {
    const { userId, minRole, team, ownerId, children } = this.props
    let template = null

    if (ownerId && ownerId === userId) {
      // If we are just checking owner... Do it
      template = children
    } else if (team) {
      // If we are checking team permissions...
      const userInfo = team.find(member => member._id === userId)
      if (userInfo && userInfo.permissions && permissionsIsMin(userInfo.permissions.role, minRole)) {
        template = children
      }
    }

    return template
  }
}

const mapStateToProps = ({ auth }) => ({
  userId: auth.user._id,
})

export default connect(mapStateToProps)(IsOwner)

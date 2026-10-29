import { Component } from 'react'
import { connect } from 'react-redux'
import { replace } from 'stemn-shared/routing'

const stateToProps = ({ auth }) => ({
  authToken: auth.authToken,
  userId: auth.user._id,
})

const dispatchToProps = {
  goHome: () => replace('/'),
}

class LoginContainer extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    const authChanged = nextProps.authToken !== this.props.authToken || nextProps.userId !== this.props.userId
    if (authChanged && nextProps.authToken && nextProps.userId) {
      nextProps.goHome()
    }
  }
  componentDidMount() {
    if (this.props.authToken && this.props.userId) {
      this.props.goHome()
    }
  }
  render() {
    return this.props.children
  }
}

export default connect(stateToProps, dispatchToProps)(LoginContainer)

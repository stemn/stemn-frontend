import { Component } from 'react'
import { connect } from 'react-redux'
import { replace } from 'stemn-shared/routing'

const stateToProps = ({ auth }) => ({
  authToken: auth.authToken,
  userId: auth.user._id,
})

const dispatchToProps = {
  goLogin: () => replace('/login'),
}

class LoginContainer extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.authToken !== this.props.authToken || nextProps.userId !== this.props.userId) {
      this.onMount(nextProps)
    }
  }
  componentDidMount() {
    this.onMount(this.props)
  }
  onMount = (props) => {
    if (!props.authToken || !props.userId) {
      props.goLogin()
    }
  }
  render() {
    return this.props.children
  }
}

export default connect(stateToProps, dispatchToProps)(LoginContainer)

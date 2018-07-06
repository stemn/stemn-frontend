import { connect } from 'react-redux'
import LoginPage from 'stemn-shared/pages/Login/Login'

import {
  nextBackground,
  authenticate,
  login, 
} from 'stemn-shared/misc/Auth/Auth.actions.js'
console.log({
  nextBackground,
  authenticate,
  login, 
})

function mapStateToProps({ auth }) {
  return { auth }
}

const mapDispatchToProps = {
  nextBackground,
  authenticate,
  login,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)

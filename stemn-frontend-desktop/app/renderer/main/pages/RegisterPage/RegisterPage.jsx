import { connect } from 'react-redux'
import RegisterPage from 'stemn-shared/pages/Register/Register'

import {
  nextBackground,
  authenticate,
  register } from 'stemn-shared/misc/Auth/Auth.actions.js'

function mapStateToProps({ auth }) {
  return { auth }
}

const mapDispatchToProps = {
  nextBackground,
  authenticate,
  register,
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage)

import { connect } from 'react-redux';
import LoginPage from 'stemn-shared/pages/Login/Login';

import {
  nextBackground,
  authenticate,
  login } from 'stemn-shared/misc/Auth/Auth.actions.js';

function mapStateToProps({ auth }) {
  return { auth };
}

function mapDispatchToProps = {
  nextBackground,
  authenticate,
  login
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Login from '../components/Login/Login';
import * as LoginActions from '../../../shared/actions/login';

function mapStateToProps({ login }) {
  return { login };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoginActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

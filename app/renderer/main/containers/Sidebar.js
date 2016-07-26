import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar/Sidebar';
import * as SidebarActions from '../../../shared/actions/sidebar';
import * as AuthActions from '../../../shared/actions/auth';

function mapStateToProps({ sidebar, auth }, otherProps) {
  return { sidebar, auth, params: otherProps.params };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
    sidebarActions: bindActionCreators(SidebarActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

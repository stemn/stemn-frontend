import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import * as SidebarActions from '../../../shared/actions/sidebar';
import * as HeaderActions from '../../../shared/actions/header';
import * as AuthActions from '../../../shared/actions/auth';

function mapStateToProps({ header, auth }, ownProps) {
  return {
    header,
    auth,
    location:  ownProps.location
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sidebarActions: bindActionCreators(SidebarActions, dispatch),
    headerActions: bindActionCreators(HeaderActions, dispatch),
    authActions: bindActionCreators(AuthActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);

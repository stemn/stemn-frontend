import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import * as SidebarActions from '../../../shared/actions/sidebar';

function mapStateToProps({ header, auth }) {
  return { header, auth };
}

function mapDispatchToProps(dispatch) {
  return {
    sidebarActions: bindActionCreators(SidebarActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);

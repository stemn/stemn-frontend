import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar/Sidebar';
import * as SidebarActions from '../../../shared/actions/sidebar';

function mapStateToProps({ sidebar }) {
  return { sidebar };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SidebarActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

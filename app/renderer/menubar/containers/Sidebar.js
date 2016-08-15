import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar/Sidebar';
import * as MenubarLayoutActions from 'app/shared/actions/menubarLayout';

function mapStateToProps({ menubarLayout, sidebar }) {
  return { menubarLayout, sidebar };
}

function mapDispatchToProps(dispatch) {
  return {
    MenubarLayoutActions: bindActionCreators(MenubarLayoutActions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

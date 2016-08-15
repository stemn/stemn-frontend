import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Toolbar from '../components/Toolbar/Toolbar';
import * as MenubarLayoutActions from 'app/shared/actions/menubarLayout';

function mapStateToProps({ menubarLayout }) {
  return { menubarLayout };
}

function mapDispatchToProps(dispatch) {
  return {
    MenubarLayoutActions: bindActionCreators(MenubarLayoutActions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);

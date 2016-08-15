import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SettingsPage from './SettingsPage.jsx';
import * as SettingsActions from 'app/shared/actions/settings';


function mapStateToProps({ settings }) {
  return { settings };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);

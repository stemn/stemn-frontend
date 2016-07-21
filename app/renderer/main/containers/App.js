import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import App from '../components/App';
import * as ChangesActions from '../../../shared/actions/changes';

function mapStateToProps({ system, settings, header }) {
  return { system, settings, header };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ChangesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import App from '../components/App';
import * as JobActions from '../../../shared/actions/job';

function mapStateToProps({ job, system, settings, header }) {
  return { job, system, settings, header };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(JobActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

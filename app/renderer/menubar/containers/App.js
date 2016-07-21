import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import App from '../components/App';
import * as ChangeActions from '../../../shared/actions/changes';


function mapStateToProps({ job }) {
  return { job };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(ChangeActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

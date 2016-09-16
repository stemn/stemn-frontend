import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import App from '../components/App';
import * as ChangeActions from 'app/renderer/main/modules/Changes/Changes.actions.js';


function mapStateToProps({ job }) {
  return { job };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(ChangeActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

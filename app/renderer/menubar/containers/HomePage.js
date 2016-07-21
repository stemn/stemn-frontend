import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as ChangeActions from '../../../shared/actions/changes';

function mapStateToProps({ changes }) {
  return { changes };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(ChangeActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

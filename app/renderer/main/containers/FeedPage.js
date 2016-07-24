import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FeedPage from '../pages/FeedPage/FeedPage';
import * as FeedActions from '../../../shared/actions/feed';

function mapStateToProps({ feed }) {
  return { feed };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(FeedActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedPage);

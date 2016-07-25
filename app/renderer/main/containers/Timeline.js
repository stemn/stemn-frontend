import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Timeline from '../components/Timeline/Timeline';
import * as SidebarTimelineActions from '../../../shared/actions/sidebarTimeline';

function mapStateToProps({ sidebarTimeline }) {
  return { sidebarTimeline };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SidebarTimelineActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);

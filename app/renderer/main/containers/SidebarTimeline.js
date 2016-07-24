import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SidebarTimeline from '../components/SidebarTimeline/SidebarTimeline';
import * as SidebarTimelineActions from '../../../shared/actions/sidebarTimeline';

function mapStateToProps({ sidebarTimeline }) {
  return { sidebarTimeline };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SidebarTimelineActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarTimeline);

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SidebarTimeline from '../components/SidebarTimeline/SidebarTimeline';
import * as SidebarTimelineActions from 'app/shared/actions/sidebarTimeline';

function mapStateToProps({ sidebarTimeline }, {project}) {
  return {
    timeline: sidebarTimeline[project._id],
    project
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TimelineActions: bindActionCreators(SidebarTimelineActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarTimeline);

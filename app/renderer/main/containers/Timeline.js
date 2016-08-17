import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Timeline from '../components/Timeline/Timeline';
import * as SidebarTimelineActions from '../../../shared/actions/sidebarTimeline';

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

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);

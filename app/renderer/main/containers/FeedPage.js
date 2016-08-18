import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FeedPage from '../pages/FeedPage/FeedPage';
import * as SidebarTimelineActions from '../../../shared/actions/sidebarTimeline';

function mapStateToProps({ sidebarTimeline }) {
  return { feed: sidebarTimeline };
}

function mapStateToProps({sidebarTimeline, projects}, {params}) {
  const project = projects[params.stub];
  return {
    timeline: sidebarTimeline[project._id],
    project: project
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TimelineActions: bindActionCreators(SidebarTimelineActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedPage);

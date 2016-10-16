// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SyncTimelineActions from 'app/shared/modules/SyncTimeline/SyncTimeline.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import feedPageStyles from './ProjectFeedPage.css';

// Sub Components
import { has }                  from 'lodash';
import { Link }                 from 'react-router';
import Popover                  from 'app/renderer/assets/other/react-popup';
import Timeline                 from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import SidebarTimeline          from 'app/shared/modules/SyncTimeline/SidebarTimeline/SidebarTimeline.jsx';
import ContentSidebar           from 'app/renderer/main/components/ContentSidebar';

import ProjectFeedPageCommit    from './ProjectFeedPageCommit/ProjectFeedPageCommit.jsx'
import ProjectFeedPageRevision  from './ProjectFeedPageRevision/ProjectFeedPageRevision.jsx'

///////////////////////////////// COMPONENT /////////////////////////////////

const eventComponentMap = {
  commit   : (item, project) => (<ProjectFeedPageCommit item={item} project={project}/>),
  revision : (item, project) => (<ProjectFeedPageRevision item={item} project={project}/>),
}

const getEventComponent = (item, project) => {
  return eventComponentMap[item.event]
    ? eventComponentMap[item.event](item, project)
    : <div className="layout-column layout-align-center-center flex text-title-4 text-center">No event selected.</div>
};

export const Component = React.createClass({

  // Mounting
  onMount(nextProps, prevProps){
    if(nextProps.project && nextProps.project.data && nextProps.project.data.remote.connected){
      if(!prevProps || nextProps.project.data._id !== prevProps.project.data._id){
        nextProps.syncTimelineActions.fetchTimeline({projectId: nextProps.project.data._id})
      }
    }
    if(has(nextProps, 'location.query.item')){
      if(!has(prevProps, 'location.query.item') || nextProps.location.query.item != prevProps.location.query.item){
        const itemFromQueryParams = this.props.timeline.data.find(item => item._id == nextProps.location.query.item);
        if(itemFromQueryParams){this.selectTimelineItem(itemFromQueryParams)}
      }
    }
  },
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},

  selectTimelineItem(item){
    this.props.syncTimelineActions.selectTimelineItem({
      projectId: this.props.project.data._id,
      selected : item
    })
  },

  refresh(){
    this.props.syncTimelineActions.fetchTimeline({
      projectId: this.props.project.data._id
    })
  },

  render(){
    const { timeline, timelineModel, project, location } = this.props;
    const baseLink = `project/${project && project.data ? project.data._id : ''}`

    if(project.data.remote.connected){
      return (
        <div className="layout-column flex rel-box">
          <Timeline
            items={timeline && timeline.data ? timeline.data : []}
            selected={timeline && timeline.selected ? timeline.selected._id : ''}
            onSelect={this.selectTimelineItem}
          />
          <div className="layout-row flex">
            <div className="layout-column">
              <ContentSidebar className="flex">
                <SidebarTimeline
                  items={timeline && timeline.data ? timeline.data : []}
                  selected={timeline && timeline.selected ? timeline.selected._id : ''}
                  onSelect={this.selectTimelineItem}
                  loading={timeline && timeline.data ? false : true}
                  query={timeline.query}
                  queryModel={`${timelineModel}.query`}
                  refresh={this.refresh}
                />
              </ContentSidebar>
            </div>
            <div className="layout-column flex">
              {getEventComponent(timeline.selected, project)}
            </div>
          </div>
        </div>
      );
    }
    else{
      return (
        <div className="layout-column layout-align-center-center flex">
          <div className="text-title-4 text-center">Timeline not available. Connect this project to Drive or Dropbox</div>
          <div className="text-title-4 text-center link-primary" style={{marginTop: '10px'}}><Link to={baseLink+'/settings'}>Add File Store</Link></div>
        </div>
      )
    }
  }
})

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({syncTimeline, projects}, {params}) {
  const project = projects.data[params.stub];
  return {
    timeline: syncTimeline[project.data._id],
    timelineModel: `syncTimeline.${project.data._id}`,
    project: project
  };
}

function mapDispatchToProps(dispatch) {
  return {
    syncTimelineActions: bindActionCreators(SyncTimelineActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

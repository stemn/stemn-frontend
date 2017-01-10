// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SyncTimelineActions from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import feedPageStyles from './ProjectFeedPage.css';

// Sub Components
import { has }                  from 'lodash';
import { Link }                 from 'react-router';
import Timeline                 from 'stemn-shared/misc/Timeline/Timeline.jsx';
import SidebarTimeline          from 'stemn-shared/misc/SyncTimeline/SidebarTimeline/SidebarTimeline.jsx';
import ContentSidebar           from 'stemn-shared/misc/ContentSidebar';
import Guide                    from 'stemn-shared/misc/Guide/Guide';
import Button                   from 'stemn-shared/misc/Buttons/Button/Button'
import ProjectFeedPageCommit    from './ProjectFeedPageCommit/ProjectFeedPageCommit.jsx'
import ProjectFeedPageRevision  from './ProjectFeedPageRevision/ProjectFeedPageRevision.jsx'
import timeline                 from 'stemn-shared/assets/images/pure-vectors/timeline.svg';
import cloudProviders           from 'stemn-shared/assets/images/illustrations/cloud-providers.svg'


///////////////////////////////// COMPONENT /////////////////////////////////

const eventComponentMap = {
  commit   : (item, project) => (<ProjectFeedPageCommit item={item} project={project}/>),
  revision : (item, project) => (<ProjectFeedPageRevision item={item} project={project}/>),
}

const getEventComponent = (item, project) => {
  return item && item.event && eventComponentMap[item.event]
    ? eventComponentMap[item.event](item, project)
    : (
    <div className="layout-column layout-align-center-center flex text-title-4 text-center">
      <img src={timeline} style={{width: '100px'}}/>
      <div>No commit selected.</div>
    </div>)
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

  deselect(){
    this.props.syncTimelineActions.deselect({
      projectId: this.props.project.data._id
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
                  loading={timeline && timeline.loading}
                  query={timeline && timeline.query ? timeline.query : ''}
                  queryModel={`${timelineModel}.query`}
                  refresh={this.refresh}
                  deselect={this.deselect}
                  toChanges={baseLink}
                />
              </ContentSidebar>
            </div>
            <div className="layout-column flex">
              {getEventComponent(timeline && timeline.selected ? timeline.selected : '', project)}
            </div>
          </div>
        </div>
      );
    }
    else{
      const guideInfo = [{
        title: 'Cloud Storage Not Connected',
        description: 'Connect this project to your cloud storage folder so STEMN can track changes to your files.',
        image: cloudProviders,
      }];
      return (
        <div className="layout-column flex layout-align-center">
          <div className="layout-row layout-align-center"><Guide data={guideInfo[0]}/></div>
          <div className="layout-row layout-align-center">
            <Link to={`${baseLink}/settings`}><Button className="primary lg">Select Project Folder</Button> </Link>
          </div>
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

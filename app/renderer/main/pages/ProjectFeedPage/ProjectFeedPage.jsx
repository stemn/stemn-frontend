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
import { has }            from 'lodash';
import i                  from 'icepick';
import { Link }           from 'react-router';
import Popover            from 'app/renderer/assets/other/react-popup';
import Timeline           from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import SidebarTimeline    from 'app/shared/modules/SyncTimeline/SidebarTimeline/SidebarTimeline.jsx';
import FileCompare        from 'app/renderer/main/modules/FileCompare/FileCompare.jsx';
import FileCompareHeader  from 'app/renderer/main/modules/FileCompare/FileCompareHeader/FileCompareHeader.jsx';
import ContentSidebar     from 'app/renderer/main/components/ContentSidebar';
import EditorDisplay      from 'app/renderer/main/modules/Editor/EditorDisplay.jsx';
import UserAvatar         from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';
import CommitFilesList    from './CommitFilesList.jsx';


///////////////////////////////// COMPONENT /////////////////////////////////

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

    const filePrevious = timeline && timeline.selected && timeline.selected.data && timeline.selected.data.previousRevisionId
    ? i.assocIn(timeline.selected, ['data', 'revisionId'], timeline.selected.data.previousRevisionId)
    : null;
    const baseLink = `project/${project && project.data ? project.data._id : ''}`

    const getDetailSection = () => {
      if(this.props.timeline && this.props.timeline.selected && this.props.timeline.selected.data){
        if(this.props.timeline.selected.event == 'commit'){
          return (
            <div className="layout-column flex">
              <div className={feedPageStyles.commitInfo}>
                <h3>{this.props.timeline.selected.data.summary}</h3>
                <div className={feedPageStyles.description}>
                  <EditorDisplay value={this.props.timeline.selected.data.description}/>
                </div>
                <div className="layout-row layout-align-start-center">
                  <UserAvatar picture={this.props.timeline.selected.user.picture} size="20"/>
                  <div style={{marginLeft: '10px'}}>{this.props.timeline.selected.user.name}</div>
                  <div className="flex">
                  </div>
                  <a className="link-primary">Revert</a>
                  &nbsp;&nbsp;&nbsp;
                  <a className="link-primary">View Online</a>
                </div>
              </div>
              <div className="flex scroll-box">
                {this.props.timeline.selected.data.items ? <CommitFilesList items={this.props.timeline.selected.data.items} project={project}/> : null}
              </div>
            </div>
          )
        }
        else{
          return(
            <div className="layout-column flex">
              <FileCompareHeader
                compareId={`feed-${project.data._id}-${timeline.selected._id}`}
                file1={timeline.selected.data} />
              <FileCompare
                compareId={`feed-${project.data._id}-${timeline.selected._id}`}
                project={project.data}
                file1={timeline.selected.data}
                file2={filePrevious ? filePrevious.data : null} />
            </div>
          )
        }
      }
      else{
        return (
          <div className="layout-column layout-align-center-center flex text-title-4 text-center">No event selected.</div>
        )
      }
    }

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
              {getDetailSection()}
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

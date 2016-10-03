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
import i                  from 'icepick';
import { Link }           from 'react-router';
import Popover            from 'app/renderer/assets/other/react-popup';
import Timeline           from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import SidebarTimeline    from 'app/shared/modules/SyncTimeline/SidebarTimeline/SidebarTimeline.jsx';
import FileCompare        from 'app/renderer/main/modules/FileCompare/FileCompare.jsx';
import FileCompareHeader  from 'app/renderer/main/modules/FileCompare/FileCompareHeader/FileCompareHeader.jsx';
import FileCompareMenu    from 'app/renderer/main/modules/FileCompare/FileCompareMenu/FileCompareMenu.jsx';
import ContentSidebar     from 'app/renderer/main/components/ContentSidebar';
import TogglePanel        from 'app/renderer/main/components/Panels/TogglePanel/TogglePanel.jsx';
import DragResize         from 'app/renderer/main/modules/DragResize/DragResize.jsx';


///////////////////////////////// COMPONENT /////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(nextProps.project && nextProps.project.data && nextProps.project.data.remote.connected){
    if(!prevProps || nextProps.project.data._id !== prevProps.project.data._id){
      nextProps.syncTimelineActions.fetchTimeline({projectId: nextProps.project.data._id})
    }
  }
}

export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

  selectTimelineItem(item){
    this.props.syncTimelineActions.selectTimelineItem({
      projectId: this.props.project.data._id,
      selected : item
    })
  },

  render(){
    const { timeline, project } = this.props;
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
                <div className={feedPageStyles.description}>{this.props.timeline.selected.data.description}</div>
                <div className="layout-row layout-align-start-center">
                  <img src={'https://stemn.com' + this.props.timeline.selected.user.picture + '?size=thumb&crop=true'} className={feedPageStyles.avatar}/>
                  <div>{this.props.timeline.selected.user.name}</div>
                </div>
              </div>
              <div className="flex scroll-box">
                {getFilesSection()}
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

    const getFilesSection = () => {

      if(timeline.selected.data.items){
        return this.props.timeline.selected.data.items.map((file)=>{
          const filePrevious = file.data.previousRevisionId ? u( {data: {revisionId : file.data.previousRevisionId}}, file) : null;
          return (
            <TogglePanel>
              <div className="layout-row flex layout-align-start-center">
                <div className="flex">{file.data.path}</div>
                <FileCompareMenu
                  compareId={`feed-${project.data._id}-${file.data._id}`}/>
              </div>
              <DragResize side="bottom" height="500" heightRange={[200, 1000]} className="layout-column flex">
                <FileCompare
                  compareId={`feed-${project.data._id}-${file.data._id}`}
                  project={project.data}
                  file1={file.data}
                  file2={filePrevious ? filePrevious.data : null} />
              </DragResize>
            </TogglePanel>
          )
        })
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
                  loading={timeline ? timeline.loading : true}
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
    project: project
  };
}

function mapDispatchToProps(dispatch) {
  return {
    syncTimelineActions: bindActionCreators(SyncTimelineActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

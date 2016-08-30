// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SidebarTimelineActions from 'app/shared/actions/sidebarTimeline';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import feedPageStyles from './ProjectFeedPage.css';

// Sub Components
import Popover           from 'app/renderer/assets/other/react-popup';
import Timeline          from 'app/renderer/main/modules/Timeline/Timeline.jsx';
import SidebarTimeline   from 'app/renderer/main/containers/SidebarTimeline';
import FileCompare      from 'app/renderer/main/modules/FileCompare/FileCompare.jsx';
import ContentSidebar    from 'app/renderer/main/components/ContentSidebar';
import TogglePanel       from 'app/renderer/main/components/Panels/TogglePanel/TogglePanel.jsx';
import CompareFiles      from 'app/renderer/main/components/CompareFiles/CompareFiles';


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({

  componentWillMount() {
    this.props.TimelineActions.fetchTimeline({stub: this.props.project._id})
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.project._id !== this.props.project._id) {
      this.props.TimelineActions.fetchTimeline({stub: nextProps.project._id})
    }
  },

  render(){
    const styles = {
        padding: '30px'
    }

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
            <FileCompare project={this.props.project} file={this.props.timeline.selected.data} />
          )
        }
      }
    }

    const getFilesSection = () => {
      if(this.props.timeline.selected.data.items){
        return this.props.timeline.selected.data.items.map((file)=>
          <TogglePanel>
            <div className="layout-row flex layout-align-start-center">
              <div className="flex">{file.path}</div>
              <div>{file.size}</div>
            </div>
            <div>
              <FileCompare project={this.props.project} file={file} />
            </div>
          </TogglePanel>
        )
      }
    }

    return (
      <div className="layout-column flex rel-box">
        <Timeline project={this.props.project} />
        <div className="layout-row flex">
          <div className="layout-column">
            <ContentSidebar className="flex">
              <SidebarTimeline project={this.props.project}/>
            </ContentSidebar>
          </div>
          <div className="layout-column flex">
            {getDetailSection()}
          </div>
        </div>
      </div>
    );
  }
})

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

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

export default connect(mapStateToProps, mapDispatchToProps)(Component);

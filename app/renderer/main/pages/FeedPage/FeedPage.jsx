import React, { Component } from 'react';
import Popover   from '../../../assets/other/react-popup';

import ContentSidebar   from '../../components/ContentSidebar';
import Timeline         from '../../containers/Timeline';
import SidebarTimeline  from '../../containers/SidebarTimeline';
import PreviewFile      from '../../containers/PreviewFile';
import TogglePanel      from 'app/renderer/main/components/Panels/TogglePanel/TogglePanel.jsx';
import CompareFiles      from 'app/renderer/main/components/CompareFiles/CompareFiles';

// Styles
import classNames from 'classnames';
import feedPageStyles from './FeedPage.css';

export default class FeedPage extends React.Component{

  componentWillMount() {
    this.props.TimelineActions.fetchTimeline({stub: this.props.project._id})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project._id !== this.props.project._id) {
      this.props.TimelineActions.fetchTimeline({stub: nextProps.project._id})
    }
  }

  render(){
    const styles = {
        padding: '30px'
    }

    const getDetailSection = () => {
      if(this.props.timeline.selected.data){
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
            <div>{this.props.timeline.selected._id}</div>
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
              <CompareFiles>
                <PreviewFile projectStub={file.parentProject} path={file.path} />
                <PreviewFile projectStub={file.parentProject} path={file.path} />
              </CompareFiles>
            </div>
          </TogglePanel>
        )
      }
    }

    return (
      <div className="layout-column flex rel-box">
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
}
//        <Timeline project={this.props.project}/>

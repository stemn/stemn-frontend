import React, { Component } from 'react';
import Popover   from '../../../assets/other/react-popup';

import ContentSidebar   from '../../components/ContentSidebar';
import Timeline         from '../../containers/Timeline';
import SidebarTimeline  from '../../containers/SidebarTimeline';
import PreviewFile      from '../../containers/PreviewFile';
import TogglePanel      from 'app/renderer/main/components/Panels/TogglePanel/TogglePanel.jsx';

// Styles
import classNames from 'classnames';
import feedPageStyles from './FeedPage.css';

export default class FeedPage extends React.Component{

  render(){
    const styles = {
        padding: '30px'
    }

    const getDetailSection = () => {
      if(this.props.feed.selected.data){
        return (
          <div className="layout-column flex">
            <div className={feedPageStyles.commitInfo}>
              <h3>{this.props.feed.selected.data.summary}</h3>
              <div className={feedPageStyles.description}>{this.props.feed.selected.data.description}</div>
              <div className="layout-row layout-align-start-center">
                <img src={'https://stemn.com' + this.props.feed.selected.actor.picture + '?size=thumb&crop=true'} className={feedPageStyles.avatar}/>
                <div>{this.props.feed.selected.actor.name}</div>
              </div>
            </div>
            <div className="flex scroll-box">
              {getFilesSection()}
            </div>
          </div>
        )
      }
    }

    const getFilesSection = () => {
      if(this.props.feed.selected.data.files){
        return this.props.feed.selected.data.files.map((file)=>
          <TogglePanel>
            <div className="layout-row flex layout-align-start-center">
              <div className="flex">{file.path}</div>
              <div>{file.size}</div>
            </div>
            <div>
              <PreviewFile projectStub={file.parentProject} path={file.path} />
            </div>
          </TogglePanel>
        )
      }
    }

    return (
      <div className="layout-column flex rel-box">
        <Timeline />
        <div className="layout-row flex">
          <div className="layout-column">
            <ContentSidebar className="flex">
              <SidebarTimeline />
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

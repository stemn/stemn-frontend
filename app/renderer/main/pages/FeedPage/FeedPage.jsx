import React, { Component } from 'react';
import Popover   from '../../../assets/other/react-popup';

import ContentSidebar   from '../../components/ContentSidebar';
import Timeline         from '../../containers/Timeline';
import SidebarTimeline  from '../../containers/SidebarTimeline';
import PreviewFile  from '../../components/PreviewFile/PreviewFile';

// Styles
import classNames from 'classnames';

import {MdChevronRight} from 'react-icons/lib/md';


export default class FeedPage extends React.Component{

  render(){
    const styles = {
        padding: '30px'
    }

    const getDetailSection = () => {
      if(this.props.feed.selected.data){
        return (
          <div>
            <h3>{this.props.feed.selected.data.message}</h3>
            <div>{getFilesSection()}</div>
          </div>
        )
      }
    }

    const getFilesSection = () => {
      if(this.props.feed.selected.data.files){
        return this.props.feed.selected.data.files.map((file)=>
          <div className='layout-row layout-align-start-center'>
            <MdChevronRight size='22'></MdChevronRight>
            <div className='flex'>{file.path}</div>
            <div>{file.size}</div>
          </div>
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
            <PreviewFile />
          </div>
        </div>
      </div>
    );
  }
}

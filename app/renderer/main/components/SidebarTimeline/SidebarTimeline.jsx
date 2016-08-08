import React from 'react';

// Components
import SidebarTimelineRow from './SidebarTimelineRow'
import FileChangeTitleRow from '../CommitChanges/FileChangeTitleRow';


export default (props) => {
  const timeline = props.sidebarTimeline.timeline.map((item)=>
    <SidebarTimelineRow item={item} clickFn={()=>{props.selectTimelineItem(item)}} key={item._id} isActive={item._id == props.sidebarTimeline.selected._id}></SidebarTimelineRow>
  )
  return (
    <div className="layout-column flex">
      <FileChangeTitleRow text="Recent Changes" />
      <div className="flex">
        {timeline}
      </div>
    </div>
  )
}

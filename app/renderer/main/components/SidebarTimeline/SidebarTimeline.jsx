import React from 'react';

// Components
import SidebarTimelineRow from './SidebarTimelineRow'
import FileChangeTitleRow from '../CommitChanges/FileChangeTitleRow';


export default ({selectTimelineItem, sidebarTimeline}) => {
  const timeline = sidebarTimeline.timeline.map((item)=>
    <SidebarTimelineRow item={item} clickFn={()=>{selectTimelineItem(item)}} key={item._id} isActive={item._id == sidebarTimeline.selected._id}></SidebarTimelineRow>
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

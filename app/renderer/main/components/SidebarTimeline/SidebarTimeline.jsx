import React from 'react';

// Components
import SidebarTimelineRow from './SidebarTimelineRow'
import FileChangeTitleRow from '../CommitChanges/FileChangeTitleRow';


export default class extends React.Component{
  render() {
    const timeline = this.props.timeline && this.props.timeline.data
    ? this.props.timeline.data.map((item)=>
      <SidebarTimelineRow item={item} clickFn={()=>{this.props.TimelineActions.selectTimelineItem({projectId: this.props.project._id, selected: item})}} key={item._id} isActive={item._id == this.props.timeline.selected._id}></SidebarTimelineRow>
    )
    : <div>Loading</div>
    return (
      <div className="layout-column flex">
        <FileChangeTitleRow text="Recent Events" />
        <div className="scroll-box flex">
            {timeline}
        </div>
      </div>
    )
  }
};

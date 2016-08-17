import React from 'react';

// Components
import SidebarTimelineRow from './SidebarTimelineRow'
import FileChangeTitleRow from '../CommitChanges/FileChangeTitleRow';


export default class extends React.Component{
  componentWillMount() {
    this.props.TimelineActions.fetchTimeline({stub: this.props.project._id})
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.project._id !== this.props.project._id) {
      this.props.TimelineActions.fetchTimeline({stub: nextProps.project._id})
    }
  }
  render() {
    console.log(this.props.timeline.data);
    const timeline = this.props.timeline.data.map((item)=>
      <SidebarTimelineRow item={item} clickFn={()=>{this.props.TimelineActions.selectTimelineItem(item)}} key={item._id} isActive={item._id == this.props.timeline.selected._id}></SidebarTimelineRow>
    )
    return (
      <div className="layout-column flex">
        <FileChangeTitleRow text="Recent Events" />
        <div className="flex">
          {timeline}
        </div>
      </div>
    )
  }
};

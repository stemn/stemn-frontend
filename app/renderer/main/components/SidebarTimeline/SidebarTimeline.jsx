import React from 'react';

// Components
import SidebarTimelineRow from './SidebarTimelineRow'
import FileChangeTitleRow from 'app/renderer/main/modules/Changes/CommitChanges/FileChangeTitleRow';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';



export default class extends React.Component{
  render() {
    const getData = () => {
      if(this.props.timeline && this.props.timeline.data){
        if(this.props.timeline.data.length > 0){
          return this.props.timeline.data.map((item)=>
            <SidebarTimelineRow item={item} clickFn={()=>{this.props.TimelineActions.selectTimelineItem({projectId: this.props.project._id, selected: item})}} key={item._id} isActive={item._id == this.props.timeline.selected._id}></SidebarTimelineRow>
          )
        }
        else{
          return (
            <div className="layout-column layout-align-center-center flex" style={{height: '100%'}}>
              <div className="text-center text-title-4">No Feed items yet</div>
            </div>
          )
        }
      }
      else{
        return <LoadingOverlay />
      }
    }
    return (
      <div className="layout-column flex">
        <FileChangeTitleRow text="Recent Events" />
        <div className="scroll-box flex rel-box">
          {getData()}
        </div>
      </div>
    )
  }
};

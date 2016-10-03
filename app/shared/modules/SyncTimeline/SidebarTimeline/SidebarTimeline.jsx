// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import SidebarTimelineRow from './SidebarTimelineRow'
import FileChangeTitleRow from 'app/renderer/main/modules/Changes/CommitChanges/FileChangeTitleRow';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';


///////////////////////////////// COMPONENT /////////////////////////////////

export default React.createClass({
  render() {
    const { selected, items, loading, onSelect } = this.props;

//                this.props.syncTimelineActions.selectTimelineItem({projectId: this.props.project._id, selected: item})}

    const getData = () => {
      if(items && items.length > 0){
        return items.map((item)=>
          <SidebarTimelineRow
            item={item}
            key={item._id}
            isActive={item._id == selected._id}
            clickFn={onSelect} />
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

    return (
      <div className="layout-column flex">
        <FileChangeTitleRow text="Recent Events" />
        <div className="scroll-box flex rel-box">
          {getData()}
          <LoadingOverlay show={loading} />
        </div>
      </div>
    )
  }
});

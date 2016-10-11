// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import SidebarTimelineRow from './SidebarTimelineRow'
import FileChangeTitleRow from 'app/renderer/main/modules/Changes/CommitChanges/FileChangeTitleRow';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import { MdMoreHoriz } from 'react-icons/lib/md';


///////////////////////////////// COMPONENT /////////////////////////////////

export default React.createClass({
  render() {
    const { selected, items, loading, onSelect } = this.props;

    return (
      <div className="layout-column flex">
        <FileChangeTitleRow text="Recent Events">
          <PopoverMenu preferPlace="below">
            <SimpleIconButton>
              <MdMoreHoriz size="20px" />
            </SimpleIconButton>
            <div className="PopoverMenu">
              <a>Filter: Revisions</a>
              <a>Filter: Commits</a>
              <a>Filter: All</a>
              <div className="divider"></div>
              <a>Refresh</a>
            </div>
          </PopoverMenu>
        </FileChangeTitleRow>
        <div className="scroll-box flex rel-box">
          {
            items && items.length > 0
            ? items.map((item)=>
              <SidebarTimelineRow
                item={item}
                key={item._id}
                isActive={item._id == selected}
                clickFn={()=>onSelect(item)} />
              )
            : <div className="layout-column layout-align-center-center flex" style={{height: '100%'}}>
                <div className="text-center text-title-4">No Feed items yet</div>
              </div>
          }
          <LoadingOverlay show={loading} />
        </div>
      </div>
    )
  }
});

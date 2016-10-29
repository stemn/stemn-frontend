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
import MdMoreHoriz from 'react-icons/md/more-horiz';
import { every } from 'lodash';
import StringFilterMenu from 'app/renderer/main/modules/StringFilter/StringFilterMenu.jsx';


const eventFilter = [{
  text: 'Filter: Revisions',
  value: 'event:revision',
},{
  text: 'Filter: Commits',
  value: 'event:commit',
},{
  text: 'Filter: All',
  value: ''
}];

///////////////////////////////// COMPONENT /////////////////////////////////

export default React.createClass({
  filterItems(items, fullQuery){
    const fullQueryArray = fullQuery ? fullQuery.split(' ') : [];
    return items.filter(item => every(fullQueryArray, queryString => this.queryByString(item, queryString)))
  },
  queryByString(item, queryString){
    if     (queryString == 'event:revision'){
      return item.event == 'revision'
    }
    else if(queryString == 'event:commit'){
      return item.event == 'commit'
    }
    // Filter by the string itself (case independent)
    else if(queryString && queryString.length > 0){
      return new RegExp(queryString, 'i').test(item.data.name)
    }
    else{
      return true;
    }
  },
  render() {
    const { selected, items, loading, onSelect, query, queryModel, refresh, deselect } = this.props;
    const filteredItems = this.filterItems(items, query);
    return (
      <div className="layout-column flex">
        <FileChangeTitleRow text="Recent Events">
          <PopoverMenu preferPlace="below">
            <SimpleIconButton>
              <MdMoreHoriz size="20px" />
            </SimpleIconButton>
            <div className="PopoverMenu">
              <StringFilterMenu filter={eventFilter} model={queryModel} value={query}/>
              <div className="divider"></div>
              <a onClick={refresh}>Refresh</a>
            </div>
          </PopoverMenu>
        </FileChangeTitleRow>
        {
          filteredItems && filteredItems.length > 0
          ? (
          <div className="scroll-box layout-column flex">
            <div>
               {filteredItems.map(item=>
                <SidebarTimelineRow
                  item={item}
                  key={item._id}
                  isActive={item._id == selected}
                  clickFn={()=>onSelect(item)}
                />
              )}
            </div>
            <div className="flex" onClick={deselect} style={{minHeight: '60px'}}></div>
          </div>
          )
          : <div className="layout-column layout-align-center-center text-title-4 flex">No Feed items yet</div>
        }
        <LoadingOverlay show={loading} linear={true} hideBg={true} />
      </div>
    )
  }
});

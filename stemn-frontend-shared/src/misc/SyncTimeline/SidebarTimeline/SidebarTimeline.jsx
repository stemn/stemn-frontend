// Component Core
import React from 'react'

// Sub Components
import FileChangeTitleRow  from 'stemn-shared/misc/Changes/CommitChanges/FileChangeTitleRow'
import LoadingOverlay      from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import MdMoreHoriz         from 'react-icons/md/more-horiz'
import Popover             from 'stemn-shared/misc/Popover'
import SidebarTimelineRow  from './SidebarTimelineRow'
import SimpleIconButton    from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import Link from 'stemn-shared/misc/Router/Link'
import { every }           from 'lodash'

const eventFilter = [{
  text: 'Filter: Revisions',
  value: 'event:revision',
}, {
  text: 'Filter: Commits',
  value: 'event:commit',
}, {
  text: 'Filter: All',
  value: '',
}]

export default class SidebarTimeline extends React.Component {
  filterItems = (items, fullQuery) => {
    const fullQueryArray = fullQuery ? fullQuery.split(' ') : []
    return items.filter(item => every(fullQueryArray, queryString => this.queryByString(item, queryString)))
  };

  queryByString = (item, queryString) => {
    if     (queryString === 'event:revision') {
      return item.event === 'revision'
    } else if (queryString === 'event:commit') {
      return item.event === 'commit'
    }
    // Filter by the string itself (case independent)
    else if (queryString && queryString.length > 0) {
      return new RegExp(queryString, 'i').test(item.data.name)
    }
    
    return true
  };

  render() {
    const {
      projectId,
      items,
      loading,
      query,
      refresh,
    } = this.props
    const routeParams = {
      projectId,
    }

    const filteredItems = this.filterItems(items, query)
    return (
      <div className="layout-column flex">
        <FileChangeTitleRow text="Recent Commits">
          <Popover preferPlace="below">
            <SimpleIconButton>
              <MdMoreHoriz size="20px" />
            </SimpleIconButton>
            <div className="PopoverMenu">
              <a onClick={ refresh }>Refresh</a>
            </div>
          </Popover>
        </FileChangeTitleRow>
        {
          filteredItems && filteredItems.length > 0
            ? (
              <div className="scroll-box layout-column flex">
                <div>
                  {filteredItems.map(item =>
                    <SidebarTimelineRow
                      item={ item }
                      key={ item._id }
                    />,
                  )}
                </div>
                <Link name="projectCommitsRoute" params={ routeParams } className="flex" style={ { minHeight: '60px' } } />
              </div>
            )
            : <div className="layout-column layout-align-center-center text-title-4 flex">Your commits will show here.<br /><Link className="link-primary" name="projectChangesRoute" params={ routeParams }>Create your first commit.</Link></div>
        }
        <LoadingOverlay show={ loading } linear hideBg />
      </div>
    )
  }
}

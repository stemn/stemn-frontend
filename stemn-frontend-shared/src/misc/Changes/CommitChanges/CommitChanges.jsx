import React from 'react'
import { ContextMenuTrigger } from 'react-contextmenu'
import FileChangeRow from './FileChangeRow'
import FileChangeTitleRow from './FileChangeTitleRow'
import FileChangeMenu from './FileChange.menu.js'
import ContextMenu from 'stemn-shared/misc/ContextMenu/ContextMenu.jsx'
import Popover from 'stemn-shared/misc/Popover/Popover'
import PopoverMenuList from 'stemn-shared/misc/PopoverMenu/PopoverMenuList'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMoreHoriz from 'react-icons/md/more-horiz'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import Walkthrough from 'stemn-shared/misc/Walkthrough/Walkthrough.jsx'
import FileSyncUnderway from 'stemn-shared/misc/FileList/FileSyncUnderway'
import { groupRevisions } from 'stemn-shared/misc/Timeline/Timeline.utils.js'
import { getToggleAllStatus, filterSelectedChangesByPossible } from '../Changes.utils.js'
import { get } from 'lodash'
import './CommitChanges.css'

const contextIdentifier = 'FileChangeCm'

export default class CommitChanges extends React.Component {
  render() {
    const { changes, project, toggleAll, refresh, selectedFileChange, deselect, loading, dispatch, initialSync } = this.props
    const isInitialSync = initialSync && changes.data.length === 0
    
    // Group changes by fileId
    const groupedChanges = groupRevisions(changes.data)
    const possibleGroupedChanges = filterSelectedChangesByPossible(groupedChanges, changes.checked)
    const allChecked = getToggleAllStatus(groupedChanges, possibleGroupedChanges)

    const filterMenu = [{
      label: 'Refresh',
      onClick: refresh,
    }]

    return (
      <div className="layout-column flex rel-box">
        { isInitialSync
          ? <FileSyncUnderway refresh={ refresh } />
          : <div className="layout-column flex">
            <Walkthrough
              name="commit.commitIntro"
              preferPlace="right"
            >
              <FileChangeTitleRow
                text={ `${groupedChanges.length} file changes` }
                value={ allChecked }
                changeAction={ toggleAll }
                checkbox
              >
                <Popover preferPlace="below">
                  <SimpleIconButton title="Filter changes">
                    <MdMoreHoriz size={ 20 } />
                  </SimpleIconButton>
                  <PopoverMenuList menu={ filterMenu } />
                </Popover>
              </FileChangeTitleRow>
            </Walkthrough>
            { groupedChanges.length > 0
              ? <div className="scroll-box layout-column flex">
                { groupedChanges.map(item => (
                  <ContextMenuTrigger 
                    item={ item }
                    id={ contextIdentifier }
                    key={ item._id }
                  >
                    <FileChangeRow
                      item={ item }
                      text={ item.data.path }
                      clickFn={ () => selectedFileChange({ projectId: project._id, selected: item }) }
                      isActive={ changes.selected ? item._id === changes.selected._id : false }
                      model={ `changes.${project._id}.checked.${item.data.fileId}` }
                      value={ get(changes, ['checked', item.data.fileId], false) }
                      status={ item.data.state }
                    />
                  </ContextMenuTrigger>
                ))}
                <div className="flex" onClick={ deselect } style={ { minHeight: '60px' } } />
              </div>
              : <div className="layout-column layout-align-center-center text-title-4 flex">No Changes</div> }
          </div>
        }
        <LoadingOverlay
          show={ loading }
          linear
          hideBg
        />
        <ContextMenu
          identifier={ contextIdentifier }
          menu={ FileChangeMenu(dispatch) }
        />
      </div>
    )
  }
}

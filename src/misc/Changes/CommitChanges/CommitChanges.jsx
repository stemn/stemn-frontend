import React from 'react'
import { ContextMenuLayer } from 'react-contextmenu'

// Components
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

// Functions
import { groupRevisions } from 'stemn-shared/misc/Timeline/Timeline.utils.js'
import { getToggleAllStatus, filterSelectedChangesByPossible } from '../Changes.utils.js'
import { has, get } from 'lodash'

// Styles
import styles from './CommitChanges.css'

const contextIdentifier = 'FileChangeCm'
const FileChangeRowContext = ContextMenuLayer(contextIdentifier, props => props.item)(FileChangeRow)


export default React.createClass({
  render() {
    const { changes, project, toggleAll, refresh, selectedFileChange, deselect, loading, dispatch, initialSync } = this.props
    const isInitialSync = initialSync && changes.data.length == 0
    
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
                { groupedChanges.map((item, idx) => (
                  <FileChangeRowContext
                    key={ item._id }
                    item={ item }
                    text={ item.data.path }
                    clickFn={ () => selectedFileChange({ projectId: project._id, selected: item }) }
                    isActive={ changes.selected ? item._id == changes.selected._id : false }
                    model={ `changes.${project._id}.checked.${item.data.fileId}` }
                    value={ get(changes, ['checked', item.data.fileId], false) }
                    status={ item.data.state }
                  />
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
  },
})

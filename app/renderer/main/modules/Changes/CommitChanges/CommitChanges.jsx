import React from 'react';
import { Field, Form } from 'react-redux-form';
import { ContextMenuLayer } from "react-contextmenu";

// Components
import FileChangeRow from './FileChangeRow';
import FileChangeTitleRow from './FileChangeTitleRow';
import FileChangeMenu from './FileChange.menu.js';
import ContextMenu from 'app/renderer/main/modules/ContextMenu/ContextMenu.jsx';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import PopoverMenuList from 'app/renderer/main/components/PopoverMenu/PopoverMenuList';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import { MdMoreHoriz } from 'react-icons/lib/md';

// Functions
import { groupRevisions } from 'app/renderer/main/modules/Timeline/Timeline.utils.js'
import { getToggleAllStatus } from '../Changes.utils.js'

// Styles
import styles from './CommitChanges.css';

const contextIdentifier = 'FileChangeCm';
const FileChangeRowContext = ContextMenuLayer(contextIdentifier, (props) => (props))(FileChangeRow)


export default React.createClass({
  render(){
    const { changes, project, toggleAll, refresh, selectedFileChange, dispatch } = this.props;
    const groupedChanges = groupRevisions(changes.data);
    const allChecked = getToggleAllStatus(groupedChanges, changes.checked);

    const filterMenu = [{
      label: 'Filter',
      submenu: [{
        label: 'Filter: All Changes',
      },{
        label: 'Filter: My Changes',
      }]
    },{
      label: 'Filter: All Changes',
    },{
      label: 'Filter: My Changes',
    },{
      divider: true,
      label: 'Refresh',
      onClick: refresh
    }]

    return (
      <div className="layout-column flex">
        <div className="layout-column flex">
          <FileChangeTitleRow
            text={groupedChanges.length + ' file changes'}
            checkbox={true}
            value={allChecked}
            changeAction={toggleAll}>
            <PopoverMenu preferPlace="below">
              <SimpleIconButton title="Filter changes">
                <MdMoreHoriz size="20px" />
              </SimpleIconButton>
              <PopoverMenuList menu={filterMenu}/>
            </PopoverMenu>
          </FileChangeTitleRow>
          {
            groupedChanges.length > 0
            ? <div className="scroll-box flex">
              {groupedChanges.map((item, idx)=><FileChangeRowContext key={item._id}
                item={item}
                text={item.data.path}
                clickFn={()=>{selectedFileChange({projectId: project._id, selected: item})}}
                isActive={item._id == changes.selected._id}
                model={`changes.${project._id}.checked.${item.data.fileId}`}
                value={changes.checked[item.data.fileId]}
              />)}
            </div>
            : <div className="layout-column layout-align-center-center text-title-4 flex">No Changes</div>
          }

        </div>
        <ContextMenu identifier={contextIdentifier} menu={FileChangeMenu(dispatch)}/>
      </div>
    )
  }
})

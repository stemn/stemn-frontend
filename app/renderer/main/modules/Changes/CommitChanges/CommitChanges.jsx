import React from 'react';
import { Field, Form } from 'react-redux-form';
import { ContextMenu, MenuItem, ContextMenuLayer } from "react-contextmenu";

// Components
import FileChangeRow from './FileChangeRow';
import FileChangeTitleRow from './FileChangeTitleRow';
import FileContextmenu from './FileContextmenu';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
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
    const { changes, project, toggleAll, refresh, selectedFileChange } = this.props;
    const groupedChanges = groupRevisions(changes.data);
    const allChecked = getToggleAllStatus(groupedChanges, changes.checked);

    return (
      <div className="layout-column flex">
        <div className="layout-column flex">
          <FileChangeTitleRow
            text={groupedChanges.length + ' file changes'}
            checkbox={true}
            value={allChecked}
            changeAction={toggleAll}>
            <PopoverMenu preferPlace="below">
              <SimpleIconButton>
                <MdMoreHoriz size="20px" />
              </SimpleIconButton>
              <div className="PopoverMenu">
                <a>Filter: All Changes</a>
                <a>Filter: My Changes</a>
                <div className="divider"></div>
                <a onClick={refresh}>Refresh</a>
              </div>
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
        <FileContextmenu identifier={contextIdentifier}/>
      </div>
    )
  }
})

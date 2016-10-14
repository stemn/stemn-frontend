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

// Styles
import styles from './CommitChanges.css';

const contextIdentifier = 'FileChangeCm';
const FileChangeRowContext = ContextMenuLayer(contextIdentifier, (props) => (props))(FileChangeRow)

export default (props) => {

  const groupedChanges = groupRevisions(props.changes.data);
  return (
    <div className="layout-column flex">
      <div className="layout-column flex">
        <FileChangeTitleRow
          text={groupedChanges.length + ' file changes'}
          model={`changes.${props.project._id}.toggleAll`}
          value={props.changes.toggleAll}
          changeAction={props.actToggleAll}>
          <PopoverMenu preferPlace="below">
            <SimpleIconButton>
              <MdMoreHoriz size="20px" />
            </SimpleIconButton>
            <div className="PopoverMenu">
              <a>Filter: All Changes</a>
              <a>Filter: My Changes</a>
              <div className="divider"></div>
              <a onClick={props.refresh}>Refresh</a>
            </div>
          </PopoverMenu>
        </FileChangeTitleRow>
        {
          groupedChanges.length > 0
          ? <div className="scroll-box flex">
            {groupedChanges.map((item, idx)=><FileChangeRowContext key={item._id}
              item={item}
              text={item.data.path}
              clickFn={()=>{props.selectedFileChange({projectId: props.project._id, selected: item})}}
              isActive={item._id == props.changes.selected._id}
              model={`changes.${props.project._id}.data.${idx}.selected`}
              value={item.selected}/>)}
          </div>
          : <div className="layout-column layout-align-center-center text-title-4 flex">No Changes</div>
        }

      </div>
      <FileContextmenu identifier={contextIdentifier}/>
    </div>
  )
}

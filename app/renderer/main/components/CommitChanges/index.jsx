import React from 'react';
import { Field, Form } from 'react-redux-form';
import { ContextMenu, MenuItem, ContextMenuLayer } from "react-contextmenu";

// Components
//import CommitBox from 'app/modules/files/CommitBox/CommitBox.container.js';
import FileChangeRow from './FileChangeRow';
import FileChangeTitleRow from './FileChangeTitleRow';
import FileContextmenu from './FileContextmenu';

// Styles
import styles from './CommitChanges.css';

const contextIdentifier = 'FileChangeCm';
const FileChangeRowContext = ContextMenuLayer(contextIdentifier, (props) => (props))(FileChangeRow)

export default (props) => {
  return (
    <div className="layout-column flex">
      <div className="layout-column flex">
        <FileChangeTitleRow text={props.changes.data.length + ' file changes'} model="changes.toggleAll" value={props.changes.toggleAll} changeAction={props.actToggleAll}/>
        <div className="scroll-box flex">
          {props.changes.data.map((file, idx)=><FileChangeRowContext key={idx} text={file.data.name} clickFn={()=>{props.selectedFileChange({name: file.name})}} isActive={file.name == props.changes.selected.name} model={'changes.data['+idx+'].selected'} value={file.selected}/>)}
        </div>
      </div>
      <FileContextmenu identifier={contextIdentifier}/>
    </div>
  )
}


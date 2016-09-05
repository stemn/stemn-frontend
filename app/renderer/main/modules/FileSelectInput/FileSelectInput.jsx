import React from 'react';

import classes from './FileSelectInput.css'

import FileSelect from 'app/renderer/main/modules/FileSelect/FileSelect.jsx'
import Modal from 'app/renderer/main/modules/Modal/Modal.jsx'
import {MdFolder} from 'react-icons/lib/md';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'

export default React.createClass({
  render() {
    const {project} = this.props;
    const options = {
      allowFolder: true,
      foldersOnly: true,
      explore: 'drive'
    };
    return (
      <Modal modalId="FileSelect1">
        <div className={classes.fileSelectInput + ' layout-row layout-align-start-center'}>
          <div className={classes.text + ' flex'}><span style={{textTransform: 'capitalize'}}>{project.remote.provider}/</span>{project.remote.root.path}</div>
            <SimpleIconButton>
              <MdFolder size="22" />
            </SimpleIconButton>
        </div>
        <div>
          <div className="modal-title">Select Folder</div>
          <FileSelect projectId={project._id} path="" storeKey="ProjectSettingsPage" options={options} />
        </div>
      </Modal>
    );
  }
});

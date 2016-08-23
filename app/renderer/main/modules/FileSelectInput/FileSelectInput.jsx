import React from 'react';

import classes from './FileSelectInput.css'

import FileSelect from 'app/renderer/main/modules/FileSelect/FileSelect.jsx'
import Modal from 'app/renderer/main/modules/Modal/Modal.jsx'
import {MdFolder} from 'react-icons/lib/md';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'

export default React.createClass({
  render() {
//    const {projectId, path, fileSelect, options} = this.props;

    return (
        <div className={classes.fileSelectInput + ' layout-row layout-align-start-center'}>
          <div className={classes.text + ' flex'}>Dropbox/Some Folder/SomeOtherFolder/asffsaafs</div>
          <Modal modalId="FileSelect1">
            <SimpleIconButton>
              <MdFolder size="22" />
            </SimpleIconButton>
            <div>
              <div className="modal-title">Select File</div>
              <FileSelect projectId={this.props.project._id} path="" storeKey="ProjectSettingsPage" options={{allowFolder: true, foldersOnly: true}} />
            </div>
          </Modal>
        </div>
    );
  }
});

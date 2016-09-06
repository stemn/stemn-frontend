import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';

import classes from './FileSelectInput.css'

import FileSelect from 'app/renderer/main/modules/FileSelect/FileSelect.jsx'
import Modal from 'app/renderer/main/modules/Modal/Modal.jsx'
import {MdFolder} from 'react-icons/lib/md';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'

const Component = React.createClass({
  onChangeFn(value){
    this.props.dispatch(actions.change(this.props.model, value))
  },
  render() {
    const {projectId, provider, model, value} = this.props;
    const options = {
      allowFolder: true,
      foldersOnly: true,
      explore: 'drive'
    };
    return (
      <Modal modalId="FileSelect1">
        <div className={classes.fileSelectInput + ' layout-row layout-align-start-center'}>
          <div className={classes.text + ' flex'}><span style={{textTransform: 'capitalize'}}>{provider}/</span>{value.path}</div>
            <SimpleIconButton>
              <MdFolder size="22" />
            </SimpleIconButton>
        </div>
        <div>
          <div className="modal-title">Select Folder</div>
          <FileSelect projectId={projectId} path="" storeKey="ProjectSettingsPage" options={options} />
          <button onClick={this.onChangeFn}>Select</button>
        </div>
      </Modal>
    );
  }
});

export default connect()(Component);

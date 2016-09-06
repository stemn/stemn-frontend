import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';

import classes from './FileSelectInput.css'

import FileSelectModal from 'app/renderer/main/modules/FileSelect/FileSelectModal.jsx'
import Modal from 'app/renderer/main/modules/Modal/Modal.jsx'
import {MdFolder} from 'react-icons/lib/md';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'

const Component = React.createClass({
  submitFn(value){
    this.props.dispatch(actions.change(this.props.model, value))
  },
  render() {
    const {projectId, provider, model, value} = this.props;
    const options = {
      allowFolder : true,
      foldersOnly : true,
      explore     : 'drive'
    };
    return (
      <Modal modalId="FileSelect1">
        <div className={classes.fileSelectInput + ' layout-row layout-align-start-center'}>
          <div className={classes.text + ' flex'}><span style={{textTransform: 'capitalize'}}>{provider}/</span>{value.path}</div>
          <SimpleIconButton>
            <MdFolder size="22" />
          </SimpleIconButton>
        </div>
        <FileSelectModal
          projectId={projectId}
          path={value.fileId}
          storeKey="FileSelect1"
          options={options}
          submitFn={this.submitFn}
        />
      </Modal>
    );
  }
});

export default connect()(Component);

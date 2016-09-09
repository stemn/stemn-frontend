import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';

// Container Actions
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

import classes from './FileSelectInput.css'

import Modal from 'app/renderer/main/modules/Modal/Modal.jsx'
import {MdFolder} from 'react-icons/lib/md';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'

const Component = React.createClass({
  showModal(){
    console.log('here');
    this.props.ModalActions.showModal({
      modalType: 'FILE_SELECT',
      modalProps: {
        projectId: this.props.projectId,
        path: this.props.value.fileId,
        storeKey: "FileSelect1",
        options: {
          allowFolder : true,
          foldersOnly : true,
          explore     : 'drive'
        },
      },
      modalConfirm: actions.change(this.props.model)
    })
  },
  render() {
    const {projectId, provider, model, value} = this.props;
    return (
      <div className={classes.fileSelectInput + ' layout-row layout-align-start-center'} onClick={this.showModal}>
        <div className={classes.text + ' flex'}><span style={{textTransform: 'capitalize'}}>{provider}/</span>{value.path}</div>
        <SimpleIconButton>
          <MdFolder size="22" />
        </SimpleIconButton>
      </div>
    );
  }
});
//        <FileSelectModal

//        />
function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    ModalActions: bindActionCreators(ModalActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

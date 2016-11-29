import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

import classes from './FileSelectInput.css'
import classNames from 'classnames';
import MdFolder from 'react-icons/md/folder';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'


const propTypesObject = {
  projectId: PropTypes.string,
  provider: PropTypes.string.isRequired,    // 'dropbox' || 'drive' - The provider
  model: PropTypes.string.isRequired,       // The model to assign the selected file
  value: PropTypes.object.isRequired,       // The value of the selected file: { path, fileId }
  disabled: PropTypes.bool                  // Should we disable the input
};

const FileSelectInput = React.createClass({
  showModal(){
    this.props.ModalActions.showModal({
      modalType: 'FILE_SELECT',
      modalProps: {
        projectId: this.props.projectId,
        model: this.props.model,
        path: this.props.value.fileId,
        storeKey: this.props.model, // We use the model as the storekey
        options: {
          allowFolder : true,
          foldersOnly : true,
          explore     : this.props.provider
        },
      },
    })
  },
  render() {
    const { provider, model, value, disabled } = this.props;
    return (
      <div className={classNames(classes.fileSelectInput, 'layout-row layout-align-start-center', {[classes.disabled] : disabled})} onClick={()=>{if(!disabled){this.showModal()}}}>
        <div className={classes.text + ' flex'}>
          {value && value.path && value.path.length > 0 && provider ? <span><span style={{textTransform: 'capitalize'}}>{provider}/</span>{value.path}</span> : 'Select the project path'}
        </div>
        <SimpleIconButton>
          <MdFolder size="22" />
        </SimpleIconButton>
      </div>
    );
  }
});

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    ModalActions: bindActionCreators(ModalActions, dispatch),
  }
}

FileSelectInput.propTypes = propTypesObject;

export default connect(mapStateToProps, mapDispatchToProps)(FileSelectInput);

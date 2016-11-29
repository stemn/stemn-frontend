// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as FileSelectActions from './FileSelect.actions.js';
import { actions } from 'react-redux-form';

// Component Core
import React, { PropTypes } from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import FileList from 'app/renderer/main/modules/FileList/FileList';
import Button from 'app/renderer/main/components/Buttons/Button/Button';
import MdDone from 'react-icons/md/done';


///////////////////////////////// COMPONENT /////////////////////////////////

// Either a projectId or options.explore must be defined
const propTypesObject = {
  projectId     : PropTypes.string,               // Optional: The project id (this is used if we are not exploring a provider)
  path          : PropTypes.string,               // The current fileId: This folder will be opened when the modal inits.
  model         : PropTypes.string,               // The { fileId, path } will be assigned to this model on confirm
  storeKey      : PropTypes.string.isRequired,    // The store key (to be used in the redicer)
  options       : React.PropTypes.shape({
    allowFolder : React.PropTypes.bool,
    foldersOnly : React.PropTypes.bool,
    explore     : React.PropTypes.string,         // Optional: 'dropbox' || 'drive' - The provider
  }),
};

export const FileSelectModal = React.createClass({
  propTypes: propTypesObject,
  componentWillMount() {
    if(!this.props.fileSelect){
      this.props.FileSelectActions.init({
        storeKey: this.props.storeKey,
        path: this.props.path
      })
    }
  },

  componentWillReceiveProps(nextProps) {
    if(!nextProps.fileSelect){
      this.props.FileSelectActions.init({
        storeKey: nextProps.storeKey,
        path: nextProps.path
      })
    }
  },

  singleClickFn({file}){
    if(file.type == 'file' || this.props.options.allowFolder && file.type == 'folder'){
      this.props.FileSelectActions.select({
        storeKey: this.props.storeKey,
        file: file
      })
    }
    else{
      this.props.FileSelectActions.changePath({
        storeKey: this.props.storeKey,
        path: file.fileId
      })
    }
  },
  doubleClickFn({file}){
    if(file.type == 'folder'){
      this.props.FileSelectActions.changePath({
        storeKey: this.props.storeKey,
        path: file.fileId
      })
    }
    else{
      this.props.FileSelectActions.select({
        storeKey: this.props.storeKey,
        file: file
      })
    }
  },
  crumbClickFn({file}){
    this.props.FileSelectActions.changePath({
      storeKey: this.props.storeKey,
      path: file.fileId
    })
  },

  submit(){
    this.props.dispatch(actions.change(this.props.model, {
      fileId : this.props.fileSelect.selected.fileId,
      path   : this.props.fileSelect.selected.path
    }))
    this.props.modalHide();
  },
  cancel(){
    this.props.modalCancel();
    this.props.modalHide();
  },
  render() {
    const { projectId, path, fileSelect, options } = this.props;

    const activePath = fileSelect && fileSelect.path ? fileSelect.path : '';
    return (
      <div style={{width: '600px'}}>
        <div className="modal-title">Select Folder</div>
        {fileSelect
        ? <FileList
            projectId={projectId}
            path={activePath}
            singleClickFn={this.singleClickFn}
            doubleClickFn={this.doubleClickFn}
            crumbClickFn={this.crumbClickFn}
            selected={fileSelect.selected}
            options={options}
          />
        : null
        }
        <div className="modal-footer layout-row layout-align-start-center">
          <div className="flex"></div>
          <Button style={{marginRight: '10px'}} onClick={this.cancel}>
            Cancel
          </Button>
          <Button className="primary" onClick={this.submit}>
            Select Folder
          </Button>
        </div>
      </div>
    );
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({fileSelect}, {projectId, path, storeKey, options}) {
  return {
    fileSelect: fileSelect[storeKey],
    projectId,
    storeKey,
    path,
    options
  };
}

function mapDispatchToProps(dispatch) {
  return {
    FileSelectActions: bindActionCreators(FileSelectActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileSelectModal);

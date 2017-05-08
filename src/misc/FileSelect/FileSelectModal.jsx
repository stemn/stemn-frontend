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
import FileList from 'stemn-shared/misc/FileList';
import Button from 'stemn-shared/misc/Buttons/Button/Button';
import MdDone from 'react-icons/md/done';
import { isDriveFileId, isDropboxFileId } from 'stemn-shared/misc/Files/utils';

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
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  onMount(nextProps, prevProps) {
    if(!nextProps.fileSelect){
      nextProps.FileSelectActions.init({
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
    this.props.modalConfirm();
  },
  cancel(){
    this.props.modalCancel();
  },
  render() {
    const { projectId, path, fileSelect, options } = this.props;

    const validatePath = (path, provider) => {
      if(provider == 'drive'){
        return isDriveFileId(path) ? path : ''
      }
      else if(provider == 'dropbox'){
        return isDropboxFileId(path) ? path : ''
      }
      else{
        return ''
      }
    }
    const activePath = fileSelect ? validatePath(fileSelect.path, options.explore) : '';

    return (
      <div style={{width: '600px'}}>
        {fileSelect
        ? <FileList
            projectId={projectId}
            path={activePath}
            singleClickFn={this.singleClickFn}
            doubleClickFn={this.doubleClickFn}
            crumbClickFn={this.crumbClickFn}
            selected={fileSelect.selected}
            options={options}
            contentStyle={{height: '300px', overflowY: 'auto'}}
          />
        : null
        }
        <div className="modal-footer layout-row layout-align-start-center">
          <div className="flex text-grey-3">
            {fileSelect && fileSelect.selected && fileSelect.selected.path ? <span>Selected: {fileSelect.selected.path}</span> : null}
          </div>
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

function mapStateToProps({fileSelect}, {storeKey}) {
  return {
    fileSelect: fileSelect[storeKey],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    FileSelectActions: bindActionCreators(FileSelectActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileSelectModal);

// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as FileSelectActions from './FileSelect.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
//import classes from './FileList.css'

// Sub Components
import FileList from 'app/renderer/main/modules/FileList/FileList';
import Button from 'app/renderer/main/components/Buttons/Button/Button';
import MdDone from 'react-icons/md/done';



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({

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
    // The modal confirm function is a react redux form change.
    // We extend this action object by the value to confirm the change
    this.props.modalConfirm({value: this.props.fileSelect.selected});
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

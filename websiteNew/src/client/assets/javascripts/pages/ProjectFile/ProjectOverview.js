import React, { Component } from 'react';

// Styles
import classNames from 'classnames';
import classes from './ProjectOverview.css'

// Sub Components
import FileList from 'stemn-shared/misc/FileList/FileList';
import Readme from 'stemn-shared/misc/Files/Readme/Readme.jsx';

export default class ProjectOverview extends Component {
  fileFolderClick = ({file}) => {
    const { project } = this.props;
    const isFile = file.type == 'file';
    if(isFile){
//      dispatch(ElectronWindowsActions.create({
//        type         : 'PREVIEW',
//        props        : {
//          fileId     : file.fileId,
//          revisionId : file.revisionId,
//          projectId  : file.project._id
//        }
//      }))
    } else {
//      dispatch(projectFolderRoute({
//        projectId: project.data._id,
//        fileId: file.fileId
//      }))
    }
  }
  render() {
    const { entityModel, project, path, files } = this.props;
    const options = {
      showMenu: true
    };
    if(project && project.data && project.data._id){
      return (
        <div className={classes.container+' flex scroll-box'}>
          <FileList
            className={classNames(classes.files)}
            projectId={project.data._id}
            path={path || ''}
            singleClickFn={this.fileFolderClick}
            doubleClickFn={this.fileFolderClick}
            crumbClickFn={this.fileFolderClick}
            options={options}
            crumbPopup={true}
          />
          { files && files.entries
          ? <Readme
              className={classes.readme}
              files={files.entries}
            />
          : <div className="text-center text-grey-3" style={{marginTop: '30px'}}>
              Add a README.md file to this folder to help others understand what is inside.
            </div>
          }
        </div>
      );
    }
    else{
      return null
    }
  }
};


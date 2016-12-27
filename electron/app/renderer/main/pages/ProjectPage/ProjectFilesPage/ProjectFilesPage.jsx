// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions        from 'app/shared/actions/projects.js';
import * as ElectronWindowsActions from 'app/shared/modules/ElectronWindows/ElectronWindows.actions.js';

import { push } from 'react-router-redux'

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './ProjectFilesPage.css'

// Sub Components
import FileList from 'app/renderer/main/modules/FileList/FileList';
import Readme from 'app/shared/modules/Files/Readme/Readme.jsx';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  fileFolderClick({file}){
    const { project, dispatch } = this.props;
    const isFile = file.type == 'file';
    console.log(file);
    if(isFile){
      dispatch(ElectronWindowsActions.create({
        type         : 'PREVIEW',
        props        : {
          fileId     : file.fileId,
          revisionId : file.revisionId,
          projectId  : file.project._id
        }
      }))
    }else{
      dispatch(push({
        pathname   : `project/${project.data._id}/files/${file.fileId || ''}`,
      }))
    }
  },
  render() {
    const { entityModel, project, path, files, ProjectsActions, dispatch } = this.props;
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
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ projects, projectSettings, fileList }, { params, location }) {
  const projectId   = params.stub;
  const path        = params.path || '';
  const project     = projects.data[projectId]
  const entityModel = `projects.data.${projectId}`;
  const files       = fileList[`${projectId}-${path}`];

  return {
    project,
    entityModel,
    path,
    files
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);

import React, { Component } from 'react';

// Styles
import classNames from 'classnames';
import classes from './ProjectOverview.css'

// Sub Components
import FileList from 'stemn-shared/misc/FileList/FileList';
import Readme from 'stemn-shared/misc/Files/Readme/Readme.jsx';
import { Container } from 'stemn-shared/misc/Layout';
import Button from 'stemn-shared/misc/Buttons/Button/Button';
import Tag from 'stemn-shared/misc/Tags/Tag';

import MdLocationOn from 'react-icons/md/location-on';
import MdPeople from 'react-icons/md/people';
import MdAccount from 'react-icons/md/account-balance';
import MdAccessTime from 'react-icons/md/access-time';

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
        <div>
          <div className={ classes.header }>
            <Container className={ classes.headerInner }>
              <div className={ classes.headerBorder }/>
              <div className={ classes.blurb }>{ project.data.blurb }</div>
              <div className='layout-row layout-align-start-center'>
                <div className={ classes.tags }>
                  { project.data.fields.map((field) => <Tag className='primary' key={ field._id } text={ field.name } /> )}
                </div>
              </div>
              <div className="flex" />
            </Container>
          </div>
          <Container style={{marginTop: '30px'}}>
            <div className={ classNames('layout-row', classes.infoBoxes)}>
              <div className='flex'>
                <MdAccessTime />
                Updated 1 month ago
              </div>
              <div className='flex'>
                <MdPeople />
                3 team members
              </div>
              <div className='flex'>
                <MdLocationOn />
                Sydney Australia
              </div>
              <div className='flex'>
                <MdAccount />
                Creative Commons
              </div>
            </div>
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
          </Container>
        </div>
      );
    }
    else{
      return null
    }
  }
};

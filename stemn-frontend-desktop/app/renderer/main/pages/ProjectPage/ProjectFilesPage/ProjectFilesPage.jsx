import React from 'react'
import { projectFolderRoute } from 'route-actions'
import classes from './ProjectFilesPage.css'
import FileList from 'stemn-shared/misc/FileList'
import Readme from 'stemn-shared/misc/Files/Readme/Readme.jsx'
import { get } from 'lodash'

export default class ProjectFilesPage extends React.Component {
  fileFolderClick = ({ file }) => {
    const { project, create, pushRoute } = this.props
    const isFile = file.type == 'file'
    if (isFile) {
      create({
        type: 'PREVIEW',
        props: {
          fileId: file.fileId,
          revisionId: file.revisionId,
          projectId: file.project._id,
        },
      })
    } else {
      pushRoute(projectFolderRoute({
        projectId: project.data._id,
        fileId: file.fileId,
      }))
    }
  };

  render() {
    const { entityModel, project, path, files, saveProject } = this.props
    const options = {
      showMenu: true,
    }
    if (project && project.data && project.data._id) {
      return (
        <div className={ `${classes.container} flex scroll-box` }>
          <FileList
            className={ classes.files }
            initialSync={ !project.data.remote.lastSynced }
            projectId={ project.data._id }
            path={ path || '' }
            singleClickFn={ this.fileFolderClick }
            doubleClickFn={ this.fileFolderClick }
            crumbClickFn={ this.fileFolderClick }
            options={ options }
            crumbPopup
            search
          />
          <Readme
            files={ get(files, 'entries', []) }
            project={ project }
            projectModel={ entityModel }
            saveProject={ saveProject }
            isRoot={ !path || path === '' }
            canEdit
          />
        </div>
      )
    } 
    return null
  }
}

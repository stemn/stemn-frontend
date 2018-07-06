import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import FileSelectInput from 'stemn-shared/misc/FileSelectInput/FileSelectInput.jsx'
import ProjectLinkRemote from 'stemn-shared/misc/Project/ProjectLinkRemote/ProjectLinkRemote.jsx'
import Form from 'stemn-shared/misc/Forms/Form'

export default class CloudSettings extends Component {
  static propTypes = {
    projectModel: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    confirmLinkRemote: PropTypes.func.isRequired,
  }
  renderFormInner() {
    const { projectModel, project, confirmLinkRemote } = this.props
    return (
      <div className="layout-column">
        <h3>Cloud Storage Folder</h3>
        <p>Select your project's cloud storage folder. STEMN will track all changes to files in this folder.</p>
        <ProjectLinkRemote
          model={ `${projectModel}.fileStoreForm.provider` }
          value={ project.fileStoreForm.provider }
        />
        <br />
        <FileSelectInput
          projectId={ project.data._id }
          provider={ project.fileStoreForm.provider }
          model={ `${projectModel}.fileStoreForm.root` }
          value={ project.fileStoreForm.root || {} }
          disabled={ !['drive', 'dropbox'].includes(project.fileStoreForm.provider) }
        />
        <br />
        <div className="layout-row layout-align-end">
          <ProgressButton
            className="primary"
            onClick={ confirmLinkRemote }
            loading={ project.linkPending }
            error={ project.linkRejected }
          >
            Update Folder
          </ProgressButton>
        </div>
      </div>
    )
  }
  render() {
    const { projectModel, project } = this.props

    return (
      <Form
        model={ `${projectModel}.fileStoreForm` }
        value={ project.data.remote }
      >
        { project.fileStoreForm
          ? this.renderFormInner()
          : null }
      </Form>
    )
  }
}

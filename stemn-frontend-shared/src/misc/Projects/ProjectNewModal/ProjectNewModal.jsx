import { get, pick } from 'lodash';
import React, { Component } from 'react';
import Button from 'stemn-shared/misc/Buttons/Button/Button';
import FileSelectInput from 'stemn-shared/misc/FileSelectInput/FileSelectInput.jsx';
import Input from 'stemn-shared/misc/Input/Input/Input';
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import PanelDescription from 'stemn-shared/misc/Panels/PanelDescription';
import ProjectLinkRemote from 'stemn-shared/misc/Project/ProjectLinkRemote/ProjectLinkRemote.jsx';
import ProjectPermissionsRadio from 'stemn-shared/misc/Project/ProjectPermissionsRadio/ProjectPermissionsRadio.jsx';
import { ArrowTab, ArrowTabs } from 'stemn-shared/misc/Tabs/ArrowTabs/ArrowTabs.jsx';

import classes from './ProjectNewModal.scss';

export default class ProjectNewModal extends Component {
  state = {
    activeTab: 1,
    linkPending: false,
  }
  createProject = () => {
    const { newProject, goToProjectSettings, createProject, linkRemote, modalConfirm, auth } = this.props
    const newProjectData = pick(newProject, ['private', 'name', 'summary'])
    createProject(newProjectData).then(({ value }) => {
      const goToProject = () => {
        goToProjectSettings({ projectId: value.data._id })
        modalConfirm()
      }

      const canLink = value.data._id && newProject.provider && newProject.root

      // Link the provider if we can.
      if (canLink) {
        this.setState({ linkPending: true })
        linkRemote({
          projectId: value.data._id,
          provider: newProject.provider,
          fileId: newProject.root.fileId,
          userId: auth.user._id,
        }).then(() => {
          // After we have linked, we go to the project
          this.setState({ linkPending: false })
          goToProject()
        }).catch(() => {
          // If the link fails, we still go to the project
          this.setState({ linkPending: false })
          goToProject()
        })
      } else {
        goToProject()
      }
    })
  }
  changeTab = (activeTab) => {
    this.setState({ activeTab })
  }
  render() {
    const { newProject, entityModel, modalCancel } = this.props
    const { activeTab, linkPending } = this.state

    const namePanelTemplate = () => (
      <div className={ classes.panel }>
        <h3>Name and blurb</h3>
        <p>Set your project name and blurb.</p>
        <Input
          model={ `${entityModel}.name` }
          value={ newProject.name }
          className="dr-input"
          type="text"
          placeholder="Project Name"
          autoFocus
        />
        <br />
        <Textarea
          model={ `${entityModel}.summary` }
          value={ newProject.summary }
          className="dr-input"
          placeholder="Project Summary"
        />
      </div>
    )

    const permissionsTemplate = () => (
      <div className={ classes.panel }>
        <h3>Project Type</h3>
        <ProjectPermissionsRadio
          model={ `${entityModel}.private` }
          value={ get(newProject, 'private') }
        />
      </div>
    )

    const fileStoreTemplate = () => (
      <div className={ `${classes.panel} rel-box layout-column` }>
        <h3>Cloud Storage Folder</h3>
        <p>Select your project's cloud store location.</p>
        <ProjectLinkRemote
          model={ `${entityModel}.provider` }
          value={ newProject.provider }
        />
        <br />
        <FileSelectInput
          disabled={ !['drive', 'dropbox'].includes(newProject.provider) }
          provider={ newProject.provider }
          model={ `${entityModel}.root` }
          value={ newProject.root || {} }
        />
        <LoadingOverlay show={ newProject.savePending || linkPending } />
      </div>
    )

    const tabTemplate = ({ title, blurb, body, button1, button2 }) => (
      <div className="layout-column flex">
        <div className={ `${classes.modalBody} layout-column flex` }>
          <PanelDescription
            title={ title }
            description={ blurb }
          >
            { body }
          </PanelDescription>
        </div>
        <div className={ `${classes.modalFooter} layout-row layout-align-end` }>
          <Button style={ { marginRight: '10px' } } onClick={ button1.onClick }>{ button1.text }</Button>
          <Button className="primary"           onClick={ button2.onClick }>{ button2.text }</Button>
        </div>
      </div>
    )

    const getTab = () => {
      if (activeTab === 1) {
        return tabTemplate({
          title: 'Create Project',
          blurb: 'Enter general display details such as project name and blurb. Remember to set a blurb if you want to open-source your project.',
          body: (
            <div>
              {namePanelTemplate()}
              {permissionsTemplate()}
            </div>
          ),
          button1: {
            text: 'Cancel',
            onClick: modalCancel,
          },
          button2: {
            text: 'Next',
            onClick: () => this.changeTab(2),
          },
        })
      } else if (activeTab === 2) {
        return tabTemplate({
          title: 'File Store',
          blurb: 'Connect a cloud provider (Dropbox or Drive). This will give you access to version control and collaboration features.',
          body: (
            <div>
              {fileStoreTemplate()}
            </div>
          ),
          button1: {
            text: 'Back',
            onClick: () => this.changeTab(1),
          },
          button2: {
            text: 'Create',
            onClick: this.createProject,
          },
        }) 
      }
    }

    const tabTitles = [{
      title: 'General',
      arrow: true,
      onClick: () => { this.changeTab(1) },
      isActive: () => activeTab === 1,
    }, {
      title: 'File Store',
      arrow: false,
      onClick: () => { this.changeTab(2) },
      isActive: () => activeTab === 2,
    }]

    return (
      <div className={ `${classes.stepModal} layout-column` }>
        <div className={ classes.modalTitle }>
          <ArrowTabs className="layout-row flex">
            { tabTitles.map(tab => <ArrowTab
              key={ tab.title }
              arrow={ tab.arrow }
              onClick={ tab.onClick }
              isActive={ tab.isActive() }
            >
              { tab.title }
            </ArrowTab>,
            )}
          </ArrowTabs>
        </div>
        { getTab() }
      </div>
    )
  }
}

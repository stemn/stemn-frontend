import React, { Component } from 'react'
import { get } from 'lodash'

import classes from '../ProjectNewModal/ProjectNewModal.scss'

import Button from 'stemn-shared/misc/Buttons/Button/Button'
import Input from 'stemn-shared/misc/Input/Input/Input'
import ProjectLinkRemote from 'stemn-shared/misc/Project/ProjectLinkRemote/ProjectLinkRemote.jsx'
import { ArrowTabs, ArrowTab } from 'stemn-shared/misc/Tabs/ArrowTabs/ArrowTabs.jsx'
import ProjectPermissionsRadio from 'stemn-shared/misc/Project/ProjectPermissionsRadio/ProjectPermissionsRadio.jsx'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import PanelDescription from 'stemn-shared/misc/Panels/PanelDescription'


export default class ProjectCloneModal extends Component {
  state = {
    activeTab: 1,
    linkPending: false,
  }
  componentWillMount() {
    const { storeChange, projectName } = this.props
    storeChange('projects.cloneProject.name', projectName)
  }
  createClonedProject = () => {
    const { goToProject, createClonedProject, projectId, modalConfirm, cloneProject } = this.props
    createClonedProject({
      projectId,
      name: cloneProject.name,
      provider: cloneProject.provider,
      isPrivate: cloneProject.private,
    }).then(({ value }) => {
      goToProject({ projectId: value.project.id })
      modalConfirm()
    })
  }
  render() {
    const { cloneProject, entityModel, modalCancel } = this.props
    const { linkPending, activeTab } = this.state

    const namePanelTemplate = () => (
      <div className={ classes.panel }>
        <h3>Name</h3>
        <p>Set your project's name.</p>
        <Input
          model={ `${entityModel}.name` }
          value={ cloneProject.name }
          className="dr-input"
          type="text"
          placeholder="Project Name"
          autoFocus
        />
      </div>
    )

    const permissionsTemplate = () => (
      <div className={ classes.panel }>
        <h3>Project Type</h3>
        <ProjectPermissionsRadio
          model={ `${entityModel}.private` }
          value={ get(cloneProject, 'private') }
        />
      </div>
    )

    const fileStoreTemplate = () => (
      <div className={ `${classes.panel} rel-box layout-column` }>
        <h3>Cloud Storage Folder</h3>
        <p>Select your project's cloud store location.</p>
        <ProjectLinkRemote
          model={ `${entityModel}.provider` }
          value={ cloneProject.provider }
        />
        <LoadingOverlay show={ cloneProject.savePending || linkPending } />
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
          <Button 
            className="primary" 
            onClick={ button2.onClick } 
            disabled={ !cloneProject.provider || cloneProject.savePending }
          >
            { button2.text }
          </Button>
        </div>
      </div>
    )

    const getTab = () => {
      if (activeTab === 1) {
        return tabTemplate({
          title: 'Clone Project',
          blurb: 'This will copy all the files associated with this project into your dropbox or google drive. A clone project will also appear on your profile.',
          body: (
            <div>
              {namePanelTemplate()}
              {permissionsTemplate()}
              {fileStoreTemplate()}
            </div>
          ),
          button1: {
            text: 'Cancel',
            onClick: modalCancel,
          },
          button2: {
            text: 'Clone Project',
            onClick: this.createClonedProject,
          },
        })
      }
    }

    const tabTitles = [{
      title: 'Clone Project',
      arrow: false,
      onClick: () => {},
      isActive: () => activeTab === 1,
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

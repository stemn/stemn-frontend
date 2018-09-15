import { elByDataTag, elByPh, elByTitle } from '../utils'

export const createProject = (
  { projectName, projectBlurb, userName }:
  { projectName: string, projectBlurb: string, userName: string },
) => {
  describe('Create project', () => {
    it('Should have a create project button', () => {
      cy.get(elByTitle('button', 'Create new project')).click({ force: true })
    })

    it('Should fill out project general details', () => {
      cy.get(elByPh('input', 'Project Name')).type(projectName)
      cy.get(elByPh('textarea', 'Project Summary')).type(projectBlurb)
      cy.contains('Private Project').click()
      cy.contains('Next').click()
    })

    it('Should fill out file store details', () => {
      cy.get('.ReactModal__Content').within(() => {
        cy.contains('Cloud Storage Folder')
        cy.wait(100)
        cy.contains('Create').click()
      })
    })

    it('Should redirect to the settings page', () => {
      cy.location('href').should('include', '/settings')
      cy.contains(projectName)
    })

    it('Should have the Overview Tab', () => {
      cy.wait(100)
      cy.contains('Overview').click()
      cy.contains('Add a readme')
    })

    it('Should have the Threads Tab', () => {
      cy.contains('Threads').click()
      cy.contains('Project Threads')
    })

    it('Should have the History Tab', () => {
      cy.contains('History').click()
      cy.contains('Project History')
    })

    it('Should have the Pipelines Tab', () => {
      cy.contains('Pipelines').click()
      cy.contains('Project Pipelines')
    })

    it('Should have the Team Tab', () => {
      cy.contains('Team').click()
      cy.contains(userName)
    })

    it('Should have the Settings General Tab', () => {
      cy.contains('Settings').click()
      cy.contains('Project name')
    })

    it('Should have the Settings Permissions Tab', () => {
      cy.get(elByDataTag('nav-pills')).within(() => cy.contains('Permissions').click())
      cy.contains('Project Type')
    })

    it('Should have the Settings Tags Tab', () => {
      cy.get(elByDataTag('nav-pills')).within(() => cy.contains('Tags').click())
      cy.contains('Field Tags')
    })

    it('Should have the Settings Threads Tab', () => {
      cy.get(elByDataTag('nav-pills')).within(() => cy.contains('Threads').click())
      cy.contains('Thread Groups')
    })

    it('Should have the Settings Team Tab', () => {
      cy.get(elByDataTag('nav-pills')).within(() => cy.contains('Team').click())
      cy.contains('Team Members')
    })
  })
}

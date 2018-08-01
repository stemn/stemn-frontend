import { elByPh, elByTitle } from '../utils'

const projectName = 'Test Project'
const projectBlurb = 'This is a test project to make sure the stemn systems are working'

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
})


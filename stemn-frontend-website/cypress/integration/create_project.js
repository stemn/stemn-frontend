import { elByPh, elByTitle } from '../utils'

describe('Create project', () => {
  it('Should have a create project button', () => {
    cy.get(elByTitle('button', 'Create new project'))
    cy.wait(1000) // Was throwing an error if we don't wait
    cy.get(elByTitle('button', 'Create new project')).click()
  })
  it('Should fill out project general details', () => {
    cy.get(elByPh('input', 'Project Name')).type('Test Project')
    cy.get(elByPh('textarea', 'Project Summary')).type('This is a test project to make sure the stemn systems are working')
    cy.contains('Private Project').click()
    cy.contains('Next').click()
  })
  it('Should fill out file store details', () => {
    cy.contains('Cloud Storage Folder')
    cy.contains('Create').click()
  })
})


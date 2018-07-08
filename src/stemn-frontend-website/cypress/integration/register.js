const url = 'http://localhost:3000/register'
import { elByPh, elByTitle } from '../utils'

describe('Register and onboard', () => {
  it('Should fill out name, email and password', () => {
    cy.visit(url)
    cy.contains('Register')
    cy.get(elByPh('input', 'First name')).type('E2E')
    cy.get(elByPh('input', 'Last name')).type('Tester')
    cy.get(elByPh('input', 'Email')).type(`e2e-tester-${new Date().getTime()}@stemn.com`)
    cy.get(elByPh('input', 'Password')).type('password')
    cy.get('button').contains('Register').click()
    cy.location('href').should('include', '/onboarding')
  })
  it('Should redirect to onboarding', () => {
    cy.location('href').should('include', '/onboarding')
  })
  it('Should fill out profile details', () => {
    cy.get(elByPh('textarea', 'Eg: Structural Engineer @ SpaceX')).type('I\'m an automated account used for testing')
    cy.contains('Next: Sync Account').click()
  })
  it('Should redirect to onboarding/sync', () => {
    cy.location('href').should('include', '/onboarding/sync')
    cy.contains('Connect to Dropbox')
    cy.contains('Connect to Google Drive')
    cy.contains('Next: Download').click()
  })
  it('Should redirect to onboarding/download', () => {
    cy.location('href').should('include', '/onboarding/download')
    cy.contains('Download Now')
    cy.contains('Go to Dashboard').click()
  })
  it('Should redirect to the dashboard', () => {
    cy.contains('Your feed is empty.')
  })
  it('Should have a link to the explore page', () => {
    cy.contains('projects or users.').click()
    cy.location('href').should('include', '/explore')
  })
  it('Should have a create project button', () => {
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


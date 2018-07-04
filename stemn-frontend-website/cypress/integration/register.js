const url = 'http://localhost:3000/register'
import { inputByPh, textareaByPh } from '../utils'

describe('Register and onboard', () => {
  it('Should fill out name, email and password', () => {
    cy.visit(url)
    cy.contains('Register')
    cy.get(inputByPh('First name')).type('E2E')
    cy.get(inputByPh('Last name')).type('Tester')
    cy.get(inputByPh('Email')).type(`e2e-tester-${new Date().getTime()}@stemn.com`)
    cy.get(inputByPh('Password')).type('password')
    cy.get('button').contains('Register').click()
    cy.location('href').should('include', '/onboarding')
  })
  it('Should redirect to onboarding', () => {
    cy.location('href').should('include', '/onboarding')
  })
  it('Should fill out profile details', () => {
    cy.get(textareaByPh('Eg: Structural Engineer @ SpaceX')).type('I\'m an automated account used for testing')
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
})
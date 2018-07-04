const url = 'http://localhost:3000/register'

describe('Register', () => {
  beforeEach(() => {
    cy.get('input[placeholder=\'First name\']').as('firstName')
    cy.get('input[placeholder=\'Last name\']').as('lastName')
    cy.get('input[placeholder=Email]').as('email')
    cy.get('input[placeholder=Password]').as('password')
    cy.get('button').contains('Register').as('submit')
  })
  it('Should fill out name, email and password', () => {
    cy.visit(url)
    cy.contains('Register')
    cy.get('@firstName').type('E2E')
    cy.get('@lastName').type('Tester')
    cy.get('@email').type(`e2e-tester-${new Date().getTime()}@stemn.com`)
    cy.get('@password').type('password')
    cy.get('@submit').click()
  })
})
const url = 'http://localhost:44300'
describe('Home Page', () => {
  it('Should load', () => {
    cy.visit(url)
    cy.title().should('include', 'Zuper - Extremely Super Superannuation.')
  })
  it('Should have a waitlist form', () => {
    cy.get('#sign-up-form').should('contain', 'Join the waitlist')
  })
})
export const pageHome = (
  { url }:
  { url: string },
) => {
  describe('Home Page', () => {
    it('Should redirect to landing', () => {
      cy.visit(url)
      cy.location('href').should('include', '/landing')
    })
    it('Should have the title and download button', () => {
      cy.visit(url)
      cy.contains('Seamless Version Control and Task Tracking')
      cy.contains('Download Now')
    })
    it('Should have Sign in', () => {
      cy.visit(url)
      cy.contains('Sign in').click()
      cy.location('href').should('include', '/login')
    })
    it('Should have Sign up', () => {
      cy.visit(url)
      cy.contains('Sign up').click()
      cy.location('href').should('include', '/register')
    })
  })
}

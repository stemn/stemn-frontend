import { elByDataTag } from '../utils'

export default ({ url }: { url: string }) => {
  describe('Pricing Page', () => {
    it('Should have plan names', () => {
      cy.visit(`${url}/pricing`)
      cy.get(elByDataTag('pricingColumn')).then((pricingColumns) => {
        const wraps = (x: number) => cy.wrap(pricingColumns[x])
        wraps(0).contains('Open-source')
        wraps(0).contains('FREE')
        wraps(1).contains('Solo')
        wraps(1).contains('$21')
        wraps(2).contains('Team')
        wraps(2).contains('$49')
        wraps(3).contains('Enterprise')
        wraps(3).contains('$99')
      })
    })
    it('Should link to home', () => {
      cy.visit(`${url}/pricing`)
      cy.contains('Home').click()
      cy.location('href').should('include', '/landing')
    })
    // pricingColumns[0].contains('Open-source')
    //   cy.contains('Open-source')
    //   cy.contains('Solo')
    //   cy.contains('Team')
    //   cy.contains('Enterprise')

    // it('Should have plan prices', () => {
    //   cy.visit(`${url}/pricing`)
    //   cy.contains('FREE')
    //   cy.contains('$21')
    //   cy.contains('$49')
    //   cy.contains('$99')
    // })
  })
}
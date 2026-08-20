/// <reference types="cypress" />

describe('Package 2: Selectors and Assertions', () => {
  it('Task 2.1 - displays at least 1 program card', () => {
    cy.visit('/programs')

    cy.getByTestId('program-card').should('have.length.at.least', 1)
  })

  it('Task 2.2 - displays at least one card with category Beratung', () => {
    cy.visit('/programs')

    cy.contains('[data-testid="program-card"]', 'Beratung').should('be.visible')
  })

  it('Task 2.3 - updates nav state after route changes', () => {
    cy.visit('/programs')

    cy.getByTestId('nav-link-programs').should('have.class', 'app-nav-link--active')

    cy.getByTestId('nav-link-home').click()

    cy.location('pathname').should('eq', '/')
    cy.getByTestId('nav-link-programs').should('not.have.class', 'app-nav-link--active')
    cy.getByTestId('nav-link-home').should('have.class', 'app-nav-link--active')
  })
})

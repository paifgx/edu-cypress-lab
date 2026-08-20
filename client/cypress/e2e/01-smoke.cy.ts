/// <reference types="cypress" />

describe('Package 1: Smoke Tests', () => {
  it('Task 1.1 - loads landing page', () => {
    cy.visit('/')

    cy.getByTestId('landing-page').should('be.visible')
    cy.getByTestId('app-title').should('contain.text', 'Service')
  })

  it('Task 1.2 - navigates to Programs and marks nav link active', () => {
    cy.visit('/')

    cy.getByTestId('nav-link-programs').click()

    cy.location('pathname').should('eq', '/programs')
    cy.getByTestId('programs-page').should('be.visible')
    cy.getByTestId('nav-link-programs').should(
      'have.class',
      'app-nav-link--active',
    )
  })

  it('Task 1.3 - shows 404 page on unknown route', () => {
    cy.visit('/gibts-nicht')

    cy.getByTestId('not-found-page').should('be.visible')
    cy.contains('h2', '404').should('be.visible')
  })
})

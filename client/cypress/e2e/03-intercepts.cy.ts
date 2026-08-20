/// <reference types="cypress" />

describe('Package 3: Network Intercepts', () => {
  it('Task 3.1 - intercepts GET /programs and validates status code', () => {
    cy.intercept('GET', '**/programs*').as('getPrograms')

    cy.visit('/programs')

    cy.wait('@getPrograms')
      .its('response.statusCode')
      .should('be.oneOf', [200, 304])
    cy.getByTestId('program-card').should('have.length.at.least', 1)
  })

  it('Task 3.2 - simulates 500 and shows the error banner', () => {
    cy.intercept({
      method: 'GET',
      url: '**/programs*',
      headers: { 'x-sim-error': '500' },
    }).as('getProgramsError')
    
    cy.visit('/programs?__error=500')
    cy.wait('@getProgramsError').its('response.statusCode').should('eq', 500)
    cy.getByTestId('error-banner')
      .should('be.visible')
      .and('contain.text', 'Simulated failure')
  })

  it('Task 3.3 - simulates latency and verifies spinner behavior', () => {
    cy.intercept({
      method: 'GET',
      url: '**/programs*',
      headers: { 'x-sim-delay': '800' },
    }).as('getProgramsDelay')

    cy.visit('/programs?__delay=800')

    cy.getByTestId('spinner').should('be.visible')
    cy.wait('@getProgramsDelay').its('response.statusCode').should('eq', 200)
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('program-card').should('have.length.at.least', 1)
  })
})

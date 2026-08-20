/// <reference types="cypress" />

describe('Package 5: Error Scenarios', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('Task 5.1 - redirects to /login when backoffice is accessed without auth', () => {
    cy.visit('/backoffice/applications')

    cy.location('pathname').should('eq', '/login')
    cy.location('search').should('include', 'returnTo=')
  })

  it('Task 5.2 [known bug] - redirects to returnTo URL after officer login', () => {
    cy.visit('/backoffice/applications')
    cy.location('pathname').should('eq', '/login')
    cy.location('search').should('include', 'returnTo')

    cy.getByTestId('login-email').type('officer@example.com')
    cy.getByTestId('login-password').type('password', { log: false })
    cy.getByTestId('login-submit').click()

    // Expected behavior (currently buggy in app code): redirect to returnTo path.
    cy.location('pathname').should('eq', '/backoffice/applications')
  })

  it('Task 5.3 [known bug] - sends search request for single-character query', () => {
    cy.intercept('GET', '**/programs?q=*').as('programSearch')

    cy.visit('/programs')
    cy.getByTestId('filter-input').type('I')

    cy.wait('@programSearch').then(({ request }) => {
      const query = new URL(request.url).searchParams.get('q')
      expect(query).to.eq('I')
    })

    cy.getByTestId('results').should('contain.text', 'IT-Beratung')
  })

  it('Task 5.3 [known bug] - trims spaces before sending filter query', () => {
    cy.intercept('GET', '**/programs?q=*').as('programSearch')

    cy.visit('/programs')
    cy.getByTestId('filter-input').type('  Beratung  ')

    cy.wait('@programSearch').then(({ request }) => {
      const query = new URL(request.url).searchParams.get('q')
      expect(query).to.eq('Beratung')
    })

    cy.getByTestId('program-card').should('have.length', 2)
  })
})

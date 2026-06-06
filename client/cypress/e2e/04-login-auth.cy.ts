/// <reference types="cypress" />

const fillLoginForm = (email: string, password: string) => {
  cy.getByTestId('login-email').clear().type(email)
  cy.getByTestId('login-password').clear().type(password, { log: false })
}

describe('Package 4: Login and Auth Flows', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('Task 4.1 - logs in and shows New Application instead of Login', () => {
    cy.loginAs('citizen')

    cy.location('pathname').should('eq', '/')
    cy.getByTestId('nav-link-new-application').should('be.visible')
    cy.getByTestId('nav-link-login').should('not.exist')
  })

  it('Task 4.2 - shows error banner with invalid credentials', () => {
    cy.visit('/login')
    fillLoginForm('wrong@example.com', 'wrong')
    cy.getByTestId('login-submit').click()

    cy.getByTestId('login-error')
      .should('be.visible')
      .and('contain.text', 'Ungueltige')
  })

  it('Task 4.3 [known bug] - clears error after successful follow-up login', () => {
    cy.visit('/login')

    fillLoginForm('wrong@example.com', 'wrong')
    cy.getByTestId('login-submit').click()
    cy.getByTestId('login-error').should('be.visible')

    fillLoginForm('citizen@example.com', 'password')
    cy.getByTestId('login-submit').click()

    // Expected behavior (currently buggy in app code): error should be cleared.
    cy.getByTestId('login-error').should('not.exist')
  })
})

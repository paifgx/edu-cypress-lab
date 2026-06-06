/// <reference types="cypress" />

type UserRole = 'citizen' | 'officer'
type GetByTestIdOptions = Partial<
  Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow
>

const USER_CREDENTIALS: Record<UserRole, { email: string; password: string }> = {
  citizen: { email: 'citizen@example.com', password: 'password' },
  officer: { email: 'officer@example.com', password: 'password' },
}

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(
        testId: string,
        options?: GetByTestIdOptions,
      ): Chainable<JQuery<HTMLElement>>
      loginAs(role: UserRole): Chainable<void>
      gotoLandingPage(): Chainable<void>
      outputPageSource(): Chainable<void>
    }
  }
}

Cypress.Commands.add(
  'getByTestId',
  (testId: string, options?: GetByTestIdOptions) => {
    return cy.get(`[data-testid="${testId}"]`, options)
  },
)

Cypress.Commands.add('loginAs', (role: UserRole) => {
  const credentials = USER_CREDENTIALS[role]

  cy.visit('/login')
  cy.getByTestId('login-email').clear().type(credentials.email)
  cy.getByTestId('login-password').clear().type(credentials.password, {
    log: false,
  })
  cy.getByTestId('login-submit').click()
})

Cypress.Commands.add('gotoLandingPage', () => {
  cy.visit('/')
  cy.getByTestId('landing-page').should('be.visible')
})

Cypress.Commands.add('outputPageSource', () => {
  cy.getByTestId('landing-page').then(($element) => {
    // Useful while debugging flaky rendering issues.
    console.log($element.html())
  })
})

export {}

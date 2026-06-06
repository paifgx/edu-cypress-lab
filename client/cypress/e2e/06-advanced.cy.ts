/// <reference types="cypress" />

const fillNewApplicationForm = (applicantName: string, applicantEmail: string) => {
  cy.getByTestId('select-program').select('P-1001')
  cy.getByTestId('input-name').clear().type(applicantName)
  cy.getByTestId('input-email').clear().type(applicantEmail)
}

const openNewApplicationFormAsCitizen = (
  applicantName: string,
  applicantEmail: string,
) => {
  cy.loginAs('citizen')
  cy.visit('/applications/new')
  fillNewApplicationForm(applicantName, applicantEmail)
}

describe('Package 6: Advanced', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('Task 6.1 [known bug] - prevents duplicate POST on double click submit', () => {
    cy.intercept('POST', '**/applications').as('createApplication')

    openNewApplicationFormAsCitizen(
      'Double Submit User',
      'double-submit@example.com',
    )
    cy.getByTestId('submit-application').dblclick()

    cy.wait('@createApplication').its('response.statusCode').should('eq', 201)

    // Expected behavior (currently buggy in app code): only one create request.
    cy.get('@createApplication.all').should('have.length', 1)
  })

  it('Task 6.2 [known bug] - list reflects status change after returning from detail', () => {
    const uniqueSuffix = Date.now()
    const applicantName = `Stale Status ${uniqueSuffix}`
    const applicantEmail = `stale-status-${uniqueSuffix}@example.com`

    cy.intercept('POST', '**/applications').as('createApplication')

    openNewApplicationFormAsCitizen(applicantName, applicantEmail)
    cy.getByTestId('submit-application').click()

    cy.wait('@createApplication').then(({ response }) => {
      expect(response?.statusCode).to.eq(201)

      const createdApplicationId = response?.body?.id as string | undefined
      if (!createdApplicationId) {
        throw new Error('Expected created application id in response body')
      }

      cy.clearLocalStorage()
      cy.clearCookies()

      cy.loginAs('officer')
      cy.visit('/backoffice/applications')

      cy.contains('[data-testid="application-row"]', createdApplicationId)
        .as('targetRow')

      cy.get('@targetRow').contains('Details').click()
      cy.getByTestId('change-status').first().click()

      cy.getByTestId('application-status')
        .invoke('text')
        .then((statusText) => {
          const normalizedStatus = statusText.replace(/\s+/g, ' ').trim()

          cy.getByTestId('nav-link-backoffice').click()

          // Expected behavior (currently buggy in app code): list shows updated status.
          cy.contains('[data-testid="application-row"]', createdApplicationId)
            .should('contain.text', normalizedStatus)
        })
    })
  })

  it('Task 6.3 [known bug] - keeps result set for latest search term', () => {
    cy.intercept('GET', '**/programs?q=Bi*', (req) => {
      req.headers['x-sim-delay'] = '800'
      req.continue()
    }).as('slowSearch')
    cy.intercept('GET', '**/programs?q=Beratung*').as('fastSearch')

    cy.visit('/programs')
    cy.clock(undefined, ['setTimeout', 'clearTimeout'])

    cy.getByTestId('filter-input').type('Bi')
    cy.tick(301)
    cy.getByTestId('filter-input').clear().type('Beratung')
    cy.tick(301)

    cy.wait('@fastSearch')
    cy.getByTestId('program-card').should('have.length', 2)

    cy.wait('@slowSearch')

    // Expected behavior (currently buggy in app code): stale response must not overwrite.
    cy.getByTestId('program-card').should('have.length', 2)
  })
})

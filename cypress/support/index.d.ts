/**
 * @reference cypress/support/index.d.ts
 * @description Loading & Overriding type definitions from Cypress Module
 */

declare namespace Cypress {
  interface Chainable {

    /**
     * Custom command to login into the app
     * @example cy.login()
     */
    login(): Chainable<Element>;
  }
}

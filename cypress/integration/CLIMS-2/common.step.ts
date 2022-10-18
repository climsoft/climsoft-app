import { And, Given, When, Then } from "cypress-cucumber-preprocessor/steps";

Given('I am able to login successfully', () => {
  cy.login();
});

When('I click on the stations link on the side navigation', () => {
  cy.get('c-sidebar').within(() => {
    cy.get('c-sidebar-nav-link').eq(1).within(() => {
      cy.get('a').click({ force: true });
    });
  });
});

And('I am able to see the stations view', () => {
  cy.url().should('contain', '#/stations');
});

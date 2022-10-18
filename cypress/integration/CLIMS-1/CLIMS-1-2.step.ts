import { And, Given, When, Then } from "cypress-cucumber-preprocessor/steps";

And('I enter incorrect password in password textbox', () => {
  cy.get('app-login').within(() => {
    cy.get('form').within(() => {
      cy.get('c-input-group').eq(1).within(() => {
        cy.get('[formcontrolname="password"]').type('Passwierd123');
      });
    });
  });
});

Then('I am able to see the login failure error message {string}', (message: string) => {
  cy.get('app-login').within(() => {
    cy.get('form').within(() => {
      cy.get('.error-block').should("include.text", message);
    });
  });
});

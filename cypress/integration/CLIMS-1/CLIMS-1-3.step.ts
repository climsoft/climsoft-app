import { And, Given, When, Then } from "cypress-cucumber-preprocessor/steps";

And('I enter the password in password textbox as {string}', (password: string) => {
  cy.get('app-login').within(() => {
    cy.get('form').within(() => {
      cy.get('c-input-group').eq(1).within(() => {
        cy.get('[formcontrolname="password"]').type(password);
      });
    });
  });
});

Then('I login successfully', () => {
  cy.url().should('contain', '/dashboard');
});

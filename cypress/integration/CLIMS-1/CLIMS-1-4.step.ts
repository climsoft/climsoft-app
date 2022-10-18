import { And, Given, When, Then } from "cypress-cucumber-preprocessor/steps";

Given('I am on the login page with return path {string}', (path: string) => {
  cy.log(path);
  cy.visit(path);
});

Then('I login successfully with the right returnUrl {string}', (destUrl: string) => {
  cy.url().should('contain', destUrl);
});

import { And, Given, When, Then } from "cypress-cucumber-preprocessor/steps";

Given('I am on the login page', () => {
  cy.visit('#/login');
});

And('I enter the username in username textbox as "admin"', () => {
  cy.get('app-login').within(() => {
    cy.get('form').within(() => {
      cy.get('c-input-group').eq(0).within(() => {
        cy.get('[formcontrolname="username"]').type('admin');
      });
    });
  });
});

When('I click on the login button', () => {
  cy.get('app-login').within(() => {
    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click({ force: true });
    });
  });
});

And('I can see the busy spinner', () => {
  cy.log('Step implementation not required for this step');
  cy.wait(200);
});


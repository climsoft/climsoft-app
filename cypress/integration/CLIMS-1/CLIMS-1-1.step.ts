import { And, Given, When, Then } from "cypress-cucumber-preprocessor/steps";

Then('I am able to see the username textbox invalid status', () => {
  cy.get('app-login').within(() => {
    cy.get('form').within(() => {
      cy.get('c-input-group').eq(0).within(() => {
        cy.get('[formcontrolname="username"]').should('have.class', 'is-invalid');
      });
    });
  });
});

And('I am able to see the username validation error message {string}', (message: string) => {
  cy.get('app-login').within(() => {
    cy.get('form').within(() => {
      cy.get('c-input-group').eq(0).within(() => {
        cy.get('.invalid-feedback').should('include.text', message);
      });
    });
  });
});

And('I am able to see the password textbox invalid status', () => {
  cy.get('app-login').within(() => {
    cy.get('form').within(() => {
      cy.get('c-input-group').eq(1).within(() => {
        cy.get('[formcontrolname="password"]').should('have.class', 'is-invalid');
      });
    });
  });
});

And('I am able to see the password validation error message {string}', (message: string) => {
  cy.get('app-login').within(() => {
    cy.get('form').within(() => {
      cy.get('c-input-group').eq(1).within(() => {
        cy.get('.invalid-feedback').should('include.text', message);
      });
    });
  });
});

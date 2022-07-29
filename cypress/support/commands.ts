// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 * Climsoft App Custom Commands
 */

Cypress.on('uncaught:exception', () => {
  return false;
});

Cypress.Commands.add("login", (username: string = 'admin', password: string = 'password123') => {
    cy.visit('#/login');
    cy.wait(2000);

    cy.get('app-login').within(() => {
      cy.get('form').within(() => {
        cy.get('c-input-group').eq(0).within(() => {
          cy.get('[formcontrolname="username"]').type(username);
        });
        cy.wait(500);
        cy.get('c-input-group').eq(1).within(() => {
          cy.get('[formcontrolname="password"]').type(password);
        });
        cy.wait(500);
        cy.get('button[type="submit"]').click({ force: true });
      });
    });
});

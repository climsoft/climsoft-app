import { And, Given, When, Then } from "cypress-cucumber-preprocessor/steps";

When('I click on the "20" button on the page limit control', () => {
  cy.get('app-stations').within(() => {
    cy.get('c-card').within(() => {
      cy.get('c-card-body').within(() => {
        cy.get('c-button-group').within(() => {
          cy.get('.btn-outline-primary').contains('20').click({ force: true });
        });
      });
    });
  });
});

Then('I am able to see "20" stations loaded in the table', () => {
  cy.get('app-stations').within(() => {
    cy.get('c-card').within(() => {
      cy.get('c-card-body').within(() => {
        cy.get('table').within(() => {
          cy.get('thead').within(() =>{
            cy.get('tr').find('th').its('length').should('be.gte', 9);
          });
          cy.get('tbody').within(() =>{
            cy.get('tr').its('length').should('be.gte', 20);
          });
        });
      });
    });
  });
});

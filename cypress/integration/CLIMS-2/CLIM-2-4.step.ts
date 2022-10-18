import { And, Given, When, Then } from "cypress-cucumber-preprocessor/steps";

When('I click on the first row item details button in the table', () => {
  cy.get('app-stations').within(() => {
    cy.get('c-card').within(() => {
      cy.get('c-card-body').within(() => {
        cy.get('table').within(() => {
          cy.get('tbody').within(() => {
            cy.get('tr').first().within(() => {
              cy.get('td').eq(7).within(() => {
                cy.get('button').eq(0).click({ force: true });
              });
            });
          });
        });
      });
    });
  });
});

Then('I am able to see station details view', () => {
  cy.url().should('contain', 'http://localhost:4200/#/stations/67755030');
});


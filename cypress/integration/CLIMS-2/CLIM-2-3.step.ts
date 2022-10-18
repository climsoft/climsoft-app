import { And, Given, When, Then } from "cypress-cucumber-preprocessor/steps";

When('I click on the page "2" button on the pagination control', () => {
  cy.get('app-stations').within(() => {
    cy.get('app-paginator').within(() => {
      cy.get('c-pagination').within(() => {
        cy.get('ul').within(() => {
          cy.get('li').eq(3).within(() => {
            cy.get('a').click({ force: true });
          });
        });
      });
    });
  });
});

Then('I am able to see page "2" button active', () => {
  cy.get('app-stations').within(() => {
    cy.get('app-paginator').within(() => {
      cy.get('c-pagination').within(() => {
        cy.get('ul').within(() => {
          cy.get('li').eq(3).should('have.class', 'active');
        });
      });
    });
  });
});

And('I am able to see the next page results loaded', () => {
  // cy.intercept('GET', '/stations?');
  cy.log('Front End Implementation not required for this step.');
});

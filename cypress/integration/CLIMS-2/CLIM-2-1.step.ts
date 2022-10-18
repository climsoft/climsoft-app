import { And, Given, When, Then } from "cypress-cucumber-preprocessor/steps";

And('I am able to see the pagination control', () => {
  cy.log('Step implementation coming soon');
});

Then('I am able to see the stations view', () => {
  cy.url().should('contain', '#/stations');
});

And('I am able to see the pagination control', () => {
  cy.get('app-stations').within(() => {
    cy.get('app-paginator').within(() => {
      cy.get('c-pagination').within(() => {
        cy.get('ul').within(() => {
          cy.get('li').eq(2).should('have.class', 'active');
        });
      });
    });
  });
});

And('I am able to see the items per page control', () => {
  cy.get('app-stations').within(() => {
    cy.get('c-card').within(() => {
      cy.get('c-card-body').within(() => {
        cy.get('c-button-group').within(() => {
          cy.get('.btn-outline-primary').eq(0).should('have.class', 'active').should('contain', '10');
        });
      });
    });
  });
});

And('I am able to see the stations loaded in the table', () => {
  cy.get('app-stations').within(() => {
    cy.get('c-card').within(() => {
      cy.get('c-card-body').within(() => {
        cy.get('table').within(() => {
          cy.get('thead').within(() =>{
            cy.get('tr').find('th').its('length').should('be.gte', 9);
          });
          cy.get('tbody').within(() =>{
            cy.get('tr').its('length').should('be.gte', 10);
          });
        });
      });
    });
  });
});

beforeEach(() => {
  cy.request('POST', 'http://localhost:3001/api/test/reset');
  cy.visit('http://localhost:3000/signup');
});

it('signup form is displayed', () => {
  cy.contains(/sign up/i);
  cy.get('input[name="email"]');
  cy.get('input[name="username"]');
  cy.get('input[name="password"]');
  cy.get('input[name="fullName"]');
});

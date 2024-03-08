beforeEach(() => {
  const user = Cypress.env('user1');

  cy.request('POST', 'http://localhost:3001/api/test/reset');
  cy.createUser(user);
  cy.login({ username: user.username, password: user.password });
  cy.createPost();
  cy.reload();
});

it('user can delete their post in the post view', () => {
  const user = Cypress.env('user1');

  cy.visit(`http://localhost:3000/${user.username}`);

  cy.get('[data-cy="user-profile-image-grid"] img').click();

  cy.get('[data-cy="post-options-btn"]').click();

  cy.contains(/delete/i).click();
  cy.contains(/are you sure/i).should('be.visible');

  // Confirm delete
  cy.get('[data-cy="confirm-delete-post-btn"]').click();

  cy.contains(/post deleted/i).should('be.visible');

  cy.contains(/posts/i)
    .prev()
    .should('contain.text', '0');

  cy.get('[data-cy="user-profile-image-grid"] img').should('not.exist');
});

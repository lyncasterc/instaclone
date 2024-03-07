beforeEach(() => {
  const user = Cypress.env('user1');

  cy.request('POST', 'http://localhost:3001/api/test/reset');
  cy.createUser(user);
  cy.login({ username: user.username, password: user.password });
});

it('after creating a post, user can view it in their user profile', () => {
  const user = Cypress.env('user1');

  cy.get('input#postImageUpload').selectFile('./cypress/fixtures/cloud-test-image.jpg', { force: true });

  cy.get('[data-cy="edit-post-image-desktop-next-btn"]').click();

  cy.get('[data-cy="edit-post-details-desktop-share-btn"]').click();

  cy.contains(/post added/i).should('be.visible');

  cy.visit(`http://localhost:3000/${user.username}`);

  cy.contains(/post/i)
    .prev()
    .should('contain.text', '1')
    .and('be.visible');

  cy.get('[data-cy="user-profile-image-grid"] img').should('be.visible');
});

it('user can view a post by clicking on it in their user profile', () => {
  const user = Cypress.env('user1');

  cy.createPost();

  cy.visit(`http://localhost:3000/${user.username}`);

  cy.get('[data-cy="user-profile-image-grid"] img').click();

  cy.url().should('include', '/p/');

  cy.get('[data-cy="post-image"] img').should('be.visible');
});

it('user can view their post on the home page', () => {
  const user = Cypress.env('user1');

  cy.createPost();

  cy.visit('http://localhost:3000');

  cy.get('[data-cy="post-image"]').should('be.visible');
  cy.contains(user.username).should('be.visible');
  cy.get('[data-cy="post-options-btn"]').should('be.visible');
});

beforeEach(() => {
  const user = Cypress.env('user1');

  cy.request('POST', 'http://localhost:3001/api/test/reset');
  cy.createUser(user);
  cy.login({ username: user.username, password: user.password });
});

describe('create posts navigation', () => {
  it('after selecting file, user is taken to /create/edit', () => {
    cy.get('input#postImageUpload').selectFile('./cypress/fixtures/cloud-test-image.jpg', { force: true });

    cy.url().should('include', '/create/edit');
    cy.get('img').should('be.visible');
  });

  it('user can cancel image upload in /create/edit', () => {
    cy.get('input#postImageUpload').selectFile('./cypress/fixtures/cloud-test-image.jpg', { force: true });

    cy.contains(/cancel/i).click();

    cy.url().should('not.include', '/create/edit');
  });

  it('user can cancel image upload in /create/edit on mobile', () => {
    cy.viewport('iphone-6');

    cy.get('input#postImageUpload').selectFile('./cypress/fixtures/cloud-test-image.jpg', { force: true });

    cy.get('[data-cy="edit-post-image-mobile-cancel-btn"]').click();

    cy.url().should('not.include', '/create/edit');
  });

  it('on create/edit page, clicking next takes user to /create/details', () => {
    cy.get('input#postImageUpload').selectFile('./cypress/fixtures/cloud-test-image.jpg', { force: true });

    cy.get('[data-cy="edit-post-image-desktop-next-btn"]').click();

    cy.url().should('include', '/create/details');
    cy.contains(/back/i).should('be.visible');
    cy.get('[data-cy="edit-post-details-desktop-share-btn"]').should('be.visible');
  });

  it('on create/details page, clicking back takes user to /create/edit', () => {
    cy.get('input#postImageUpload').selectFile('./cypress/fixtures/cloud-test-image.jpg', { force: true });

    cy.get('[data-cy="edit-post-image-desktop-next-btn"]').click();
    cy.contains(/back/i).click();

    cy.url().should('include', '/create/edit');
    cy.get('img').should('be.visible');
  });

  it('on create/details page, clicking back takes user to /create/edit on mobile', () => {
    cy.viewport('iphone-6');

    cy.get('input#postImageUpload').selectFile('./cypress/fixtures/cloud-test-image.jpg', { force: true });

    cy.get('[data-cy="edit-post-image-mobile-next-btn"]').click();

    cy.get('[data-testid="goBackNavBtn"]').click();

    cy.url().should('include', '/create/edit');
    cy.get('img').should('be.visible');
  });
});

describe('creating posts functionality', () => {
  it('user can create a post without a caption', () => {
    cy.get('input#postImageUpload').selectFile('./cypress/fixtures/cloud-test-image.jpg', { force: true });

    cy.get('[data-cy="edit-post-image-desktop-next-btn"]').click();

    cy.get('[data-cy="edit-post-details-desktop-share-btn"]').click();

    cy.contains(/sharing/i)
      .should('be.visible')
      .should('be.disabled');

    cy.contains(/post added/i).should('be.visible');
  });

  it('user can create a post with a caption', () => {
    cy.get('input#postImageUpload').selectFile('./cypress/fixtures/cloud-test-image.jpg', { force: true });

    cy.get('[data-cy="edit-post-image-desktop-next-btn"]').click();

    cy.get('textarea').type('This is a test post');

    cy.get('[data-cy="edit-post-details-desktop-share-btn"]').click();

    cy.contains(/sharing/i)
      .should('be.visible')
      .should('be.disabled');

    cy.contains(/post added/i).should('be.visible');
  });
});

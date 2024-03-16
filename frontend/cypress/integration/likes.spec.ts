const user1 = Cypress.env('user1');
const user2 = Cypress.env('user2');

beforeEach(() => {
  cy.request('POST', 'http://localhost:3001/api/test/reset');

  cy.createUser(user1);
  cy.createUser(user2);

  cy.login({ username: user1.username, password: user1.password });

  cy.followUser(user2.username);
  cy.createPost();
  cy.logout();

  cy.login({ username: user2.username, password: user2.password });
  cy.followUser(user1.username);
  cy.logout();
});

describe.skip('when liking posts', () => {
  it('user can like their own post', () => {
    // the post is created by user1

    cy.login({ username: user1.username, password: user1.password });

    cy.get('[data-cy="like-post-btn"]').click();

    cy.wait(500);

    cy.contains('1 like').should('be.visible');

    cy.get('[data-cy="like-post-btn"] svg').should('have.attr', 'fill', 'red');

    // checking that the like is still there after a reload
    // confirming that it's persisted in the database

    cy.reload();

    cy.contains('1 like').should('be.visible');

    cy.get('[data-cy="like-post-btn"] svg').should('have.attr', 'fill', 'red');
  });

  it('user can like another user\'s post', () => {
    // the post is created by user1

    cy.login({ username: user2.username, password: user2.password });

    cy.get('[data-cy="like-post-btn"]').click();

    cy.wait(500);

    cy.contains('1 like').should('be.visible');

    cy.get('[data-cy="like-post-btn"] svg').should('have.attr', 'fill', 'red');

    // checking that the like is still there after a reload
    // confirming that it's persisted in the database

    cy.reload();

    cy.contains('1 like').should('be.visible');

    cy.get('[data-cy="like-post-btn"] svg').should('have.attr', 'fill', 'red');
  });

  it('user can unlike their own post', () => {
    cy.login({ username: user1.username, password: user1.password });

    // like the post
    cy.get('[data-cy="like-post-btn"]').click();
    cy.wait(500);

    // unlike the post
    cy.get('[data-cy="like-post-btn"]').click();
    cy.wait(500);

    cy.get('[data-cy="like-post-btn"] svg').should('not.have.attr', 'fill', 'red');
    cy.contains('1 like').should('not.exist');

    cy.reload();

    cy.get('[data-cy="like-post-btn"] svg').should('not.have.attr', 'fill', 'red');
    cy.contains('1 like').should('not.exist');
  });

  it('user can unlike another user\'s post', () => {
    cy.login({ username: user2.username, password: user2.password });

    // like the post
    cy.get('[data-cy="like-post-btn"]').click();
    cy.wait(500);

    // unlike the post
    cy.get('[data-cy="like-post-btn"]').click();
    cy.wait(500);

    cy.get('[data-cy="like-post-btn"] svg').should('not.have.attr', 'fill', 'red');
    cy.contains('1 like').should('not.exist');

    cy.reload();

    cy.get('[data-cy="like-post-btn"] svg').should('not.have.attr', 'fill', 'red');
    cy.contains('1 like').should('not.exist');
  });
});

describe('when liking comments', () => {
  beforeEach(() => {
    cy.login({ username: user1.username, password: user1.password });

    cy.get('[data-cy="comments-link"]').click();
    cy.get('textarea').type(`${user1.username} test comment`);
    cy.get('button').contains(/post/i).click();

    cy.logout();
  });

  it('user can like their own comment', () => {
    cy.login({ username: user1.username, password: user1.password });

    cy.get('[data-cy="comments-link"]').click();

    cy.get('[data-cy="like-comment-btn"]').click();

    cy.wait(500);

    cy.contains('1 like').should('be.visible');

    cy.get('[data-cy="like-comment-btn"] svg').should('have.attr', 'fill', 'red');

    // // checking that the like is still there after a reload
    // // confirming that it's persisted in the database

    cy.reload();

    cy.contains('1 like').should('be.visible');

    cy.get('[data-cy="like-comment-btn"] svg').should('have.attr', 'fill', 'red');
  });

  it('user can like another user\'s comment', () => {
    cy.login({ username: user2.username, password: user2.password });

    cy.get('[data-cy="comments-link"]').click();

    cy.get('[data-cy="like-comment-btn"]').click();

    cy.wait(500);

    cy.contains('1 like').should('be.visible');

    cy.get('[data-cy="like-comment-btn"] svg').should('have.attr', 'fill', 'red');

    // // checking that the like is still there after a reload
    // // confirming that it's persisted in the database

    cy.reload();

    cy.contains('1 like').should('be.visible');

    cy.get('[data-cy="like-comment-btn"] svg').should('have.attr', 'fill', 'red');
  });

  it('user can unlike their own comment', () => {
    cy.login({ username: user1.username, password: user1.password });

    cy.get('[data-cy="comments-link"]').click();

    // like the comment
    cy.get('[data-cy="like-comment-btn"]').click();
    cy.wait(500);

    // unlike the comment
    cy.get('[data-cy="like-comment-btn"]').click();
    cy.wait(500);

    cy.get('[data-cy="like-comment-btn"] svg').should('not.have.attr', 'fill', 'red');
    cy.contains('1 like').should('not.exist');

    cy.reload();

    cy.get('[data-cy="like-comment-btn"] svg').should('not.have.attr', 'fill', 'red');
    cy.contains('1 like').should('not.exist');
  });

  it('user can unlike another user\'s comment', () => {
    cy.login({ username: user2.username, password: user2.password });

    cy.get('[data-cy="comments-link"]').click();

    // like the comment
    cy.get('[data-cy="like-comment-btn"]').click();
    cy.wait(500);

    // unlike the comment
    cy.get('[data-cy="like-comment-btn"]').click();
    cy.wait(500);

    cy.get('[data-cy="like-comment-btn"] svg').should('not.have.attr', 'fill', 'red');
    cy.contains('1 like').should('not.exist');

    cy.reload();

    cy.get('[data-cy="like-comment-btn"] svg').should('not.have.attr', 'fill', 'red');
    cy.contains('1 like').should('not.exist');
  });
});

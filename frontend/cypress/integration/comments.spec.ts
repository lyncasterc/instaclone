beforeEach(() => {
  const user = Cypress.env('user1');

  cy.request('POST', 'http://localhost:3001/api/test/reset');
  cy.createUser(user);
  cy.login({ username: user.username, password: user.password });
  cy.createPost();
  cy.reload();
});

describe('general comments view tests', () => {
  it('user can navigate to the comments view of a post', () => {
    cy.get('[data-cy="comments-link"]').click();

    cy.url().should('include', '/comments');
    cy.contains(/no comments yet/i).should('be.visible');
  });

  it('user can see their caption in the comments view', () => {
    const user = Cypress.env('user1');

    cy.get('[data-cy="comments-link"]').click();

    const caption = `${user.username} test post`;

    cy.contains(caption).should('be.visible');
  });
});

describe('commenting on a post', () => {
  beforeEach(() => {
    cy.get('[data-cy="comments-link"]').click();
  });

  it('user can comment on a post', () => {
    const commentText = 'This is a test comment';

    cy.get('textarea').type(commentText);

    cy.get('button').contains(/post/i).click();

    cy.reload();

    cy.contains(commentText).should('be.visible');
  });

  it('user can reply to a comment', () => {
    const commentText = 'This is a test comment';

    cy.get('textarea').type(commentText);

    cy.get('button').contains(/post/i).click();

    cy.reload();

    cy.contains(/reply/i).click();

    const replyText = 'This is a test reply';

    cy.get('textarea').type(replyText);

    cy.get('button').contains(/post/i).click();

    cy.reload();

    cy.contains(/view all 1 replies/i)
      .should('be.visible')
      .click();

    cy.contains(`@admin ${replyText}`).should('be.visible');
  });

  it('when post has a comment, user can see the comment count link', () => {
    const commentText = 'This is a test comment';

    cy.get('textarea').type(commentText);

    cy.get('button').contains(/post/i).click();

    cy.visit('http://localhost:3000');

    cy.contains(/view all 1 comments/i)
      .should('be.visible')
      .click();

    cy.url().should('include', '/comments');
  });
});

describe('deleting comments', () => {
  const commentText = 'This is a test comment';

  beforeEach(() => {
    cy.get('[data-cy="comments-link"]').click();

    cy.get('textarea').type(commentText);

    cy.get('button').contains(/post/i).click();

    cy.reload();
  });

  it('user can delete their comment', () => {
    cy.get('[data-cy="delete-comment-btn"]').click();

    cy.contains(/delete/i)
      .should('be.visible')
      .click();

    cy.reload();

    cy.contains(commentText).should('not.exist');
  });
});

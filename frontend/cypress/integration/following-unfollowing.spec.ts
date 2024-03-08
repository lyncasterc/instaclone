beforeEach(() => {
  const user1 = Cypress.env('user1');
  const user2 = Cypress.env('user2');

  cy.request('POST', 'http://localhost:3001/api/test/reset');
  cy.createUser(user1);
  cy.createUser(user2);

  cy.login({ username: user1.username, password: user1.password });

  // creating a post for user1
  cy.createPost();

  cy.logout();

  cy.login({ username: user2.username, password: user2.password });

  // creating a post for user2
  cy.createPost();

  cy.logout();
});

it('user can follow and unfollow another user', () => {
  const user1 = Cypress.env('user1');
  const user2 = Cypress.env('user2');

  cy.login({ username: user1.username, password: user1.password });

  cy.visit(`http://localhost:3000/${user2.username}`);

  cy.get('button[data-cy="follow-btn"]').as('followBtn');

  cy.contains(/followers/i)
    .as('followersCount')
    .should('contain.text', '0');

  cy.get('@followBtn').click();

  cy.get('@followBtn').should('contain.text', 'Following');

  cy.get('@followersCount').should('contain.text', '1');

  cy.get('@followBtn').click();

  cy.get('@followBtn').should('contain.text', 'Follow');

  cy.get('@followersCount').should('contain.text', '0');
});

it('user following count increments and decrements when following and unfollowing other user', () => {
  const user1 = Cypress.env('user1');
  const user2 = Cypress.env('user2');

  cy.login({ username: user1.username, password: user1.password });

  cy.visit(`http://localhost:3000/${user2.username}`);

  cy.get('button[data-cy="follow-btn"]').as('followBtn').click();

  cy.visit(`http://localhost:3000/${user1.username}`);

  cy.contains(/following/i)
    .should('contain.text', '1');

  cy.visit(`http://localhost:3000/${user2.username}`);

  cy.get('@followBtn').click();

  cy.visit(`http://localhost:3000/${user1.username}`);

  cy.contains(/following/i)
    .should('contain.text', '0');
});

it('user can see a list of users they are following', () => {
  const user1 = Cypress.env('user1');
  const user2 = Cypress.env('user2');

  cy.login({ username: user1.username, password: user1.password });
  cy.followUser(user2.username);
  cy.visit(`http://localhost:3000/${user1.username}`);

  cy.contains(/following/i).click();

  cy.contains(user2.fullName).should('be.visible');
});

it('user can see a list of users following them', () => {
  const user1 = Cypress.env('user1');
  const user2 = Cypress.env('user2');

  cy.login({ username: user1.username, password: user1.password });
  cy.followUser(user2.username);
  cy.logout();
  cy.login({ username: user2.username, password: user2.password });

  cy.visit(`http://localhost:3000/${user2.username}`);

  cy.contains(/follower/i).click();

  cy.contains(user1.fullName).should('be.visible');
});

it('user can unfollow a user from their following list', () => {
  const user1 = Cypress.env('user1');
  const user2 = Cypress.env('user2');

  cy.login({ username: user1.username, password: user1.password });
  cy.followUser(user2.username);

  cy.visit(`http://localhost:3000/${user1.username}/following`);

  cy.contains(user2.fullName)
    .next()
    .should('contain.text', 'Following')
    .click();

  cy.contains(user2.fullName).should('not.exist');
});

it('user can follow a user from their followers list', () => {
  const user1 = Cypress.env('user1');
  const user2 = Cypress.env('user2');

  cy.login({ username: user1.username, password: user1.password });
  cy.followUser(user2.username);

  cy.logout();

  cy.login({ username: user2.username, password: user2.password });

  cy.visit(`http://localhost:3000/${user2.username}/followers`);

  cy.contains(user1.fullName)
    .next()
    .as('followBtn')
    .should('contain.text', 'Follow')
    .click();

  cy.get('@followBtn').should('contain.text', 'Following');
});

it('user can view posts from users they follow on the home page', () => {
  const user1 = Cypress.env('user1');
  const user2 = Cypress.env('user2');

  cy.login({ username: user1.username, password: user1.password });
  cy.followUser(user2.username);
  cy.visit('http://localhost:3000/');

  cy.contains(`${user2.username} test post`).should('be.visible');
});

beforeEach(() => {
  cy.request('POST', 'http://localhost:3001/api/test/reset');
});

describe('login view', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('displays the login view', () => {
    cy.get('input[name="username"]');
    cy.get('input[name="password"]');
    cy.contains(/don't have an account/i).should('be.visible');
  });

  it('allows users to login', () => {
    const user1 = Cypress.env('user1');
    cy.createUser(user1);

    cy.get('input[name="username"]').type(user1.username);
    cy.get('input[name="password"]').type(user1.password);
    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="homepage-container"]').should('be.visible');
  });

  it('displays error message on unsuccessful login', () => {
    const user1 = Cypress.env('user1');
    cy.createUser(user1);

    cy.get('input[name="username"]').type(user1.username);
    cy.get('input[name="password"]').type('invalidPassword');
    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="homepage-container"]').should('not.exist');
    cy.contains(/invalid username or password/i).should('be.visible');
  });
});

describe('logged in state persistence', () => {
  it('maintains the logged in state of a user after a page reload', () => {
    const user1 = Cypress.env('user1');
    cy.createUser(user1);

    cy.login({ username: user1.username, password: user1.password });

    cy.get('[data-testid="homepage-container"]').should('be.visible');

    cy.reload();

    cy.get('[data-testid="homepage-container"]').should('be.visible');
  });
});

describe('signup view', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/signup');
  });

  it('displays the signup view', () => {
    cy.contains(/sign up to see photos/i);
    cy.get('input[name="email"]');
    cy.get('input[name="username"]');
    cy.get('input[name="password"]');
    cy.get('input[name="fullName"]');
    cy.contains(/have an account/i).should('be.visible');
  });

  it('allows users to signup', () => {
    const user1 = Cypress.env('user1');

    cy.get('input[name="email"]').type(user1.email);
    cy.get('input[name="username"]').type(user1.username);
    cy.get('input[name="password"]').type(user1.password);
    cy.get('input[name="fullName"]').type(user1.fullName);

    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="homepage-container"]').should('be.visible');
  });

  it('logs in the user after signup', () => {
    const user1 = Cypress.env('user1');

    cy.get('input[name="email"]').type(user1.email);
    cy.get('input[name="username"]').type(user1.username);
    cy.get('input[name="password"]').type(user1.password);
    cy.get('input[name="fullName"]').type(user1.fullName);

    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="homepage-container"]').should('be.visible');

    cy.reload();

    cy.get('[data-testid="homepage-container"]').should('be.visible');
  });

  it('displays error message on unsuccessful signup', () => {
    const user1 = Cypress.env('user1');

    cy.createUser(user1);

    cy.get('input[name="email"]').type(user1.email);
    cy.get('input[name="username"]').type(user1.username);
    cy.get('input[name="password"]').type(user1.password);
    cy.get('input[name="fullName"]').type(user1.fullName);

    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="homepage-container"]').should('not.exist');
    cy.contains(/username is already taken/i).should('be.visible');
  });
});

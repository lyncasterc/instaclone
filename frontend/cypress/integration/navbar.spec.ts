import testImageDataUrl from '../fixtures/test-image-data-url';

const user = Cypress.env('user1');

beforeEach(() => {
  cy.request('POST', 'http://localhost:3001/api/test/reset');
  cy.visit('http://localhost:3000');
});

it('navbars are not displayed in login page', () => {
  cy.get('[data-cy="desktop-nav"]').should('not.exist');
  cy.get('[data-testid="home-nav"]').should('not.exist');
  cy.get('[data-cy="bottom-nav"]').should('not.exist');
});
it('navbars are not displayed in signup page', () => {
  cy.visit('http://localhost:3000/signup');
  cy.get('[data-cy="desktop-nav"]').should('not.exist');
  cy.get('[data-testid="home-nav"]').should('not.exist');
  cy.get('[data-cy="bottom-nav"]').should('not.exist');
});

it('when logged in on desktop, desktop nav is rendered and visible', () => {
  cy.viewport('macbook-13');
  cy.createUser(user);
  cy.login({ username: user.username, password: user.password });

  cy.get('[data-cy="desktop-nav"]').should('be.visible');
  cy.get('[data-testid="home-nav"]').should('not.be.visible');
  cy.get('[data-cy="bottom-nav"]').should('not.be.visible');
});

it('when logged on mobile, mobile navs are rendered and visible', () => {
  cy.viewport('iphone-x');
  cy.createUser(user);
  cy.login({ username: user.username, password: user.password });

  cy.get('[data-cy="desktop-nav"]').should('not.be.visible');
  cy.get('[data-testid="home-nav"]').should('be.visible');
  cy.get('[data-cy="bottom-nav"]').should('be.visible');
});

it('when a user has a profile image, it is displayed in mobile nav', () => {
  cy.viewport('iphone-x');
  cy.createUser(user);
  cy.login({ username: user.username, password: user.password });
  cy.editUser({ imageDataUrl: testImageDataUrl });
  cy.reload();

  cy.get('[data-testid="bottom-nav-avatar"] svg').should('not.exist');
  cy.get('[data-testid="bottom-nav-avatar"] img').should('be.visible');
});

it('when a user has no profile image, a default image is displayed in mobile nav', () => {
  cy.viewport('iphone-x');
  cy.createUser(user);
  cy.login({ username: user.username, password: user.password });
  cy.reload();

  cy.get('[data-testid="bottom-nav-avatar"] svg').should('be.visible');
  cy.get('[data-testid="bottom-nav-avatar"] img').should('not.exist');
});

it('when a user has a profile image, it is displayed in desktop nav', () => {
  cy.viewport('macbook-13');
  cy.createUser(user);
  cy.login({ username: user.username, password: user.password });
  cy.editUser({ imageDataUrl: testImageDataUrl });
  cy.reload();

  cy.get('[data-testid="desktop-nav-avatar"] svg').should('not.exist');
  cy.get('[data-testid="desktop-nav-avatar"] img').should('be.visible');
});

it('when a user has no profile image, a default image is displayed in desktop nav', () => {
  cy.viewport('macbook-13');
  cy.createUser(user);
  cy.login({ username: user.username, password: user.password });
  cy.reload();

  cy.get('[data-testid="desktop-nav-avatar"] svg').should('be.visible');
  cy.get('[data-testid="desktop-nav-avatar"] img').should('not.exist');
});

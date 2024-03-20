// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import testImageDataUrl from '../fixtures/test-image-data-url';

Cypress.Commands.add('createUser', ({
  fullName, email, username, password,
}) => {
  cy.request({
    url: 'http://localhost:3001/api/users',
    method: 'POST',
    body: {
      fullName, email, username, password,
    },
  }).then((res) => {
    const user = res.body;

    // storing user id in localStorage for later use in tests
    localStorage.setItem(`cy-${user.username}-id`, user.id);
  });
});

Cypress.Commands.add('login', ({
  username, password,
}) => {
  cy.request({
    url: 'http://localhost:3001/api/auth/login',
    method: 'POST',
    body: {
      username, password,
    },
  }).then((res) => {
    localStorage.setItem('cy-login-res-data', JSON.stringify(res.body));
  });
  cy.visit('http://localhost:3000');
});

Cypress.Commands.add('logout', () => {
  localStorage.removeItem('cy-login-res-data');
  cy.request({
    url: 'http://localhost:3001/api/auth/logout',
    method: 'POST',
  });
});

Cypress.Commands.add('createPost', () => {
  const { accessToken, username } = JSON.parse(localStorage.getItem('cy-login-res-data'));

  cy.request({
    url: 'http://localhost:3001/api/posts',
    method: 'POST',
    body: {
      caption: `${username} test post`,
      imageDataUrl: testImageDataUrl,
    },
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  });
});

Cypress.Commands.add('editUser', (updatedUserFields) => {
  const { accessToken, username } = JSON.parse(localStorage.getItem('cy-login-res-data'));
  const userId = localStorage.getItem(`cy-${username}-id`);

  cy.request({
    url: `http://localhost:3001/api/users/${userId}`,
    method: 'PUT',
    body: updatedUserFields,
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  });
});

Cypress.Commands.add('followUser', (username) => {
  const { accessToken } = JSON.parse(localStorage.getItem('cy-login-res-data'));
  const userId = localStorage.getItem(`cy-${username}-id`);

  cy.request({
    url: `http://localhost:3001/api/users/${userId}/follow`,
    method: 'PUT',
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  });
});
